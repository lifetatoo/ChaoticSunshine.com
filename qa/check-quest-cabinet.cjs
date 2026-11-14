const fs=require('fs'),path=require('path'),assert=require('assert');
process.env.PLAYWRIGHT_BROWSERS_PATH='C:/Users/amyal/Documents/Codex/2026-11-06/files-mentioned-by-the-user-screenshot/browser-audit-runtime';
const {chromium,webkit,devices}=require('C:/Users/amyal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const quests=require('../source/side-quests.json'),base='http://127.0.0.1:8813',screens=path.join(__dirname,'screenshots');
const report={date:new Date().toISOString(),missions:quests.length,uniqueIllustrations:24,profiles:[],findings:[]};
(async()=>{
 const chrome=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),safari=await webkit.launch({headless:true});
 for(const profile of [{name:'desktop',browser:chrome,opts:{viewport:{width:1440,height:1050}}},{name:'android',browser:chrome,opts:devices['Pixel 7']},{name:'iphone',browser:safari,opts:devices['iPhone 13']},{name:'small-phone',browser:chrome,opts:{viewport:{width:320,height:780},reducedMotion:'reduce'}}]){
  const ctx=await profile.browser.newContext(profile.opts);await ctx.route('https://app.kit.com/**',r=>r.abort());const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/side-quests',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  const active=()=>page.locator('[data-quest-card]:visible');
  assert.equal(await active().count(),1);
  const seen=[];
  for(let i=0;i<24;i++){
   const card=active(),id=await card.getAttribute('id');seen.push(id);
   assert.equal(await card.locator('[data-quest-art]').getAttribute('data-quest-art'),quests[i].id);
   await card.locator('img').scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>{const img=document.querySelector('[data-quest-card]:not([hidden]) img');return img&&img.complete&&img.naturalWidth>0;});
   assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),id+' overflow '+profile.name);
   const box=await card.boundingBox();assert(box.height<(profile.name==='small-phone'?480:440),'Mission card too tall: '+id+' '+profile.name+' '+box.height);
   await page.locator('[data-quest-next]').click();
  }
  assert.equal(new Set(seen).size,24);assert.equal(await active().getAttribute('id'),'quest-plot-twist');
  await page.locator('[data-quest-prev]').click();assert.equal(await active().getAttribute('id'),'quest-overdressed');
  await page.goBack();assert.equal(await active().getAttribute('id'),'quest-plot-twist');
  for(const category of ['discovery','creative','kindness','brave','after-dark']){
   await page.locator('[data-quest-category="'+category+'"]').click();assert.equal(await active().getAttribute('data-quest-type'),category);
   const before=await active().getAttribute('id');await page.locator('[data-quest-surprise]').click();assert.notEqual(await active().getAttribute('id'),before);assert.equal(await active().getAttribute('data-quest-type'),category);
  }
  await page.locator('[data-quest-category="all"]').click();await page.locator('.quest-finder>summary').click();
  await page.locator('[data-quest-search]').fill('qwerty-nothing');assert(await page.locator('.quest-empty').isVisible());assert.equal(await active().count(),1);assert(await page.locator('[data-quest-next]').isDisabled());
  await page.locator('[data-quest-search]').fill('pottery');assert.equal(await active().getAttribute('id'),'quest-be-bad-at-it');assert(!(await page.locator('.quest-empty').isVisible()));
  await page.locator('[data-quest-picker]').selectOption('dark-sky');assert.equal(await active().getAttribute('id'),'quest-dark-sky');assert.equal(await page.locator('[data-quest-search]').inputValue(),'');
  await active().locator('.quest-pocket>summary').click();const download=page.waitForEvent('download');await active().locator('[data-save-quest]').click();assert.equal((await download).suggestedFilename(),'dark-sky-field-note.txt');
  await page.goto(base+'/side-quests#quest-postcard-party',{waitUntil:'networkidle'});assert.equal(await active().getAttribute('id'),'quest-postcard-party');
  await page.locator('.quest-finder').evaluate(e=>e.open=false);
  await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
  await page.locator('.quest-cabinet').screenshot({path:path.join(screens,'quest-cabinet-'+profile.name+'.png')});
  const dimensions=await page.locator('.quest-cabinet').boundingBox();
  const art=await active().locator('.quest-illustration').boundingBox();
  assert(art.width>(profile.name==='desktop'?240:70));
  assert.deepEqual(errors,[]);report.profiles.push({name:profile.name,all24Missions:true,oneVisible:true,drawers:true,randomExcludesCurrent:true,searchAndFallback:true,deepLink:true,backButton:true,download:true,cabinetHeight:Math.round(dimensions.height),artWidth:Math.round(art.width),pageErrors:errors});await ctx.close();console.log(profile.name+' cabinet passed');
 }
 const ctx=await chrome.newContext({javaScriptEnabled:false}),page=await ctx.newPage();await page.goto(base+'/side-quests');assert.equal(await page.locator('[data-quest-card]:visible').count(),24);assert.equal(await page.locator('[data-quest-controls]:visible').count(),0);report.noJavaScript={all24Readable:true,deadControlsHidden:true};await ctx.close();
 await chrome.close();await safari.close();fs.writeFileSync(path.join(__dirname,'quest-cabinet-results.json'),JSON.stringify(report,null,2)+'\n');console.log('All cabinet checks passed.');
})().catch(e=>{console.error(e);process.exit(1)});
