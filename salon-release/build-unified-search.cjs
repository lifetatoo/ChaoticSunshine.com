// V4 unified discovery: original PDF bytes remain unchanged.
// pdftotext provides complete page content if available; excerpts are clearly labeled otherwise.
'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
module.exports=function buildUnifiedIndex(out){
 const root=path.resolve(__dirname,'../source');
 const guides=require('../source/content-library/products.json');
 const devotions=require('../source/devotions/devotions.json');
 const teachings=require('../source/teaching-illustrations.json').items;
 const quests=require('../source/side-quests.json');
 const sparks=require('../source/cabinet-original-sparks.json');
 const cards=require('../source/side-quest-field-cards.json');
 const records=[];
 const clean=t=>String(t||'').replace(/[\u0000-\u0008\u000b\u000e-\u001f]/g,' ').replace(/\s+/g,' ').trim();
 const push=o=>records.push(Object.fromEntries(Object.entries(o).map(([k,v])=>[k,typeof v==='string'?clean(v):v])));
 for(const d of devotions)push({id:d.slug,type:'Soul Snack',title:d.title,description:d.description||d.takeaway,reference:d.reading,tags:[d.topic,d.readerTopicLabel,d.movementName,...(d.readerTopics||[])].join(' '),body:(d.paragraphs||[]).join(' '),url:'/'+d.slug,format:'reading'});
 let pdfFull=0,pdfFallback=0,pdfPages=0;
 for(const g of guides){
  const first=g.files?.find(f=>f.edition==='color')||g.files?.[0];
  const base='/'+g.slug;
  push({id:'guide-'+g.slug,type:'Free guide',title:g.title,description:g.description||g.subtitle,tags:(g.readerTopics||[]).join(' '),body:g.guideResource?.sampleText||'',url:base,format:'PDF'});
  let pages=[],mode='excerpt';
  if(first?.localPath){
   const file=path.join(root,first.localPath);
   if(fs.existsSync(file)){
    try{
     const raw=execFileSync('pdftotext',['-enc','UTF-8','-layout',file,'-'],{maxBuffer:35*1024*1024,timeout:60000,stdio:['ignore','pipe','ignore']}).toString('utf8');
     const extracted=raw.split('\f').filter(p=>clean(p).length>30);
     if(extracted.length>=Math.max(1,Math.round((first.pages||5)*.65))){
      pages=extracted.map(clean);mode='full-text';pdfFull++;
     }
    }catch(err){/* Portable fallback: never claim full-text without extraction. */}
   }
  }
  if(mode!=='full-text'){
   pages=(g.guideResource?.pageHeadings||[]).map(clean).filter(Boolean);
   pdfFallback++;
  }
  pages.forEach((txt,i)=>{if(!txt)return;pdfPages++;push({id:'guide-page-'+g.slug+'-'+(i+1),type:'Guide page',title:g.title+' · page '+(i+1),description:mode==='full-text'?'Find this passage in the complete guide.':'Extracted page preview; full PDF text is not indexed for this edition.',tags:(g.readerTopics||[]).join(' '),body:txt,url:base,page:i+1,format:'PDF',indexCoverage:mode});});
 }
 for(const t of teachings)push({id:'teaching-'+t.slug,type:'Teaching sheet',title:t.title||t.name,description:t.description||'',reference:t.reference||t.scripture||'',tags:(t.keywords||[]).join(' '),body:[t.summary,t.outline,t.keyTakeaway].filter(Boolean).join(' '),url:'/teaching-'+t.slug,format:'teaching'});
 for(const q of quests)push({id:'mission-'+q.id,type:'Side Quest mission',title:q.title,description:q.steps||'',tags:q.category,body:[q.steps,q.prompt].filter(Boolean).join(' '),url:'/side-quests',format:'activity'});
 for(const q of cards)push({id:'pocket-'+q.id,type:'Side Quest pocket card',title:q.title,description:q.action,tags:q.category,body:q.reflection,url:'/side-quests',format:'activity'});
 for(const s of sparks)push({id:s.id,type:'Studio encouragement',title:s.title,description:s.message,tags:'creative courage curiosity encouragement',body:s.prompt,url:'/daily-cabinet',format:'card'});
 const result={version:4,generatedFrom:'V4 original manuscripts and approved PDF files',coverage:{devotions:devotions.length,guides:guides.length,teachings:teachings.length,missions:quests.length,pocketCards:cards.length,studioSparks:sparks.length,pdfFilesFullyExtracted:pdfFull,pdfFilesExcerptFallback:pdfFallback,pdfIndexedPages:pdfPages},records};
 fs.writeFileSync(path.join(out,'unified-search-index.json'),JSON.stringify(result));
 fs.copyFileSync(path.join(__dirname,'unified-search.js'),path.join(out,'unified-search.js'));
 fs.copyFileSync(path.join(__dirname,'unified-search.css'),path.join(out,'unified-search.css'));
 console.log('V4_SEARCH_INDEX',JSON.stringify({recordCount:records.length,...result.coverage}));
};
