const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
async function readBody(request){const reader=request.body?.getReader();if(!reader)throw Error('empty');let bytes=0,parts=[];while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>8192){await reader.cancel();throw Error('large');}parts.push(value);}const all=new Uint8Array(bytes);let offset=0;for(const chunk of parts){all.set(chunk,offset);offset+=chunk.length;}return JSON.parse(new TextDecoder().decode(all));}
export async function receiveFeedback(request,env){
 if(request.method!=='POST')return json({ok:false,error:'Use the letterbox form.'},405);
 const origin=request.headers.get('Origin'),host=new URL(request.url);if(origin&&origin!==host.origin)return json({ok:false,error:'Please use the form on this website.'},403);
 if(!request.headers.get('Content-Type')?.includes('application/json'))return json({ok:false,error:'Invalid note format.'},415);
 if(!env.FEEDBACK_DB||!env.TURNSTILE_SECRET)return json({ok:false,error:'The letterbox is not connected yet.'},503);
 let body;try{body=await readBody(request);}catch(e){return json({ok:false,error:e.message==='large'?'This note is too long.':'We could not read this note.'},e.message==='large'?413:400);}
 if(!body||typeof body!=='object'||Array.isArray(body))return json({ok:false,error:'Invalid note format.'},400);
 const text=(key,max)=>typeof body[key]==='string'?body[key].trim().slice(0,max):'';
 if(text('website',100))return json({ok:false,error:'We could not accept this note.'},400);
 if(typeof body.message!=='string'||body.message.trim().length<3||body.message.length>2000)return json({ok:false,error:'Please write a note between 3 and 2,000 characters.'},400);
 const email=text('email',254);if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return json({ok:false,error:'Please check the reply email address.'},400);
 const page=text('page',180);if(!/^\/[a-zA-Z0-9/_-]*$/.test(page))return json({ok:false,error:'Please send from a page on this website.'},400);
 const category=text('category',30);if(!['learning','suggestion','question','correction','other'].includes(category))return json({ok:false,error:'Please choose a kind of note.'},400);
 const token=text('token',2048);if(!token)return json({ok:false,error:'Please complete the letterbox check.'},400);
 try{
  const checked=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET,response:token}),signal:AbortSignal.timeout(8000)});
  const valid=await checked.json();if(!valid.success||valid.action!=='feedback'||valid.hostname!==host.hostname)return json({ok:false,error:'The letterbox check expired. Please try again.'},403);
  const now=Date.now(),ip=request.headers.get('CF-Connecting-IP')||'unknown';const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(env.TURNSTILE_SECRET+'|'+ip+'|'+Math.floor(now/600000)));const bucket=Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');
  const rate=await env.FEEDBACK_DB.prepare('INSERT INTO feedback_rate(bucket,hits,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET hits=hits+1 RETURNING hits').bind(bucket,now+1200000).first();
  await env.FEEDBACK_DB.prepare('DELETE FROM feedback_rate WHERE expires_at < ?').bind(now).run();
  if(rate.hits>5)return json({ok:false,error:'Please wait a little before sending another note.'},429);
  const id=/^[a-f0-9-]{36}$/i.test(text('requestId',40))?text('requestId',40):crypto.randomUUID();
  await env.FEEDBACK_DB.prepare('INSERT OR IGNORE INTO feedback(id,created_at,page_path,verse,category,name,email,message,status) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,new Date().toISOString(),page,text('verse',160),category,text('name',80),email,body.message.trim(),'new').run();
  return json({ok:true,id});
 }catch(e){return json({ok:false,error:'The letterbox could not receive your note just now.'},503);}
}
export default {async fetch(request,env){if(new URL(request.url).pathname==='/api/feedback')return receiveFeedback(request,env);return env.ASSETS.fetch(request);}};
