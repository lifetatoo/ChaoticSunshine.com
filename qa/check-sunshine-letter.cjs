const fs=require('fs'),path=require('path'),assert=require('assert');
process.env.PLAYWRIGHT_BROWSERS_PATH='C:/Users/amyal/Documents/Codex/2026-11-06/files-mentioned-by-the-user-screenshot/browser-audit-runtime';
const {chromium,webkit,devices}=require('C:/Users/amyal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out=path.join(__dirname,'screenshots');fs.mkdirSync(out,{recursive:true});
const axe=fs.readFileSync('C:/Users/amyal/Documents/Codex/2026-11-06/files-mentioned-by-the-user-screenshot/website-audit-tools/node_modules/axe-core/axe.min.js','utf8');
const checks=[];
(async()=>{
 const chrome=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const safari=await webkit.launch({headless:true});
 const profiles=[['desktop',chrome,{viewport:{width:1440,height:1000}}],['android',chrome,devices['Pixel 7']],['iphone',safari,devices['iPhone 13']],['small-phone',chrome,{viewport:{width:320,height:780},isMobile:true,hasTouch:true}]];
 for(const [name,browser,opts]of profiles){
  const ctx=await browser.newContext({...opts,reducedMotion:'reduce'});const page=await ctx.newPage();await ctx.route('https://app.kit.com/**',r=>r.abort());
  await page.goto('http://127.0.0.1:8813/teaching-shelf',{waitUntil:'networkidle'});
  const footer=page.locator('.sunshine-footer-envelope');await footer.scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('.sunshine-footer-art img').naturalWidth>0);
  assert.equal(await footer.locator('form').getAttribute('action'),'https://app.kit.com/forms/10182939/subscriptions');
  await footer.screenshot({path:path.join(out,'sunshine-footer-'+name+'.png')});
  const bounds=await footer.evaluate(el=>{const p=el.querySelector('.sunshine-footer-poster').getBoundingClientRect(),f=el.querySelector('form').getBoundingClientRect();return {frameWidth:p.width,frameHeight:p.height,formLeft:f.left-p.left,formRight:f.right-p.left,formBottom:f.bottom-p.top,fieldHeight:el.querySelector('input[type=email]').getBoundingClientRect().height,buttonHeight:el.querySelector('button').getBoundingClientRect().height};});
  assert(bounds.fieldHeight>=44&&bounds.buttonHeight>=44);assert(bounds.formLeft>=0&&bounds.formRight<=bounds.frameWidth);assert(bounds.formBottom<bounds.frameHeight*.79);
  await page.addScriptTag({content:axe});const footerAxe=await page.evaluate(async()=> (await axe.run(document.querySelector('.sunshine-footer-envelope'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id));assert.deepEqual(footerAxe,[]);
  await page.goto('http://127.0.0.1:8813/sunshine-mail-sample',{waitUntil:'networkidle'});await page.locator('.sunday-letter-illustration').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('.sunday-letter-illustration img').naturalWidth>0);
  const letter=page.locator('.illustrated-sunday-letter');await letter.screenshot({path:path.join(out,'sunshine-letter-'+name+'.png')});
  const text=await page.locator('.sunday-letter-prose').innerText();for(const phrase of ['Dear friend,','Read Romans 8:12–17.','If “Father” is a tender word','You do not have to turn it into a paragraph with excellent formatting.','A little sunshine for your Sunday,','Amy Grace'])assert(text.includes(phrase));
  await page.addScriptTag({content:axe});const result=await page.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,violations:(await axe.run(document.querySelector('.illustrated-sunday-letter'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)}));assert(!result.overflow);assert.deepEqual(result.violations,[]);
  await page.goto('http://127.0.0.1:8813/subscribe',{waitUntil:'networkidle'});await page.locator('.illustrated-letter-peek>summary').click();assert(await page.locator('.illustrated-letter-peek .sunday-letter-prose').isVisible());const size=await page.locator('.illustrated-letter-peek .sunday-letter-prose p').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize));assert(size>=19);
  checks.push({profile:name,footer:bounds,letterTextPreserved:true,inlineReadingFont:size,axeViolations:0});await ctx.close();console.log(name+' envelope and complete letter passed');
 }
 fs.writeFileSync(path.join(__dirname,'sunshine-letter-detail-results.json'),JSON.stringify({date:new Date().toISOString(),checks},null,2));await chrome.close();await safari.close();
})().catch(e=>{console.error(e);process.exit(1)});
