const fs=require('fs'),p=require('path'),products=require('./products.json');
if(new Set(products.map(x=>x.slug)).size!==products.length)throw Error('Duplicate product slug');
for(const x of products){if(!x.slug||!x.title||!x.coverAsset||!x.guideResource)throw Error('Incomplete product '+x.slug);for(const f of x.files){if(!fs.existsSync(p.join(__dirname,'..',f.localPath)))throw Error('Missing file '+f.localPath);}}
exports.products=products;
exports.guides=products.filter(x=>x.status!=='archived').map(x=>[x.slug,x.title,x.description,x.cta,x.coverCode,x.subtitle]);
exports.resources=Object.fromEntries(products.filter(x=>x.status!=='archived').map(x=>[x.slug,{...x.guideResource,downloads:x.files.map(f=>({file:f.filename,label:f.edition==='color'?'Color PDF':'Print-friendly PDF',pages:f.pages}))}]));
exports.sync=()=>fs.writeFileSync(p.join(__dirname,'../guide-resources.json'),JSON.stringify(exports.resources,null,2));
