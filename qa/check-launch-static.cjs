// Portable release-source checks. No external npm packages or network needed.
// This is NOT a substitute for live signup, real-device, visual or theological QA.
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const site=process.env.CS_BUILD_DIR?path.resolve(process.env.CS_BUILD_DIR):path.join(root,'source/site-kit');
const required=['index','start','freebies','soul-snacks','teaching-shelf','side-quests','subscribe','welcome','about','privacy'];
const read=(name)=>fs.readFileSync(path.join(site,name),'utf8');
const failures=[];
const check=(ok,message)=>{if(!ok)failures.push(message);};
for(const slug of required)check(fs.existsSync(path.join(site,slug+'.html')),'Missing route /'+slug);
check(fs.existsSync(path.join(site,'assets/css/site.css')),'Missing compiled CSS');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
const css=read('assets/css/site.css');
check(css.includes('--cs-sapphire:')&&css.includes('--cs-burgundy:')&&css.includes('--cs-gold:'),'Canonical jewel-tone tokens missing');
const pages=fs.readdirSync(site).filter(n=>n.endsWith('.html'));
check(pages.length>=130,'Unexpected loss of pages: '+pages.length);
let checkedAssets=0;
for(const file of pages){
 const html=read(file);
 if(file!=='404.html'){
   check(/<title>[^<]+<\/title>/.test(html),file+': missing title');
   check(html.includes('rel="canonical"'),file+': missing canonical');
 }
 for(const m of html.matchAll(/(?:src|href)="(\/?(?:assets|guides)\/[^"#?]+)(?:[?#][^"]*)?"/g)){
  const relative=m[1].replace(/^\//,'');
  checkedAssets++;
  check(fs.existsSync(path.join(site,relative)),file+': missing '+relative);
 }
 check(!html.includes('Sunshine Mail Club'),file+': retired Mail Club name still appears');
 check(!html.includes('kit-form.invalid'),file+': unresolved kit-form marker');
}
const front=read('index.html'), sub=read('subscribe.html');
for(const [file,html] of [['index',front],['subscribe',sub]]){
 check(html.includes('10182939/subscriptions'),file+': missing configured newsletter action');
 check(html.includes('free digital letter')||html.includes('free monthly digital letter'),file+': no explanation that Sunshine Mail is digital');
}
const guides=fs.readdirSync(path.join(site,'guides')).filter(n=>n.endsWith('.pdf'));
check(guides.length>=21,'Expected 21 PDFs, found '+guides.length);
const report={asOf:new Date().toISOString(),source:'generated pilot build',pages:pages.length,guides:guides.length,checkedAssetLinks:checkedAssets,findings:failures};
console.log(JSON.stringify(report,null,2));
if(failures.length)process.exitCode=1;
