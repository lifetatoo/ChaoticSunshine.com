(function(){
 'use strict';
 const root=document.querySelector('.cs');if(!root)return;
 function preference(key){try{return localStorage.getItem(key)==='true';}catch(e){return false;}}
 function setPreference(key,value){try{localStorage.setItem(key,String(value));}catch(e){}}
 for(const [attr,cls,key] of [['data-reading-larger','refresh-large','cs-reading-large'],['data-reading-plain','refresh-plain','cs-reading-plain']]){
  const on=preference(key);root.classList.toggle(cls,on);
  document.querySelectorAll('['+attr+']').forEach(button=>{button.setAttribute('aria-pressed',String(on));button.addEventListener('click',()=>{const active=!root.classList.contains(cls);root.classList.toggle(cls,active);setPreference(key,active);button.setAttribute('aria-pressed',String(active));});});
 }
 document.querySelectorAll('[data-reading-print]').forEach(button=>button.addEventListener('click',()=>window.print()));
 document.querySelectorAll('.refresh-reflection').forEach(box=>{
  const field=box.querySelector('textarea'),status=box.querySelector('[role=status]');
  box.querySelector('[data-copy-reflection]').addEventListener('click',async()=>{if(!field.value.trim()){status.textContent='Write a sentence first, then copy it to keep.';return;}try{await navigator.clipboard.writeText(field.value);status.textContent='Copied. Paste it somewhere you want to keep it.';}catch(e){field.focus();field.select();status.textContent='Your words are selected. Use your device’s Copy command.';}});
  box.querySelector('[data-clear-reflection]').addEventListener('click',()=>{field.value='';status.textContent='Cleared. Nothing was sent or saved.';field.focus();});
 });
 const library=document.querySelector('[data-little-library]');
 if(library){
  const toggle=library.querySelector('[data-library-door-toggle]'),doors=[...library.querySelectorAll('[data-clickable-door]')],handles=[...library.querySelectorAll('[data-open-door-handle]')];
  function sync(){const open=toggle.getAttribute('aria-expanded')==='true';doors.forEach(d=>{d.tabIndex=open?-1:0;d.setAttribute('aria-hidden',String(open));d.setAttribute('aria-expanded',String(open));});handles.forEach(h=>{h.hidden=!open;h.setAttribute('aria-expanded',String(open));});}
  function change(side){toggle.click();sync();const open=toggle.getAttribute('aria-expanded')==='true';(open?handles.find(h=>h.dataset.openDoorHandle===side):doors.find(d=>d.dataset.clickableDoor===side)).focus({preventScroll:true});}
  doors.forEach(d=>d.addEventListener('click',()=>change(d.dataset.clickableDoor)));handles.forEach(h=>h.addEventListener('click',()=>change(h.dataset.openDoorHandle)));new MutationObserver(sync).observe(toggle,{attributes:true,attributeFilter:['aria-expanded']});sync();
  const search=library.querySelector('[data-library-search]');
  function highlight(){const words=search.value.trim().split(/\s+/).filter(Boolean);library.querySelectorAll('[data-search-hit]').forEach(hit=>{const text=hit.textContent;hit.replaceChildren();if(!words.length){hit.textContent=text;return;}const safe=words.map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));const re=new RegExp('('+safe.join('|')+')','ig');let last=0;for(const m of text.matchAll(re)){hit.append(document.createTextNode(text.slice(last,m.index)));const mark=document.createElement('mark');mark.textContent=m[0];hit.append(mark);last=m.index+m[0].length;}hit.append(document.createTextNode(text.slice(last)));});}
  search.addEventListener('input',highlight);
 }
})();
