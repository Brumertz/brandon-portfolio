import puppeteer from "puppeteer-core";
import fs from "node:fs";
const EDGE = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe","C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"].find(p=>fs.existsSync(p));
const b = await puppeteer.launch({executablePath:EDGE,headless:true,args:["--no-sandbox","--use-gl=swiftshader","--enable-unsafe-swiftshader"]});
const p = await b.newPage();
const logs=[]; p.on("console",m=>logs.push(m.type()+": "+m.text()));
await p.setContent("<body style='margin:0'></body>");
const res = await p.evaluate(async ()=>{
  const out=[]; const lost=[];
  for(let i=0;i<24;i++){
    const c=document.createElement("canvas"); c.width=64;c.height=64; document.body.appendChild(c);
    const gl=c.getContext("webgl2")||c.getContext("webgl");
    if(!gl){ out.push(i+":NULL"); continue; }
    gl.clearColor(1,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT);
    out.push(i+":ok");
    await new Promise(r=>setTimeout(r,30));
    if(gl.isContextLost()) lost.push(i);
  }
  return {attempted:24, nullCount:out.filter(x=>x.endsWith("NULL")).length, lost, firstNull: out.find(x=>x.endsWith("NULL"))};
});
console.log(JSON.stringify(res));
console.log("context logs:", logs.filter(l=>/context|WebGL/i.test(l)).slice(0,6));
await b.close();
