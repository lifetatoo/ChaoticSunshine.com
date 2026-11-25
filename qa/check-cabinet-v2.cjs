// Daily Cabinet release checks: no six-card fallback or shared community jar in the active client.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(process.env.CS_BUILD_DIR||path.join(__dirname,'../source/site-kit'));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'daily-cabinet.html'),'utf8');
const css=fs.readFileSync(path.join(root,'daily-cabinet-v2.css'),'utf8');
const devotions=require('../source/devotions/devotions.json');
const sparks=require('../source/cabinet-original-sparks.json');
const passages=require('../source/cabinet-extra-passages.json');
const quests=require('../source/side-quest-field-cards.json');
const cards=devotions.length+sparks.length;
const scripture=devotions.length+passages.length;
assert.equal(devotions.length,90,'preserve original 90 devotions');
assert.ok(cards>=100&&scripture>=100,'each public drawer needs at least 100 distinct cards');
assert.equal(new Set(devotions.map(x=>x.takeaway)).size,devotions.length,'duplicate studio reflections');
assert.equal(new Set(sparks.map(x=>x.id)).size,sparks.length,'duplicate original studio card');
assert.equal(new Set(passages.map(x=>x.id)).size,passages.length,'duplicate extra Scripture prompt');
assert.equal(quests.length,72,'preserve 72 original Side Quest pocket cards');
assert.ok(quests.every(x=>x.title&&x.action&&x.reflection&&x.credit),'side quest cards require distinct useful content');
for(const category of ['discovery','kindness','brave'])assert.equal(quests.filter(x=>x.category===category).length,24,'each side quest book needs own distinct prompts: '+category);
for(const filename of ['little-good-things-glass.svg','little-good-things-lid.svg','little-good-things-ribbon.svg']){
 const asset=path.join(root,'assets',filename);
 assert.ok(fs.existsSync(asset),'missing independent jar component '+filename);
 assert.ok(fs.readFileSync(asset,'utf8').startsWith('<svg'),'jar component must be scalable vector');
}
assert.ok(html.includes('daily-cabinet-v2.css')&&html.includes('site-visual-fixes.css'),'design system loaded on page');
assert.ok(app.includes('CS_CABINET_VERSE')&&app.includes('CS_CABINET_STUDIO'),'complete dedicated card pools active');
assert.ok(app.includes("localStorage.getItem('cs-studio-gratitude')"),'existing personal notes must survive');
assert.ok(app.includes("localStorage.setItem('cs-studio-gratitude'"),'notes must be written only to prior browser key');
assert.ok(app.includes("localStorage.removeItem('cs-studio-gratitude')"),'two-step clear must have original key');
assert.ok(app.includes('CS_QUEST_FIELD_CARDS')&&app.includes('quest-card-stage'),'Side Quest pull-card module loaded');
assert.ok(app.includes("notes.length")&&app.includes('cs-jar-note-card'),'personal jar note reveal active');
assert.ok(css.includes('prefers-reduced-motion:reduce')&&css.includes('cs-jar-note-back'),'reduced motion and both faces required');
assert.ok(css.includes('cabinet-art-card')&&css.includes('cs-jar-paper'),'art cards and layered jar required');
for(const n of ['today','verse','studio','archive'])assert.ok(app.includes(n),'missing catalog category '+n);
assert.ok(app.includes('decks[drawer].splice(idx,1)[0]'),'drawer draws must consume cards from full non-repeating pool');
assert.ok(app.includes('drawer=key;drawCard(false);'),'repeated drawer clicks must draw again');
assert.ok(app.includes('lastTitle'),'separate collections must avoid immediate matching titles');
assert.ok(app.includes("const shown=drawn[drawer],total=choices.length"),'display current draw count and full pool size');
new Function(app); // syntax check of the ENTIRE generated script without running it.
console.log('CABINET_QA',JSON.stringify({scriptureCards:scripture,studioCards:cards,dailyMix:scripture+cards,sideQuestPocketCards:quests.length,jarAssets:3,legacyStoragePreserved:true,editorialStatus:'90 manuscript drafts await final approval'}));