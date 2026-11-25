/* Public resource sharing uses only existing original cover and social assets. No private draft is sent. */
const csV4PublicPaths=CS_V4_PUBLIC_SHARE_SLUGS;
function csV4ShareTools(){
 const main=document.querySelector('main#main');
 if(!main)return;
 main.querySelector('#v4-sharing')?.remove();
 const slug=(location.pathname.split('/').pop()||'index').replace(/\.html$/,'');
 if(!csV4PublicPaths.includes(slug))return;
 const asset=CS_V4_SOCIAL_CARDS[slug];
 const title=(document.querySelector('h1')?.textContent||document.title||'Chaotic Sunshine').trim().replace(/\s+/g,' ');
 const canonical='https://chaoticsunshine.com/'+(slug==='index'?'':slug);
 const preview=main.querySelector('img[src*="cover"]')||main.querySelector('img[src*="product-"]');
 const media=preview?.getAttribute('src')
   ?new URL(preview.getAttribute('src'),location.href).href
   :asset?.file?'https://chaoticsunshine.com/assets/'+asset.file:'';
 const section=document.createElement('section');
 section.className='v4-public-sharing';
 section.id='v4-sharing';
 section.setAttribute('aria-label','Share this public resource');
 section.innerHTML='<div class="wrap v4-sharing-wrap"><div class="v4-share-copy"><span class="eyebrow">PASS THE GOOD STUFF ALONG</span><h2>A little sunshine travels well.</h2><p>Share this public reading or resource. Your private notes and journal drafts never come along.</p></div><div class="v4-share-actions"></div><p class="v4-share-status" role="status"></p></div>';
 const panel=section.querySelector('.v4-share-actions');
 function link(label,href){
   const a=document.createElement('a');a.className='v4-share-link';a.textContent=label;
   a.href=href;panel.append(a);return a;
 }
 const text=title+' — Chaotic Sunshine\n'+canonical;
 link('Email this page ✉','mailto:?subject='+encodeURIComponent(title+' · Chaotic Sunshine')+'&body='+encodeURIComponent(text));
 link('Text this page ↗','sms:?&body='+encodeURIComponent(text));
 if(media)link('Pin this artwork ✦','https://www.pinterest.com/pin/create/button/?url='+encodeURIComponent(canonical)+'&media='+encodeURIComponent(media)+'&description='+encodeURIComponent(title+' · Chaotic Sunshine'));
 const copy=document.createElement('button');copy.type='button';copy.className='v4-share-link';copy.textContent='Copy link ⧉';
 const status=section.querySelector('.v4-share-status');
 copy.onclick=async()=>{
   try{await navigator.clipboard.writeText(canonical);status.textContent='Copied the public page link.';}
   catch{status.textContent='Copy the address from your browser: '+canonical;}
 };
 panel.append(copy);
 if(typeof navigator.share==='function'){
   const native=document.createElement('button');native.type='button';native.className='v4-share-link';
   native.textContent='More sharing options ↗';
   native.onclick=()=>navigator.share({title,text,url:canonical}).catch(()=>{});
   panel.append(native);
 }
 main.append(section);
}
// Run on the first page and any client-side route changes, including legacy guide pages.
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',csV4ShareTools,{once:true});
else csV4ShareTools();
window.addEventListener('hashchange',()=>{queueMicrotask(csV4ShareTools);});
