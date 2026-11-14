const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function config(cfg,mode){const x=cfg.analytics||{};return mode==='site'&&x.enabled===true&&/^G-[A-Z0-9]{6,20}$/.test(x.measurementId||'')?{id:x.measurementId,hosts:(x.allowedHostnames||[]).filter(x=>/^[a-z0-9.-]+$/.test(x))}:null;}
exports.controls=(cfg,mode)=>config(cfg,mode)?`<button type="button" class="analytics-choice-button" data-analytics-settings hidden>Analytics choices</button><aside class="analytics-choice-panel" data-analytics-panel aria-label="Optional website analytics" hidden><h2>A little help making this place better?</h2><p>Optional Google Analytics counts visits, reading clicks and download clicks. You can use every reading and guide without it. We don’t send your journal notes, feedback text or email fields.</p><details><summary>What would be counted?</summary><p>Google receives visit and device information, the page address without its query string, and a few button actions. Analytics uses cookies if you allow it. Advertising features are switched off. Download counts mean clicks, not proof that a file finished downloading.</p></details><div><button type="button" data-analytics-allow>Allow analytics</button><button type="button" data-analytics-deny>Only essential</button></div><p role="status" data-analytics-status></p></aside>`:'';
function runtime(cfg){
 if(location.protocol!=='https:'||!cfg.hosts.includes(location.hostname))return;
 const panel=document.querySelector('[data-analytics-panel]'),settings=document.querySelector('[data-analytics-settings]');if(!panel||!settings)return;
 const key='cs-analytics-choice-v1',disabled='ga-disable-'+cfg.id;let allowed=false,loaded=false;
 window[disabled]=true;settings.hidden=false;
 function preference(){try{return localStorage.getItem(key)||'';}catch(e){return '';}}
 function remember(value){try{localStorage.setItem(key,value);}catch(e){}}
 function event(name,params={}){if(allowed&&typeof window.gtag==='function')window.gtag('event',name,{...params,transport_type:'beacon'});}
 function start(){
  if(allowed)return;allowed=true;window[disabled]=false;
  if(loaded)return;loaded=true;
  window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('js',new Date());
  let referrer='';try{if(document.referrer)referrer=new URL(document.referrer).origin;}catch(e){}
  window.gtag('config',cfg.id,{send_page_view:true,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin+location.pathname,page_referrer:referrer});
  const tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(cfg.id);tag.dataset.csGoogleTag='true';document.head.append(tag);
 }
 function clearCookies(){document.cookie.split(';').map(x=>x.trim().split('=')[0]).filter(x=>/^_ga(?:_|$)/.test(x)).forEach(name=>{document.cookie=name+'=; Max-Age=0; path=/';[location.hostname,...cfg.hosts].forEach(domain=>{document.cookie=name+'=; Max-Age=0; path=/; domain='+domain;document.cookie=name+'=; Max-Age=0; path=/; domain=.'+domain;});});}
 function deny(){allowed=false;window[disabled]=true;remember('denied');clearCookies();panel.hidden=true;}
 const browserDeclines=navigator.globalPrivacyControl===true||navigator.doNotTrack==='1';
 panel.querySelector('[data-analytics-allow]').addEventListener('click',()=>{if(browserDeclines){panel.querySelector('[data-analytics-status]').textContent='Your browser asks us not to track. We’re keeping analytics off.';return;}remember('allowed');start();panel.hidden=true;});
 panel.querySelector('[data-analytics-deny]').addEventListener('click',deny);
 settings.addEventListener('click',()=>{panel.hidden=!panel.hidden;if(!panel.hidden)panel.querySelector('[data-analytics-allow]').focus();});
 panel.addEventListener('keydown',e=>{if(e.key==='Escape'){panel.hidden=true;settings.focus();}});
 window.addEventListener('storage',e=>{if(e.key!==key)return;if(e.newValue==='allowed'&&!browserDeclines)start();else{allowed=false;window[disabled]=true;clearCookies();}});
 if(browserDeclines){remember('denied');clearCookies();}else if(preference()==='allowed')start();else if(preference()!=='denied')panel.hidden=false;
 document.addEventListener('click',e=>{
  const el=e.target.closest('a,button,summary');if(!el||!allowed)return;
  if(el.matches('[data-save-reading]'))event('save_toggle');
  if(el.matches('[data-copy-link],[data-native-share],[data-share-email],[data-card-email]'))event('share_click',{method:el.matches('[data-copy-link]')?'copy':el.matches('[data-native-share]')?'device':'email'});
  if(!el.matches('a[href]'))return;
  let url;try{url=new URL(el.href,location.href);}catch(err){return;}
  if(!['http:','https:'].includes(url.protocol))return;
  if(el.matches('[data-journal-open]'))event('journal_open',{reading_length:new URLSearchParams(url.search).get('pace')||'any'});
  if(el.matches('[data-journal-turn]'))event('journal_turn',{direction:el.dataset.journalTurn});
  const file=url.pathname.match(/\.(pdf|png|webp|jpe?g|zip)$/i);
  if(file){event('download_click',{file_type:file[1].toLowerCase(),resource_type:url.pathname.includes('/guides/')?'guide':url.pathname.includes('22-teaching-illustrations')?'teaching':'image'});return;}
  if(/\/soul-snack-\d+(?:\.html)?$/.test(url.pathname))event('read_devotion');
  else if(url.origin===location.origin&&/\/(fully-family|before-the-first-mountain|the-daughter-who-stayed|beloved-first|heir-not-hired|he-sings-over-you|the-father-who-runs|the-road-out-of-moab|seconds-please|advent|table-talks-guide)(?:\.html)?$/.test(url.pathname))event('open_guide');
  else if(/(^|\.)gumroad\.com$/.test(url.hostname))event('guide_delivery_click');
 });
 document.addEventListener('toggle',e=>{if(!allowed||!e.target.open)return;if(e.target.matches('.journal-making'))event('creative_exercise_open');if(e.target.matches('[data-quest-card],.journal-joy-mission details'))event('side_quest_open');},true);
 document.addEventListener('submit',e=>{const form=e.target;if(!e.defaultPrevented&&form.matches('form[data-kit-form]')&&!form.querySelector('[data-kit-hp]')?.value&&/^https:\/\/app\.kit\.com\/forms\/\d+\/subscriptions$/.test(form.action))event(form.dataset.kitForm==='newsletter'?'newsletter_submit':'guide_signup_submit');});
}
exports.script=(cfg,mode)=>{const x=config(cfg,mode);return x?`<script data-cs-measurement>(${runtime.toString()})(${JSON.stringify(x).replaceAll('<','\\u003c')});</script>`:'';};
exports.css=`.cs .analytics-choice-button{display:block;margin:15px auto;background:#FFFCF6;color:#1F3A8A;border:0;padding:12px 18px;min-height:44px;font:700 14px/1.4 Jost,Arial,sans-serif;cursor:pointer}.cs .analytics-choice-button[hidden],.cs .analytics-choice-panel[hidden]{display:none}.cs .analytics-choice-panel{position:fixed;bottom:16px;right:16px;z-index:1000;width:min(520px,calc(100vw - 32px));max-height:85vh;overflow:auto;background:#FFFCF6;color:#231D32;padding:25px;border:4px solid #5B3A8C;box-shadow:7px 7px 0 #E0A526;text-align:left;box-sizing:border-box}.cs .analytics-choice-panel h2{font-size:27px;color:#5B3A8C;margin:0 0 12px}.cs .analytics-choice-panel p,.cs .analytics-choice-panel summary{font:15px/1.55 Jost,Arial,sans-serif;margin:0 0 15px;color:#231D32}.cs .analytics-choice-panel details{padding:12px;border:1px dashed #5B3A8C}.cs .analytics-choice-panel details p{margin:15px 0 0}.cs .analytics-choice-panel summary{margin:0;cursor:pointer}.cs .analytics-choice-panel>div{display:flex;gap:12px;flex-wrap:wrap;margin-top:18px}.cs .analytics-choice-panel button{background:#1F3A8A;color:#FFFCF6;border:0;padding:12px 18px;min-height:44px;font:700 14px/1.4 Jost,Arial,sans-serif;cursor:pointer}.cs .analytics-choice-panel button:last-child{background:#5B3A8C}.cs .analytics-choice-panel button:focus-visible,.cs .analytics-choice-button:focus-visible{outline:3px solid #E0A526;outline-offset:4px}`;
