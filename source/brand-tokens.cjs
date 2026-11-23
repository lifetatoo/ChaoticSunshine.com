/* Chaotic Sunshine · shared semantic brand palette · 2026-11-15.
   Keep the primary purple brush wordmark; this module coordinates colors and typography,
   but does not substitute images or overwrite special editorial compositions. */
const palette=Object.freeze({
  ink:'#173C46', readingInk:'#1B1726',
  teal:'#076D75', emerald:'#0B5D4A', blue:'#245893', sapphire:'#1F3A8A',
  purple:'#5B3A8C', plum:'#603666', burgundy:'#7A1F4B', berry:'#A72863',
  rose:'#F06BA4', coral:'#C85F4D',
  sunshine:'#E0A526', gold:'#EFBC3C',
  cream:'#FBF5EA', paper:'#FFF8EB', paperDeep:'#F4EAD7',
  sea:'#E0EEE9', sky:'#E3EDF4', white:'#FFFCF6'
});
exports.palette=palette;
exports.css=`.cs{
  ${Object.entries(palette).map(([name,hex])=>'--cs-'+name.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())+':'+hex+';').join('\n  ')}
  --cs-font-editorial:Fraunces,Georgia,serif;
  --cs-font-reading:Jost,Arial,sans-serif;
  --cs-font-handwritten:'Nanum Pen Script',cursive;
  --cs-font-marker:'Permanent Marker',cursive;
  --cs-space-1:8px;--cs-space-2:16px;--cs-space-3:24px;
  --cs-space-4:36px;--cs-space-5:48px;
  --cs-action:var(--cs-teal);
  --cs-focus:var(--cs-berry);
  --cs-surface:var(--cs-paper);
  --cs-divider:#D8C99E;
  --ink:var(--cs-ink);--teal:var(--cs-teal);
  --blue:var(--cs-blue);--plum:var(--cs-plum);
  --gold:var(--cs-gold);--paper:var(--cs-paper);
  --paper-deep:var(--cs-paper-deep);--sea:var(--cs-sea);
  --sky:var(--cs-sky);--berry:var(--cs-berry);
}
.cs :is(a,button,summary,input,select,textarea):focus-visible{
  outline:3px solid var(--cs-focus);
  outline-offset:3px;
}
.cs :is(.button,button.button){
  font-family:var(--cs-font-reading);
  min-height:44px;
  border-radius:3px;
}
.cs main :is(.reading,.devotion-reading,.journal-text-page){
  overflow-wrap:break-word;
}

/* One persistent menu below the art banner; scrolls horizontally at narrow widths.
   Never hide the destinations behind a drawer. The nav lives directly inside .cs so
   position:sticky is not constrained by the height of the masthead itself. */
.cs > .masthead-nav{
  position:sticky;top:0;z-index:90;
  display:flex;align-items:center;justify-content:center;flex-wrap:nowrap;
  gap:clamp(12px,1.5vw,24px);
  width:100%;max-width:none;margin:0;
  padding:5px 18px;
  color:var(--cs-ink);background:var(--cs-paper);
  border-top:1px solid #E6D4A5;border-bottom:2px solid var(--cs-gold);
  box-shadow:0 3px 12px #173C4619;
  overflow-x:auto;overscroll-behavior-x:contain;
  scrollbar-width:thin;scrollbar-color:var(--cs-gold) transparent;
}
.cs > .masthead-nav a{
  display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;
  min-height:44px;padding:6px 2px;
  color:var(--cs-ink);
  font:700 clamp(13px,1vw,15px)/1.25 var(--cs-font-reading);
  text-decoration:none;white-space:nowrap;
}
.cs > .masthead-nav a:is(:hover,[aria-current="page"]){
  color:var(--cs-burgundy);text-decoration:underline;
  text-underline-offset:5px;text-decoration-thickness:2px;
}
.cs > .masthead-nav .masthead-mail{
  padding:7px 13px;background:var(--cs-gold);color:var(--cs-reading-ink);
  transform:none;box-shadow:2px 2px 0 #7A1F4B26;
}
.cs #sunday-letter,.cs #journal,.cs .site-crumbs {scroll-margin-top:82px;}
@media(max-width:920px){
 .cs > .masthead-nav{justify-content:flex-start;gap:16px;padding-inline:16px;}
}
@media(max-width:600px){
 .cs > .masthead-nav{gap:14px;padding:3px 12px;}
 .cs > .masthead-nav a{min-height:44px;font-size:13px;}
 .cs > .masthead-nav .masthead-mail{padding:6px 10px;}
}
@media(prefers-reduced-motion:reduce){
  .cs :is(.sunshine-mail-invitation,.sunshine-mail-art,.reader-journal-collage){
    animation:none!important;
  }
}`;
