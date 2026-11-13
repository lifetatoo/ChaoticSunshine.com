const kit = require('./kit-newsletter.cjs');
const delight = require('./delight.cjs');

exports.art = '29-editorial-refresh/sunshine-mail-luxury-invitation.webp';

exports.footer=({cfg,image,href})=>`<aside class="sunshine-footer-envelope" aria-labelledby="footer-envelope-title">
 <div class="sunshine-footer-poster">
  <div class="sunshine-footer-art">${image('29-editorial-refresh/sunshine-mail-footer-envelope.webp','A dimensional gold envelope with layered cream stationery, teal paper, a gold clip, and a sunshine seal.')}</div>
  <div class="sunshine-footer-letter"><p class="sunshine-footer-kicker">Sunshine Mail</p><h2 id="footer-envelope-title">Hello, lovely.</h2><p class="sunshine-footer-promise">One Sunday letter a month.<br>Faith, real life, and a little surprise.</p>${kit.render(cfg,'footer').replace('inputmode="email" required','inputmode="email" placeholder="Your email address" required')}</div>
 </div>
 <div class="sunshine-footer-after"><a class="sunshine-footer-peek" href="${href('/sunshine-mail-sample')}">Open an illustrated letter <span aria-hidden="true">↗</span></a><a class="sunshine-footer-privacy" href="${href('/privacy')}">Privacy</a></div>
</aside>`;

exports.feature = ({ cfg, image, heading = 'h2', placement = 'home' }) => `
  <div class="sunshine-mail sunshine-mail-luxury" id="sunday-letter">
    <div class="sunshine-mail-letter sunshine-mail-intro">
      <p class="eyebrow">Sunshine Mail from Amy Grace</p>
      <${heading}>Good mail for messy days.</${heading}>
      <p>One Sunday a month, I’ll send you a Bible passage, an honest story or question, and something small to carry into your day. Now and then a sketch sneaks into the envelope.</p>
      <p class="sunshine-mail-aside">Personal mail. Finally, something that isn’t a password reset.</p>
    </div>
    <div class="sunshine-mail-invitation">
      <figure class="sunshine-mail-art"><picture><source media="(max-width:600px)" srcset="assets/29-editorial-refresh/sunshine-welcome-envelope.webp">${image(exports.art, 'Hello, Lovely! Sunshine Mail Club. A dimensional gold envelope with cream paper, a sunshine seal, raspberry lining, and a teal background. A monthly surprise letter for your beautifully messy life.')}</picture><figcaption class="sunshine-mobile-envelope-label"><strong>Hello, lovely.</strong><span>Your monthly little<br>ray of sunshine.</span></figcaption></figure>
      ${kit.render(cfg, placement)}
    </div>
    <p class="sunshine-mail-signoff">One letter a month. Free. Unsubscribe anytime. <a href="privacy.html">Privacy</a><span>From my messy, hopeful life to yours. Love, Amy</span></p>
    ${delight.sampleLetter({image})}
  </div>`;

exports.css = `
.cs .sunshine-mail-section{background:#f9e9ae;padding:clamp(26px,5.6vw,72px) 0}
.cs .sunshine-mail{display:grid;grid-template-columns:1fr 1fr;gap:clamp(22px,4vw,60px);align-items:center;scroll-margin-top:16px}
.cs .sunshine-mail-art{position:relative;margin:0;transform:rotate(-1.75deg);border:7px solid #fffcf6;box-shadow:6px 9px 0 #166b62,0 15px 32px #76542227;background:#0b5865}
.cs .sunshine-mail-art::before{content:"";position:absolute;z-index:1;width:26%;height:21px;left:35%;top:-14px;background:repeating-linear-gradient(100deg,#f6c9dc 0 4px,#fbe1ea 4px 7px);transform:rotate(4deg);pointer-events:none}
.cs .sunshine-mail-art img{width:100%;display:block;aspect-ratio:768/331;object-fit:cover}
.cs .sunshine-mail-signoff{margin:20px 0 0;text-align:right;color:#554078;font:27px/1.05 'Nanum Pen Script',cursive}
.cs .sunshine-mail-signoff span{display:block}
.cs .sunshine-mail-letter{min-width:0;background:#fffaf0;color:#31254a;padding:clamp(19px,3vw,36px);border:1px solid #d8c99e;border-radius:2px 2px 9px 2px;box-shadow:3px 4px 0 #d2b66355}
.cs .sunshine-mail-letter .eyebrow{color:#075c52;margin:0 0 8px}
.cs .sunshine-mail-letter :is(h1,h2){font-size:clamp(29px,3.5vw,51px);line-height:1.02;color:#50307e;margin:0 0 12px}
.cs .sunshine-mail-letter > p:not(.eyebrow){margin:0 0 13px}
.cs .sunshine-mail-letter .sunshine-mail-aside{font:25px/1.05 'Nanum Pen Script',cursive;color:#8a245b}
.cs .sunshine-mail-letter details{margin-top:17px}
@media(max-width:760px){.cs .sunshine-mail{grid-template-columns:1fr;gap:22px}.cs .sunshine-mail-art{margin:5px 9px 0;transform:rotate(-1deg)}}

.cs .sunshine-mail-luxury{display:block;max-width:1120px;margin:auto}.cs .sunshine-mail-luxury .sunshine-mail-intro{max-width:740px;margin:0 auto 20px;text-align:center;background:none;border:0;box-shadow:none;padding:0}.cs .sunshine-mail-luxury .sunshine-mail-intro h1,.cs .sunshine-mail-luxury .sunshine-mail-intro h2{font-size:clamp(32px,4vw,52px)}
.cs .sunshine-mail-invitation{position:relative;filter:drop-shadow(0 16px 17px #64442535)}.cs .sunshine-mail-luxury .sunshine-mail-art{margin:0;border:0;transform:none;box-shadow:none;background:none}.cs .sunshine-mail-luxury .sunshine-mail-art::before{display:none}.cs .sunshine-mail-luxury .sunshine-mail-art img{aspect-ratio:3/2;object-fit:contain;width:100%;height:auto}
.cs .sunshine-mail-invitation .home-kit-form{position:absolute;left:22.9%;top:66.1%;width:52.2%;height:8.7%;max-width:none;margin:0;display:grid;grid-template-columns:1.43fr 1fr;align-items:stretch;gap:2%}.cs .sunshine-mail-invitation .kit-fields{display:block;min-width:0;height:100%}.cs .sunshine-mail-invitation .kit-field{height:100%}.cs .sunshine-mail-invitation .kit-field:has([name="fields[first_name]"]){display:none}.cs .sunshine-mail-invitation label{position:absolute;clip:rect(0,0,0,0);width:1px;height:1px;overflow:hidden}.cs .sunshine-mail-invitation input{height:100%;min-height:0;background:#fffaf1;border:2px solid #817b7a;border-radius:9px;font-size:clamp(14px,1.7vw,24px);padding:8px 13px}.cs .sunshine-mail-invitation .button{width:100%;height:100%;min-height:0;border-radius:10px;background:#b40051!important;color:#fffaf1;font-size:clamp(12px,1.5vw,22px);padding:5px 10px;justify-self:stretch;line-height:1.15;box-shadow:none}.cs .sunshine-mail-invitation form>small{display:none}.cs .sunshine-mail-invitation .kit-status{position:absolute;top:110%;left:0;right:0;background:#fff9ed;padding:5px;color:#75224f}.cs .sunshine-mail-luxury>.sunshine-mail-signoff{text-align:center;font:15px/1.5 Jost,Arial,sans-serif;margin:20px 0}.cs .sunshine-mail-luxury>.sunshine-mail-signoff span{font:27px/1.2 'Nanum Pen Script',cursive;margin-top:7px}.cs .sunshine-mail-luxury>details{max-width:760px;margin:20px auto}
@media(max-width:600px){.cs .sunshine-mail-invitation .home-kit-form{position:relative;left:auto;top:auto;width:100%;height:auto;display:grid;grid-template-columns:1fr;gap:13px;margin:18px auto 0;padding:19px;background:#fff8e8;border:3px solid #f1c44e;box-shadow:5px 5px 0 #075b69}.cs .sunshine-mail-invitation label{position:static;clip:auto;width:auto;height:auto;overflow:visible;font-size:16px}.cs .sunshine-mail-invitation input{min-height:52px;font-size:19px}.cs .sunshine-mail-invitation .button{min-height:52px;font-size:19px}.cs .sunshine-mail-invitation form>small{display:block;font-size:14px}.cs .sunshine-mail-invitation .kit-status{position:static;margin:0}.cs .sunshine-mail-luxury .sunshine-mail-intro{padding-inline:4px}.cs .sunshine-mail-luxury .sunshine-mail-art{pointer-events:none}}
`;
