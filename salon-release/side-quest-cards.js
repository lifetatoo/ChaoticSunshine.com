// Side Quest Society: curated original pocket cards, independent of visitors' private journals.
// Run after app's page definitions and before final render().
const CS_QUEST_DECKS={
 all:{label:"A little of everything",hint:"A fresh pocket invitation",icon:"✷"},
 discovery:{label:"Curiosity, please",hint:"A small invitation to notice",icon:"✦"},
 kindness:{label:"A ripple of joy",hint:"A kind act with room to grow",icon:"♡"},
 brave:{label:"Something a little brave",hint:"An honest, manageable stretch",icon:"✧"}
};
// Subjects are matched to the pocket prompts using the studio’s original mission art sheets.
const CS_QUEST_ART_SCENES=[
  11,18,21,3,7,22,1,12,15,8,4,3,15,18,11,8,16,7,15,12,19,9,6,17,
  20,2,19,0,22,4,16,2,20,12,22,6,2,10,9,19,22,20,6,21,19,2,0,16,
  1,22,4,10,16,19,20,3,21,22,11,23,3,6,12,2,14,18,9,4,22,16,7,0
];
const questDeckBefore=pages.quests;
pages.quests=()=>{
 const source=questDeckBefore();
 const deck='<section class="quest-card-deck" aria-label="Illustrated pocket invitations from Side Quest Society">'
 +'<div class="quest-deck-intro"><span class="eyebrow">THE POCKET INVITATION COLLECTION</span><h2>One small card. <em>One beautifully different day.</em></h2><p>Choose a book to draw a pocket invitation. Turn the card over for a question to take with you.</p><p class="deck-privacy">72 quick ideas for curiosity, kindness, and courage. The longer illustrated missions are also available on this page.</p></div>'
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
 const palettes={
  discovery:['#006263','#123e60','#fdcb45'],
  kindness:['#85305d','#582653','#ffd285'],
  brave:['#3e267f','#32285e','#ffd761']
 };
 let current=null,side='front',group='all',lastId='';
 const sourceGroups=()=>group==='all'?CS_QUEST_FIELD_CARDS:CS_QUEST_FIELD_CARDS.filter(x=>x.category===group);
 const plain=()=>current?current.title+'\n\n'+current.action+'\n\nA question to carry: '+current.reflection+'\n\n'+current.credit:'';
 function renderCard(){
  const color=palettes[current.category];
  const artIndex=CS_QUEST_FIELD_CARDS.indexOf(current);
  const scene=CS_QUEST_ART_SCENES[artIndex];
  const sheet=Math.floor(scene/6)+1;
  const column=(scene%6)%3;
  const row=Math.floor((scene%6)/3);
  const illustration='<span class="quest-card-art" aria-hidden="true" style="background-image:url(assets/mission-sheet-'+sheet+'.webp);background-position:'+column*50+'% '+row*100+'%"></span>';
  const isBack=side==='back';
  stage.innerHTML='<article class="quest-pocket-card" style="--qcard-front:'+color[0]+';--qcard-back:'+color[1]+';--qcard-gilt:'+color[2]+'" id="quest-card-'+safe(current.id)+'">'
   +'<div class="quest-card-face quest-card-'+side+'">'+illustration
   +'<div class="quest-card-copy"><span class="quest-card-label">'+(isBack?'A question to carry':'Side Quest Society · '+safe(current.category))+'</span>'
   +'<h3>'+safe(current.title)+'</h3><p>'+safe(isBack?current.reflection:current.action)+'</p></div></div></article>';
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