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
@media(prefers-reduced-motion:reduce){
  .cs :is(.sunshine-mail-invitation,.sunshine-mail-art,.reader-journal-collage){
    animation:none!important;
  }
}`;
