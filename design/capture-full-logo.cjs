const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
async function main(){
  const browser=await chromium.launch({headless:true,...(process.env.PREVIEW_BROWSER?{executablePath:process.env.PREVIEW_BROWSER}:{channel:'chrome'})});
  try{
    const page=await browser.newPage({viewport:{width:1200,height:950},deviceScaleFactor:1.5});
    const logo=fs.readFileSync(path.join(__dirname,'../assets/kragsta-elektriska-full.svg'),'utf8');
    const compact=fs.readFileSync(path.join(__dirname,'../assets/kragsta-elektriska.svg'),'utf8');
    const icon=fs.readFileSync(path.join(__dirname,'../assets/kragsta-icon.svg'),'utf8');
    const html=`<!doctype html><html lang="sv"><meta charset="utf-8"><title>Kragsta Elektriska — logotyp</title><style>*{box-sizing:border-box}body{margin:0;font-family:'Segoe UI',sans-serif;color:#073a24;background:#f7f7f2}.board{width:1200px;padding:35px 50px 30px}.head{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d5ddcf;padding-bottom:21px}.head h1{font-size:25px;font-weight:450;letter-spacing:-.5px;margin:0}.head span{font-size:12px;color:#526553}.hero{padding:23px 44px 20px;display:flex;justify-content:center}.hero svg{width:100%;height:auto;display:block}.details{display:flex;align-items:center;gap:35px;border-top:1px solid #d5ddcf;padding-top:25px}.app{display:flex;gap:13px;align-items:center;min-width:235px}.app svg{width:54px;height:54px;flex-shrink:0}.app b{font-size:13px;font-weight:500;display:block}.app p{font-size:11px;color:#526553;margin:4px 0 0}.small-wordmark{padding:10px 25px;border-left:1px solid #d5ddcf;border-right:1px solid #d5ddcf}.small-wordmark svg{width:240px;height:auto;display:block}.small-wordmark span{font-size:10px;color:#526553;display:block;text-align:center;margin-top:5px}.note{font-size:12px;line-height:1.8;color:#526553;max-width:370px}</style><main class="board"><header class="head"><h1>En gemensam form för Kragsta.</h1><span>Huvudlogga i originalets stil</span></header><div class="hero">${logo}</div><section class="details"><div class="app">${icon}<div><b>Den valda apploggan</b><p>Samma K i den stora loggan.</p></div></div><div class="small-wordmark">${compact}<span>Version för fakturor och mindre ytor</span></div><p class="note">Tät bokstavsplacering och höga klackseriffer.<br>Välvd nederkant och orange telefonrad, som i originalet.</p></section></main></html>`;
    fs.writeFileSync(path.join(__dirname,'full-logo.html'),html);
    await page.setContent(html);await page.evaluate(()=>document.fonts.ready);
    await page.locator('.board').screenshot({path:path.join(__dirname,'previews/kragsta-full-logo-board.png')});
    await page.setContent(`<style>body{margin:0}main{background:#f7f7f2;width:1200px;padding:25px}svg{display:block;width:1150px;height:auto}</style><main>${logo}</main>`);
    await page.locator('main').screenshot({path:path.join(__dirname,'previews/kragsta-full-logo.png')});
    await page.setViewportSize({width:390,height:1000});
    await page.goto(require('node:url').pathToFileURL(path.join(__dirname,'../index.html')).href);
    await page.getByRole('button',{name:'Prova appen',exact:false}).click();
    const live=page.locator('#live-phone');
    const brand=live.getByRole('img',{name:'Kragsta Elektriska'});
    if(!await brand.evaluate(img=>img.complete&&img.naturalWidth>0))throw Error('App icon did not load');
    await live.locator('.phone').screenshot({path:path.join(__dirname,'previews/mobile-approved-logo.png')});
    await live.getByRole('button',{name:'Fakturor',exact:true}).click();
    await live.locator('.invoice-list-row').first().click();
    await live.getByRole('button',{name:'Förhandsgranska fakturan',exact:false}).click();
    await live.locator('.doc-logo img').evaluate(img=>img.decode());
    await live.locator('.phone').screenshot({path:path.join(__dirname,'previews/invoice-modern-logo.png')});
    console.log('Verified approved app icon and invoice logo loading; saved full-logo and mobile previews.');
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exit(1);});
