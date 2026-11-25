// Side Quest Society: curated original pocket cards, independent of visitors' private journals.
// Run after app's page definitions and before final render().
const CS_QUEST_DECKS={
 all:{label:"A little of everything",hint:"A fresh pocket invitation",icon:"✷"},
 discovery:{label:"Curiosity, please",hint:"A small invitation to notice",icon:"✦"},
 kindness:{label:"A ripple of joy",hint:"A kind act with room to grow",icon:"♡"},
 brave:{label:"Something a little brave",hint:"An honest, manageable stretch",icon:"✧"}
};
const questDeckBefore=pages.quests;
pages.quests=()=>{
 const source=questDeckBefore();
 const deck='<section class="quest-card-deck" aria-label="Illustrated pocket invitations from Side Quest Society">'
 +'<div class="quest-deck-intro"><span class="eyebrow">THE POCKET INVITATION COLLECTION</span><h2>One small card. <em>One beautifully different day.</em></h2><p>Select a leather book above, then pull a card from that collection. Every category has its own real prompts; nothing is submitted or shared.</p><p class="deck-privacy">72 original pocket invitations across curiosity, kindness and courage. No account needed.</p></div>'
 +'<div class="quest-pull-station"><div class="quest-pocket-stack" aria-hidden="true"><i></i><i></i><i></i><span>COLLECT A LITTLE WONDER</span></div>'
 +'<div class="quest-card-reveal-wrap"><p class="quest-card-kicker" id="quest-card-kicker">Choose a leather book above</p><div class="quest-card-stage" id="quest-card-stage" aria-live="off"></div>'
 +'<div class="quest-card-controls"><button type="button" id="quest-draw-card">Pull another invitation ✦</button><button type="button" class="secondary" id="quest-flip-card" disabled>Turn card over ↻</button><button type="button" class="small secondary" id="quest-keep-card" disabled>Keep this card ↓</button></div>'
 +'<p id="quest-card-status" role="status" class="deck-status">Pick a book to open a little possibility.</p></div></div></section>';
 return source.replace('<div class="quest-bottom">',deck+'<div class="quest-bottom">');
};
const questDeckBindBefore=bind;
bind=function(route){
 questDeckBindBefore(route);
 if(route!=='quests')return;
 const drawButton=document.getElementById('quest-draw-card');
 const flipButton=document.getElementById('quest-flip-card');
 const keepButton=document.getElementById('quest-keep-card');
 const kicker=document.getElementById('quest-card-kicker');
 const stage=document.getElementById('quest-card-stage');
 const status=document.getElementById('quest-card-status');
 if(!drawButton||!flipButton||!keepButton||!stage)return;
 const seen={all:new Set(),discovery:new Set(),kindness:new Set(),brave:new Set()};
 const palettes=[
 ['#005b5b','#064f55','#f4ce77','✺'],
 ['#513383','#29285b','#f1d38b','✦'],
 ['#a32d68','#681e59','#ffe2aa','✿'],
 ['#2455a3','#172f62','#ffe0a0','✧'],
 ['#913c42','#662038','#ffdda4','♡'],
 ['#006b55','#144d42','#e9d18a','✣']
 ];
 let current=null,side='front',group='all',lastId='';
 const sourceGroups=()=>group==='all'?CS_QUEST_FIELD_CARDS:CS_QUEST_FIELD_CARDS.filter(x=>x.category===group);
 const plain=()=>current?current.title+'\n\n'+current.action+'\n\nA question to carry: '+current.reflection+'\n\n'+current.credit:'';
 function renderCard(){
  const color=palettes[(CS_QUEST_FIELD_CARDS.indexOf(current)+CS_QUEST_FIELD_CARDS.filter(x=>x.category===current.category).indexOf(current))%palettes.length];
  const id='quest-card-'+safe(current.id);
  stage.innerHTML='<div class="quest-pocket-card'+(side==='back'?' is-flipped':'')+'" style="--qcard-front:'+color[0]+';--qcard-back:'+color[1]+';--qcard-gilt:'+color[2]+'" id="'+id+'">'
   +'<div class="quest-card-face quest-card-front" aria-hidden="'+String(side==='back')+'"><span class="quest-card-sigil" aria-hidden="true">'+color[3]+'</span><span class="quest-card-label">SIDE QUEST SOCIETY · '+safe(current.category).toUpperCase()+'</span><h3>'+safe(current.title)+'</h3><p>'+safe(current.action)+'</p><span class="quest-card-foot">A SMALL ADVENTURE, MADE REAL · '+safe(current.id.split('-').slice(-1)[0])+'</span></div>'
   +'<div class="quest-card-face quest-card-back" aria-hidden="'+String(side==='front')+'"><span class="quest-card-sigil" aria-hidden="true">✦</span><span class="quest-card-label">THE QUESTION TO CARRY</span><h3>Notice what happened.</h3><p>'+safe(current.reflection)+'</p><span class="quest-card-foot">'+safe(current.credit)+'</span></div></div>';
  flipButton.disabled=false;keepButton.disabled=false;
  flipButton.textContent=side==='front'?'Turn card over ↻':'Return to the front ↶';
  kicker.textContent=CS_QUEST_DECKS[group].label+' · pocket invitation';
 }
 function draw(){
  const cards=sourceGroups();
  if(!cards.length){status.textContent='No pocket cards are available for this book yet.';return;}
  let choices=cards.filter(c=>!seen[group].has(c.id)&&c.id!==lastId);
  if(!choices.length){seen[group].clear();choices=cards.filter(c=>c.id!==lastId);}
  if(!choices.length)choices=cards;
  current=choices[Math.floor(Math.random()*choices.length)];
  lastId=current.id;seen[group].add(current.id);side='front';
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  stage.classList.remove('is-drawing');void stage.offsetWidth;
  if(!reduce)stage.classList.add('is-drawing');
  renderCard();
  status.textContent='You drew '+current.title+'. '+(cards.length-seen[group].size)+' unseen cards remain in this book before the collection reshuffles.';
 }
 document.querySelectorAll('[data-quest-group]').forEach(button=>button.addEventListener('click',()=>{
  group=Object.hasOwn(CS_QUEST_DECKS,button.dataset.questGroup)?button.dataset.questGroup:'all';
  draw();
 }));
 drawButton.addEventListener('click',draw);
 flipButton.addEventListener('click',()=>{
  if(!current)return;
  side=side==='front'?'back':'front';
  renderCard();
  status.textContent=side==='back'?'Question to carry: '+current.reflection:'Front: '+current.title;
 });
 keepButton.addEventListener('click',()=>{if(current)download(plain(),'side-quest-'+current.id+'.txt')});
 draw();
};