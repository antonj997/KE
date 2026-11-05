const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const options=[
  {id:'klassisk',number:'1',name:'Klassisk',copy:'Raka, kraftiga klackseriffer.',note:'Samma tydliga form som A, med mer tyngd.',pick:true},
  {id:'skylt',number:'2',name:'Skylt',copy:'Mörkgrön kontur och mjukare seriffer.',note:'Närmast originalets målade skyltkänsla.'},
  {id:'kondenserad',number:'3',name:'Kondenserad',copy:'Högre, smalare bokstav med breda klackar.',note:'Mer av originalets täta, kraftiga typografi.'}
];
function mark(o,mono=false){
  const svg=fs.readFileSync(path.join(__dirname,`../assets/logo-proposals/kragsta-kraft-${o.id}.svg`),'utf8');
  if(!mono)return svg;
  const paths=[...svg.matchAll(/<path d="([^"]+)"/g)];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" aria-label="Enfärgad version"><path d="${paths.at(-1)[1]}" fill="#073a24"/></svg>`;
}
const original=fs.readFileSync(path.join(__dirname,'../assets/logo-proposals/kragsta-kraft.svg'),'utf8');
const html=`<!doctype html><html lang="sv"><meta charset="utf-8"><title>Kragsta — Kraft med originalets karaktär</title><style>
*{box-sizing:border-box}body{margin:0;color:#073a24;background:#f7f7f2;font-family:'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}.board{width:1200px;padding:40px 48px 28px}.heading{display:flex;justify-content:space-between;align-items:center;gap:30px;padding-bottom:24px;border-bottom:1px solid #d5ddcf}.heading h1{font-size:31px;letter-spacing:-.9px;font-weight:450;margin:0}.source{display:flex;align-items:center;gap:11px;white-space:nowrap;font-size:12px;color:#526553}.source svg{width:34px;height:34px}.options{display:grid;grid-template-columns:repeat(3,1fr);margin-top:27px}.option{padding:0 28px}.option:first-child{padding-left:0}.option:last-child{padding-right:0}.option+.option{border-left:1px solid #d5ddcf}.option-head{height:28px;display:flex;align-items:center;gap:11px}.number{height:26px;width:26px;display:grid;place-items:center;border:1px solid #bccbbd;border-radius:50%;font-size:12px}.pick{font-size:11px;background:#e5ebdf;padding:5px 10px;border-radius:30px}.hero{height:224px;display:grid;place-items:center}.hero svg{width:180px;height:180px}h2{margin:8px 0 11px;font-size:23px;letter-spacing:-.5px;font-weight:500}p{font-size:13px;line-height:1.8;margin:0}.note{font-size:12px;color:#526553}.detail{display:flex;gap:24px;align-items:center;margin:23px 0 25px;min-height:39px}.detail>span{display:flex;align-items:center;gap:8px;font-size:11px;color:#526553}.detail svg{width:32px;height:32px}.detail .micro svg{width:24px;height:24px}.app-strip{border-radius:14px;background:#edeee5;padding:16px;display:flex;align-items:center;gap:12px}.app-strip svg{width:36px;height:36px;flex-shrink:0}.app-strip .greeting{margin-right:auto;font-size:12px;font-weight:500}.avatar{display:grid;place-items:center;width:27px;height:27px;border-radius:50%;background:#dce5d6;font-size:10px}.footer{margin-top:31px;padding-top:21px;border-top:1px solid #d5ddcf;display:flex;justify-content:space-between;gap:25px;font-size:11px;color:#526553}
</style><main class="board"><header class="heading"><h1>Kraft, med originalets karaktär.</h1><div class="source">${original}<span>Utgångspunkt: förslag A</span></div></header><section class="options">${options.map(o=>`<article class="option"><header class="option-head"><span class="number">${o.number}</span>${o.pick?'<span class="pick">Mitt förslag för appen</span>':''}</header><div class="hero">${mark(o)}</div><h2>${o.name}</h2><p>${o.copy}</p><p class="note">${o.note}</p><div class="detail"><span>${mark(o)}32 px</span><span class="micro">${mark(o)}24 px</span><span>${mark(o,true)}Enfärgad</span></div><div class="app-strip">${mark(o)}<span class="greeting">God morgon, Jimmy.</span><span class="avatar">J</span></div></article>`).join('')}</section><footer class="footer"><span>Kragsta Elektriska · K och blixt i en sammanhängande bokstavsform.</span><span>Tre varianter med klackseriffer och originalets färger.</span></footer></main></html>`;
async function main(){
  fs.writeFileSync(path.join(__dirname,'retro-logo-proposals.html'),html);
  const browser=await chromium.launch({headless:true,...(process.env.PREVIEW_BROWSER?{executablePath:process.env.PREVIEW_BROWSER}:{channel:'chrome'})});
  try{
    const page=await browser.newPage({viewport:{width:1200,height:900},deviceScaleFactor:1.5});
    await page.setContent(html);await page.evaluate(()=>document.fonts.ready);
    await page.locator('.board').screenshot({path:path.join(__dirname,'previews/kragsta-retro-proposals.png')});
    for(const o of options){
      await page.setContent(`<style>body{margin:0}main{width:192px;height:192px;display:grid;place-items:center;background:#f7f7f2}svg{width:128px;height:128px}</style><main>${mark(o)}</main>`);
      await page.locator('main').screenshot({path:path.join(__dirname,`previews/kragsta-kraft-${o.id}.png`)});
    }
    console.log('Created three serif K/lightning SVG variants and rendered small-size comparison previews.');
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exit(1);});
