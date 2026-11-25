// Shared, server-rendered recovery and wayfinding. Re-run on every production/staging build.
const fs=require('fs'),path=require('path');
module.exports=function(out,review){
 const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 const read=f=>fs.readFileSync(path.join(out,f),'utf8');
 const pages=fs.readdirSync(out).filter(f=>f.endsWith('.html')&&f!=='phone.html');
 const meta={};for(const f of pages){const s=read(f);meta[f]={title:s.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()||f};}
 const guides=require('../source/content-library/products.json').map(x=>x.slug+'.html');
 const teachings=require('../source/teaching-illustrations.json').items.map(x=>'teaching-'+x.slug+'.html');
 const readings=Array.from({length:90},(_,i)=>'soul-snack-'+String(i+1).padStart(2,'0')+'.html');
 const shareCards=require('../source/assets/26-share-cards/manifest.json');
 const flow=['soul-snack-01.html','make.html','try.html','share.html'];
 const rooms=['index.html','soul-snacks.html','freebies.html','teaching-shelf.html','daily-cabinet.html','make.html','side-quests.html','subscribe.html','about.html'];
 const routes={};
 const posts=require('../source/devotions/devotions.json');
 const finder=`<section class="section reading-finder"><div class="wrap"><details><summary>Find a devotion by title, Bible passage, or topic ↓</summary><label for="reading-search">What are you looking for?</label><input type="search" id="reading-search" placeholder="Try Romans, prayer, belonging…" aria-describedby="reading-search-status"><p id="reading-search-status" role="status">90 readings to explore.</p><ol class="directory-readings">${posts.map(p=>`<li data-reading-search="${esc([p.title,p.reading,p.readerTopic,p.movementName,p.takeaway].join(' ').toLowerCase())}"><a href="/${p.slug}.html">${esc(p.title)}</a><small> · ${esc(p.reading)}</small></li>`).join('')}</ol><p id="reading-search-empty" hidden>No readings match yet. Try a Bible book, a different word, or clear your search.</p></details></div></section>`;
 for(const f of pages){let group=rooms,parent='index.html',label='Studio home';
  if(readings.includes(f)){group=readings;parent='soul-snacks.html';label='All 90 readings';}
  else if(guides.includes(f)){group=guides;parent='freebies.html';label='Back to the library';}
  else if(teachings.includes(f)){group=teachings;parent='teaching-shelf.html';label='Back to the teaching shelf';}
  else if(flow.includes(f)){group=flow;parent='soul-snacks.html';label='Read · Make · Try · Share';}
  const i=group.indexOf(f);routes[f]={parent,label,previous:i>0?group[i-1]:null,next:i>=0&&i<group.length-1?group[i+1]:null};
 }
 function nav(f){const d=routes[f],a=(url,text)=>`<a href="/${url}">${text}</a>`;return `<nav class="journey-navigation wrap" aria-label="Page and section navigation"><div class="journey-history"><a href="/${d.parent}" data-previous-visit>← Back to ${d.parent==='index.html'?'home':'section'}</a>${d.parent!=='index.html'?a(d.parent,esc(d.label)):''}${a('index.html','Studio home')}${a('site-map.html','All pages / menu')}</div>${d.previous||d.next?`<div class="journey-sequence">${d.previous?a(d.previous,'← Previous: '+esc(meta[d.previous].title)):''}${d.next?a(d.next,'Next: '+esc(meta[d.next].title)+' →'):a(d.parent,'Choose another from this section →')}</div>`:''}</nav>`;}
 const template=read('404.html');
 function recovery(file,title,code,copy){let s=template.replace(/<title>[\s\S]*?<\/title>/,`<title>${title} | Chaotic Sunshine</title>`).replace(/<main\b[^>]*>[\s\S]*?<\/main>/,`<main id="main" tabindex="-1"><section class="recovery-scene"><div class="wrap recovery-paper"><span class="eyebrow">CHAOTIC SUNSHINE · ${code}</span><span class="recovery-sun" aria-hidden="true">☀</span><h1>${title}</h1><p>${copy}</p><p class="hand">A little detour. Still plenty of sunshine.</p><div class="actions"><a class="button" href="/index.html">Please return to home →</a><a class="button secondary" href="/freebies.html">Open the little library</a></div><p><a href="/index.html" data-previous-visit>← Back to familiar ground</a> · <a href="/site-map.html">Find every studio room</a></p>${file==='offline.html'?'<button type="button" class="button secondary" data-retry-page>Try this page again ↻</button><p class="quiet">If your connection is completely offline, your browser may show its own connection screen. This page does not promise offline access.</p>':''}</div></section></main>`);
 s=s.replace(/<link rel="canonical"[^>]*>/g,'').replace(/<meta name="robots"[^>]*>/g,'').replace('</head>',`<meta name="robots" content="noindex,follow"><meta name="description" content="${esc(title)} Find your way back to Chaotic Sunshine devotions, creative practice, and the little free library."></head>`);
 fs.writeFileSync(path.join(out,file),s);routes[file]={parent:'index.html',label:'Back to the studio',previous:null,next:null};
 }
 recovery('404.html','Well, this page got lost.','404 · PAGE NOT FOUND','Possibly distracted by a very good book. This address does not lead to a page, but your chair is still waiting.');
 recovery('offline.html','The sunshine is taking a small breather.','CONNECTION HELP','A connection hiccup can interrupt a good moment. Check your internet connection, then try the page again. Your open-tab drafts may still be here; download them when you can.');
 recovery('something-went-wobbly.html','Something went a little wobbly.','A LITTLE HELP','The page could not finish what you asked. Try once more, or head back to a familiar room. If you were joining Sunshine Mail, check your inbox before submitting again.');
 const list=rooms.concat(['creative-faith.html','scripture-index.html','try.html','share.html','welcome.html','privacy.html','resource-permissions.html','community-guidelines.html',...pages.filter(f=>f.startsWith('for-')||['prayer-trust.html','sunshine-mail-sample.html','taking-thoughts-captive.html'].includes(f))]);
 let map=template.replace(/<title>[\s\S]*?<\/title>/,'<title>Find Your Way Around the Studio | Chaotic Sunshine</title>').replace(/<main\b[^>]*>[\s\S]*?<\/main>/,`<main id="main" tabindex="-1"><section class="section"><div class="wrap"><span class="eyebrow">THE STUDIO DIRECTORY</span><h1>Every good door, right here.</h1><p>No secret handshake. Choose a room, find a reading, or return to your creative moment.</p><div class="directory-grid">${list.map(f=>`<a href="/${f}">${esc(meta[f]?.title||f)}</a>`).join('')}</div><h2>All 90 devotions</h2><ol class="directory-readings">${readings.map(f=>`<li><a href="/${f}">${esc(meta[f].title)}</a></li>`).join('')}</ol><h2>The free library</h2><ul>${guides.map(f=>`<li><a href="/${f}">${esc(meta[f].title)}</a></li>`).join('')}</ul><h2>The teaching shelf</h2><ul>${teachings.map(f=>`<li><a href="/${f}">${esc(meta[f].title)}</a></li>`).join('')}</ul></div></section></main>`);
 map=map.replace(/<meta name="robots"[^>]*>/g,'');fs.writeFileSync(path.join(out,'site-map.html'),map);routes['site-map.html']={parent:'index.html',label:'Studio home',previous:null,next:null};
 const all=Object.keys(routes),utility=['404.html','welcome.html','offline.html','something-went-wobbly.html'];
 const discovery=`<section class="section discovery-note"><div class="wrap"><span class="eyebrow">CHRISTIAN CREATIVITY · SCRIPTURE FOR REAL LIFE</span><h2>Deep roots. Wild curiosity.</h2><p>Explore Christian devotions, Bible journaling, free Bible study guides, and small adventures in faith. Read a passage in context, make an honest response, try it in your day, and share when you want to.</p><a href="/creative-faith.html">A practical introduction to Christian creativity →</a> · <a href="/scripture-index.html">Find a passage in the Scripture index</a></div></section>`;
 for(const f of all){let s=read(f);s=s.replace('<body','<body data-section="'+routes[f].parent+'"');s=s.replace(/<meta name="robots"[^>]*>/g,'');if(review||utility.includes(f))s=s.replace('</head>',`<meta name="robots" content="${review?'noindex,nofollow':'noindex,follow'}"></head>`);
  if(f==='site-map.html'){s=s.replace('</head>','<meta name="description" content="Browse all Chaotic Sunshine devotions, free Bible study guides, creative practice rooms, and Sunshine Mail."><link rel="canonical" href="https://chaoticsunshine.com/site-map"></head>');}
  // Root-relative URLs and a base make recovery work even at /deeply/missing/page.
  if(utility.includes(f))s=s.replace(/(href|src)="(?![a-z]+:|\/|#)([^"]+)"/g,'$1="/$2"');
  if(f==='soul-snacks.html')s=s.replace('</main>',finder+'</main>');
  if(f==='index.html')s=s.replace('</main>',discovery+'</main>');
  if(!utility.includes(f)){const canonical='https://chaoticsunshine.com/'+(f==='index.html'?'':f.replace(/\.html$/,''));const title=s.match(/<title>([\s\S]*?)<\/title>/)?.[1],description=s.match(/<meta name="description" content="([^"]*)"/)?.[1];let count=0;s=s.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_,raw)=>{const g=JSON.parse(raw),graph=g['@graph']||[];for(const page of graph){if(['WebPage','CollectionPage','AboutPage'].includes(page['@type'])){page.name=title;page.description=description;page.url=canonical;}}count++;return '<script type="application/ld+json">'+JSON.stringify(g).replaceAll('<','\\u003c')+'</script>';});if(!count)s=s.replace('</head>','<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'WebPage','@id':canonical+'#webpage',name:title,description,url:canonical,inLanguage:'en-US'},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://chaoticsunshine.com/'},{'@type':'ListItem',position:2,name:title,item:canonical}]}]})+'</script></head>');}
  // Original per-resource share cards: URLs are absolute and only emitted if the actual file ships.
  const key=f.replace(/\.html$/,'');
  const social=shareCards[key];
  if(social&&social.file&&fs.existsSync(path.join(out,'assets',social.file))){
    const socialUrl='https://chaoticsunshine.com/assets/'+social.file;
    s=s.replace(/<meta property="og:image"[^>]*>/g,'').replace(/<meta name="twitter:image"[^>]*>/g,'');
    s=s.replace('</head>','<meta property="og:image" content="'+esc(socialUrl)+'"><meta name="twitter:image" content="'+esc(socialUrl)+'"><meta property="og:image:width" content="'+(Number(social.width)||1200)+'"><meta property="og:image:height" content="'+(Number(social.height)||630)+'"></head>');
  }
  s=s.replace('</footer>','<p class="studio-help"><a href="/something-went-wobbly.html">Something not working? A little help →</a></p></footer>');
  s=s.replace('</head>','<link rel="stylesheet" href="/release-navigation.css"></head>').replace('</main>','</main>'+nav(f)).replace('</body>','<script defer src="/release-navigation.js"></script></body>');
  fs.writeFileSync(path.join(out,f),s);
 }
 const appFile=path.join(out,'app.js');fs.writeFileSync(appFile,"const CS_SERVER_JOURNEY=document.querySelector('.journey-navigation')?.outerHTML||'';\n"+read('app.js')+"\nif(CS_SERVER_JOURNEY&&!document.querySelector('.journey-navigation'))document.querySelector('main').insertAdjacentHTML('afterend',CS_SERVER_JOURNEY);\n");
 fs.writeFileSync(path.join(out,'navigation-map.json'),JSON.stringify(routes));
 for(const f of ['release-navigation.js','release-navigation.css'])fs.copyFileSync(path.join(__dirname,f),path.join(out,f));
 fs.writeFileSync(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+all.filter(f=>!utility.includes(f)).sort().map(f=>'<url><loc>https://chaoticsunshine.com/'+(f==='index.html'?'':f.replace(/\.html$/,''))+'</loc></url>').join('\n')+'\n</urlset>');
 if(review)fs.copyFileSync(path.join(__dirname,'phone-preview.html'),path.join(out,'phone.html'));
 fs.writeFileSync(path.join(out,'release-wayfinding.json'),JSON.stringify({routes,utility,discovery},null,2));
};
