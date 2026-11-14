const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const site=process.env.CS_BUILD_DIR?path.resolve(process.env.CS_BUILD_DIR):path.resolve(__dirname,'../source/site-kit'),out=path.join(__dirname,'screenshots');fs.mkdirSync(out,{recursive:true});
process.env.PLAYWRIGHT_BROWSERS_PATH='C:/Users/amyal/Documents/Codex/2026-11-06/files-mentioned-by-the-user-screenshot/browser-audit-runtime';
const {chromium,webkit,devices}=require('C:/Users/amyal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const axe=fs.readFileSync('C:/Users/amyal/Documents/Codex/2026-11-06/files-mentioned-by-the-user-screenshot/website-audit-tools/node_modules/axe-core/axe.min.js','utf8');
const pages=fs.readdirSync(site).filter(f=>f.endsWith('.html'));
const findings=[],cases=[];let refs=0;
const css=fs.readFileSync(path.join(site,'assets/css/site.css'),'utf8');
for(const m of css.matchAll(/url\(["']?(\.\.\/[^)"']+)["']?\)/g)){const asset=path.resolve(site,'assets/css',m[1]);refs++;if(!fs.existsSync(asset))findings.push({file:'assets/css/site.css',missing:m[1]});}
for(const f of pages){
 const text=fs.readFileSync(path.join(site,f),'utf8');
 for(const m of text.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)){
  const url=m[1];if(/^(https?:|mailto:|data:|tel:|#)/.test(url))continue;
  const file=path.join(site,decodeURIComponent(url.replace(/^\//,'')));
  refs++;if(!fs.existsSync(file))findings.push({file:f,missing:url});
 }
 if(/(?:action|href|src)="[^"]*(?:KIT_FORM_ID_PENDING|kit-form\.invalid|file:\/\/\/|G:\\My Drive)/.test(text))findings.push({file:f,error:'Unresolved placeholder or local path'});
 if(f!=='404.html'){
  if(!/<link rel="canonical"/.test(text))findings.push({file:f,error:'Missing canonical'});
  const graphs=[...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for(const g of graphs)try{JSON.parse(g[1]);}catch(e){findings.push({file:f,error:'Invalid schema JSON'});}
 }
}
const server=http.createServer((req,res)=>{
 let route;try{route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch(e){res.writeHead(400).end();return;}
 let target=path.resolve(site,'.'+(route==='/'?'/index.html':route));if(target!==site&&!target.startsWith(site+path.sep)){res.writeHead(403).end();return;}
 if(!path.extname(target)&&fs.existsSync(target+'.html'))target+='.html';
 const exists=fs.existsSync(target)&&fs.statSync(target).isFile();if(!exists){target=path.join(site,'404.html');res.statusCode=404;}
 const type={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.pdf':'application/pdf','.ttf':'font/ttf','.ico':'image/x-icon'}[path.extname(target)]||'application/octet-stream';
 res.setHeader('Content-Type',type);fs.createReadStream(target).pipe(res);
});
const selected=process.env.CS_QA_PAGES?process.env.CS_QA_PAGES.split(','):['index','freebies','soul-snacks','about','start','subscribe','welcome','teaching-shelf','teaching-a-hard-day-still-counts','soul-snack-01','soul-snack-03','soul-snack-39','soul-snack-90','advent','seconds-please','table-talks-guide','fully-family','pray-when-you-feel-unworthy','for-too-many-tabs','community-guidelines','privacy'];
const reportFile=path.join(__dirname,process.env.CS_QA_REPORT||'refresh-results.json');
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const chrome=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const profiles=[{name:'desktop',browser:chrome,opts:{viewport:{width:1440,height:1000}}},{name:'android',browser:chrome,opts:devices['Pixel 7']}];
 process.env.PLAYWRIGHT_BROWSERS_PATH='C:/Users/amyal/Documents/Codex/2026-11-06/files-mentioned-by-the-user-screenshot/browser-audit-runtime';
 let safari;try{safari=await webkit.launch({headless:true});profiles.push({name:'iphone',browser:safari,opts:devices['iPhone 13']});}catch(e){findings.push({error:'iPhone WebKit unavailable',detail:e.message.slice(0,200)});}
 for(const profile of profiles){
  const ctx=await profile.browser.newContext({...profile.opts,reducedMotion:'reduce',acceptDownloads:true});
  // No signups are sent; preserve the real form while testing its UI and failure path.
  await ctx.route('https://app.kit.com/**',route=>route.abort());
  const page=await ctx.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const slug of selected){
   errors=[];const response=await page.goto(base+'/'+slug,{waitUntil:'networkidle'});
   await page.addScriptTag({content:axe});
   const result=await page.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),axe:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))}));
   const record={profile:profile.name,slug,status:response.status(),...result,errors};cases.push(record);
   if(record.status!==200||result.overflow||result.broken.length||result.axe.length||errors.length)findings.push(record);
   if(['index','freebies','soul-snacks','about','welcome','soul-snack-03','subscribe'].includes(slug)){await page.screenshot({path:path.join(out,slug+'-'+profile.name+'.png'),fullPage:true});await page.screenshot({path:path.join(out,slug+'-'+profile.name+'-screen.png')});}
   fs.writeFileSync(reportFile,JSON.stringify({pages:pages.length,references:refs,cases,findings},null,2));
  }
  await page.goto(base+'/freebies',{waitUntil:'networkidle'});
  await page.locator('[data-open-door-handle="left"]').click();assert.equal(await page.locator('[data-library-door-toggle]').getAttribute('aria-expanded'),'false');
  await page.locator('[data-clickable-door="right"]').click();assert.equal(await page.locator('[data-library-door-toggle]').getAttribute('aria-expanded'),'true');
  await page.locator('[data-library-search]').fill('Advent');await page.waitForTimeout(100);assert(await page.locator('[data-guide-id="advent"]').isVisible());assert(await page.locator('[data-library-reset]').isVisible());
  await page.locator('[data-library-search]').fill('qwertyzxcvnomatch');assert.equal(await page.locator('[data-library-door-toggle]').getAttribute('aria-expanded'),'true');assert(await page.locator('[data-guide-id]:visible').count()>0);
  await page.locator('[data-library-reset]').click();assert.equal(await page.locator('[data-guide-id]:visible').count(),11);
  await page.goto(base+'/soul-snack-03',{waitUntil:'networkidle'});await page.locator('.journal-reading-options>summary').click();await page.locator('[data-reading-larger]').click();assert(await page.locator('.cs').evaluate(e=>e.classList.contains('refresh-large')));await page.locator('[data-reading-plain]').click();assert(!(await page.locator('.journal-art-page').isVisible()));
  await page.locator('.refresh-reflection summary').click();await page.locator('[data-private-reflection]').fill('Private test reflection');await page.locator('[data-copy-reflection]').click();assert.equal(await page.evaluate(()=>localStorage.getItem('Private test reflection')),null);await page.locator('[data-clear-reflection]').click();assert.equal(await page.locator('[data-private-reflection]').inputValue(),'');
  await page.goto(base+'/welcome',{waitUntil:'networkidle'});await page.locator('.welcome-folio>summary').click();await page.locator('.welcome-body img').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('.welcome-body img').naturalWidth>0);const download=page.waitForEvent('download');await page.getByRole('link',{name:'Keep the illustrated page'}).click();assert((await download).suggestedFilename().endsWith('.pdf'));
  await page.goto(base+'/subscribe',{waitUntil:'networkidle'});assert.equal(await page.locator('[data-sunshine-mail="subscribe"]').getAttribute('action'),'https://app.kit.com/forms/10182939/subscriptions');
  await ctx.close();console.log(profile.name+' layouts and interactions checked');
 }
 // Every generated route is served, and every devotion has context, comfort and continuation.
 for(const file of pages){const response=await fetch(base+'/'+file);assert.equal(response.status,file==='404.html'?200:200);if(/^soul-snack-\d/.test(file)){const text=await response.text();assert(text.includes('data-reading-comfort'));assert(text.includes('data-private-reflection'));assert(text.includes('journal-making'));}}
 const report={date:new Date().toISOString(),pages:pages.length,references:refs,cases,findings};fs.writeFileSync(reportFile,JSON.stringify(report,null,2));
 console.log(JSON.stringify({pages:pages.length,references:refs,rendered:cases.length,findings:findings.length}));
 await chrome.close();if(safari)await safari.close();server.close();if(findings.length)process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exit(1);});
