const fs=require('fs'), path=require('path');

const base=__dirname, assets=path.join(base,'assets');

const cfg=JSON.parse(fs.readFileSync(path.join(base,'settings.json'),'utf8'));

const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');

const catalog=require('./content-library/catalog.cjs');catalog.sync();
const guides=catalog.guides;

let css=`.cs{--green:#0B5D4A;--deep:#073D31;--cream:#FBF5EA;--gold:#E0A526;--ink:#1B1726;color:var(--ink);background:var(--cream);font:18px/1.65 Jost,Arial,sans-serif}.cs *{box-sizing:border-box}.cs a{color:inherit}.cs a:focus-visible,.cs summary:focus-visible{outline:3px solid currentColor;outline-offset:6px}.cs .wrap{max-width:1200px;margin:auto;padding:0 6%}.cs nav{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;padding:24px 0}.cs header img,.cs footer img,.cs .logo{width:225px;max-width:70vw;height:auto}.cs .links{display:flex;gap:22px;flex-wrap:wrap;align-items:center;font-size:15px;font-weight:700}.cs .links a{text-decoration:none}.cs section{padding:88px 0}.cs .dark{background:var(--green);color:var(--cream)}.cs .deep{background:var(--deep);color:var(--cream)}.cs .gold{background:var(--gold)}.cs h1,.cs h2,.cs h3{font-family:'Playfair Display',Georgia,serif;line-height:1.08;letter-spacing:-.035em;margin:0 0 24px}.cs h1{font-size:clamp(42px,5.2vw,66px)}.cs h2{font-size:clamp(32px,4vw,44px)}.cs h3{font-size:27px}.cs p{margin:0 0 24px;max-width:700px}.cs .eyebrow{text-transform:uppercase;font-size:12px;letter-spacing:.18em;font-weight:800;margin-bottom:20px}.cs .dark .eyebrow,.cs .deep .eyebrow{color:var(--gold)}.cs .split{display:grid;grid-template-columns:1.1fr 1fr;gap:56px;align-items:center}.cs img{display:block;max-width:100%;height:auto}.cs .button{display:inline-block;background:var(--green);color:var(--cream);border-radius:999px;padding:15px 27px;text-decoration:none;font-size:16px;font-weight:700}.cs .dark .button,.cs .deep .button{background:var(--gold);color:var(--ink)}.cs .gold .button{background:var(--ink);color:var(--cream)}.cs small{display:block;font-size:13px;margin-top:16px}.cs .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}.cs .card{border:1px solid #0b5d4a30;padding:24px;border-radius:14px}.cs .card img{margin-bottom:26px;border-radius:8px;aspect-ratio:1/1;object-fit:contain;width:100%;background:#FBF5EA}.cs .card p{font-size:16px}.cs .number{font:40px Georgia,serif;color:#8A5A00}.cs .ribbon{padding:18px 6%;background:var(--ink);color:var(--gold);text-align:center;font-size:12px;letter-spacing:.14em}.cs .banner{width:100%;max-height:420px;object-fit:contain;background:var(--cream)}.cs footer{background:var(--ink);color:var(--cream);padding:56px 0}.cs footer p{font-size:15px;margin-top:20px}.cs details{padding:20px 0;border-bottom:1px solid #0b5d4a30}.cs summary{cursor:pointer;font-weight:bold}.cs .notice{border:2px dashed #8A5A00;padding:22px;background:#fff6d8;color:var(--ink);font-size:15px}.cs .skip{position:absolute;left:-9999px}.cs .skip:focus{position:static}.cs .pill{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.cs .bio-links{display:grid;gap:16px;max-width:580px}.cs .bio-links a{text-align:center}@media(max-width:760px){.cs section{padding:56px 0}.cs .split,.cs .grid{grid-template-columns:1fr}.cs .split{gap:32px}.cs nav{gap:20px}.cs .links{gap:16px}.cs .card{padding:22px}}`;

const webImages=require('./web-image-manifest.json');

let mode='preview', issues=new Set();

function image(rel,alt){if(!fs.existsSync(path.join(assets,rel)))throw Error('Missing asset '+rel);const m=webImages[rel];const web=m?.file||rel;let url=mode==='preview'?'../assets/'+web:(cfg.assets[web]||cfg.assets[rel]);if(!url){url='REPLACE_ASSET_URL/'+web;issues.add('Asset URL: '+web)}const prominent=(rel.includes('logo-')||rel.includes('23-brand-wordmark'))||rel.includes('soul-snacks-journal')||rel.includes('fully-family-cover') || rel.includes('20-author-illustration');return `<img src="${esc(url)}" alt="${esc(alt)}" ${m?`width="${m.width}" height="${m.height}"`:''} loading="${prominent?'eager':'lazy'}" decoding="async">`;}

function href(slug){return mode==='preview'?`${slug==='/'?'index':slug.replace(/^\//,'')}.html`:slug;}

function link(slug,label){return `<a class="button" href="${href(slug)}">${esc(label)}</a>`}

function signup(key,label){const url=cfg.links[key];if(url && !/^https:\/\//.test(url))throw Error('Use an HTTPS URL for '+key);if(url)return `<a class="button" href="${esc(url)}">${esc(label)}</a>`;issues.add('Signup/product URL: '+key);return `<p class="availability">The live signup is being prepared. In the meantime, <a href="${href('/soul-snacks')}">read a devotion</a> or <a href="${href('/freebies')}">explore the free library</a>.</p>`;}

function sec(content,cls=''){return `<section class="${cls}"><div class="wrap">${content}</div></section>`}

function intro(title,desc,banner){return (banner?image(banner,''):'')+sec(`<h1>${esc(title)}</h1><p>${esc(desc)}</p>`,'dark')}

function close(){return sec(`<h2>Pull up a chair on one Sunday each month.</h2><p>One verse, one true story and one brave question.</p>${signup('newsletter','Pull up my chair')}<small>Free, monthly, written by Amy Grace (and supervised by two doodles).</small>`,'gold')}

const newCoverSlugs=new Set(['fully-family','before-the-first-mountain','the-daughter-who-stayed','beloved-first','heir-not-hired']);

function guideArt(g){return newCoverSlugs.has(g[0])?'09-new-covers/'+g[0]+(g[0]==='before-the-first-mountain'?'-cover-v3.png':'-cover-v4.png'):`01-guide-product-cards/${g[4]}-product-1200.png`;}

function card(g){return `<article class="card">${image(guideArt(g),g[1])}<h3>${g[1]}</h3><p>${g[2]}</p>${link('/'+g[0],'Take a look')}</article>`}

function page(slug,title,body){
  const chrome=require('./site-chrome.cjs');
  const main=seo.breadcrumbs(slug,title,href)+body+require('./feedback.cjs').render({cfg,page:slug});
  return `<style>${css}${require('./palette-balance.cjs').texture(mode)}${chrome.css}</style>`+chrome.render({href,image,cfg,slug,mode,main});
}

function originalBodies(){let p={};

p.index=['Chaotic Sunshine | Faith for the Beautifully Messy Days',sec(`<div class="split"><div><p class="eyebrow">Dogs · Sunshine · Honest talks with God</p><h1>Faith for the beautifully messy days.</h1><p>Chaotic sunshine is the joy that shows up in real life, mess and all, because God does. One Sunday a month: one verse, one true story and one brave question.</p>${signup('newsletter','Send me Sunday’s')}<small>Free, monthly, written by Amy Grace (and supervised by two doodles).</small></div>${image('03-home/home-hero-beloved-really.png','Chaotic Sunshine: faith for the beautifully messy days')}</div>`,'dark')+`<div class="ribbon">REAL FAITH · REAL FRIENDS · ZERO PERFORMANCE</div>`+sec(`<p class="eyebrow">Is this you?</p><h2>Pull up a chair.</h2><div class="grid">${['You love God and want more than going through the motions.','You talk to Him best on a walk, in the car or on the couch.','You’d rather have one deep friend than forty polite ones.','Your days are a little messy, and you’d like to find Him in them.'].map((t,i)=>`<div><span class="number">0${i+1}</span><p>${t}</p></div>`).join('')}</div>`)+sec(`<p class="eyebrow">Where it started</p><h2>Same trail, new route.</h2><p>Chaotic Sunshine is inspired by my two doodles, Tucker and Addie, and the better paths they keep finding on our walks. Tucker keeps every rule. Addie has none. Most days I’m somewhere in between, learning to walk closer with God.</p>${link('/about','Meet Tucker and Addie')}`,'deep')+sec(`<h2>Free on the shelf.</h2><p>Take one. Take them all. Nobody’s counting.</p>${link('/freebies','Explore the free guides')}`,'dark')+sec(`<div class="split"><div><p class="eyebrow">The books · Coming soon</p><h2>Three books. One honest path.</h2><p>Who God says you are, trusting Him in the rain and living it out loud. Ninety days each, written for real life.</p>${link('/books','Join the launch list')}</div>${image('03-home/home-books-trio.png','Three Chaotic Sunshine books, coming soon')}</div>`)+close()];

p.freebies=['Free on the shelf',intro('Free on the shelf.','Take one. Take them all. Nobody’s counting.','05-pages/freebies-shelf-hero-v3.png')+sec(`<div class="grid">${guides.map(card).join('')}<article class="card">${image('06-freebies/freebie-color-me-fierce.png','Color Me Fierce coloring pack')}<h3>Color Me Fierce</h3><p>Four verse pages to color while you pray. Print at home.</p>${signup('color-me-fierce','Get it free')}</article></div>`)+close()];

p['soul-snacks']=['Soul snacks',intro('Soul snacks.','One Sunday a month: one verse, one true story and one brave question. No fluff.','04-page-banners/banner-soul-snacks.png')+sec(signup('archive','Read the latest soul snacks')+'<p>The live archive is maintained by beehiiv. Connect its published URL in settings.json, or use a native Posts block on a visual builder page.</p>')+close()];

p.about=['About Chaotic Sunshine',intro('Hi, I’m Amy Grace.','Dogs, sunshine and honest talks with God.','04-page-banners/banner-about.png')+sec(`<h2>Same trail, new route.</h2><p>Chaotic Sunshine is inspired by my two doodles, Tucker and Addie, and the better paths they keep finding on our walks. Same trail, new route, and fewer lessons we have to learn twice.</p><p>Tucker keeps every rule. Addie has none. Most days I’m somewhere in between, learning to walk closer with God.</p>`)+sec(`<p class="eyebrow">chaotic sunshine (n.)</p><h2>The joy that shows up in real life, mess and all, because God does.</h2>`,'deep')+sec('<h2>Loved by the Father. Led by the Shepherd.</h2>')+close()];

p.start=['Start here',intro('A table with room for you.','Find your next step.','04-page-banners/banner-start.png')+sec(`<div class="bio-links">${link('/seconds-please','Free Thanksgiving table guide')}${signup('newsletter','Get Sunday’s soul snack')}${link('/freebies','Free guides and lesson packs')}${link('/soul-snacks','Latest soul snack')}</div>`)];

for(const g of guides)p[g[0]]=[g[1],(newCoverSlugs.has(g[0])?sec(`<div class="split"><div><p class="eyebrow">Free faith guide</p><h1>${g[1]}</h1><p>${g[2]}</p></div>${image(guideArt(g),g[1]+' illustrated cover')}</div>`,'dark'):intro(g[1],g[2],`02-guide-landing-banners/${g[4]}-banner-1600x640.png`))+sec(`<h2>${g[0]==='advent'?'Be first to hear.':'Make room for an honest moment.'}</h2>${signup(g[0],g[3])}`)+sec(`<h2>More on the shelf.</h2>${link('/freebies','See all freebies')}`,'dark')+close()];delete p['table-talks'];return p;}

function bodies(){const p=originalBodies();const j=require('./journal-redesign.cjs')({sec,image,link,href,signup,guides,card,guideArt,mode,cfg});Object.assign(p,j.pages);Object.assign(p,require('./devotional-blog.cjs')({sec,image,link,href,mode,cfg}).pages);Object.assign(p,require('./priority-pages.cjs')({sec,image,link,href,mode,cfg,guides,guideArt}).pages);Object.assign(p,require('./teaching-share-pages.cjs')({sec,href,mode,cfg}));delete p.books;return p;}

css+=require('./journal-redesign.cjs')({sec,image,link,href,signup,guides,card,guideArt,mode,cfg}).css;

css+=require('./devotional-blog.cjs')({sec,image,link,href,mode,cfg}).css;

css+=require('./priority-pages.cjs')({sec,image,link,href,mode,cfg,guides,guideArt}).css;

css+=require('./google-measurement.cjs').css;
css+=require('./delight.cjs').css;
css+=require('./feedback.cjs').css;css+=`.cs .brand-lockup{max-width:100%}.cs .header-monthly-letter{font:700 13px/1.5 Jost,Arial,sans-serif;color:#1F3A8A;display:inline-flex;align-items:center;min-height:36px;padding:6px 0;text-underline-offset:4px}.cs .brand-home{display:block;text-decoration:none;max-width:100%}.cs .brand-purpose{display:block;font:22px/1.1 'Nanum Pen Script',cursive;color:#5B3A8C;margin-top:7px;max-width:330px}.cs header .brand-home img{width:330px;max-width:78vw}.cs nav{row-gap:20px}.cs footer img{background:#FFFCF6;padding:12px;width:330px;border-radius:4px}@media(max-width:760px){.cs .brand-purpose{font-size:21px;max-width:290px}.cs header .brand-home img{width:290px}}`;
const fonts=require('./font-manifest.json');

css+=require('./palette-balance.cjs').css;
css+=fonts.map(f=>`@font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weight};font-display:swap;src:url(data:font/ttf;base64,${fs.readFileSync(path.join(assets,f.file)).toString('base64')}) format('truetype')}`).join('')+`.cs{font-family:Jost,Arial,sans-serif}.cs h1,.cs h2,.cs h3{font-family:Fraunces,Georgia,serif}.cs .hand{font-family:'Nanum Pen Script',cursive;font-style:normal;font-size:29px}`;

const seo=require('./seo-metadata.cjs'),metadata=[];

fs.mkdirSync(path.join(base,'preview'),{recursive:true});fs.mkdirSync(path.join(base,'beehiiv-html'),{recursive:true});

// Keep explicitly retired pages out of rebuilt preview and publishing folders.

for(const folder of ['preview','beehiiv-html'])fs.rmSync(path.join(base,folder,'editorial.html'),{force:true});

let count=0;for(mode of ['preview','beehiiv'])for(const [slug,[title,body]] of Object.entries(bodies())){if(mode==='preview')metadata.push(seo.data(slug,title,body));let html=page(slug,title,body);html+=require('./feedback.cjs').script();html+=require('./delight.cjs').script(body);html+=require('./google-measurement.cjs').script(cfg,mode);if(body.includes('data-home-chapters'))html+=require('./home-journey.cjs').script();if(html.includes('data-sunshine-mail'))html+=require('./kit-newsletter.cjs').script();if(body.includes('data-reader-tools')||body.includes('data-saved-readings')||body.includes('data-reading-resume'))html+=require('./reader-tools.cjs').script({href});if(body.includes('data-start-picker'))html+=require('./start-deck.cjs').script();if(body.includes('data-little-library'))html+=require('./free-library.cjs').script({indexUrl:mode==='preview'?'../assets/21-library-search/guide-search.js':(cfg.assets['21-library-search/guide-search.js']||'REPLACE_ASSET_URL/21-library-search/guide-search.js')});if(body.includes('data-journal-reader'))html+=require('./journal-reader.cjs').script();if(body.includes('data-random-devotion'))html+=require('./random-devotion.cjs').script({href,current:slug,mode,cfg});if(mode==='preview'&&/^soul-snack-\d+$/.test(slug))html+=require('./discussion.cjs').script();if(mode==='preview')html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><link rel="icon" type="image/png" sizes="32x32" href="../assets/25-brand-icons/favicon-teal-v2-32.png"><link rel="icon" href="../assets/25-brand-icons/favicon-teal-v2.ico" sizes="any"><link rel="apple-touch-icon" sizes="180x180" href="../assets/25-brand-icons/favicon-teal-v2-180.png">${seo.head(seo.data(slug,title,body))}${require('./social-cards.cjs').head(slug,cfg.siteKit.publicBaseUrl)}<style>body{margin:0}</style></head><body>${html}</body></html>`;if(Buffer.byteLength(html)>512000)throw Error('Beehiiv page too large');fs.writeFileSync(path.join(base,mode==='preview'?'preview':'beehiiv-html',slug+'.html'),html);count++;}

fs.writeFileSync(path.join(base,'metadata-plan.json'),JSON.stringify(metadata,null,2));

const files=[];function walk(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){let p=path.join(d,f.name);if(f.isDirectory())walk(p);else files.push(path.relative(assets,p).split(path.sep).join('/'));}}walk(assets);

fs.writeFileSync(path.join(base,'asset-upload-map.csv'),'local_file,hosted_url\n'+files.map(f=>`"${f}","${cfg.assets[f]||''}"`).join('\n'));

fs.writeFileSync(path.join(base,'SETUP-REMAINING.txt'),[...issues].sort().join('\n')+'\n');

fs.writeFileSync(path.join(base,'validation.json'),JSON.stringify({pagesPerFormat:count/2,assetFiles:files.length,missingLocalAssets:0,allPagesBelow512KB:true,unresolvedConnections:[...issues].length,liveSignupTested:false},null,2));

console.log(`Built ${count/2} pages in each format; ${files.length} assets; ${issues.size} beehiiv compatibility connections remain; Cloudflare assets are included locally.`);
