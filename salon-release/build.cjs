// Reproducible Cloudflare build: keep the complete manuscript/library, apply the salon system.
const fs=require('fs'),path=require('path');
const source=path.resolve(__dirname,'../source');
require(path.join(source,'build-site-kit.cjs'));
const out=path.resolve(process.env.CS_BUILD_DIR||path.join(source,'site-kit'));
const review=process.env.CS_STAGING==='1'||Boolean(process.env.CF_PAGES_BRANCH&&process.env.CF_PAGES_BRANCH!=='main');
const meta=JSON.parse(fs.readFileSync(path.join(__dirname,'page-meta.json'),'utf8'));
const snapshots=path.join(__dirname,'prerendered');
const originals=new Map(fs.readdirSync(out).filter(f=>f.endsWith('.html')).map(f=>[f,fs.readFileSync(path.join(out,f),'utf8')]));
const extras=['daily-cabinet.html','make.html','try.html','share.html'];
const files=[...new Set([...originals.keys(),...extras])].sort();
let shell=fs.readFileSync(path.join(snapshots,'index.html'),'utf8').replace(/<dialog\b[\s\S]*?<\/dialog>/g,'');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function extraHead(slug){const d=meta[slug],canonical='https://chaoticsunshine.com/'+slug;
 const graph={'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':'https://chaoticsunshine.com/#organization',name:'Chaotic Sunshine',url:'https://chaoticsunshine.com/'},{'@type':'WebPage','@id':canonical+'#webpage',url:canonical,name:d.title,description:d.description,inLanguage:'en-US'}]};
 return `<title>${escape(d.title)}</title><meta name="description" content="${escape(d.description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(d.title)}"><meta property="og:description" content="${escape(d.description)}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(d.title)}"><meta name="twitter:description" content="${escape(d.description)}"><meta property="og:image" content="https://chaoticsunshine.com/assets/26-share-cards/index-collage.png"><script type="application/ld+json">${JSON.stringify(graph)}</script>`;
}
const libraryCode=fs.readFileSync(path.join(__dirname,'library-system.js'),'utf8');
const fullGuides=JSON.parse(fs.readFileSync(path.join(__dirname,'app.js'),'utf8').match(/const FULL_GUIDES=(.*);/)[1]);
const libraryMarkup=require('vm').runInNewContext(libraryCode+';pages.library();',{FULL_GUIDES:fullGuides,pages:{},safe:escape,art:(f,alt)=>'<img src="assets/'+escape(f)+'" alt="'+escape(alt)+'">',bind:()=>{}});
const mailFunction=fs.readFileSync(path.join(__dirname,'app.js'),'utf8').match(/pages\.mail=\(\)=>`([^\n]+)`;/)[1];
const mailMarkup=require('vm').runInNewContext('`'+mailFunction+'`',{art:(f,alt)=>'<img src="assets/'+escape(f)+'" alt="'+escape(alt)+'">',go:(r,t,c)=>'<a href="welcome.html" class="'+c+'">'+t+'</a>'});
const postalData=JSON.parse(fs.readFileSync(path.join(__dirname,'letters.json'),'utf8'));
const postalMarkup=require('vm').runInNewContext(fs.readFileSync(path.join(__dirname,'letter-system.js'),'utf8')+';pages.welcome();',{SUNSHINE_LETTERS:postalData,location:{search:''},URLSearchParams,pages:{},safe:escape,bind:()=>{}});
const styles='<link rel="stylesheet" href="studio.css"><link rel="stylesheet" href="salon.css"><link rel="stylesheet" href="letter-system.css"><link rel="stylesheet" href="library-system.css"><link rel="stylesheet" href="mobile-navigation.css"><link rel="stylesheet" href="side-quest-books.css"><link rel="stylesheet" href="side-quest-cards.css"><link rel="stylesheet" href="site-visual-fixes.css"><link rel="stylesheet" href="daily-cabinet-v2.css"><link rel="stylesheet" href="v4-mail-polish.css">';
const noscript='<noscript><style>.permanent-menu{display:block!important;position:static!important}.library-doors{display:none!important}.closed .library-inside>*{visibility:visible!important}.closed .library-inside{max-height:none!important;overflow:visible!important}button:not([type=submit]){display:none!important}</style></noscript>';
for(const file of files){const slug=file.replace(/\.html$/,''),original=originals.get(file)||'';
 let oldHead=original?original.match(/<head>([\s\S]*?)<\/head>/)[1]:extraHead(slug);
 oldHead=oldHead.replace(/<meta charset=[^>]*>|<meta name="viewport"[^>]*>|<meta name="robots"[^>]*>/g,'').replace(/<style>[\s\S]*?<\/style>/g,'');
 let body,scripts;
 const snapshot=path.join(snapshots,file);
 if(fs.existsSync(snapshot)){
  oldHead=oldHead.replace(/<link rel="stylesheet"[^>]*>/g,'');
  body=fs.readFileSync(snapshot,'utf8').replace(/<textarea([^>]*)>[\s\S]*?<\/textarea>/g,'<textarea$1></textarea>').replace(/(<input\b[^>]*?) value="[^"]*"/g,'$1').replace(/(<a\b[^>]*class="library-book"[^>]*?) tabindex="-1"/g,'$1 tabindex="0"').replace(/(<p[^>]*id="jar-status"[^>]*>)[\s\S]*?<\/p>/g,(_,open)=>open+'0 little good things in this browser’s jar.</p>').replace(/<span class="card-tab">TODAY[^<]*<\/span>/g,'<span class="card-tab">A VERSE TO CARRY</span>');
  scripts='<script defer src="app.js"></script>';
 }else{
  let content=original.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];if(content===undefined)throw Error('Missing main: '+file);
  if(slug==='privacy')content=content.replace('are not sent or saved automatically','are not sent to us. In the studio, writing, practice plans, and sketches are saved automatically in this browser tab so they survive page changes and refreshes. Download a copy to keep your work beyond this tab. Reading tools that offer a separate save control explain their behavior on the page');
  content=content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
  body=shell.replace(/<main\b[^>]*>[\s\S]*?<\/main>/,()=>`<main id="main" tabindex="-1"><div class="cs legacy-content">${content}</div></main>`).replace(/data-room="[^"]*"/,'data-room="reading"');
  const originalBody=original.match(/<body>([\s\S]*?)<\/body>/)[1];
  scripts=(originalBody.match(/<script\b[^>]*>[\s\S]*?<\/script>/g)||[]).join('')+'<script defer src="site-navigation.js"></script>';
 }
 if(slug==='freebies')body=shell.replace(/<main\b[^>]*>[\s\S]*?<\/main>/,()=>'<main id="main" tabindex="-1">'+libraryMarkup+'</main>').replace(/data-room="[^"]*"/,'data-room="library"');
 if(slug==='subscribe')body=shell.replace(/<main\b[^>]*>[\s\S]*?<\/main>/,()=>'<main id="main" tabindex="-1">'+mailMarkup+'</main>').replace(/data-room="[^"]*"/,'data-room="mail"');
 if(slug==='welcome')body=shell.replace(/<main\b[^>]*>[\s\S]*?<\/main>/,()=>'<main id="main" tabindex="-1">'+postalMarkup+'</main>').replace(/data-room="[^"]*"/,'data-room="welcome"');
 body=body.replace(/<div class="footer-letter">[\s\S]*?<\/div>/,'<div class="footer-letter"><span class="eyebrow">FAITH, CREATIVITY &amp; A LITTLE GOOD COMPANY</span><h2>Join Sunshine Mail</h2><p>Devotions, Bible lessons, creative prompts, and little adventures. Monthly and free.</p><a class="button" href="subscribe.html">Join Sunshine Mail →</a></div>');
 body=body.replace(/ data-client-ready="true"/g,'').replace('</body>',scripts+'</body>');
 const robots=review?'<meta name="robots" content="noindex,nofollow">':(['welcome','404'].includes(slug)?'<meta name="robots" content="noindex,follow">':'');
 fs.writeFileSync(path.join(out,file),'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+oldHead+robots+styles+noscript+'</head>'+body+'</html>');
}
for(const f of ['studio.css','salon.css','site-navigation.js','letter-system.css','library-system.css','mobile-navigation.css','side-quest-books.css','side-quest-cards.css','site-visual-fixes.css','daily-cabinet-v2.css','v4-mail-polish.css'])fs.copyFileSync(path.join(__dirname,f),path.join(out,f));
for(const f of fs.readdirSync(path.join(__dirname,'assets')))fs.copyFileSync(path.join(__dirname,'assets',f),path.join(out,'assets',f));
 // Preserve and publish existing original social-share cards; never generate substitutes in a release.
 const socialManifest=require('../source/assets/26-share-cards/manifest.json');
 let socialCopied=0;const missingSocial=[];
 for(const [key,entry] of Object.entries(socialManifest)){
   if(!entry.file)continue;
   const from=path.join(source,'assets',entry.file),to=path.join(out,'assets',entry.file);
   if(!fs.existsSync(from)){missingSocial.push(key);continue;}
   fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);socialCopied++;
 }
 fs.writeFileSync(path.join(out,'social-share-assets.json'),JSON.stringify({copied:socialCopied,missing:missingSocial},null,2));

const urls=files.filter(f=>!['welcome.html','404.html'].includes(f)).map(f=>'https://chaoticsunshine.com/'+(f==='index.html'?'':f.replace(/\.html$/,'')));
fs.writeFileSync(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>'<url><loc>'+u+'</loc></url>').join('\n')+'\n</urlset>');
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\n'+(review?'Disallow: /\n':'Allow: /\nSitemap: https://chaoticsunshine.com/sitemap.xml\n'));
fs.writeFileSync(path.join(out,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n'+(review?'  X-Robots-Tag: noindex, nofollow\n':'')+'/guides/*\n  X-Robots-Tag: noindex\n/assets/*\n  Cache-Control: public, max-age=604800\n');
console.log(JSON.stringify({profile:review?'staging':'production',pages:files.length,sitemapUrls:urls.length,output:out}));

const letterData=JSON.parse(fs.readFileSync(path.join(__dirname,'letters.json'),'utf8'));
const letterCode='const SUNSHINE_LETTERS='+JSON.stringify(letterData)+';\n'+fs.readFileSync(path.join(__dirname,'letter-system.js'),'utf8');
const questCards=require('../source/side-quest-field-cards.json');
const questCardCode='const CS_QUEST_FIELD_CARDS='+JSON.stringify(questCards)+';\n'+fs.readFileSync(path.join(__dirname,'side-quest-cards.js'),'utf8');

const cabinetDevotions=require('../source/devotions/devotions.json').map(p=>({
 id:p.slug,title:p.title,reading:p.reading,takeaway:p.takeaway,question:p.question,status:p.status
}));
const cabinetPassages=require('../source/cabinet-extra-passages.json');
const cabinetSparks=require('../source/cabinet-original-sparks.json');
if(cabinetDevotions.length<90||cabinetPassages.length<10||cabinetSparks.length<10)throw Error('Cabinet content inventory incomplete');
const cabinetCode='const CS_CABINET_DEVOTIONS='+JSON.stringify(cabinetDevotions)+';\n'
  +'const CS_CABINET_EXTRA_PASSAGES='+JSON.stringify(cabinetPassages)+';\n'
  +'const CS_CABINET_ORIGINAL_SPARKS='+JSON.stringify(cabinetSparks)+';\n'
  +fs.readFileSync(path.join(__dirname,'daily-cabinet-v2.js'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
if(!app.includes('\nrender();\n'))throw Error('Missing final render hook');
fs.writeFileSync(path.join(out,'app.js'),app.replace('\nrender();\n','\n'+libraryCode+'\n'+letterCode+'\n'+questCardCode+'\n'+cabinetCode+'\n'+fs.readFileSync(path.join(__dirname,'v4-mail-polish.js'),'utf8')+'\nrender();\n'));

const phoneCode=fs.readFileSync(path.join(__dirname,'mobile-navigation.js'),'utf8');
fs.appendFileSync(path.join(out,'app.js'),'\n'+phoneCode);fs.appendFileSync(path.join(out,'site-navigation.js'),'\n'+phoneCode);

require("./release-finish.cjs")(out,review);
