// Shared navigation for complete, server-readable manuscript and resource pages.
document.querySelector('.skip')?.addEventListener('click',e=>{e.preventDefault();const m=document.querySelector('#main');m.focus({preventScroll:true});m.scrollIntoView({block:'start',behavior:'instant'});});
const current=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.permanent-menu a').forEach(a=>{if(a.getAttribute('href')===current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
