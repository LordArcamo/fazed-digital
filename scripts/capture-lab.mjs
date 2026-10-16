import puppeteer from '/Users/lordarcamo/Projects/fazed-3d-sites/clients/fazed-digital/site/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
const OUT='/Users/lordarcamo/Projects/fazed-3d-sites/clients/fazed-digital/media/lab-design/captures';
const sites=[['01','https://fazed-nocturne-espresso.vercel.app'],['02','https://fazed-offcut-frame7.vercel.app'],['03','https://fazed-maison-ossel.vercel.app'],['04','https://fazed-halde-o1.vercel.app'],['fd-home','https://www.fazeddigital.com/'],['fd-work','https://www.fazeddigital.com/work'],['fd-about','https://www.fazeddigital.com/about']];
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
for(const [id,u] of sites){for(const [vw,vh,s] of [[1440,900,'d'],[390,844,'m']]){
 const p=await b.newPage();await p.setViewport({width:vw,height:vh,deviceScaleFactor:1,isMobile:s==='m',hasTouch:s==='m'});
 try{await p.goto(u,{waitUntil:'networkidle2',timeout:45000});}catch(e){console.log('timeout',id)}
 await new Promise(r=>setTimeout(r,6000));
 await p.screenshot({path:`${OUT}/${id}-${s}.png`});await p.close();console.log(id,s);}}
await b.close();
