const fs=require('fs'),path=require('path'),assert=require('assert');
process.env.PLAYWRIGHT_BROWSERS_PATH='C:/Users/amyal/Documents/Codex/2026-11-06/files-mentioned-by-the-user-screenshot/browser-audit-runtime';
const {chromium,webkit,devices}=require('C:/Users/amyal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const posts=require('../source/devotions/devotions.json'),quests=require('../source/side-quests.json'),creative=require('../source/journal-experience.cjs');
const site=process.env.CS_BUILD_DIR,base='http://127.0.0.1:8813',screens=path.join(__dirname,'screenshots');
const report={date:new Date().toISOString(),pages:0,readings:posts.length,missions:quests.length,paintedMotifs:9,artwork:[],profiles:[],seo:{},findings:[]};
(async()=>{
 const titles=new Map(),descriptions=new Map();let articles=0,collections=0,resources=0;
 for(const name of fs.readdirSync(site).filter(n=>n.endsWith('.html'))){
  const html=fs.readFileSync(path.join(site,name),'utf8');report.pages++;
  if(name==='404.html')continue;
  const title=html.match(/<title>(.*?)<\/title>/)[1],description=html.match(/<meta name="description" content="([^"]+)"/)[1];
  assert(!titles.has(title),'Duplicate title: '+name+' / '+titles.get(title));titles.set(title,name);
  if(descriptions.has(description))report.findings.push({type:'duplicate-description',pages:[name,descriptions.get(description)]});descriptions.set(description,name);
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert(graph.some(x=>x['@type']==='Organization'&&x['@id']==='https://chaoticsunshine.com/#organization'));
  assert(graph.some(x=>x['@type']==='WebSite'&&x['@id']==='https://chaoticsunshine.com/#website'));
  if(graph.some(x=>x['@type']==='CollectionPage'))collections++;
  if(graph.some(x=>x['@type']==='LearningResource'))resources++;
  if(/^soul-snack-\d+\.html$/.test(name)){
   const article=graph.find(x=>x['@type']==='BlogPosting');assert(article);assert(article.author['@id']==='https://chaoticsunshine.com/#amy-grace');assert(article.citation);assert(article.image.url.includes('/assets/'));articles++;
   assert(html.includes('journal-painted-moment'));assert(html.includes('journal-art-card'));assert(html.includes('data-journal-art-toggle open'));
   const src=html.match(/<figure class="journal-art-card">[\s\S]*?<img[^>]*src="([^"]+)"/)[1];report.artwork.push(src);
   const res=await fetch(base+'/'+name);assert.equal(res.status,200,'Preview route failed: '+name);
  }
  if(name==='side-quests.html'){const list=graph.find(x=>x['@type']==='ItemList');assert.equal(list.numberOfItems,24);for(const item of list.itemListElement)assert(html.includes('id="'+item.url.split('#')[1]+'"'));}
 }
 assert.equal(articles,90);assert.equal(new Set(report.artwork).size,90);assert.equal(new Set(creative.artMap).size,9);
 for(let i=1;i<creative.artMap.length;i++)assert.notEqual(creative.artMap[i],creative.artMap[i-1]);
 const sitemap=fs.readFileSync(path.join(site,'sitemap.xml'),'utf8');assert(sitemap.includes('/side-quests</loc>'));assert(!sitemap.includes('/welcome</loc>'));assert(!sitemap.includes('127.0.0.1'));
 report.seo={uniqueTitles:titles.size,uniqueDescriptions:descriptions.size,articles,collections,learningResources:resources,sitemapIncludesSideQuests:true};
 const chrome=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),safari=await webkit.launch({headless:true});
 for(const profile of [{name:'desktop',browser:chrome,opts:{viewport:{width:1440,height:1050}}},{name:'android',browser:chrome,opts:devices['Pixel 7']},{name:'iphone',browser:safari,opts:devices['iPhone 13']},{name:'small-phone',browser:chrome,opts:{viewport:{width:320,height:780}}}]){
  const ctx=await profile.browser.newContext(profile.opts);await ctx.route('https://app.kit.com/**',r=>r.abort());const page=await ctx.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const pace of ['short','medium','long']){
   await page.goto(base+'/soul-snacks',{waitUntil:'networkidle'});
   assert.equal(await page.locator('main [data-journal-open]').count(),1);assert.equal(await page.locator('.reader-topic-pills,.reader-shelf,#movements').count(),0);
   await page.locator('input[name="reading-length"][value="'+pace+'"]').check();await page.locator('[data-journal-open]').click();await page.waitForURL('**/soul-snack-*?pace='+pace+'#journal');
   const current=await page.locator('[data-journal-slug]').getAttribute('data-journal-slug');assert.equal(posts.find(p=>p.slug===current).length,pace);
   const group=posts.filter(p=>p.length===pace),start=group[4];await page.goto(base+'/'+start.slug+'.html?pace='+pace+'#journal',{waitUntil:'networkidle'});
   for(let i=0;i<2;i++){const slug=group[5+i].slug;await page.locator('.journal-quick-turn [data-journal-turn="next"]').click();await page.waitForURL('**/'+slug+'.html?pace='+pace+'#journal');assert(await page.locator('[data-journal-art-toggle]').evaluate(e=>e.open));}
   await page.locator('.journal-quick-turn [data-journal-turn="back"]').click();await page.waitForURL('**/'+group[5].slug+'.html?pace='+pace+'#journal');
  }
  await page.goto(base+'/soul-snack-51.html#journal',{waitUntil:'networkidle'});await page.locator('.journal-painted-moment').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(screens,'journal-studio-'+profile.name+'.png')});
  assert(await page.locator('.journal-painted-moment img').evaluate(i=>i.naturalWidth>0));assert(!(await page.locator('[data-reading-larger]').isVisible()));
  await page.locator('.journal-reading-options>summary').click();await page.locator('[data-reading-larger]').click();assert.equal(await page.locator('[data-reading-larger]').innerText(),'Use standard text');await page.locator('[data-reading-plain]').click();assert(!(await page.locator('.journal-art-page').isVisible()));await page.locator('[data-return-journal-art]').click();assert(await page.locator('.journal-art-page').isVisible());assert.equal(await page.locator('[data-reading-plain]').innerText(),'Text only');
  await page.goto(base+'/soul-snack-06.html#journal',{waitUntil:'networkidle'});await page.locator('.journal-making>summary').click();await page.locator('[data-reveal-words]').click();assert.equal(await page.locator('[data-reveal-words]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.verse-word-hunt tr').count(),9);
  await page.goto(base+'/soul-snack-03.html#journal',{waitUntil:'networkidle'});await page.locator('.journal-joy-mission summary').click();assert(await page.locator('.mission-paper').isVisible());
  await page.goto(base+'/start',{waitUntil:'networkidle'});assert.equal(await page.locator('.pick-front .creative-sketch').count(),9);await page.locator('[data-deal-card]').click();assert.equal(await page.locator('.pick-card.is-flipped').count(),1);await page.locator('.pick-card.is-flipped [data-pick-close]').click();await page.screenshot({path:path.join(screens,'topic-studio-'+profile.name+'.png'),fullPage:true});
  await page.goto(base+'/side-quests',{waitUntil:'networkidle'});assert.equal(await page.locator('[data-quest-card]').count(),24);await page.locator('[data-quest-search]').fill('qwerty-nothing');assert(await page.locator('.quest-empty').isVisible());await page.locator('[data-quest-search]').fill('');await page.locator('[data-quest-card]').first().locator('summary').click();const download=page.waitForEvent('download');await page.locator('[data-save-quest]').first().click();assert((await download).suggestedFilename().endsWith('.txt'));
  for(const route of ['soul-snacks','start','side-quests','soul-snack-51']){await page.goto(base+'/'+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),route+' overflow '+profile.name);}
  assert.deepEqual(errors,[]);report.profiles.push({name:profile.name,passed:true,paceChoices:3,forwardAndBack:true,artwork:true,creativeExercise:true,mission:true,download:true});await ctx.close();console.log(profile.name+' journal workflow, artwork, missions, and page turns passed');
 }
 await chrome.close();await safari.close();fs.writeFileSync(path.join(__dirname,'journal-studio-interactions.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pages:report.pages,seo:report.seo,findings:report.findings}));if(report.findings.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
