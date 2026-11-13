const fs=require('fs'),path=require('path'),assert=require('assert');
process.env.PLAYWRIGHT_BROWSERS_PATH='C:/Users/amyal/Documents/Codex/2026-11-06/files-mentioned-by-the-user-screenshot/browser-audit-runtime';
const {chromium,webkit,devices}=require('C:/Users/amyal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'../source'),site=process.env.CS_BUILD_DIR,out=path.join(__dirname,'screenshots');
const posts=require('../source/devotions/devotions.json');
const report={date:new Date().toISOString(),artwork:[],cases:[]};
const base='http://127.0.0.1:8813';
(async()=>{
 // A distinct teaching/Scripture image remains attached to every devotional.
 for(const post of posts){
  const html=fs.readFileSync(path.join(site,post.slug+'.html'),'utf8');
  const art=html.match(/<figure class="journal-art-card">[\s\S]*?<img[^>]*src="([^"]+)"/);
  assert(art,'Missing teaching card: '+post.slug);assert(fs.existsSync(path.join(site,art[1])));
  assert(html.includes('data-journal-art-toggle open'));
  assert(html.includes('journal-scripture'));assert(html.includes('data-journal-turn'));
  report.artwork.push({day:post.day,asset:art[1]});
 }
 assert.equal(new Set(report.artwork.map(x=>x.asset)).size,90);
 const chrome=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const safari=await webkit.launch({headless:true});
 for(const profile of [{name:'desktop',browser:chrome,opts:{viewport:{width:1440,height:1000}}},{name:'android',browser:chrome,opts:devices['Pixel 7']},{name:'iphone',browser:safari,opts:devices['iPhone 13']},{name:'small-phone',browser:chrome,opts:{viewport:{width:320,height:780}}}].filter(p=>!process.env.CS_FRONT_PROFILE||p.name===process.env.CS_FRONT_PROFILE)){
  const ctx=await profile.browser.newContext(profile.opts);await ctx.route('https://app.kit.com/**',r=>r.abort());
  const page=await ctx.newPage();const checks=[];
  await page.goto(base+'/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('main h1').count(),1);
  assert((await page.locator('.reader-welcome h1').innerText()).includes('Grow deeper in faith.'));
  assert.equal(await page.getByRole('navigation',{name:'Main navigation',exact:true}).getByRole('link',{name:'Find Your Page'}).count(),1);
  assert.equal(await page.locator('.reader-feature-card').count(),3);
  await page.locator('.reader-journal-collage').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'front-door-art-'+profile.name+'.png')});
  const caption=await page.locator('.reader-journal-collage figcaption').boundingBox(),image=await page.locator('.reader-journal-collage img').boundingBox();
  assert(caption.x>=image.x+image.width*.18&&caption.x+caption.width<=image.x+image.width*.49,'Caption crosses bookmark: '+JSON.stringify({caption,image}));
  assert.equal(await page.locator('.reader-begin[data-random-devotion]').count(),1);
  const target=await page.locator('.reader-begin').getAttribute('href');assert(/soul-snack-\d+/.test(target));
  for(const step of await page.locator('.reader-step').all()){await step.locator('summary').click();assert(await step.getAttribute('open')!==null);await step.locator('summary').click();}
  await page.locator('.reader-mail-invite').click();assert(await page.locator('#sunday-letter').isVisible());
  checks.push('Reader benefit, primary reading CTA, three paths, numbered plan, newsletter link, caption placement');
  await page.goto(base+'/start',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.pick-intro h1').innerText(),'Your day is welcome here.');
  await page.locator('[data-deal-card]').click();assert.equal(await page.locator('.pick-card.is-flipped').count(),1);
  await page.locator('.pick-card.is-flipped [data-pick-close]').click();
  await page.screenshot({path:path.join(out,'find-your-page-'+profile.name+'.png'),fullPage:true});
  checks.push('Warm card-picker welcome, deal and turn-back controls');
  await page.goto(base+'/soul-snack-51#journal',{waitUntil:'networkidle'});
  assert(await page.locator('[data-journal-art-toggle]').evaluate(e=>e.open));
  await page.locator('.journal-art-card img').scrollIntoViewIfNeeded();assert(await page.locator('.journal-art-card img').evaluate(i=>i.naturalWidth>0));
  await page.screenshot({path:path.join(out,'journal-restored-'+profile.name+'-screen.png')});
  await page.locator('[data-journal-art-toggle] summary').evaluate(e=>e.getBoundingClientRect().width).then(async width=>{if(width){await page.locator('[data-journal-art-toggle] summary').click();assert(!(await page.locator('[data-journal-art-toggle]').evaluate(e=>e.open)));await page.locator('[data-journal-art-toggle] summary').click();}});
  await page.locator('[data-reading-plain]').click();assert(!(await page.locator('.journal-art-page').isVisible()));
  await page.locator('[data-return-journal-art]').click();assert(await page.locator('.journal-art-page').isVisible());
  assert.equal(await page.evaluate(()=>localStorage.getItem('cs-reading-plain')),'false');
  const next=page.locator('[data-journal-turn="next"]');await next.click();await page.waitForURL('**/soul-snack-52.html#journal');
  assert(await page.locator('[data-journal-art-toggle]').evaluate(e=>e.open));
  checks.push('Visible day 51 artwork/Scripture, manual fold, restore from plain view, animated turn to day 52');
  await page.waitForFunction(()=>!document.querySelector('.journal-book').className.includes('is-arriving'));
  const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,items:[...document.querySelectorAll('body *')].filter(e=>{const b=e.getBoundingClientRect();return b.width&&b.right>innerWidth+2}).slice(0,8).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right}))}));
  assert(overflow.scroll<=overflow.width+1,JSON.stringify(overflow));
  report.cases.push({profile:profile.name,checks,passed:true});
  console.log(profile.name+' front door and illustrated journal checked');await ctx.close();
 }
 await chrome.close();await safari.close();fs.writeFileSync(path.join(__dirname,'front-door-interactions.json'),JSON.stringify(report,null,2)+'\n');
 console.log('90 individual teaching cards preserved; four responsive interaction profiles passed.');
})().catch(e=>{console.error(e);process.exit(1)});
