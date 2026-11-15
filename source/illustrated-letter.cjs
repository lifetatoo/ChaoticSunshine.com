const art='29-editorial-refresh/prayer-cover-letter-illustration.webp';
exports.art=art;
exports.render=({image,heading='h3'}={})=>{
 const illustration=image?image(art,'A jewel-tone illustrated typewriter, curled cover letter, open journal, cobalt mug, and plum pen. A small taped note says formalities optional.'):`<img src="assets/${art}" alt="A jewel-tone illustrated typewriter, curled cover letter, open journal, cobalt mug, and plum pen.">`;
 return `<article class="illustrated-sunday-letter">
  <div class="sunday-letter-paper">
   <header class="sunday-letter-heading"><p class="sunday-letter-edition">Sunshine Mail <span aria-hidden="true">✦</span> A Sunday letter from Amy Grace</p><p class="sunday-letter-hello">A little truth. A little room to breathe.</p><${heading}>Your prayer can lose<br>the <em>cover letter.</em></${heading}></header>
   <figure class="sunday-letter-illustration">${illustration}<figcaption>A prayer doesn’t need a polished introduction.</figcaption></figure>
   <div class="sunday-letter-prose">
    <p class="sunday-letter-salutation">Dear friend,</p>
    <p>If you have ever mentally drafted an email before praying, complete with a polite opening and a convincing reason for taking up God’s time, pull up a chair.</p>
    <p class="sunday-letter-wink">“I hope this finds You well” is a lovely greeting. God probably does not need the update.</p>
    <p>Read <a href="https://www.biblegateway.com/passage/?search=Romans%208%3A12-17&amp;version=NIV" target="_blank" rel="noopener">Romans 8:12–17</a>. Paul describes the Spirit bringing believers into God’s family, teaching us to call God Father. There is room to begin with belonging rather than a presentation.</p>
    <p class="sunday-letter-tender">If “Father” is a tender word, take your time. You can tell God that, too.</p>
    <p>For today, try one unpolished sentence: “God, here is what I’m carrying.” Leave it unfinished if you need to. You do not have to turn it into a paragraph with excellent formatting.</p>
    <p class="sunday-letter-signature">A little sunshine for your Sunday,<br><strong>Amy Grace</strong></p>
   </div>
   <div class="sunday-letter-postscript"><span aria-hidden="true">☀</span><p>One letter a month. A little room for surprises.</p><small>An illustrated sample of Sunshine Mail.</small></div>
  </div>
 </article>`;
};
