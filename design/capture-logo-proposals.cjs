const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const options=[
  {id:'kraft',letter:'A',name:'Kraft',copy:'K:et och blixten är en enda form.',note:'Tydligast som liten applogga.',recommended:true},
  {id:'spanning',letter:'B',name:'Spänning',copy:'Blixten bildar K:ets vänstra stam.',note:'Skarpare och mer tekniskt uttryck.'},
  {id:'ledning',letter:'C',name:'Ledning',copy:'Ett mjukare K med blixtens sicksack.',note:'Lättare, rundare och mer avskalat.'}
];
function symbol(o,mono=false){
  let svg=fs.readFileSync(path.join(__dirname,`../assets/logo-proposals/kragsta-${o.id}.svg`),'utf8');
  if(mono)svg=svg.replace(/<rect[^>]*\/>/,'').replaceAll('#ff8508','#073a24');
  return svg;
}
const html=`<!doctype html><html lang="sv"><meta charset="utf-8"><title>Kragsta — tre loggförslag</title><style>
*{box-sizing:border-box}body{margin:0;color:#073a24;background:#f7f7f2;font-family:'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}.board{padding:44px 48px 30px;width:1200px}.heading{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d5ddcf;padding-bottom:23px}.heading h1{font-size:34px;font-weight:450;letter-spacing:-1px;margin:0}.heading span{font-size:13px;color:#526553}.options{display:grid;grid-template-columns:repeat(3,1fr);margin-top:28px}.option{padding:0 29px}.option:first-child{padding-left:0}.option:last-child{padding-right:0}.option+.option{border-left:1px solid #d5ddcf}.option-head{display:flex;align-items:center;gap:10px;min-height:27px;margin-bottom:23px}.letter{font-size:12px;display:grid;place-items:center;border:1px solid #bccbbd;width:25px;height:25px;border-radius:50%}.pick{font-size:11px;padding:5px 9px;background:#e5ebdf;border-radius:30px}.hero{height:194px;display:grid;place-items:center}.hero svg{width:160px;height:160px}h2{font-size:23px;letter-spacing:-.5px;font-weight:500;margin:20px 0 10px}p{font-size:13px;line-height:1.8;margin:0}p.note{font-size:12px;color:#526553}.small{display:flex;gap:22px;align-items:center;margin:24px 0 27px;min-height:38px}.tiny{display:flex;align-items:center;gap:9px}.tiny svg{width:32px;height:32px}.tiny.micro svg{width:24px;height:24px}.tiny span{font-size:11px;color:#526553}.app-strip{background:#edeee5;border-radius:14px;padding:16px;display:flex;align-items:center;justify-content:space-between}.app-strip svg{width:32px;height:32px;flex-shrink:0}.app-strip .greeting{margin-left:12px;margin-right:auto;font-size:12px;font-weight:500}.avatar{width:27px;height:27px;border-radius:50%;display:grid;place-items:center;font-size:10px;background:#dce5d6}.footer{margin-top:32px;padding-top:20px;border-top:1px solid #d5ddcf;display:flex;justify-content:space-between;font-size:11px;color:#526553}
</style><main class="board"><header class="heading"><h1>Ett K. En blixt.</h1><span>Kragsta Elektriska · Tre loggförslag</span></header><section class="options">${options.map(o=>`<article class="option"><div class="option-head"><span class="letter">${o.letter}</span>${o.recommended?'<span class="pick">Mitt förslag</span>':''}</div><div class="hero">${symbol(o)}</div><h2>${o.name}</h2><p>${o.copy}</p><p class="note">${o.note}</p><div class="small"><span class="tiny">${symbol(o)}<span>32 px</span></span><span class="tiny micro">${symbol(o)}<span>24 px</span></span><span class="tiny">${symbol(o,true)}<span>Enfärgad</span></span></div><div class="app-strip">${symbol(o)}<span class="greeting">God morgon, Jimmy.</span><span class="avatar">J</span></div></article>`).join('')}</section><footer class="footer"><span>Orange och mörkgrönt från Kragstas befintliga identitet.</span><span>Förslag att välja mellan</span></footer></main></html>`;
async function main(){
  fs.writeFileSync(path.join(__dirname,'logo-proposals.html'),html);
  const browser=await chromium.launch({headless:true,...(process.env.PREVIEW_BROWSER?{executablePath:process.env.PREVIEW_BROWSER}:{channel:'chrome'})});
  try{
    const page=await browser.newPage({viewport:{width:1200,height:900},deviceScaleFactor:1.5});
    await page.setContent(html);await page.evaluate(()=>document.fonts.ready);
    await page.locator('.board').screenshot({path:path.join(__dirname,'previews/kragsta-logo-proposals.png')});
    for(const o of options){
      await page.setContent(`<style>body{margin:0}main{width:192px;height:192px;background:#f7f7f2;display:grid;place-items:center}svg{width:112px;height:112px}</style><main>${symbol(o)}</main>`);
      await page.locator('main').screenshot({path:path.join(__dirname,`previews/kragsta-${o.id}.png`)});
    }
    console.log('Saved three SVG alternatives, comparison board, and individual PNG previews.');
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exit(1);});
