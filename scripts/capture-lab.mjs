// Fresh plate captures of the shipped lab sites (README "Plates"). `node scripts/capture-lab.mjs 02` re-shoots one id.
// Live clocks are neutralised before the shot (#02 OFFCUT's raffle countdown would freeze into the plate and read as
// a live drop that never ticks), so a plate never dates itself. Layout is kept: visibility only, no reflow.
import puppeteer from '/Users/lordarcamo/Projects/fazed-3d-sites/clients/fazed-digital/site/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
const OUT='/Users/lordarcamo/Projects/fazed-3d-sites/clients/fazed-digital/media/lab-design/captures';
const sites=[['01','https://fazed-nocturne-espresso.vercel.app'],['02','https://fazed-offcut-frame7.vercel.app'],['03','https://fazed-maison-ossel.vercel.app'],['04','https://fazed-halde-o1.vercel.app'],['fd-home','https://www.fazeddigital.com/'],['fd-work','https://www.fazeddigital.com/work'],['fd-about','https://www.fazeddigital.com/about']];
// per-site: selectors hidden before the shot
const hide={'02':['[data-cd]','[data-cd-label]','[data-cd-short]']};
const only=process.argv.slice(2);
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
for(const [id,u] of sites){if(only.length&&!only.includes(id))continue;for(const [vw,vh,s] of [[1440,900,'d'],[390,844,'m']]){
 const p=await b.newPage();await p.setViewport({width:vw,height:vh,deviceScaleFactor:1,isMobile:s==='m',hasTouch:s==='m'});
 try{await p.goto(u,{waitUntil:'networkidle2',timeout:45000});}catch(e){console.log('timeout',id)}
 await new Promise(r=>setTimeout(r,6000));
 if(hide[id]){const n=await p.evaluate((sel)=>{let n=0;for(const q of sel)for(const e of document.querySelectorAll(q)){e.style.setProperty('visibility','hidden','important');n++;}return n;},hide[id]);console.log(id,s,'hidden',n);await new Promise(r=>setTimeout(r,300));}
 await p.screenshot({path:`${OUT}/${id}-${s}.png`});await p.close();console.log(id,s);}}
await b.close();
