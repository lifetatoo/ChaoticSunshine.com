// Builds the static-hosting edition of the Chaotic Sunshine site into ./site-kit/.

// Guide downloads become Kit (kit.com) signup forms. Form IDs live in settings.json:

//   kitForms: { guide-slug: formId }, kitNewsletterFormId: formId

// Does not touch preview/ or beehiiv-html/. Run: node build-site-kit.cjs

// Then run: node check-site-kit.cjs (fails while any Kit form ID is still KIT_FORM_ID_PENDING).

const fs = require('fs'), path = require('path');

const base = __dirname, assets = path.join(base, 'assets'), out = process.env.CS_BUILD_DIR ? path.resolve(process.env.CS_BUILD_DIR) : path.join(base, 'site-kit');
if(path.basename(out)!=='site-kit'||out===path.parse(out).root||out===base)throw Error('Build output must be an explicitly named site-kit directory');

const cfg = JSON.parse(fs.readFileSync(path.join(base, 'settings.json'), 'utf8'));

const kit = cfg.siteKit || {};

const ROOT = (kit.publicBaseUrl || 'https://chaoticsunshine.com').replace(/\/$/, '');

const START_ROUTE = kit.startRoute || '/start';

const PENDING = 'KIT_FORM_ID_PENDING';

const kitForms = cfg.kitForms || {};

const ungated = new Set(kit.ungatedGuides || ['advent']);

const catalog=require('./content-library/catalog.cjs');catalog.sync();
const resources = require('./guide-resources.json');

const webImages = require('./web-image-manifest.json');

const fonts = require('./font-manifest.json');

const seo = require('./seo-metadata.cjs');
const chrome = require('./site-chrome.cjs');
const sunshineMail = require('./sunshine-mail.cjs');
const refresh = require('./editorial-refresh.cjs');

const randomDevotion = require('./random-devotion.cjs');



// Reuse the exact guide list and base stylesheet from build.cjs so the design system stays in sync.

const buildSrc = fs.readFileSync(path.join(base, 'build.cjs'), 'utf8');

const guides = catalog.guides;

let css = eval(buildSrc.match(/let css=(`[^`]*`);/)[1]);



const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const mode = 'site';

let prefix = '';            // '' for root pages; '/' for the 404 page (served at any depth)

const usedAssets = new Set();
const sourceImageAssets = new Set();

const MARK = 'https://kit-form.invalid/';



function image(rel, alt) {
  sourceImageAssets.add(rel);

  if (!fs.existsSync(path.join(assets, rel))) throw Error('Missing asset ' + rel);

  const m = webImages[rel], web = m?.file || rel; usedAssets.add(web);

  const prominent = (rel.includes('logo-')||rel.includes('23-brand-wordmark')) || rel.includes('soul-snacks-journal') || rel.includes('fully-family-cover') || rel.includes('20-author-illustration');

  return `<img src="${esc(prefix + 'assets/' + web)}" alt="${esc(alt)}" ${m ? `width="${m.width}" height="${m.height}"` : ''} loading="${prominent ? 'eager' : 'lazy'}" decoding="async">`;

}

function href(slug) { const canonical=slug==='/praying-as-family'?'/pray-when-you-feel-unworthy':slug; const s = canonical === '/' ? 'index' : canonical.replace(/^\//, ''); return prefix + s + '.html'; }

function link(slug, label) { return `<a class="button" href="${href(slug)}">${esc(label)}</a>`; }

function sec(content, cls = '') { return `<section class="${cls}"><div class="wrap">${content}</div></section>`; }



// ---------- Kit form component ----------

let formCount = 0;

function kitForm({ id, key, button, note, title }) {

  const n = ++formCount, pid = `kit-${key}-${n}`, connected=/^\d+$/.test(String(id));

  return `<form class="kit-form" action="https://app.kit.com/forms/${esc(id)}/subscriptions" method="post" data-kit-form="${esc(key)}"${title ? ` aria-label="${esc(title)}"` : ''}>` +

    `<div class="kit-fields"><div class="kit-field"><label for="${pid}-name">First name <span>(optional)</span></label><input id="${pid}-name" type="text" name="fields[first_name]" autocomplete="given-name" maxlength="60"></div>` +

    `<div class="kit-field"><label for="${pid}-email">Email address</label><input id="${pid}-email" type="email" name="email_address" autocomplete="email" inputmode="email" required></div></div>` +

    `<div class="kit-hp" aria-hidden="true"><label for="${pid}-website">Leave this field empty</label><input id="${pid}-website" type="text" name="cs_website" tabindex="-1" autocomplete="off" data-kit-hp></div>` +

    `<button class="button" type="submit"${connected?'':' disabled'}>${esc(button)}</button>` +

    `<small>${esc(note)}</small><p class="kit-status" role="status" aria-live="polite">${connected?'':'Signup opens soon.'}</p></form>`;

}

const guideTitle = slug => (guides.find(g => g[0] === slug) || [, slug])[1];

function guideForm(slug) {
  if (cfg.guideDeliveryProvider === 'direct') return directDownloads(slug);
  if (cfg.guideDeliveryProvider === 'gumroad') {
    const url = cfg.gumroadProducts?.[slug];
    if (!url) return '<p class="availability">The guide’s download link is being connected. You can use the sample below.</p>';
    const u = new URL(url);
    if (u.protocol !== 'https:' || !(u.hostname === 'gumroad.com' || u.hostname.endsWith('.gumroad.com'))) throw Error('Use the public Gumroad product URL for '+slug);
    return `<a class="button" data-guide-provider="gumroad" href="${esc(url)}">Get the free guide ↗</a><small>Enter $0 to download free. Gumroad emails your file.</small>`;
  }
  if (!(slug in kitForms)) throw Error('No kitForms entry for gated guide ' + slug);
  return kitForm({ id: kitForms[slug] || PENDING, key: slug, button: 'Email me the free guide', note: 'We’ll email your guide right away. Unsubscribe anytime.', title: 'Get ' + guideTitle(slug) + ' by email' });
}
function newsletterForm(label = 'Send me the monthly Sunday letter') {

  return kitForm({ id: cfg.kitNewsletterFormId || PENDING, key: 'newsletter', button: label, note: 'One letter from Amy Grace on one Sunday each month. Unsubscribe anytime.', title: 'Monthly Sunday Soul Snack signup' });

}


function signup(key, label) {

  if (key === 'newsletter') return newsletterForm(label);

  if (key in kitForms) return guideForm(key);

  const url = cfg.links[key];

  if (url && /^https:\/\//.test(url)) return `<a class="button" href="${esc(url)}">${esc(label)}</a>`;

  return `<p class="availability">The live signup is being prepared. In the meantime, <a href="${href('/soul-snacks')}">read a devotion</a> or <a href="${href('/freebies')}">explore the free library</a>.</p>`;

}

const guideFile = (slug, kind) => `guides/${slug}${kind === 'print' ? '-print' : ''}.pdf`;

function directDownloads(slug) { // ungated (Advent)

  const r = resources[slug];

  return `<div class="actions">${r.downloads.map((d, i) => `<a class="${i === 0 ? 'button' : 'text-link'}" href="${prefix}${guideFile(slug, i === 0 ? 'color' : 'print')}" download>${esc(d.label)} ↓</a>`).join('')}</div><small>Free PDF · ${r.downloads[0].pages} pages</small>`;

}



// Modules receive a cfg whose links point at markers for gated guides; markers are swapped for forms below.

const siteCfg = { ...cfg, links: { ...cfg.links, newsletter: MARK + 'newsletter' }, assets: new Proxy({}, { get: (t, k) => typeof k === 'string' ? (usedAssets.add(k), prefix + 'assets/' + k) : undefined }) };

for (const slug of Object.keys(kitForms)) siteCfg.links[slug] = MARK + slug;

for (const slug of ungated) siteCfg.links[slug] = MARK + slug;

const guideArt = g => ['fully-family', 'before-the-first-mountain', 'the-daughter-who-stayed', 'beloved-first', 'heir-not-hired'].includes(g[0]) ? '09-new-covers/' + g[0] + (g[0] === 'before-the-first-mountain' ? '-cover-v3.png' : '-cover-v4.png') : `01-guide-product-cards/${g[4]}-product-1200.png`;

const card = g => `<article class="card">${image(guideArt(g), g[1])}<h3>${g[1]}</h3><p>${g[2]}</p>${link('/' + g[0], 'Take a look')}</article>`;

const args = { sec, image, link, href, signup, guides, card, guideArt, mode, cfg: siteCfg };

const journal = require('./journal-redesign.cjs')(args), blog = require('./devotional-blog.cjs')(args), priority = require('./priority-pages.cjs')(args);

css += journal.css + blog.css + priority.css;

css += require('./palette-balance.cjs').css;css += require('./palette-balance.cjs').texture('site');
css += fonts.map(f => `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weight};font-display:swap;src:url(../${f.file}) format('truetype')}`).join('') + `.cs{font-family:Jost,Arial,sans-serif}.cs h1,.cs h2,.cs h3{font-family:Fraunces,Georgia,serif}.cs .hand{font-family:'Nanum Pen Script',cursive;font-style:normal;font-size:29px}`;

fonts.forEach(f => usedAssets.add(f.file));

css += `.cs .kit-form{position:relative;display:grid;gap:14px;max-width:580px;margin:6px 0 4px}.cs .kit-fields{display:grid;grid-template-columns:1fr 1.35fr;gap:14px}.cs .kit-field{display:grid;gap:6px;text-align:left}.cs .kit-field label{font-weight:700;font-size:15px;line-height:1.3}.cs .kit-field label span{font-weight:400}.cs .kit-form input{display:block;width:100%;min-height:48px;font:17px/1.4 Jost,Arial,sans-serif;color:var(--ink);background:#FFFCF6;border:1.5px solid #8f8273;border-radius:999px;padding:11px 20px}.cs .kit-form input:focus-visible{outline:3px solid #5B3A8C;outline-offset:3px;border-color:var(--green)}.cs .kit-form .button{border:0;cursor:pointer;min-height:48px;font-family:inherit;line-height:1.2;justify-self:start}.cs .kit-form small{margin-top:0;font-size:14px}.cs .kit-status{margin:0;font-size:14px}.cs .kit-status:empty{display:none}.cs .kit-hp{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}.cs .letter .kit-form{margin-left:auto;margin-right:auto}.cs .letter .kit-form .button{justify-self:center}.cs .gold .kit-form input{border-color:#6b4f12}.cs .kit-form+.button,.cs .kit-form+p{margin-top:18px}@media(max-width:760px){.cs .kit-fields{grid-template-columns:1fr}.cs .kit-form .button,.cs .letter .kit-form .button{justify-self:stretch;text-align:center}}`;

css += require('./google-measurement.cjs').css;
css += require('./delight.cjs').css;
css += require('./feedback.cjs').css;css+=`.cs .brand-lockup{max-width:100%}.cs .header-monthly-letter{font:700 13px/1.5 Jost,Arial,sans-serif;color:#1F3A8A;display:inline-flex;align-items:center;min-height:36px;padding:6px 0;text-underline-offset:4px}.cs .brand-home{display:block;text-decoration:none;max-width:100%}.cs .brand-purpose{display:block;font:22px/1.1 'Nanum Pen Script',cursive;color:#5B3A8C;margin-top:7px;max-width:330px}.cs header .brand-home img{width:330px;max-width:78vw}.cs nav{row-gap:20px}.cs footer img{background:#FFFCF6;padding:12px;width:330px;border-radius:4px}@media(max-width:760px){.cs .brand-purpose{font-size:21px;max-width:290px}.cs header .brand-home img{width:290px}}`;
const formScript = `<script>(function(){document.addEventListener('submit',function(e){var f=e.target;if(!f.matches||!f.matches('form[data-kit-form]'))return;var hp=f.querySelector('[data-kit-hp]'),st=f.querySelector('.kit-status');if(hp&&hp.value){e.preventDefault();return;}if(f.action.indexOf('${PENDING}')>-1){e.preventDefault();if(st)st.textContent='This signup is not connected yet.';}},true);})();</script>`;



// ---------- Pages ----------

function bodies() {

  const p = {};

  Object.assign(p, journal.pages, blog.pages, priority.pages);

  delete p.books; delete p['table-talks'];
  if(p['praying-as-family']){p['pray-when-you-feel-unworthy']=p['praying-as-family'];delete p['praying-as-family'];}

  return p;

}

const pages = bodies();
Object.assign(pages,refresh.pages({sec,href,image,cfg}));

Object.assign(pages,require('./teaching-share-pages.cjs')({sec,href,mode,cfg:siteCfg}));
pages.subscribe = ['Sunshine Mail | Chaotic Sunshine',
  sec(sunshineMail.feature({cfg,image,heading:'h1',placement:'subscribe'}),'sunshine-mail-section') +
  sec(`<h2>While you’re here.</h2><p>${link('/freebies', 'Browse the free guides')} ${link('/soul-snacks', 'Read a soul snack')}</p>`)];




function transform(slug, body) {
  body=refresh.transform(slug,body,{href,image,cfg});

  // Gated guide download blocks -> Kit form; ungated (Advent) -> direct links to /guides/.

  body = body.replace(/<a class="button" href="https:\/\/kit-form\.invalid\/([a-z0-9-]+)">[^<]*<\/a>/g, (m, key) => key === 'newsletter' ? newsletterForm() : ungated.has(key) ? directDownloads(key) : guideForm(key));

  if (slug === 'community-guidelines') {

    body = body.replace(/<h2>How comments will work\.<\/h2>[\s\S]*?private journal notes are also welcome\.<\/p>/, '<h2>How comments will work.</h2><p>Comments are not open on the website yet. These guidelines will apply when they are. Private journal notes are always welcome.</p>');

  }

  body = body.replace('<p>Take this question into the conversation when this devotion is published.</p>', '<p>Write your answer in a journal, or ask a friend the same question this week.</p>');


  if (body.includes('kit-form.invalid')) throw Error('Unreplaced form marker on ' + slug);

  return body;

}

function head(slug, title, body) {

  const d = seo.data(slug, title, body);


  const share=require('./social-cards.cjs');usedAssets.add(share.get(slug).file);

  return seo.head(d) + `<meta property="og:site_name" content="Chaotic Sunshine">` + share.head(slug,ROOT);

}

const ASSET_VERSION=require('crypto').createHash('sha256').update(css+chrome.css+fs.readFileSync(path.join(base,'brand-polish.css'),'utf8')+fs.readFileSync(path.join(assets,'29-editorial-refresh/reader-delight.js'),'utf8')).digest('hex').slice(0,12);
function page(slug, title, body, extraHead = '') {

  const main = seo.breadcrumbs(slug,title,href) + body + (cfg.feedback?.enabled ? require('./feedback.cjs').render({cfg,page:slug}) : '');
  const shell = chrome.render({href,image,cfg,slug,mode,main});

  let scripts = require('./google-measurement.cjs').script(cfg,mode) + require('./delight.cjs').script(body) + (body.includes('data-home-chapters')?require('./home-journey.cjs').script():'') + (shell.includes('data-sunshine-mail')?require('./kit-newsletter.cjs').script():'') + require('./feedback.cjs').script() + (body.includes('data-kit-form') ? formScript : '');
  if (body.includes('data-reader-tools') || body.includes('data-saved-readings') || body.includes('data-reading-resume')) scripts += require('./reader-tools.cjs').script({href});
  if(body.includes('data-journal-entry')||body.includes('data-side-quests')||body.includes('data-reveal-words')) scripts += require('./journal-experience.cjs').script({href});
  if (body.includes('data-start-picker')) scripts += require('./start-deck.cjs').script();
  if (body.includes('data-little-library')) {usedAssets.add('21-library-search/guide-search.js');scripts += require('./free-library.cjs').script({indexUrl:'assets/21-library-search/guide-search.js'});}
  if (body.includes('data-journal-reader')) scripts += require('./journal-reader.cjs').script();

  if (body.includes('data-random-devotion')) scripts += randomDevotion.script({ href, current: slug, mode, cfg: siteCfg });

  for(const icon of ['favicon-teal-v2-32.png','favicon-teal-v2-180.png','favicon-teal-v2.ico'])usedAssets.add('25-brand-icons/'+icon);

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>${slug==='404'?seo.head({slug}):extraHead}<link rel="icon" type="image/png" sizes="32x32" href="${prefix}assets/25-brand-icons/favicon-teal-v2-32.png"><link rel="icon" href="${prefix}assets/25-brand-icons/favicon-teal-v2.ico" sizes="any"><link rel="apple-touch-icon" sizes="180x180" href="${prefix}assets/25-brand-icons/favicon-teal-v2-180.png"><link rel="stylesheet" href="${prefix}assets/css/site.css?v=${ASSET_VERSION}"><style>body{margin:0;background:#FBF5EA}</style></head><body>${shell}${scripts}<script src="${prefix}assets/29-editorial-refresh/reader-delight.js?v=${ASSET_VERSION}" defer></script></body></html>`;

}



// ---------- Write ----------

for (const d of ['assets', 'guides','_qa']) { const target=path.resolve(out,d);if(path.dirname(target)!==path.resolve(out)||path.basename(out)!=='site-kit')throw Error('Unsafe build target');fs.rmSync(target,{recursive:true,force:true,maxRetries:5,retryDelay:150}); }

for (const f of fs.existsSync(out) ? fs.readdirSync(out) : []) if (f.endsWith('.html')) fs.rmSync(path.join(out, f));

fs.mkdirSync(out, { recursive: true });

const slugs = [];

for (const [slug, [title, body0]] of Object.entries(pages)) {

  formCount = 0;

  const body = transform(slug, body0);

  fs.writeFileSync(path.join(out, slug + '.html'), page(slug, title, body, head(slug, title, body)));

  slugs.push(slug);

}

prefix = '/'; formCount = 0;

fs.writeFileSync(path.join(out, '404.html'), page('404', 'Page not found | Chaotic Sunshine', sec(`<p class="eyebrow">Page not found</p><h1>This page wandered off.</h1><p>It did not leave a forwarding address. Try one of these instead.</p><div class="actions">${link('/', 'Go to the home page')}${link('/freebies', 'Browse the free guides')}<a class="text-link" href="${href('/soul-snacks')}">Read a soul snack →</a></div>`), '<meta name="robots" content="noindex">'));

prefix = '';



// Stylesheet and assets

fs.mkdirSync(path.join(out, 'assets/css'), { recursive: true });

css += chrome.css + fs.readFileSync(path.join(base,'brand-polish.css'),'utf8');
fs.writeFileSync(path.join(out, 'assets/css/site.css'), css);

// Copy only assets the finished pages and stylesheet actually reference.

usedAssets.clear();
usedAssets.add(seo.logo);
usedAssets.add('29-editorial-refresh/reader-delight.js');
for(const slug of slugs)usedAssets.add(require('./social-cards.cjs').get(slug).file);


for (const f of fs.readdirSync(out).filter(f => f.endsWith('.html'))) for (const m of fs.readFileSync(path.join(out, f), 'utf8').matchAll(/(?:href|src)="\/?assets\/([^"#?]+)"/g)) usedAssets.add(decodeURIComponent(m[1]));

for (const m of css.matchAll(/url\(\.\.\/([^)]+)\)/g)) usedAssets.add(m[1]);

fonts.forEach(f => usedAssets.add(f.file)); usedAssets.delete('css/site.css');

for (const x of fs.readdirSync(path.join(assets, '20-fonts')).filter(x => x.endsWith('OFL.txt') || x.endsWith('LICENSE.txt') || x === 'SOURCE.txt')) usedAssets.add('20-fonts/' + x);

const missingAssets = [];

for (const rel of [...usedAssets].sort()) {

  const src = path.join(assets, rel), dst = path.join(out, 'assets', rel);

  if (!fs.existsSync(src) || fs.statSync(src).size === 0) { missingAssets.push(rel); continue; }

  fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst);

}



// Guide PDFs at stable paths

const guideMap = [];

for (const [slug, r] of Object.entries(resources)) {

  const files = r.downloads.map((d, i) => ({ kind: i === 0 ? 'color' : 'print', src: path.join(base, 'covered-guides', d.file), label: d.label, pages: d.pages }));

  if (!files.length && kit.guideFiles?.[slug]) { const g = kit.guideFiles[slug]; if (g.color) files.push({ kind: 'color', src: path.resolve(base, g.color), label: 'Color PDF', pages: g.pages }); if (g.print) files.push({ kind: 'print', src: path.resolve(base, g.print), label: 'Print-friendly PDF', pages: g.pages }); }

  for (const f of files) {

    const rel = guideFile(slug, f.kind), ok = fs.existsSync(f.src);

    if (ok) { fs.mkdirSync(path.join(out, 'guides'), { recursive: true }); fs.copyFileSync(f.src, path.join(out, rel)); }

    guideMap.push({ slug, title: guideTitle(slug), gated: !ungated.has(slug), kind: f.kind, path: '/' + rel, url: ROOT + '/' + rel, source: path.relative(base, f.src).split(path.sep).join('/'), pages: f.pages, present: ok });

  }

}

fs.mkdirSync(path.join(base, 'priority-checks'), { recursive: true });

fs.writeFileSync(path.join(base, 'priority-checks/site-kit-guide-map.json'), JSON.stringify(guideMap, null, 2));
fs.writeFileSync(path.join(base,'priority-checks/source-asset-requirements.json'),JSON.stringify([...new Set([...sourceImageAssets,...usedAssets,'26-share-cards/manifest.json'])].sort(),null,2));



// Hosting files

const route = s => s === 'index' ? '/' : s === 'start' ? START_ROUTE : '/' + s;

fs.writeFileSync(path.join(out, '_redirects'), [

  '# Cloudflare Pages already serves extensionless HTML routes.',
  '# Do not rewrite /slug to /slug.html: it conflicts with automatic HTML redirects.',
  '/start-here  /start  301',
  '/praying-as-family  /pray-when-you-feel-unworthy  301',
  '/praying-as-family.html  /pray-when-you-feel-unworthy  301',
  '# Owner-only QA and setup files are excluded from this directory.', ''].join('\n'));

fs.writeFileSync(path.join(out, '_headers'), ['/*','  X-Content-Type-Options: nosniff','  Referrer-Policy: strict-origin-when-cross-origin',"  Content-Security-Policy: frame-ancestors 'self'",'/guides/*', '  X-Robots-Tag: noindex', '/assets/*', '  Cache-Control: public, max-age=604800', ''].join('\n'));

fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /_qa/\n\nSitemap: ${ROOT}/sitemap.xml\n`);

fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${slugs.filter(s=>s!=='welcome').map(s => `  <url><loc>${ROOT}${route(s)}</loc></url>`).join('\n')}\n</urlset>\n`);



const pending = [...Object.entries(['gumroad','direct'].includes(cfg.guideDeliveryProvider)?{}:kitForms).filter(([, v]) => !/^\d+$/.test(String(v))).map(([k]) => k), ...(/^\d+$/.test(String(cfg.kitNewsletterFormId)) ? [] : ['newsletter (kitNewsletterFormId)'])];

console.log(`Built ${slugs.length} pages + 404 into site-kit/; ${usedAssets.size - missingAssets.length} assets copied; ${guideMap.filter(g => g.present).length}/${guideMap.length} guide PDFs copied.`);

if (missingAssets.length) console.log('MISSING ASSETS (' + missingAssets.length + '):\n  ' + missingAssets.join('\n  '));

const absent = guideMap.filter(g => !g.present); if (absent.length) console.log('MISSING GUIDE PDFs:\n  ' + absent.map(g => g.slug + ' <- ' + g.source).join('\n  '));

if (pending.length) console.log(`WARNING: ${pending.length} Kit form IDs still pending. Run node check-site-kit.cjs before deploying.`);

if (missingAssets.length || absent.length) process.exitCode = 1;


// Advanced-mode feedback endpoint; only the API route invokes the Worker.
fs.copyFileSync(path.join(base,'cloudflare/feedback-worker.mjs'),path.join(out,'_worker.js'));
fs.writeFileSync(path.join(out,'_routes.json'),JSON.stringify({version:1,include:['/api/feedback'],exclude:[]},null,2));
