const fs=require('fs'),path=require('path'),zlib=require('zlib')
const D=path.join(__dirname,'..','assets','tabbar'); fs.mkdirSync(D,{recursive:true})
function crc(b){let c=0xFFFFFFFF;for(let i=0;i<b.length;i++){c^=b[i];for(let j=0;j<8;j++)c=(c>>>1)^(c&1?0xEDB88320:0)}return(c^0xFFFFFFFF)>>>0}
function mk(t,d){const l=Buffer.alloc(4);l.writeUInt32BE(d.length,0);const tp=Buffer.from(t,'ascii');const cr=Buffer.alloc(4);cr.writeUInt32BE(crc(Buffer.concat([tp,d])),0);return Buffer.concat([l,tp,d,cr])}
function png(w,h,r,g,b){const p=[];for(let y=0;y<h;y++){p.push(0);for(let x=0;x<w;x++){Math.sqrt((x-32)**2+(y-32)**2)<=28?p.push(r,g,b):p.push(255,255,255)}}
return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),mk('IHDR',Buffer.from([0,0,0,w,0,0,0,h,8,2,0,0,0])),mk('IDAT',zlib.deflateSync(Buffer.from(p))),mk('IEND',Buffer.alloc(0))])}
const I=[{n:'home',c:'999999',a:'1890ff'},{n:'discover',c:'999999',a:'1890ff'},{n:'mine',c:'999999',a:'1890ff'}]
for(const{n,c,a}of I){const cr=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];const[r1,g1,b1]=cr(c),[r2,g2,b2]=cr(a)
fs.writeFileSync(path.join(D,`${n}.png`),png(81,81,r1,g1,b1));fs.writeFileSync(path.join(D,`${n}-active.png`),png(81,81,r2,g2,b2));console.log(`✓ ${n}`)}
