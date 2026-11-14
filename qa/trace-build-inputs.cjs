const fs=require('fs'),path=require('path');
const source=path.resolve(__dirname,'../source'),inputs=new Set(),read=fs.readFileSync;
fs.readFileSync=function(file,...args){if(typeof file==='string'){const absolute=path.resolve(file);if(absolute.startsWith(source+path.sep))inputs.add(absolute);}return read.call(this,file,...args);};
process.on('exit',()=>fs.writeFileSync(path.join(__dirname,'build-input-trace.json'),JSON.stringify([...inputs].sort(),null,2)));
