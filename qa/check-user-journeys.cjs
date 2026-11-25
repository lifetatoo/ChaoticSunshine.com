// Chaotic Sunshine: independent real-interaction acceptance tests.
// Run only against a generated LOCAL build, never submit live Kit subscriptions.
// Browser, download and storage behavior is exercised in Chromium at three widths.
'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../source/site-kit');
const reportFile=path.resolve(__dirname,'user-journey-results.json');
const MIME={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.pdf':'application/pdf','.ttf':'font/ttf','.ico':'image/x-icon'};
const report={date:new Date().toISOString(),scope:'Generated local release candidate, not Cloudflare or live Kit',results:[],passed:0,failed:0,findings:[]};
const server=http.createServer((req,res)=>{
 let p;
 try{p=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{return res.writeHead(400).end()}
 let target=path.resolve(root,'.'+(p==='/'?'/index.html':p));
 if(!target.startsWith(root+path.sep))return res.writeHead(403).end();
 if(!path.extname(target)&&fs.existsSync(target+'.html'))target+='.html';
 if(!fs.existsSync(target)||!fs.statSync(target).isFile())return res.writeHead(404).end();
 res.setHeader('content-type',MIME[path.extname(target)]||'application/octet-stream');
 fs.createReadStream(target).pipe(res);
});
async function main(){
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port+'/';
 let exe;
 for(const p of ['google-chrome','google-chrome-stable','chromium','chromium-browser'])try{exe=execFileSync('which',[p],{encoding:'utf8'}).trim();if(exe)break}catch{}
 if(!exe)throw Error('Chrome not installed on runner');
 const browser=await chromium.launch({executablePath:exe,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const profiles=[{name:'desktop',width:1440,height:900},{name:'phone',width:390,height:844},{name:'small-phone',width:320,height:700}];
 const scenarios=[];
 const add=(id,name,fn)=>scenarios.push({id,name,fn});
 async function open(page,file){const r=await page.goto(base+file,{waitUntil:'networkidle',timeout:25000});assert.equal(r.status(),200,'HTTP status of '+file);await page.locator('main h1').first().waitFor({timeout:6000});return page}
 add('U01','Home to primary navigation and responsive menu',async(page,profile)=>{
  await open(page,'index.html');
  assert.equal(await page.locator('main h1').count(),1);
  if(profile.width<=620){
   assert.equal(await page.locator('.phone-tab-bar a').count(),4);
   await page.locator('#phone-more').click();
   assert.equal(await page.locator('#phone-pages').evaluate(e=>e.open),true);
   assert.ok(await page.locator('#phone-pages a').count()>=9);
   await page.locator('#phone-pages-close').click();
   assert.equal(await page.locator('#phone-pages').evaluate(e=>e.open),false);
  } else assert.ok(await page.locator('.permanent-menu a').count()>=8);
  await page.locator(profile.width<=620?'.phone-tab-bar a[href="freebies.html"]':'.permanent-menu a[href="freebies.html"]').click();
  assert.ok(page.url().endsWith('/freebies.html'));
 });
 add('U02','Devotional reader and next-page navigation',async(page)=>{
  await open(page,'soul-snack-01.html');
  assert.ok((await page.locator('main').innerText()).includes('Your Prayer'));
  await page.locator('#reading-toggle').click();
  assert.equal(await page.locator('#reading-toggle').getAttribute('aria-pressed'),'true');
  await page.locator('#reading-toggle').click();
  assert.equal(await page.locator('#reading-toggle').getAttribute('aria-pressed'),'false');
  await page.locator('a[href^="soul-snack-02.html"]').first().click();
  assert.ok(page.url().includes('soul-snack-02.html'));
  assert.ok((await page.locator('main').innerText()).length>300);
 });
 add('U03','Library doors, search and empty result',async(page)=>{
  await open(page,'freebies.html');
  assert.equal(await page.locator('.library-book').count(),11);
  const handle=page.locator('.library-handle').first();
  await handle.focus();await page.keyboard.press('Enter');
  assert.equal(await handle.getAttribute('aria-expanded'),'true');
  await page.locator('#guide-search').fill('Ruth');
  assert.ok(await page.locator('.library-book:visible').count()>=1);
  await page.locator('#guide-search').fill('zz-no-match-987');
  assert.equal(await page.locator('.library-book:visible').count(),0);
  assert.equal(await page.locator('#guide-empty').isVisible(),true);
  await page.locator('#guide-search').fill('');
  assert.equal(await page.locator('.library-book:visible').count(),11);
 });
 add('U04','Free guide reaches an actual PDF download',async(page)=>{
  await open(page,'advent.html');
  const link=page.locator('a[download][href$=".pdf"]').first();
  assert.ok(await link.count()>0,'Free printable PDF link is missing');
  const href=await link.getAttribute('href');
  const response=await page.request.get(new URL(href,page.url()).href);
  assert.equal(response.status(),200);
  assert.ok((await response.body()).length>10000,'PDF unexpectedly short');
  assert.equal((await response.body()).subarray(0,4).toString(),'%PDF');
 });
 add('U05','Teaching shelf selection and PDF',async(page)=>{
  await open(page,'teaching-shelf.html');
  assert.equal(await page.locator('[data-teaching]').count(),9);
  await page.locator('[data-teaching="4"]').click();
  assert.equal(await page.locator('[data-teaching="4"]').getAttribute('aria-pressed'),'true');
  assert.ok((await page.locator('#teaching-preview').innerText()).length>80);
  const href=await page.locator('#teaching-preview a[download]').getAttribute('href');
  const response=await page.request.get(new URL(href,page.url()).href);
  assert.equal(response.status(),200);
  assert.equal((await response.body()).subarray(0,4).toString(),'%PDF');
 });

 add('U06','All Daily Cabinet drawers, distinct drawn cards and accessible front/back',async(page)=>{
  await open(page,'daily-cabinet.html');
  assert.equal(await page.locator('[data-drawer]').count(),4);
  assert.ok(await page.locator('.cabinet-art-card').count(),'no daily cabinet card rendered');
  const first=await page.locator('.cabinet-card-front h2').innerText();
  await page.locator('#another-card').click();
  assert.notEqual(await page.locator('.cabinet-card-front h2').innerText(),first,'random draw repeated same card');
  await page.locator('#turn-card').click();
  assert.ok(await page.locator('.cabinet-art-card.is-flipped').count(),'card did not flip');
  await page.locator('[data-drawer="verse"]').click();
  assert.equal(await page.locator('[data-drawer="verse"]').getAttribute('aria-pressed'),'true');
  const verseType=(await page.locator('.cabinet-card-front .eyebrow').textContent()||'').trim();
  assert.ok(verseType.includes('Scripture'),'verse drawer wrong collection: '+JSON.stringify(verseType));
  await page.locator('[data-drawer="studio"]').click();
  assert.equal(await page.locator('[data-drawer="studio"]').getAttribute('aria-pressed'),'true');
  const studioType=(await page.locator('.cabinet-card-front .eyebrow').textContent()||'').trim();
  assert.ok(studioType.includes('Studio'),'studio drawer wrong collection: '+JSON.stringify(studioType));
  await page.locator('[data-drawer="archive"]').click();
  assert.ok(await page.locator('#gratitude-entry').isVisible(),'private jar not opened from its drawer');
 });
 add('U07','Private jar add, persist, retrieve, export, flip and two-step clear',async(page)=>{
  await open(page,'daily-cabinet.html');
  await page.locator('#gratitude-entry').fill('One small good thing from our QA test.');
  await page.locator('#add-gratitude').click();
  assert.ok((await page.locator('#jar-status').innerText()).includes('1 private little good thing'));
  await page.reload({waitUntil:'networkidle'});
  assert.ok((await page.locator('#jar-status').innerText()).includes('1 private little good thing'));
  await page.locator('#pull-gratitude').click();
  assert.ok((await page.locator('#jar-note').innerText()).includes('One small good thing'));
  assert.ok(await page.locator('#cs-jar-card-reveal').isVisible());
  await page.locator('#turn-jar-note').click();
  assert.ok(await page.locator('.cs-jar-note-card.is-flipped').count(),'personal card did not flip');
  const promise=page.waitForEvent('download');
  await page.locator('#export-gratitude').click();
  assert.ok((await promise).suggestedFilename().endsWith('.txt'));
  await page.locator('#clear-gratitude').click();
  assert.ok((await page.locator('#clear-gratitude').innerText()).includes('Confirm'));
  await page.locator('#clear-gratitude').click();
  assert.ok((await page.locator('#jar-status').innerText()).includes('0 private little good things'));
 });
 add('U08','Side Quest filters, next and previous',async(page)=>{
  await open(page,'side-quests.html');
  const title=await page.locator('#mission h2').innerText();
  await page.locator('#quest-next').click();
  const other=await page.locator('#mission h2').innerText();
  assert.notEqual(other,title);
  await page.locator('#quest-back').click();
  assert.equal(await page.locator('#mission h2').innerText(),title);
  await page.locator('[data-quest-group="kindness"]').click();
  assert.equal(await page.locator('[data-quest-group="kindness"]').getAttribute('aria-pressed'),'true');
  assert.ok((await page.locator('#mission').innerText()).length>100);
 });

 add('U08b','Side Quest category decks have distinct no-repeat front/back cards',async(page)=>{
  await open(page,'side-quests.html');
  assert.equal(await page.locator('[data-quest-group]').count(),4);
  for(const group of ['discovery','kindness','brave']){
   await page.locator('[data-quest-group="'+group+'"]').click();
   const seen=new Set();
   for(let i=0;i<4;i++){
    const title=(await page.locator('.quest-card-front h3').innerText()).trim();
    assert.ok(title,'missing pocket-card title');
    assert.ok(!seen.has(title),'category repeated before 24 cards exhausted: '+group);
    seen.add(title);
    await page.locator('#quest-draw-card').click();
   }
   await page.locator('#quest-flip-card').click();
   assert.ok(await page.locator('.quest-pocket-card.is-flipped').count(),'pocket card back not available');
   await page.locator('#quest-flip-card').click();
  }
 });
 add('U09','Creative studio preserves private writing and download',async(page)=>{
  await open(page,'make.html');
  await page.locator('#journal-note').fill('A private QA reflection that should stay on this tab.');
  const download=page.waitForEvent('download');
  await page.locator('#download-note').click();
  assert.ok((await download).suggestedFilename().endsWith('.txt'));
  await page.reload({waitUntil:'networkidle'});
  assert.ok((await page.locator('#journal-note').inputValue()).includes('private QA reflection'),'Draft lost on reload');
  await page.locator('[data-make-mode="sketch"]').click();
  assert.equal(await page.locator('[data-make-mode="sketch"]').getAttribute('aria-pressed'),'true');
 });
 add('U10','Try and Share retain private drafts',async(page)=>{
  await open(page,'try.html');
  await page.locator('#practice-when').fill('tomorrow after tea');
  await page.locator('#practice-try').fill('practice a quiet reflection');
  await page.reload({waitUntil:'networkidle'});
  assert.ok((await page.locator('#practice-when').inputValue()).includes('tomorrow'),'Try draft lost');
  await open(page,'share.html');
  await page.locator('#share-note').fill('A story I am not sending anywhere');
  await page.reload({waitUntil:'networkidle'});
  assert.ok((await page.locator('#share-note').inputValue()).includes('not sending'),'Share draft lost');
 });
 add('U11','Sunshine Mail field validation and mocked POST only',async(page)=>{
  await open(page,'subscribe.html');
  const form=page.locator('#sunshine-signup');
  assert.equal(await form.getAttribute('action'),'https://app.kit.com/forms/10182939/subscriptions');
  assert.equal(await form.getAttribute('method'),'post');
  assert.equal(await page.locator('#signup-email').evaluate(e=>e.checkValidity()),false);
  await page.locator('#signup-email').fill('not-an-email');
  assert.equal(await page.locator('#signup-email').evaluate(e=>e.checkValidity()),false);
  let post=null;await page.route('https://app.kit.com/forms/**',async route=>{
   post={method:route.request().method(),body:route.request().postData()};
   await route.fulfill({status:200,contentType:'text/html',body:'<h1>Mocked Kit response, no subscriber created</h1>'});
  });
  await page.locator('#signup-name').fill('Test');
  await page.locator('#signup-email').fill('chaotic-sunshine-qa@example.invalid');
  await form.locator('button[type="submit"]').click();
  await page.waitForURL(/app\.kit\.com/, {timeout:8000});
  assert.equal(post.method,'POST');
  assert.ok(post.body.includes('chaotic-sunshine-qa%40example.invalid'));
  assert.ok(post.body.includes('fields%5Bfirst_name%5D=Test'));
 });
 add('U12','Welcome letter opens, switches view and restores focus',async(page)=>{
  await open(page,'welcome.html');
  const toggle=page.locator('#postal-toggle');
  assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  assert.equal(await page.locator('#letter-reader').getAttribute('inert'),null);
  await page.locator('#letter-text-tab').click();
  assert.equal(await page.locator('#letter-text-tab').getAttribute('aria-pressed'),'true');
  await page.locator('#letter-expand').click();
  assert.equal(await page.locator('#sunshine-letter-dialog').evaluate(e=>e.open),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#sunshine-letter-dialog').evaluate(e=>e.open),false);
  await page.locator('#letter-return').click();
  assert.equal(await toggle.getAttribute('aria-expanded'),'false');
 });

 add('U14','Full-site verse and pain-point discovery on existing site directory',async(page)=>{
  await open(page,'site-map.html');
  const field=page.locator('#cs-unified-search');
  assert.ok(await field.count(),'unified search missing');
  await page.waitForFunction(()=>document.querySelector('#cs-search-coverage')?.textContent.includes('90 Soul Snacks'));
  await field.fill('Romans 8:15');
  await page.waitForFunction(()=>document.querySelector('#cs-search-status')?.textContent.includes('matching resources'));
  const verse=page.locator('#cs-search-results a[href$="soul-snack-01"]');
  assert.ok(await verse.count(),'Romans 8:15 must find Romans 8:12–17 by reference range');
  await field.fill('perfectionism');
  await page.waitForFunction(()=>document.querySelector('#cs-search-status')?.textContent.includes('matching resources'));
  assert.ok(await page.locator('#cs-search-results article').count(),'plain-language pain point did not find any content');
  await field.fill('zzzzzznoitems99');
  await page.waitForFunction(()=>document.querySelector('#cs-search-status')?.textContent.includes('No matches'));
 });

 const contexts=[];
 for(const p of profiles){
  const context=await browser.newContext({viewport:{width:p.width,height:p.height},deviceScaleFactor:1,reducedMotion:'reduce',timezoneId:'America/Phoenix',acceptDownloads:true});
  contexts.push(context);
  for(const sc of scenarios){
   const page=await context.newPage(),errs=[];
   page.setDefaultTimeout(9000);
   page.on('pageerror',e=>errs.push(e.message));
   try{
    await sc.fn(page,p);
    assert.deepEqual(errs,[],'Uncaught page JavaScript errors');
    report.results.push({id:sc.id,name:sc.name,profile:p.name,status:'pass'});report.passed++;
   }catch(e){
    const issue={id:sc.id,name:sc.name,profile:p.name,status:'fail',error:String(e.message||e).slice(0,700),url:page.url()};
    report.results.push(issue);report.findings.push(issue);report.failed++;
   }finally{await page.close().catch(()=>{})}
  }
  await context.close();
 }
 // No-JavaScript fallback should never hide all of the core content.
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 for(const slug of ['index.html','freebies.html','soul-snack-01.html','welcome.html','subscribe.html']){
  const page=await nojs.newPage();
  try{
   await open(page,slug);
   assert.ok((await page.locator('main').innerText()).trim().length>140,'No-JS page is blank');
   assert.ok(await page.locator('a[href]').count()>=5,'No-JS navigation missing');
   report.results.push({id:'U13',name:'No-JavaScript fallback',profile:slug,status:'pass'});report.passed++;
  }catch(e){
   const issue={id:'U13',name:'No-JavaScript fallback',profile:slug,status:'fail',error:String(e.message||e).slice(0,550)};
   report.results.push(issue);report.findings.push(issue);report.failed++;
  }finally{await page.close().catch(()=>{})}
 }
 await nojs.close();await browser.close();
}
main().catch(e=>{report.findings.push({id:'HARNESS',error:String(e.stack||e)});report.failed++})
 .finally(()=>{fs.writeFileSync(reportFile,JSON.stringify(report,null,2));console.log('USER_JOURNEY_SUMMARY',JSON.stringify({passed:report.passed,failed:report.failed,cases:report.results.length,findings:report.findings.slice(0,18)}));server.close();if(report.failed)process.exitCode=1;});
