// Portable, dependency-free launch checks. Browser and delivery checks are recorded separately.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'../source/site-kit');
const pages=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const findings=[],titles=new Map(),descriptions=new Map(),types={},forms=[];let references=0,scripts=0;
const val=(html,re)=>html.match(re)?.[1];
for(const file of pages){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 const fail=issue=>findings.push({file,issue});
 const title=val(html,/<title>([\s\S]*?)<\/title>/),description=val(html,/<meta name="description" content="([^"]*)"/);
 for(const [kind,value,seen] of [['title',title,titles],['description',description,descriptions]]){
  if(file==='404.html'&&kind==='description')continue;
  if(!value)fail('Missing '+kind);else if(seen.has(value))fail('Duplicate '+kind+' with '+seen.get(value));else seen.set(value,file);
 }
 if((html.match(/<h1\b/g)||[]).length!==1)fail('Expected one h1');
 if(file!=='404.html'&&!html.includes('rel="canonical" href="https://chaoticsunshine.com/'))fail('Missing production canonical');
 if(!['404.html','welcome.html'].includes(file)&&/<meta name="robots" content="[^"]*noindex/.test(html))fail('Public page noindex');
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
  if(match[1].includes('application/ld+json')){try{const graph=JSON.parse(match[2])['@graph'];for(const node of graph||[])types[node['@type']]=(types[node['@type']]||0)+1;}catch(e){fail('Invalid schema: '+e.message);}}
  else if(match[2].trim())try{new vm.Script(match[2]);scripts++;}catch(e){fail('Invalid inline script: '+e.message);}
 }
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);if(new Set(ids).size!==ids.length)fail('Duplicate HTML id');
 for(const match of html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)){
  const url=match[1];if(/^(https?:|mailto:|data:|tel:)/.test(url))continue;
  references++;const target=path.resolve(root,decodeURIComponent(url.replace(/^\//,'')));
  if(!fs.existsSync(target))fail('Missing local reference '+url);
 }
 for(const match of html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/g)){
  const f=match[0],action=val(f,/action="([^"]+)"/);forms.push({file,action,placement:val(f,/data-sunshine-mail="([^"]+)"/)});
  if(action!=='https://app.kit.com/forms/10182939/subscriptions')fail('Unexpected or missing signup destination');
  if(!/method="post"/.test(f)||!/<input[^>]*type="email"[^>]*required/.test(f))fail('Signup POST or required email missing');
  if(/<button[^>]*disabled/.test(f))fail('Disabled signup');
 }
 if(/(?:action|src|href)="[^"]*(?:KIT_FORM_ID_PENDING|kit-form\.invalid|file:\/\/)/.test(html))fail('Unresolved public placeholder');
 if(!html.includes('name="twitter:title" content="'+title+'"')&&file!=='404.html')fail('Social title differs from page title');
}
const css=fs.readFileSync(path.join(root,'assets/css/site.css'),'utf8');
for(const m of css.matchAll(/url\(["']?(\.\.\/[^)"']+)["']?\)/g)){references++;if(!fs.existsSync(path.resolve(root,'assets/css',m[1])))findings.push({file:'site.css',issue:'Missing asset '+m[1]});}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(new Set(urls).size,urls.length);
assert(!urls.some(u=>/\/(welcome|404)$/.test(u)));
assert(urls.includes('https://chaoticsunshine.com/creative-faith'));
assert.equal(urls.length,pages.length-2);
assert.equal(types.BlogPosting,90);assert.equal(types.LearningResource,20);
assert(!/X-Robots-Tag: noindex/.test(fs.readFileSync(path.join(root,'_headers'),'utf8').split('/guides/*')[0]));
const pdfs=fs.readdirSync(path.join(root,'guides')).filter(f=>f.endsWith('.pdf'));
for(const f of pdfs)assert.equal(fs.readFileSync(path.join(root,'guides',f)).subarray(0,5).toString(),'%PDF-');
const report={checkedAt:new Date().toISOString(),pages:pages.length,sitemapUrls:urls.length,references,inlineScriptsParsed:scripts,guidePdfs:pdfs.length,schemaTypes:types,signupForms:forms.length,forms,findings,limits:['Static checks do not prove Kit acceptance, confirmation delivery, unsubscribe, rendering, or indexing.','No live subscriber created. No production deployment performed.']};
fs.writeFileSync(path.join(__dirname,'launch-static-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,forms:undefined},null,2));if(findings.length)process.exitCode=1;
