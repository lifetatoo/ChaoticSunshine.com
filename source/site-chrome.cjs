const mail = require('./sunshine-mail.cjs');
const kit = require('./kit-newsletter.cjs');
const measurement = require('./google-measurement.cjs');

const wordmark = '29-editorial-refresh/chaotic-sunshine-wordmark-transparent.png';
const sun = '<svg class="chrome-glyph" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M8 1v14M1 8h14M3 3l10 10M3 13 13 3"/></svg>';
const envelope = '<svg class="chrome-glyph" viewBox="0 0 18 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2 3h14v10H2zM2 3l7 6 7-6"/></svg>';
const links = [
  ['start', 'Start Here'], ['freebies', 'Free Guides'], ['soul-snacks', 'Soul Snacks'],
  ['teaching-shelf', 'Teaching Shelf'], ['about', 'About']
];

exports.render = ({ href, image, cfg, slug, mode, main }) => {
  const home = href('/');
  const mailLink = slug === 'index' || slug === 'subscribe' ? '#sunday-letter' : home + '#sunday-letter';
  const nav = links.map(([route, label]) =>
    `<a href="${href('/' + route)}"${route === slug ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const mark = () => image(wordmark, 'Chaotic Sunshine');
  const signup = slug === 'index' || slug === 'subscribe'
    ? `<a class="chrome-footer-mail" href="${mailLink}">See what’s in Sunshine Mail <span aria-hidden="true">↗</span></a>`
    : kit.render(cfg, 'footer');

  return `<div class="cs"><a class="skip" href="#cs-main">Skip to content</a>
    <header class="site-masthead">
      <div class="masthead-ribbon"><div class="wrap masthead-ribbon-line">
        <span>${sun} Faith for the beautifully messy days</span>
        <span>Pews optional <span aria-hidden="true">·</span> Hope welcome</span>
        <a href="${href('/start')}">${sun} Open the good stuff</a>
      </div></div>
      <div class="wrap masthead-paper">
        <a class="brand-home" href="${home}" aria-label="Chaotic Sunshine home">${mark()}</a>
        <p class="masthead-note">An illustrated faith journal <span>&amp; a little free digital library</span></p>
        <nav class="masthead-nav" aria-label="Main navigation">${nav}
          <a class="masthead-mail" href="${mailLink}">${envelope} Get the monthly letter</a>
        </nav>
      </div>
    </header>
    <main id="cs-main">${main}</main>
    <footer id="site-footer" class="editorial-footer">
      <div class="footer-collage-note"><p>Bring the day you have.</p><strong>Take a little hope home.</strong><span>A little chaos. A lot of grace.</span></div>
      <div class="wrap editorial-footer-page">
        <div class="footer-brand">
          <a class="footer-wordmark" href="${home}" aria-label="Chaotic Sunshine home">${mark()}</a>
          <p class="footer-signature">A little chaos. A lot of grace.</p>
          <p>An illustrated faith journal by Amy Grace.</p>
        </div>
        <nav class="footer-index" aria-label="Footer navigation">
          <p>Find your page</p>
          ${nav}<a href="${href('/scripture-index')}">Scripture Index</a>
        </nav>
        <div class="footer-post">
          <p class="footer-post-title">${envelope} Sunshine Mail</p>
          <p>One Sunday letter a month, with a little room for surprises.</p>
          ${signup}
        </div>
      </div>
      <div class="editorial-footer-strip"><div class="wrap footer-strip-line">
        <span>© 2026 Chaotic Sunshine</span>
        <a href="${href('/community-guidelines')}">Conversation guidelines</a>
        <a href="${href('/privacy')}">Privacy</a><a href="${href('/resource-permissions')}">Using the printables</a>${measurement.controls(cfg, mode)}
      </div></div>
    </footer></div>`;
};

exports.css = mail.css + `
.cs .site-masthead{padding:0;background:#fffaf0;color:#362155}
.cs .chrome-glyph{display:inline-block;width:1em;height:1em;vertical-align:-.13em}
.cs .masthead-ribbon{background:#43256a;color:#fff9ee}
.cs .masthead-ribbon-line{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0 25px;padding-block:5px;text-align:center;font:700 11px/1.5 Jost,Arial,sans-serif;text-transform:uppercase;letter-spacing:.095em}
.cs .masthead-ribbon-line > *{padding:4px 0}
.cs .masthead-ribbon-line a{color:#ffdd75;text-underline-offset:3px}
.cs .masthead-paper{display:grid;justify-items:center;gap:8px;padding-block:18px 10px}
.cs .site-masthead .brand-home{display:block;width:min(365px,83vw);margin:auto}
.cs .site-masthead .brand-home img{display:block;width:100%;height:auto;max-width:none}
.cs .masthead-note{margin:0;text-align:center;color:#086359;font:24px/1.1 'Nanum Pen Script',cursive}
.cs .masthead-note span{display:inline-block}
.cs .site-masthead .masthead-nav{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:2px clamp(5px,1.6vw,24px);width:100%;margin:0;padding:0}
.cs .masthead-nav a{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 5px;color:#412363;text-decoration:none;font:700 15px/1.2 Jost,Arial,sans-serif;text-align:center}
.cs .masthead-nav a:hover,.cs .masthead-nav a[aria-current]{text-decoration:underline;text-underline-offset:5px;text-decoration-thickness:2px}
.cs .masthead-nav .masthead-mail{min-height:36px;padding:6px 11px;background:#f9d46b;color:#4d256f;border-radius:2px;box-shadow:2px 2px 0 #bc7a28}
.cs #site-footer.editorial-footer{background:#f2e7f7;color:#35234e;padding:0;border-top:6px solid #e3a928;text-align:left}
.cs .editorial-footer .editorial-footer-page{display:grid;grid-template-columns:1fr .67fr 1fr;gap:clamp(20px,4vw,58px);align-items:start;padding-block:clamp(28px,5vw,60px)}
.cs .editorial-footer p{margin:0 0 8px}
.cs #site-footer.editorial-footer .footer-brand p:not(.footer-signature),.cs #site-footer.editorial-footer .footer-post > p:not(.footer-post-title){color:#35234e}
.cs #site-footer.editorial-footer .footer-index a{color:#4e2b70}
.cs .editorial-footer .footer-wordmark{display:block;width:min(230px,100%)}
.cs .editorial-footer .footer-wordmark img{display:block;width:100%;height:auto;background:transparent;padding:0;border-radius:0}
.cs .footer-brand .footer-signature{color:#673882;font:29px/1.03 'Nanum Pen Script',cursive;margin-top:12px}
.cs .editorial-footer .footer-index{display:grid;justify-items:start;gap:0}
.cs .footer-index p,.cs .footer-post-title{font:700 22px/1.2 Fraunces,Georgia,serif;color:#492870}
.cs .footer-index a{padding:5px 0;text-underline-offset:3px;line-height:1.3}
.cs .footer-post{position:relative;padding:17px;background:#fff9ee;border:1px solid #dfcbe7;box-shadow:4px 4px 0 #d8bfe7;min-width:0}
.cs .footer-post-title .chrome-glyph{color:#12685d}
.cs .footer-post .home-kit-form{margin-top:11px;gap:8px}
.cs .footer-post .home-kit-form .kit-fields{grid-template-columns:minmax(0,1fr)}
.cs .footer-post .home-kit-form .button{background:#086359;color:#fffdf5;padding-inline:14px;font-size:14px}
.cs #site-footer.editorial-footer .chrome-footer-mail{color:#086359;font-weight:700;text-underline-offset:3px}
.cs .editorial-footer-strip{background:#43256a;color:#fff9ee}
.cs .editorial-footer .footer-strip-line{display:flex;flex-wrap:wrap;align-items:center;gap:5px 24px;padding-block:12px;font-size:14px}
.cs .footer-strip-line a{color:#fff4ca;text-underline-offset:3px}
.cs .site-crumbs{padding-block:7px;font:600 13px/1.4 Jost,Arial,sans-serif;color:#533976}
.cs .site-crumbs ol{display:flex;flex-wrap:wrap;gap:0 8px;list-style:none;padding:0;margin:0}
.cs .site-crumbs li + li::before{content:"›";margin-right:8px;color:#086359}
.cs .site-crumbs a{color:inherit;text-underline-offset:3px}
@media(max-width:760px){.cs .masthead-paper{gap:6px;padding-top:14px}.cs .site-masthead .brand-home{width:min(325px,78vw)}.cs .masthead-ribbon-line{gap:0 12px;font-size:10px}.cs .masthead-ribbon-line > *{padding:2px 0}.cs .masthead-note{font-size:22px}.cs .masthead-nav a{font-size:14px}.cs .editorial-footer .editorial-footer-page{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.cs .footer-post{grid-column:1/-1}}
@media(max-width:345px){.cs .editorial-footer .editorial-footer-page{grid-template-columns:1fr}.cs .masthead-nav a{min-height:38px}}
`;
