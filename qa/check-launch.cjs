const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(process.env.CS_BUILD_DIR||path.join(__dirname,'../source/site-kit'));
const utility=['welcome.html','404.html','offline.html','something-went-wobbly.html'];
const production=process.env.CS_STAGING!=='1';
const files=fs.readdirSync(root).filter(f=>f.endsWith('.html')&&f!=='phone.html');
const findings=[],titles=new Map(),descs=new Map(),types={},forms=[];let refs=0,scripts=0;
const ids=new Map(files.map(file=>[file,new Set([...fs.readFileSync(path.join(root,file),'utf8').matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]))]));
const fragments=[];
for(const file of files){const s=fs.readFileSync(path.join(root,file),'utf8');const fail=issue=>findings.push({file,issue});
 for(const [kind,re,map] of [['title',/<title>([\s\S]*?)<\/title>/,titles],['description',/<meta name="description" content="([^"]+)"/,descs]]){const value=s.match(re)?.[1];if(!value){if(file!=='404.html')fail('Missing '+kind);}else if(map.has(value))fail('Duplicate '+kind+' '+map.get(value));else map.set(value,file);}
 if((s.match(/<h1\b/g)||[]).length!==1)fail('Expected one h1');
 if((s.match(/<main\b/g)||[]).length!==1)fail('Expected one main landmark');
 if(!s.includes('aria-label="Page and section navigation"'))fail('Missing page/section navigation');
 if(!s.includes('class="permanent-menu"'))fail('Missing permanent menu');
 if(s.includes('class="room-menu"'))fail('Expandable main menu retained');
 if(production&&!utility.includes(file)&&/<meta name="robots" content="[^"]*noindex/.test(s))fail('Public noindex');
 if(!production&&!/<meta name="robots" content="noindex,nofollow"/.test(s))fail('Review noindex missing');
 if(!utility.includes(file)&&!s.includes('rel="canonical" href="https://chaoticsunshine.com/'))fail('Missing production canonical');
 const pageIds=[...s.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);if(new Set(pageIds).size!==pageIds.length)fail('Duplicate id');
 for(const m of s.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){try{if(m[1].includes('application/ld+json')){const g=JSON.parse(m[2]);for(const x of g['@graph']||[])types[x['@type']]=(types[x['@type']]||0)+1;}else if(m[2].trim()){new vm.Script(m[2]);scripts++;}}catch(e){fail('Script/schema parse '+e.message);}}
 for(const m of s.matchAll(/(?:href|src|content)="([^"<>]+)"/g)){let url=m[1];if(/^https:\/\/(www\.)?chaoticsunshine\.com\//.test(url))url=url.replace(/^https:\/\/(www\.)?chaoticsunshine\.com\//,'');else if(/^(https?:|mailto:|tel:|data:)/.test(url))continue;
  if(!(/\.(html|pdf|js|css|png|jpg|webp|ico|ttf)([?#]|$)/.test(url)||url.startsWith('assets/')||url.startsWith('guides/')))continue;
  const [p,fragment]=url.split('#');const clean=decodeURIComponent(p.split('?')[0].replace(/^\//,''));const target=path.join(root,clean);refs++;if(!fs.existsSync(target))fail('Missing reference '+clean);else if(fragment&&clean.endsWith('.html')&&!ids.get(clean)?.has(fragment))fragments.push({file,target:clean,fragment});
 }
 for(const f of s.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/g)){const action=f[0].match(/action="([^"]+)"/)?.[1];forms.push({file,action});if(action!=='https://app.kit.com/forms/10182939/subscriptions')fail('Wrong form destination');if(!/<input[^>]*type="email"[^>]*required/.test(f[0]))fail('Missing required email');if(!/method="post"/.test(f[0]))fail('Missing POST');}
 if(/Creative Faith Adventures|KIT_FORM_ID_PENDING|kit-form\.invalid/.test(s))fail('Internal phrase or unresolved integration placeholder');
}
for(const f of ['app.js','site-navigation.js','release-navigation.js']){try{new vm.Script(fs.readFileSync(path.join(root,f),'utf8'));}catch(e){findings.push({file:f,issue:e.message});}}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);if(new Set(urls).size!==urls.length)findings.push({file:'sitemap.xml',issue:'Duplicate sitemap URL'});if(urls.length!==files.length-utility.length)findings.push({file:'sitemap.xml',issue:'URL/page count mismatch'});
if(types.BlogPosting!==90)findings.push({file:'schema',issue:'Expected 90 articles; got '+types.BlogPosting});if(types.LearningResource!==20)findings.push({file:'schema',issue:'Expected 20 learning resources; got '+types.LearningResource});
const report={profile:production?'production-export':'private-review',checkedAt:new Date().toISOString(),pages:files.length,sitemapUrls:urls.length,references:refs,inlineScriptsParsed:scripts,schema:types,forms,missingFragments:fragments,findings};
fs.writeFileSync(path.join(__dirname,'qa-'+report.profile+'.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,missingFragments:fragments.slice(0,15)},null,2));if(fragments.length||findings.length)process.exitCode=1;
