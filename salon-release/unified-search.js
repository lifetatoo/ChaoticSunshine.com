/* V4 private-by-default, evidence-linked discovery. No third-party requests or search logging. */
(function(){
 const input=document.getElementById('cs-unified-search'),results=document.getElementById('cs-search-results');
 const status=document.getElementById('cs-search-status'),coverage=document.getElementById('cs-search-coverage');
 if(!input||!results||!status)return;
 let source=null;
 const normal=s=>String(s||'').toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[–—]/g,'-').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
 const synonyms={
  anxiety:['worry','fear','afraid','restless','trust'],
  anxious:['fear','worry','trust'],
  overwhelmed:['tired','exhausted','rest','pressure'],
  burnout:['tired','exhausted','rest'],
  perfectionism:['performance','enough','audition','worthy'],
  loneliness:['belonging','family','welcome'],
  lonely:['belonging','family','welcome'],
  shame:['worthy','grace','belonging'],
  grief:['lament','loss','sorrow','hope'],
  grieving:['lament','sorrow','hope'],
  boundaries:['no','limits','honesty','love'],
  procrastination:['begin','start','courage','practice'],
  courage:['brave','strength','try'],
  forgiveness:['mercy','grace','forgive'],
  identity:['belonging','chosen','beloved'],
  creativity:['sketch','art','making','wonder'],
  gratitude:['thanks','thankful','good','gift'],
  prayer:['pray','abba','father','listen'],
  hope:['waiting','light','strength']
 };
 const stop=new Set(['the','and','to','in','a','of','for','i','me','with','or','my','am','how','do','is','can','what']);
 function tokens(q){return normal(q).split(' ').filter(x=>x&&!stop.has(x)).slice(0,10)}
 function verseMatches(ref,query){
  if(!ref)return false;
  const r=normal(ref),v=normal(query);
  if(!v||!r)return false;
  if(r.includes(v))return true;
  const book=/^(.*)\s+(\d+)\s+(\d+)(?:\s+(\d+))?$/;
  const a=ref.match(/^\s*(.*?)\s+(\d+)\s*:\s*(\d+)\s*(?:[-–]\s*(\d+))?/);
  const b=query.match(/^\s*(.*?)\s+(\d+)\s*:\s*(\d+)/);
  return !!(a&&b&&normal(a[1])===normal(b[1])&&Number(a[2])===Number(b[2])&&Number(b[3])>=Number(a[3])&&Number(b[3])<=Number(a[4]||a[3]));
 }
 function weight(doc,query){
  const exact=tokens(query);if(!exact.length)return 0;
  const fields=[normal(doc.title),normal(doc.reference),normal(doc.description),normal(doc.tags),normal(doc.body)];
  let score=0,real=0;
  if(verseMatches(doc.reference,query))score+=35;
  for(const t of exact){
   if(fields[0].includes(t)){score+=12;real++;}
   if(fields[1].includes(t)){score+=16;real++;}
   if(fields[2].includes(t)){score+=6;real++;}
   if(fields[3].includes(t)){score+=4;real++;}
   if(fields[4].includes(t)){score+=2;real++;}
   if(!fields.some(v=>v.includes(t))){
    for(const alt of (synonyms[t]||[]))if(fields.some(v=>v.includes(alt))){score+=1;break;}
   }
  }
  if(fields[0].includes(normal(query)))score+=20;
  if(fields[4].includes(normal(query)))score+=8;
  return score>0?score+Math.min(9,real):0;
 }
 function resultText(doc,query){
  const s=doc.body||doc.description||'';
  const q=tokens(query);
  let idx=q.map(t=>normal(s).indexOf(t)).filter(n=>n>=0).sort((a,b)=>a-b)[0];
  if(idx===undefined)idx=0;
  // Normalized index approximates source position only; this is a supporting excerpt, not an exact highlight.
  return s.slice(Math.max(0,idx-95),Math.max(0,idx-95)+320).trim();
 }
 function draw(query){
  results.replaceChildren();
  if(!source){status.textContent='The library index is loading.';return;}
  const q=query.trim();
  if(!q){status.textContent='Search Bible verses, a question, a real-life concern, or a creative idea.';return;}
  const matches=source.records.map(doc=>({doc,score:weight(doc,q)})).filter(o=>o.score>0).sort((a,b)=>b.score-a.score||a.doc.title.localeCompare(b.doc.title));
  status.textContent=matches.length?matches.length+' matching resources found. Showing the 30 most relevant.':'No matches yet. Try a Bible book, a nearby word, or another question.';
  for(const {doc} of matches.slice(0,30)){
   const card=document.createElement('article');card.className='cs-search-result';
   const link=document.createElement('a');link.href=doc.url;link.className='cs-search-result-link';link.textContent=doc.title;
   const tag=document.createElement('span');tag.className='cs-search-type';tag.textContent=doc.type+(doc.page?' · page '+doc.page:'');
   const text=document.createElement('p');text.textContent=resultText(doc,q);
   card.append(tag,link,text);
   if(doc.reference){const r=document.createElement('small');r.textContent='Bible passage: '+doc.reference;card.append(r);}
   if(doc.indexCoverage==='excerpt'){const note=document.createElement('small');note.textContent='Page excerpt only; open the full PDF to read in context.';card.append(note);}
   results.append(card);
  }
 }
 let t=null;input.addEventListener('input',()=>{
  clearTimeout(t);t=setTimeout(()=>draw(input.value),125);
 });
 fetch('/unified-search-index.json',{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error('index unavailable');return r.json();}).then(data=>{
  if(!Array.isArray(data.records))throw Error('unexpected search format');
  source=data;
  const c=data.coverage||{};
  coverage.textContent='Search covers '+c.devotions+' Soul Snacks, '+c.guides+' free guides, '+c.teachings+' teaching selections, '+c.missions+' missions and '+c.pocketCards+' pocket invitations. '+c.pdfFilesFullyExtracted+' guides have complete PDF page text indexed; '+c.pdfFilesExcerptFallback+' use verified page excerpts.';
  draw(input.value);
 }).catch(()=>{
   status.textContent='Search is temporarily unavailable. The complete directory below still works.';
   coverage.textContent='The full site directory remains accessible without search.';
 });
})();
