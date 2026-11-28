// Compact phone tabs; matches the desktop menu.
(function(){
 if(document.querySelector('.phone-tab-bar'))return;
 const icon=p=>`<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
 const read=icon('<path d="M3 4h6a4 4 0 0 1 3 2 4 4 0 0 1 3-2h6v15h-6a4 4 0 0 0-3 2 4 4 0 0 0-3-2H3zM12 6v15"/>'),library=icon('<path d="M4 3h4v18H4zM10 3h4v18h-4zM16 4l4-1 4 17-4 1z"/>'),quest=icon('<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6z"/>'),mail=icon('<rect x="2" y="5" width="20" height="15" rx="2"/><path d="m3 6 9 7 9-7"/>');
 const current=location.pathname.split('/').pop().replace(/\.html$/,'')||'index';
 const active=f=>f.replace(/\.html$/,'')===current?' aria-current="page"':'';
 const bar=document.createElement('nav');bar.className='phone-tab-bar';bar.setAttribute('aria-label','Phone navigation');bar.innerHTML=[['soul-snacks.html','Read',read],['freebies.html','Free Library',library],['subscribe.html','Sunshine Mail',mail],['site-map.html','Explore',quest]].map(([url,label,svg])=>`<a href="${url}"${active(url)}>${svg}<span>${label}</span></a>`).join('');
 document.body.append(bar);
})();
