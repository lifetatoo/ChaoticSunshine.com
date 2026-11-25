/* V4 Sunshine Mail: reuse approved assets; preserve Kit action, fields and envelope. */
const csV4MailOriginal=pages.mail;
pages.mail=function(){
 let html=csV4MailOriginal();
 html=html.replace('CHAOTIC SUNSHINE’S FREE EMAIL COMMUNITY','SUNSHINE MAIL · FREE MONTHLY ILLUSTRATED LETTER');
 html=html.replace('Free to join. Monthly, with occasional extras. Unsubscribe anytime.','Free to join. One illustrated Sunday letter each month. Unsubscribe anytime.');
 html=html.replace('<div class="mail-signup-box">','<div class="mail-signup-box v4-mail-art-stage"><span class="v4-mail-object-label">A tiny treasure for your inbox · ✦</span>');
 html=html.replace('</form></div><div class="mail-benefits-panel">','</form>'+"<details class=\"v4-mail-sample\" id=\"mail-sample\">\n<summary>Open a sample letter. No signup required. ✉</summary>\n<div class=\"v4-mail-preview\" role=\"region\" aria-label=\"Illustrated Sunshine Mail sample\">\n<figure><img src=\"assets/sunshine-welcome-letter.webp\" alt=\"The approved illustrated jewel-tone Sunshine Mail letter\" loading=\"lazy\"><figcaption>One illustrated letter from the Sunshine Mail studio.</figcaption></figure>\n<div class=\"v4-mail-sample-text\"><span class=\"eyebrow\">A PEEK INSIDE</span><h3>Your prayer can lose the cover letter.</h3><p>Romans 8:12–17 invites us to approach God through belonging rather than polished performance. Your next prayer can begin as an honest sentence.</p><a href=\"welcome.html\">Explore the complete accessible letter →</a></div>\n</div></details>"+'</div><div class="mail-benefits-panel">');
 return html;
};
