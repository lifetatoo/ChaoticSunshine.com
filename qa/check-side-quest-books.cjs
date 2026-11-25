// Side Quest Society book-stack release guard.
// Run after npm run build. Maintains 24 usable missions and four real textured book assets.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../source/site-kit');
const html=fs.readFileSync(path.join(root,'side-quests.html'),'utf8');
const css=fs.readFileSync(path.join(root,'side-quest-books.css'),'utf8');
const data=require('../source/side-quests.json');
const names=['all','discovery','kindness','brave'];
assert.equal(data.length,24,'24 original missions preserved');
assert.equal(new Set(data.map(x=>x.id)).size,24,'no repeated mission IDs');
assert.equal((html.match(/data-quest-group="/g)||[]).length,4,'four mission-category buttons remain');
assert.ok(html.includes('class="cabinet-drawers"'),'original accessible button group remains');
assert.ok(html.includes('side-quest-books.css'),'new textured book style is served');
assert.ok(html.includes('id="mission"'),'mission page remains interactive');
assert.ok(html.includes('id="quest-surprise"'),'surprise action remains');
assert.ok(html.includes('id="quest-next"')&&html.includes('id="quest-back"'),'next/previous remain');
assert.equal((html.match(/<article id="quest-/g)||[]).length,24,'full mission index preserved');
for(const name of names){
 const f=path.join(root,'assets','side-quest-book-'+name+'.svg');
 assert.ok(fs.existsSync(f),'missing standalone book image: '+name);
 const asset=fs.readFileSync(f,'utf8');
 assert.ok(asset.startsWith('<svg')&&asset.includes('viewBox="0 0 1200 200"'),'invalid vector asset: '+name);
 assert.ok(asset.includes('<feTurbulence'),'leather texture grain missing: '+name);
 assert.ok(asset.includes('id="foil"')&&asset.includes('id="leather"'),'gilded/colored layering missing: '+name);
 assert.ok(css.includes('assets/side-quest-book-'+name+'.svg'),'book image not used: '+name);
}
assert.ok(css.includes('prefers-reduced-motion:reduce'),'reduced-motion override required');
assert.ok(css.includes(':focus-visible'),'keyboard focus needs contrast');
assert.ok(css.includes('@media(max-width:620px)'),'mobile reading state required');
console.log('SIDE_QUEST_BOOKS_QA',JSON.stringify({missionCount:data.length,bookAssets:4,buttons:4,missionIndex:24,focus:"yes",mobile:"yes",reducedMotion:"yes"}));
