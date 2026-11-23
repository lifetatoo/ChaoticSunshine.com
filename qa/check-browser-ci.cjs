// Launch-pilot browser and accessibility checks on the actual GENERATED site.
// Runs in CI with Playwright + axe-core; no external signup is submitted.
'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
const site=path.resolve(__dirname,'../source/site-kit');
const screenshots=path.resolve(__dirname,'screenshots-ci');fs.mkdirSync(screenshots,{recursive:true});
const report={pages:[],findings:[],visuals:[],asOf:new Date().toISOString()};
const MIME={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.pdf':'application/pdf','.ttf':'font/ttf','.woff2':'font/woff2','.svg':'image/svg+xml','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}
 catch{return res.writeHead(400).end('Bad URL');}
 let target=path.resolve(site,'.'+(pathname==='/'?'/index.html':pathname));
 if(!target.startsWith(site+path.sep))return res.writeHead(403).end();
 if(!path.extname(target)&&fs.existsSync(target+'.html'))target+='.html';
 if(!fs.existsSync(target)||!fs.statSync(target).isFile())return res.writeHead(404).end('Not found');
 res.setHeader('Content-Type',MIME[path.extname(target)]||'application/octet-stream');
 fs.createReadStream(target).pipe(res);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 let browser;
 const cmds=['google-chrome','google-chrome-stable','chromium','chromium-browser'];
 let executablePath;
 for(const c of cmds){try{executablePath=execFileSync('which',[c],{encoding:'utf8'}).trim();if(executablePath)break;}catch{}}
 if(!executablePath)throw Error('No Chrome executable available on the CI runner');
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
 const profiles=[{key:'desktop',width:1440,height:900},{key:'mobile',width:390,height:844},{key:'tiny',width:320,height:700}];
 const slugs=['index','start','freebies','soul-snacks','teaching-shelf','side-quests','subscribe','about','welcome','soul-snack-02','table-talks-guide','seconds-please','before-the-first-mountain'];
 for(const profile of profiles){
  const ctx=await browser.newContext({viewport:{width:profile.width,height:profile.height},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const slug of slugs){
   errors.length=0;
   const response=await page.goto(base+'/'+slug,{waitUntil:'networkidle',timeout:30000});
   await page.evaluate(()=>document.fonts.ready);
   await page.addScriptTag({content:axe});
   const state=await page.evaluate(async()=>{
    const nav=document.querySelector('.cs > nav.masthead-nav');
    const a=(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations;
    return {overflow:document.documentElement.scrollWidth>innerWidth+2,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),nav:!!nav,navLinks:nav?.querySelectorAll('a').length||0,violations:a.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.slice(0,6).map(n=>n.target)}))};
   });
   const caseResult={slug,profile:profile.key,status:response?.status(),...state,jsErrors:[...errors]};
   if(['table-talks-guide','seconds-please','before-the-first-mountain'].includes(slug)){
    const button=page.locator('.cs-guide-print-panel .cs-guide-print-button');
    const count=await button.count();
    if(count<1||count>3)report.findings.push({slug,profile:profile.key,error:'Unexpected number of real PDF print actions',count});
    else{
      const paths=new Set(await button.evaluateAll(els=>els.map(x=>x.getAttribute('href'))));
      for(const url of paths){
        if(!url?.endsWith('.pdf'))report.findings.push({slug,profile:profile.key,error:'Print link does not target a PDF',url});
        else{
          const printResponse=await page.request.get(base+'/'+url.replace(/^\//,''));
          if(printResponse.status()!==200 || !(printResponse.headers()['content-type']||'').includes('pdf'))report.findings.push({slug,profile:profile.key,error:'PDF print target missing or not PDF',url});
        }
      }
    }
   }
   report.pages.push(caseResult);
   if(caseResult.status!==200||caseResult.overflow||caseResult.brokenImages.length||!caseResult.nav||caseResult.navLinks<7||caseResult.jsErrors.length||caseResult.violations.length)report.findings.push(caseResult);
   if(slug==='index'){
    await page.evaluate(()=>window.scrollTo(0,1000));
    await page.waitForTimeout(150);
    const stickyY=await page.locator('.cs > nav.masthead-nav').evaluate(el=>el.getBoundingClientRect().top);
    if(Math.abs(stickyY)>3)report.findings.push({slug,profile:profile.key,error:'Navigation is not sticky after scrolling',stickyY});
    await page.evaluate(()=>window.scrollTo(0,0));
   }
   if((profile.key!=='tiny'&&['index','subscribe','freebies','side-quests','soul-snacks','soul-snack-02','table-talks-guide','seconds-please','before-the-first-mountain'].includes(slug))){
    const file=slug+'-'+profile.key+'.jpg';
    await page.screenshot({path:path.join(screenshots,file),type:'jpeg',quality:62,fullPage:false});
    report.visuals.push(file);
   }
  }
  await ctx.close();
 }
 await browser.close();
 // Dump two compact browser screenshots into the job log for visual examination.
 for(const name of ['subscribe-desktop.jpg','side-quests-mobile.jpg','freebies-desktop.jpg','soul-snack-02-mobile.jpg']){
   const file=path.join(screenshots,name);
   if(fs.existsSync(file)){
     const data=fs.readFileSync(file).toString('base64');
     console.log('BEGIN_CS_IMAGE_'+name.replace(/\W/g,'_'));
     console.log(data);
     console.log('END_CS_IMAGE_'+name.replace(/\W/g,'_'));
   }
 }
 fs.writeFileSync(path.join(screenshots,'browser-qa.json'),JSON.stringify(report,null,2));
 console.log('BROWSER_QA_SUMMARY',JSON.stringify({cases:report.pages.length,findings:report.findings.length,visuals:report.visuals.length}));
 if(report.findings.length){console.error('BROWSER_QA_FINDINGS',JSON.stringify(report.findings.slice(0,35),null,2));process.exitCode=1;}
})().catch(e=>{console.error('Browser QA could not complete:',e.stack||e);process.exitCode=1;}).finally(()=>server.close());
