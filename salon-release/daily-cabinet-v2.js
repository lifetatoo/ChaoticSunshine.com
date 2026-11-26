/* Daily Cabinet: sourced reading invitations, original studio encouragement and private browser-local jar. */
const CS_CABINET_PALETTES=[
 ['#066e72','#123e5c','#ffe4a2','✷'],['#632b83','#321e5b','#f3d38b','✦'],
 ['#a22d6c','#671f58','#f7d890','✿'],['#2356a4','#142e65','#f6daa1','✧'],
 ['#8f3248','#571c3b','#ead08a','♡'],['#0a7556','#154b3b','#f5d288','✣'],
 ['#ab612a','#6e3a33','#ffe1a8','☼']
];
const CS_CABINET_VERSE=CS_CABINET_DEVOTIONS.map(function(d){return {
 id:'passage-'+d.id,kind:'Scripture discovery',title:d.sourceTitle,
 message:'Read '+d.reading+'. Notice the people, actions or contrasts in the passage before considering its application.',
 reference:d.reading,prompt:'Close the passage. In your own words, what does it reveal about '+d.sourceTitle.toLowerCase()+'? Reopen it and check your answer.',credit:'Chaotic Sunshine · Scripture study invitation',
 artAsset:d.passageArtAsset,artAlt:d.passageArtAlt,url:d.id+'.html'
};}).concat(CS_CABINET_EXTRA_PASSAGES.map(function(d){return {
 id:d.id,kind:'Scripture invitation',title:d.title,message:d.message,
 reference:d.reference,prompt:d.prompt,credit:d.credit,
 artAsset:d.artAsset,artAlt:d.artAlt,url:'https://www.biblegateway.com/passage/?search='+encodeURIComponent(d.reference)
};}));
const CS_CABINET_STUDIO=CS_CABINET_DEVOTIONS.map(function(d){return {
 id:'studio-'+d.id,kind:'Studio encouragement',title:d.title,message:d.takeaway,
 reference:d.reading,prompt:d.practice,credit:'Chaotic Sunshine · original Soul Snacks practice',
 artAsset:d.studioArtAsset,artAlt:d.studioArtAlt,url:d.id+'.html'
};}).concat(CS_CABINET_ORIGINAL_SPARKS.map(function(d){return {
 id:d.id,kind:'Studio encouragement',title:d.title,message:d.message,
 reference:'',prompt:d.prompt,credit:d.credit,artAsset:d.artAsset,artAlt:d.artAlt,url:''
};}));
const CS_CABINET_ALL=CS_CABINET_VERSE.concat(CS_CABINET_STUDIO);
const CS_CABINET_GROUP_NAMES={today:'Today’s Surprise',verse:'Scripture Sparks',studio:'Studio Encouragement'};
// Each slip pairs a display line with a smaller prompt and a scene from the studio sketch sheets.
// Scene numbers correspond to the original Side Quest illustration sheets, in reading order.
const CS_LITTLE_GOOD_THINGS=[
 ['Let the sky do its thing.','Step outside for thirty seconds. The sky’s been busy all day without asking you to manage it.',5,15,'brush','wide'],
 ['One good thing is plenty.','You can call it a good day because of one good thing. The whole day does not have to agree.',4,9,'serif','side'],
 ['Play it too loud.','Put on the song you used to play too loud. Give yourself the whole first verse.',1,21,'brush','wide'],
 ['Mercy has a morning shift.','God’s mercies are new every morning. Take one breath before you decide what kind of day this is. · Lamentations 3:22–23',2,15,'hand','top'],
 ['Use the good mug.','A Tuesday is a perfectly respectable occasion.',0,10,'serif','top'],
 ['Send them a sentence.','Someone once made a very ordinary day better for you. If their name came to mind, tell them.',3,6,'hand','side'],
 ['Steal a color.','Find one in the sky, a shop window, or somebody’s shoes. Give it a name.',1,7,'brush','top'],
 ['That counts.','If the good thing was that you got through it, that counts.',2,3,'serif','wide'],
 ['Taste the first bite.','Eat it sitting down. See if you can actually taste it.',5,9,'hand','top'],
 ['This day, too.','The psalmist invites us to rejoice in this day. Name one part of it you’re glad you got to see. · Psalm 118:24',3,17,'serif','wide'],
 ['Open a window.','Give the room a different soundtrack for a minute.',4,15,'brush','top'],
 ['Your past self would grin.','Think of something your past self would be delighted to learn about your life today.',1,13,'serif','side'],
 ['Keep the good question.','A good question can be a better souvenir than a good answer. What made you curious today?',0,22,'hand','side'],
 ['Leave a little good behind.','Leave a kind note where someone will find it later. A mirror or lunch bag will do.',2,2,'brush','side'],
 ['Listen for one thing.','If the day feels too loud, put both feet on the floor. Notice one sound you’d miss if it were gone.',3,5,'hand','wide'],
 ['Give it a quiet cheer.','Look for the smallest thing doing its best. A plant, a dog, a person carrying three bags of groceries.',5,14,'brush','side'],
 ['Someone made room.','Where did someone make room for you today? A chair, a pause, a little extra patience?',1,19,'hand','top'],
 ['Catch the ordinary.','Take a photo of one ordinary thing you’d want to remember a year from now.',2,14,'brush','top'],
 ['There’s room for both.','Tell God one good thing and one hard thing in the same breath.',4,20,'serif','top'],
 ['Return to a small pleasure.','A library aisle, a fresh pencil, a drive with the windows down. Pick one you used to love.',0,12,'serif','wide'],
 ['Stand in the sunshine.','Find a patch of sunlight. Stay long enough to feel your shoulders come down.',5,8,'serif','wide'],
 ['A favor for future you.','Make the next thing a little nicer for your future self. Leave the bookmark in. Set out the mug.',3,16,'brush','top'],
 ['Joy can cut in line.','You’re allowed to enjoy something before the entire list is finished.',4,4,'brush','side'],
 ['Joy feels far away? Start smaller.','See if anything in the room makes you feel even a little more at home.',0,8,'serif','side']
];
const csCabinetOriginalPage=pages.catalog;
pages.catalog=function(){
 var s=csCabinetOriginalPage();
 var colorCards=Array.from({length:12},function(_,i){
   return '<i class="cs-jar-paper paper-'+i%6+'" style="--paper-tilt:'+((i-5)*8)+'deg;--paper-rise:'+((i%4)*14)+'px"></i>';
 }).join('');
 var jar='<div class="gratitude-jar cs-jar-assembly" id="cs-jar-assembly" >'
  +'<div class="cs-jar-inside" aria-hidden="true">'+colorCards+'</div>'
  +'<img class="cs-jar-glass" src="assets/little-good-things-glass.svg" alt="">'
  +'<button type="button" class="cs-jar-label" id="draw-studio-note" aria-controls="studio-jar-note" aria-label="Little Good Things: draw a surprise note"><span>little good</span><strong>things</strong><i aria-hidden="true">✦</i><small>Draw a note</small></button>'
  +'<img class="cs-jar-lid" src="assets/little-good-things-lid.svg" alt="">'
  +'<img class="cs-jar-ribbon" src="assets/little-good-things-ribbon.svg" alt="">'
  +'<span class="cs-jar-spark" aria-hidden="true">✧</span></div>';
 s=s.replace('<div class="gratitude-jar" aria-hidden="true"><div class="jar-lid"></div><div class="jar-glass"><i></i><i></i><i></i><span>little<br>good<br>things</span></div></div>',jar);
 s=s.replace(/<p class="collection-status">[^<]*<\/p>/,'<p class="collection-status">Three real collections: today draws from '+CS_CABINET_ALL.length+' cards. Scripture Sparks offers '+CS_CABINET_VERSE.length+' Scripture reading invitations and Studio Encouragement offers '+CS_CABINET_STUDIO.length+' original reflections and creative notes. Biblical quotations are never invented; each Scripture invitation identifies its passage.</p>');
 s=s.replace('THE GRATITUDE JAR · OPTIONAL & PRIVATE','THE LITTLE GOOD THINGS JAR')
   .replace('A place for the little good things.','A little good thing for today.')
   .replace('Not every good day announces itself. Keep one small observation, then pull it out when you’d like to remember.','Tap the jar label for a little surprise from Chaotic Sunshine.')
   .replace('<div class="gratitude-paper"><h3>What would you tuck inside?</h3>','<div class="studio-jar-desk"><div id="studio-jar-note" role="status" aria-atomic="true"><p class="studio-jar-empty hand">Pull a note from the jar.</p></div><details class="gratitude-paper"><summary>Keep your own good things</summary>')
   .replace('</div></div></section></div></section>','</div></details></div></section></div></section>');
 s=s.replace('Amy’s quote archive','My little good things').replace('Your collection belongs here','Your own private jar').replace('My little good things</span>','My little good things</span>');
 s=s.replace('<div class="card-stage" id="card-stage" aria-live="polite"></div>','<div class="card-stage" id="card-stage" aria-live="polite"></div><p class="cabinet-card-status" role="status" id="card-status"></p>');
 s=s.replace('<blockquote id="jar-note" hidden></blockquote>',
   '<div class="cs-jar-card-reveal" id="cs-jar-card-reveal" hidden><div class="cs-jar-note-card" id="cs-jar-note-card"><div class="cs-jar-note-front"><span>MY LITTLE GOOD THING ✦</span><blockquote id="jar-note" hidden></blockquote><small>A MOMENT WORTH KEEPING</small></div><div class="cs-jar-note-back" aria-hidden="true"><span>✧ A PRIVATE KEEPSAKE ✧</span><p>You noticed something good. That is worth remembering.</p><small>ONLY IN YOUR JAR</small></div></div><button type="button" id="turn-jar-note" class="small secondary">Turn my note over ↻</button></div>');
 s=s.replace('Notes stay only in this browser, if storage is available. Nothing is sent. Export a copy before clearing browser data.',
  'Your own notes stay only in this browser. Nobody else can draw them. Nothing is sent or shared. Export a copy before clearing browser data or changing devices.');
 s=s.replace('Fold it into the jar ↓','Fold it into my jar ↓').replace('Pull out a note','Pull out my note ✦');
 s=s.replace('A verse to sit with. A sentence to keep. A small invitation to notice the day you’re already in.',
  'Open a drawer for a real Scripture reading or an original studio spark. Flip a card to see the question on the other side. Tap the Little Good Things Jar for a surprise from the studio.');
 return s.replace('class="catalog-room"','class="catalog-room cabinet-upgrade"')
   .replace('class="gratitude-room"','class="gratitude-room gratitude-renewed"')
   .replace('class="catalog-drawers"','class="catalog-drawers cabinet-drawers"');
};
const csCabinetPreviousBind=bind;
bind=function(route){
 if(route!=='catalog'){csCabinetPreviousBind(route);return;}
 const stage=document.getElementById('card-stage'),status=document.getElementById('card-status');
 const drawers=Array.from(document.querySelectorAll('[data-drawer]'));
 if(!stage)return;
 var drawer='today',selected=null,side='front',lastId='';
 const seen={today:new Set(),verse:new Set(),studio:new Set()};
 const pool=function(){return drawer==='verse'?CS_CABINET_VERSE:drawer==='studio'?CS_CABINET_STUDIO:CS_CABINET_ALL;};
 function cardIllustration(card, palette){
   if(card.artAsset && /^assets\/[a-zA-Z0-9_./-]+\.(webp|png|jpg|svg)$/.test(card.artAsset) && !card.artAsset.includes('..')) return '<div class="cabinet-illustration"><img src="'+safe(card.artAsset)+'" alt="'+safe(card.artAlt||'')+'" style="max-width:100%;max-height:100%;object-fit:contain"></div>';
   // Distinct hand-drawn editorial vignettes, chosen consistently by card ID.
   // Shapes are intentionally varied: not religious icon stamps or stock imagery.
   let hash=0;for(const ch of card.id)hash=(hash*31+ch.charCodeAt(0))>>>0;
   const scenes=[
    '<circle cx="132" cy="72" r="29" fill="#f4bc46"/><path d="M132 19v19m0 69v21M80 72H61m141 0h-19M96 36 82 22m100 100-13-13m0-73 13-13M95 110l-14 13" stroke="#f9d990" stroke-width="5" stroke-linecap="round"/><path d="M24 158q43-53 85-7 47-73 124 4" fill="none" stroke="#f7dfb0" stroke-width="8" stroke-linecap="round"/><path d="M35 178q80-23 189 0" fill="none" stroke="#e3ad75" stroke-width="3"/>',
    '<path d="M44 174V46q42-15 85 10v122q-45-19-85-4Zm85 4V56q42-25 86-10v128q-38-15-86 4Z" fill="#f8e0b0" stroke="#4e336f" stroke-width="5" stroke-linejoin="round"/><path d="M59 75q23-6 50 2m-50 15q24-7 48 3m43-17q25-11 48-12m-48 30q25-10 48-9" stroke="#8b4b77" stroke-width="3" stroke-linecap="round"/><path d="M177 50v-22l13 5 12-9v36" fill="#d65284"/>',
    '<path d="M77 125h101v31q-2 18-50 18-51 0-51-18Z" fill="#f8e0ad" stroke="#672d75" stroke-width="5"/><path d="M179 132q47-11 33 19-10 16-33 7" fill="none" stroke="#f4c16b" stroke-width="8"/><path d="M82 181h108" stroke="#fff2ca" stroke-width="7" stroke-linecap="round"/><path d="M111 106q-18-18 0-35m30 35q-18-18 0-35m26 35q-18-18 0-35" fill="none" stroke="#fff1c8" stroke-width="4" stroke-linecap="round"/>',
    '<path d="M132 178V44m0 84Q82 104 71 63q51-5 61 40m1 18q52-18 65-65-55 4-65 47" fill="none" stroke="#f5ce84" stroke-width="7" stroke-linecap="round"/><path d="M132 153q-48-5-60-31m59 17q42-6 56-31" fill="none" stroke="#f0a6c8" stroke-width="5"/><circle cx="131" cy="38" r="11" fill="#f8da99"/>',
    '<path d="m131 21 22 49 54 6-39 38 10 56-47-26-47 26 10-56-39-38 54-6Z" fill="#f6c24f" stroke="#ffefd2" stroke-width="5" stroke-linejoin="round"/><path d="m131 47 13 31 31 3-23 22 6 32-27-14-27 14 6-32-23-22 31-3Z" fill="#8e3672"/><path d="m39 146 19-8m142 0 18 10" stroke="#f7deb1" stroke-width="5"/>',
    '<path d="M51 167V67l81-45 78 45v100Z" fill="#f3ca85" stroke="#fff0ca" stroke-width="6" stroke-linejoin="round"/><path d="M109 165V95h47v70" fill="#244e76" stroke="#ffebbb" stroke-width="4"/><circle cx="144" cy="132" r="4" fill="#f7cd73"/><path d="M27 169h207m-160-91 58-34 56 34" stroke="#f9dea6" stroke-width="5" fill="none" stroke-linecap="round"/>',
    '<path d="M55 152q-12-65 51-64l20 18q46-61 90-6 27 42-22 73-38 17-75 3-47 8-64-24Z" fill="#ecadbc" stroke="#fff1c6" stroke-width="5"/><path d="M80 111q18-6 29 18m42-29q26-9 42 17m-65 19q13 6 26 0" fill="none" stroke="#7a3077" stroke-width="4" stroke-linecap="round"/><path d="M113 83q-4-20 13-34m5 36q18-26 43-28" stroke="#f7d889" stroke-width="5" stroke-linecap="round"/>'
   ];
   return '<div class="cabinet-illustration" aria-hidden="true"><svg viewBox="0 0 260 205" xmlns="http://www.w3.org/2000/svg" focusable="false"><path d="M25 24q55-19 115-3 52-15 94 8l-6 151q-79 14-199-1Z" fill="#fff7e6" opacity=".12"/><path d="M29 31q18-17 42-11m127 163q17-1 29-14" stroke="#f4c372" stroke-width="3" stroke-linecap="round" fill="none"/>'+scenes[hash%scenes.length]+'<path d="M23 187q55-7 108 0 59 7 107-2" stroke="#fff0c7" stroke-width="2" opacity=".8" fill="none"/></svg></div>';
 }
 function paletteFor(key){let h=0;for(const c of key)h=(h*33+c.charCodeAt(0))>>>0;return CS_CABINET_PALETTES[h%CS_CABINET_PALETTES.length];}
 function cardText(){return selected.title+'\n\n'+selected.message+'\n\n'+(selected.reference?'Scripture reference: '+selected.reference+'\n':'')+selected.credit+'\n\nA question to carry: '+selected.prompt+'\n'+(selected.url?'Read more: '+new URL(selected.url,location.href).href:'');}
 function renderCard(){
   const p=paletteFor(selected.id);
   const style='--cs-ink:'+p[0]+';--cs-deep:'+p[1]+';--cs-foil:'+p[2];
   stage.innerHTML='<article class="daily-card cabinet-art-card'+(side==='back'?' is-flipped':'')+'" style="'+style+'">'
     +'<div class="cabinet-art-faces">'
     +'<div class="cabinet-card-front" aria-hidden="'+String(side==='back')+'">'+cardIllustration(selected,p)+'<span class="eyebrow">'+safe(selected.kind)+'</span><h2>'+safe(selected.title)+'</h2><p class="cabinet-card-message">'+safe(selected.message)+'</p><small class="cabinet-card-credit">'+safe(selected.credit)+(selected.reference?' · '+safe(selected.reference):'')+'</small></div>'
     +'<div class="cabinet-card-back" aria-hidden="'+String(side!=='back')+'" '+(side==='back'?'':'inert')+'><span class="cabinet-card-motif" aria-hidden="true">✧</span><span class="eyebrow">THE OTHER SIDE</span><h2>A question to carry</h2><p class="cabinet-card-question">'+safe(selected.prompt)+'</p>'
     +(selected.url?'<a class="cabinet-card-source" href="'+safe(selected.url)+'">Read more about this passage ↗</a>':'')
     +'<small>'+safe(selected.credit)+'</small></div></div></article>'
     +'<div class="card-actions"><button type="button" class="small" id="turn-card">'+(side==='back'?'Turn to the front ↶':'Turn the card over ↻')+'</button>'
     +'<button type="button" class="small secondary" id="keep-card">Keep this card ↓</button>'
     +'<button type="button" class="small secondary" id="another-card">Draw another from this drawer ✦</button></div>';
   stage.querySelector('#turn-card').onclick=function(){side=side==='front'?'back':'front';renderCard();status.textContent=side==='back'?'You turned the card to its question.':'Showing the illustrated front.';};
   stage.querySelector('#keep-card').onclick=function(){download(cardText(),'chaotic-sunshine-'+selected.id+'.txt');};
   stage.querySelector('#another-card').onclick=function(){drawCard(false);};
 }
 function dayKey(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
 // Each drawer keeps its own full, shuffled, non-repeating queue. A click on
 // a drawer is always a request for a fresh card, not just tab activation.
 // The daily card is deterministic only for the initial page load.
 const decks={today:[],verse:[],studio:[]};
 const drawn={today:0,verse:0,studio:0};
 let lastTitle='';
 function renewDeck(key){
   const choices=key==='verse'?CS_CABINET_VERSE:key==='studio'?CS_CABINET_STUDIO:CS_CABINET_ALL;
   const items=choices.slice();
   for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}
   // Prevent the same teaching from being displayed twice consecutively,
   // even when it lives in both the Scripture and Studio collections.
   const first=items.findIndex(c=>c.title!==lastTitle&&c.id!==lastId);
   if(first>0)[items[0],items[first]]=[items[first],items[0]];
   decks[key]=items;
   drawn[key]=0;
 }
 function drawCard(todaysPick){
   const choices=pool();let next;
   if(todaysPick&&drawer==='today'){
     let h=0;for(const ch of dayKey())h=(h*31+ch.charCodeAt(0))>>>0;
     next=choices[h%choices.length];
     // This daily selection also consumes its place in the non-repeating deck.
     renewDeck('today');decks.today=decks.today.filter(c=>c.id!==next.id);
     drawn.today=1;
   }else{
     if(!decks[drawer].length)renewDeck(drawer);
     let idx=decks[drawer].findIndex(c=>c.id!==lastId&&c.title!==lastTitle);
     if(idx<0)idx=decks[drawer].findIndex(c=>c.id!==lastId);
     if(idx<0)idx=0;
     next=decks[drawer].splice(idx,1)[0];
     drawn[drawer]++;
   }
   selected=next;seen[drawer].add(next.id);lastId=next.id;lastTitle=next.title;side='front';
   stage.classList.remove('is-drawing');void stage.offsetWidth;
   if(!matchMedia('(prefers-reduced-motion:reduce)').matches)stage.classList.add('is-drawing');
   renderCard();
   const shown=drawn[drawer],total=choices.length,remaining=decks[drawer].length;
   status.textContent=CS_CABINET_GROUP_NAMES[drawer]+': card '+shown+' of '+total+' · '+remaining+' still to discover in this round. '+selected.title+'.';
 }
 function pickDrawer(key){
   drawers.forEach(function(el){el.setAttribute('aria-pressed',String(el.dataset.drawer===key));});
   if(key==='archive'){
     document.querySelector('.gratitude-room').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
     document.getElementById('gratitude-entry').focus({preventScroll:true});return;
   }
   drawer=key;drawCard(false);
 }
 drawers.forEach(function(b){b.onclick=function(){pickDrawer(b.dataset.drawer);};});
 drawCard(true);
 let notes=[];try{const stored=JSON.parse(localStorage.getItem('cs-studio-gratitude')||'[]');notes=Array.isArray(stored)?stored.filter(function(x){return typeof x==='string'&&x.length<=600;}).slice(-200):[];}catch{}
 const jar=document.getElementById('cs-jar-assembly'),entry=document.getElementById('gratitude-entry'),jarStatus=document.getElementById('jar-status');
 const reveal=document.getElementById('cs-jar-card-reveal'),noteEl=document.getElementById('jar-note'),noteCard=document.getElementById('cs-jar-note-card');
 const turn=document.getElementById('turn-jar-note'),clear=document.getElementById('clear-gratitude');
 let lastIndex=-1,noteFlipped=false,pendingClear=false;
 function count(){jarStatus.textContent=notes.length+' private little good thing'+(notes.length===1?'':'s')+' saved in this browser’s jar.';}
 function jarMotion(name){
   if(!jar)return;jar.classList.remove('is-drawing','is-receiving');void jar.offsetWidth;
   if(!matchMedia('(prefers-reduced-motion:reduce)').matches){jar.classList.add(name);setTimeout(function(){jar.classList.remove(name);},1050);}
 }
 const surprise=document.getElementById('studio-jar-note');
 let studioDeck=[],lastStudioNote;
 document.getElementById('draw-studio-note').onclick=function(){
   if(!studioDeck.length){
     studioDeck=CS_LITTLE_GOOD_THINGS.slice();
     const previous=studioDeck.indexOf(lastStudioNote);
     if(previous>=0)studioDeck.unshift(studioDeck.splice(previous,1)[0]);
   }
   const first=studioDeck[0]===lastStudioNote?1:0;
   const index=first+Math.floor(Math.random()*(studioDeck.length-first));
   const [note]=studioDeck.splice(index,1);
   lastStudioNote=note;
   const [title,message,color,scene,type,layout]=note;
   const slip=document.createElement('article');
   slip.className='studio-jar-slip paper-'+color+' slip-'+type+' slip-'+layout;
   const copy=document.createElement('div');
   copy.className='studio-jar-copy';
   const heading=document.createElement('h3');
   heading.textContent=title;
   const prompt=document.createElement('p');
   prompt.textContent=message;
   copy.append(heading,prompt);

   const art=document.createElement('span');
   art.className='studio-jar-art';
   art.setAttribute('aria-hidden','true');
   const cell=scene%6;
   art.style.backgroundImage='url("assets/mission-sheet-'+(Math.floor(scene/6)+1)+'.webp")';
   art.style.backgroundPosition=(cell%3*50)+'% '+(Math.floor(cell/3)*100)+'%';
   slip.append(copy,art);
   surprise.replaceChildren(slip);
   jarMotion('is-drawing');
 };
 document.getElementById('add-gratitude').onclick=function(){
   const value=entry.value.trim();
   if(!value){jarStatus.textContent='Write a little something before folding it in.';entry.focus();return;}
   const next=notes.concat(value).slice(-200);
   try{localStorage.setItem('cs-studio-gratitude',JSON.stringify(next));notes=next;entry.value='';pendingClear=false;clear.textContent='Clear this jar';jarMotion('is-receiving');count();}
   catch{jarStatus.textContent='Browser storage is unavailable. Your note is still in the text box. Copy it before leaving.';}
 };
 document.getElementById('pull-gratitude').onclick=function(){
   if(!notes.length){jarStatus.textContent='Your jar is ready for its first little good thing.';return;}
   let choices=notes.map(function(_,i){return i;}).filter(function(i){return i!==lastIndex;});
   if(!choices.length)choices=[0];
   lastIndex=choices[Math.floor(Math.random()*choices.length)];
   const personal=notes[lastIndex],p=paletteFor('jar-'+lastIndex+'-'+personal);
   noteCard.style.cssText='--cs-ink:'+p[0]+';--cs-deep:'+p[1]+';--cs-foil:'+p[2];
   noteEl.textContent=personal;noteEl.hidden=false;reveal.hidden=false;
   noteFlipped=false;noteCard.classList.remove('is-flipped');turn.textContent='Turn my note over ↻';
   noteCard.querySelector('.cs-jar-note-front').setAttribute('aria-hidden','false');
   noteCard.querySelector('.cs-jar-note-back').setAttribute('aria-hidden','true');
   reveal.classList.remove('is-drawing');void reveal.offsetWidth;
   if(!matchMedia('(prefers-reduced-motion:reduce)').matches)reveal.classList.add('is-drawing');
   jarMotion('is-drawing');jarStatus.textContent='You drew one of your own private notes. It was not shared or removed.';
 };
 turn.onclick=function(){
   noteFlipped=!noteFlipped;noteCard.classList.toggle('is-flipped',noteFlipped);
   turn.textContent=noteFlipped?'Read my note ↶':'Turn my note over ↻';
   noteCard.querySelector('.cs-jar-note-front').setAttribute('aria-hidden',String(noteFlipped));
   noteCard.querySelector('.cs-jar-note-back').setAttribute('aria-hidden',String(!noteFlipped));
 };
 document.getElementById('export-gratitude').onclick=function(){
   if(!notes.length){jarStatus.textContent='Nothing to export yet.';return;}
   download('My Little Good Things Jar · private personal notes\n\n'+notes.map(function(n,i){return (i+1)+'. '+n;}).join('\n\n'),'my-little-good-things.txt');
 };
 clear.onclick=function(){
   if(!pendingClear){pendingClear=true;clear.textContent='Confirm: erase my jar';jarStatus.textContent='This clears only your saved browser notes. Export first if you want a copy.';return;}
   try{localStorage.removeItem('cs-studio-gratitude');notes=[];lastIndex=-1;reveal.hidden=true;noteEl.textContent='';noteEl.hidden=true;entry.value='';pendingClear=false;clear.textContent='Clear this jar';count();}
   catch{jarStatus.textContent='The browser could not clear this jar.';}
 };
 count();
};