'use strict';
// V4 hard gate: original asset binaries must remain byte-for-byte identical to the approved baseline.
// Git blob SHA (not SHA256) is compared via git hash-object so no asset gets regenerated on a layout fix.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),record=require('./V4-PROTECTED-ASSETS.json');
const failures=[],counts={};
for(const item of record.items){
 const pathname=path.join(root,item.path);
 if(!fs.existsSync(pathname)){failures.push({path:item.path,issue:'missing protected original'});continue;}
 const actual=execFileSync('git',['hash-object','--',item.path],{cwd:root,encoding:'utf8'}).trim();
 if(actual!==item.gitBlobSha)failures.push({path:item.path,issue:'protected original changed',expected:item.gitBlobSha,actual});
 counts[item.classification]=(counts[item.classification]||0)+1;
}
assert.ok(record.items.length>=50,'V4 register has unexpectedly shrunk');
assert.ok(counts['guide-pdf']>=20,'original free guide editions must remain');
assert.ok(counts.logo>=2,'original logo variants missing');
if(failures.length){console.error('V4_PROTECTED_ASSET_FAILURES',JSON.stringify(failures,null,2));process.exitCode=1;}
else console.log('V4_PROTECTED_ASSETS_PASS',JSON.stringify({protected:record.items.length,counts,pending:record.pending.map(x=>x.item)}));
