const quests=require('./side-quests.json');
const {esc}=require('./devotional-content.cjs');
const subjects=[
 'A playbill, ticket and theatre curtain, drawn with colored pencil.',
 'One plum velvet cinema seat and a ticket.',
 'An emerald mailbox holding a personal note.',
 'A folded street map with a wandering pink route and a little shop.',
 'A wonderfully imperfect handmade bowl and pottery tools.',
 'A saxophone, moon and evening string lights.',
 'Illustrated postcards, stamps and a purple pen.',
 'An emerald swatch beside green objects discovered out and about.',
 'A tiny Main Street with a bookstore and striped shop awning.',
 'Berry pie on a cobalt plate, with a fork ready for the occasion.',
 'An elegant emerald mocktail and a golden coaster.',
 'A half-open teal gallery door with paintings beyond it.',
 'Textured library books with one curious volume pulled out.',
 'A silk scarf and teal earrings from a secondhand treasure hunt.',
 'A cobalt camera and three little photographic discoveries.',
 'A blue architectural cornice, clouds and swallows overhead.',
 'A tiny handmade accordion book filled with sketches.',
 'A brass telescope and a star chart on cream paper.',
 'A turquoise museum jug displayed on a plum plinth.',
 'One dinner setting with a blue plate, plum napkin and candle.',
 'Two thank-you envelopes linked by a trail of golden footprints.',
 'A brass microphone and teal acoustic guitar.',
 'A blue question bubble beside a purple lectern.',
 'An emerald satin shoe, raspberry scarf and golden grocery basket.'
];
exports.art=(q,image)=>{
 const i=quests.findIndex(x=>x.id===q.id);
 if(i<0)throw Error('Missing mission artwork: '+q.id);
 const cell=i%6;
 return `<span class="quest-illustration" data-quest-art="${esc(q.id)}">${image('31-side-quest-art/mission-sheet-'+(Math.floor(i/6)+1)+'.webp',subjects[i]).replace('<img ',`<img style="left:-${cell%3*100}%;top:-${Math.floor(cell/3)*100}%" `)}</span>`;
};
exports.page=({sec,image})=>sec(`<div class="quest-cabinet-intro"><p class="eyebrow">Side Quests / little adventures for real life</p><h1>Your day could use<br><em>a little plot twist.</em></h1><p>Pull out one mission. Try it your way. Bring back a story.</p></div><div class="quest-cabinet" data-side-quests><div class="quest-cabinet-label"><span class="hand">The curiosity cabinet</span><span>24 little invitations</span></div><div class="quest-drawers" data-quest-controls hidden role="group" aria-label="Choose a mission drawer"><button type="button" data-quest-category="all" aria-pressed="true">All the possibilities</button><button type="button" data-quest-category="discovery" aria-pressed="false">Go exploring</button><button type="button" data-quest-category="creative" aria-pressed="false">Make a little mess</button><button type="button" data-quest-category="kindness" aria-pressed="false">Send some sunshine</button><button type="button" data-quest-category="brave" aria-pressed="false">Borrow some brave</button><button type="button" data-quest-category="after-dark" aria-pressed="false">After hours</button></div><div class="quest-pullout"><div class="quest-card-stack">${quests.map(q=>`<article class="quest-file" id="quest-${esc(q.id)}" data-quest-card data-quest-type="${esc(q.category)}" aria-labelledby="quest-title-${esc(q.id)}"><div class="quest-file-main">${exports.art(q,image)}<div class="quest-file-copy"><p class="quest-meta">${esc(q.time)} <span aria-hidden="true">·</span> ${esc(q.budget)}</p><h2 id="quest-title-${esc(q.id)}" tabindex="-1">${esc(q.title)}</h2><p class="quest-tagline">${esc(q.tagline)}</p><p class="quest-task">${esc(q.steps)}</p></div></div><details class="quest-pocket"><summary>A gentler version, a friend &amp; a field note <span aria-hidden="true">+</span></summary><div class="quest-pocket-paper"><div><h3>Make it easier</h3><p>${esc(q.easy)}</p></div><div><h3>Bring someone along</h3><p>${esc(q.withFriend)}</p></div><div><h3>Bring back a little noticing</h3><p>${esc(q.fieldNote)}</p><button type="button" data-save-quest="${esc(q.id)}">Download a blank field note ↓</button><small>A text file for your own notes. Nothing is submitted.</small></div></div></details></article>`).join('')}</div><div class="quest-cabinet-nav" data-quest-controls hidden><button type="button" data-quest-prev aria-label="Previous mission">← <span>Previous</span></button><button type="button" class="quest-surprise" data-quest-surprise>Surprise me ↗</button><button type="button" data-quest-next aria-label="Next mission"><span>Next</span> →</button></div><p class="quest-position" data-quest-count role="status" aria-live="polite" aria-atomic="true">24 missions to explore.</p></div><details class="quest-finder" data-quest-controls hidden><summary>Looking for a particular adventure?</summary><div><label for="quest-search">Find a mission</label><input id="quest-search" type="search" data-quest-search placeholder="Try pottery, book, kindness…"><p class="quest-empty" hidden>No exact match. Here’s another little possibility. Clear your search to explore the whole drawer.</p><label for="quest-picker">Or choose by title</label><select id="quest-picker" data-quest-picker>${quests.map(q=>`<option value="${esc(q.id)}">${esc(q.title)}</option>`).join('')}</select></div></details><noscript><p>All 24 missions are shown below. Each has a gentler version and an idea for bringing a friend.</p></noscript></div><p class="quest-cabinet-footnote hand">No passport. No personality transplant. Curiosity will do.</p>`,'quest-cabinet-stage');

function runtime(missions){
 const shelf=document.querySelector('[data-side-quests]');if(!shelf)return;
 const cards=[...shelf.querySelectorAll('[data-quest-card]')],search=shelf.querySelector('[data-quest-search]'),picker=shelf.querySelector('[data-quest-picker]'),status=shelf.querySelector('[data-quest-count]'),empty=shelf.querySelector('.quest-empty');
 let category='all',current=cards[0],matches=cards;
 shelf.classList.add('is-ready');shelf.querySelectorAll('[data-quest-controls]').forEach(e=>e.hidden=false);
 function show(card,updateURL=false){
  current=card;cards.forEach(c=>{c.hidden=c!==card;if(c!==card)c.querySelector('details').open=false;});
  picker.value=card.id.replace('quest-','');
  const index=matches.indexOf(card),noMatch=!matches.length;
  status.textContent=noMatch?'No exact match. Another possibility: '+card.querySelector('h2').textContent:(index+1)+' of '+matches.length+' · '+card.querySelector('h2').textContent;
  empty.hidden=!noMatch;
  shelf.querySelectorAll('[data-quest-prev],[data-quest-next],[data-quest-surprise]').forEach(b=>b.disabled=matches.length<2);
  if(updateURL)history.pushState(null,'','#'+card.id);
 }
 function filter(){const term=search.value.toLowerCase().trim();matches=cards.filter(c=>(category==='all'||c.dataset.questType===category)&&(!term||c.textContent.toLowerCase().includes(term)));show(matches.includes(current)?current:matches[0]||current);history.replaceState(null,'','#'+current.id);}
 function drawer(value){category=value;shelf.querySelectorAll('[data-quest-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.questCategory===value)));}
 shelf.querySelectorAll('[data-quest-category]').forEach(button=>button.addEventListener('click',()=>{drawer(button.dataset.questCategory);search.value='';filter();history.replaceState(null,'','#'+current.id);}));
 function turn(direction){if(matches.length<2)return;show(matches[(matches.indexOf(current)+direction+matches.length)%matches.length],true);}
 shelf.querySelector('[data-quest-prev]').addEventListener('click',()=>turn(-1));
 shelf.querySelector('[data-quest-next]').addEventListener('click',()=>turn(1));
 shelf.querySelector('[data-quest-surprise]').addEventListener('click',()=>{const alternatives=matches.filter(c=>c!==current);if(alternatives.length)show(alternatives[Math.floor(Math.random()*alternatives.length)],true);});
 search.addEventListener('input',filter);
 picker.addEventListener('change',()=>{drawer('all');search.value='';matches=cards;show(cards.find(c=>c.id==='quest-'+picker.value),true);});
 function fromHash(){const target=cards.find(c=>'#'+c.id===location.hash);if(target){drawer('all');search.value='';matches=cards;show(target);}else show(current);}
 window.addEventListener('hashchange',fromHash);window.addEventListener('popstate',fromHash);fromHash();
 shelf.querySelectorAll('[data-save-quest]').forEach(button=>button.addEventListener('click',()=>{
  const q=missions.find(m=>m.id===button.dataset.saveQuest),text=q.title+'\n\n'+q.steps+'\n\nMy field note\n'+q.fieldNote+'\n\nDate:\nWhat I noticed:\n\nChaotic Sunshine · Private notes, not submitted.';
  const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=q.id+'-field-note.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }));
}
exports.script=`<script>(${runtime.toString()})(${JSON.stringify(quests).replaceAll('<','\\u003c')});</script>`;
