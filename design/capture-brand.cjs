const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
async function main(){
  const browser=await chromium.launch({headless:true,...(process.env.PREVIEW_BROWSER?{executablePath:process.env.PREVIEW_BROWSER}:{channel:'chrome'})});
  try{
    const page=await browser.newPage({viewport:{width:390,height:1000},deviceScaleFactor:2});
    await page.goto(require('node:url').pathToFileURL(path.join(__dirname,'../index.html')).href);
    await page.getByRole('button',{name:'Prova appen',exact:false}).click();
    await page.locator('#live-phone .phone').screenshot({path:path.join(__dirname,'previews/mobile-compact-logo.png')});
    const mark=fs.readFileSync(path.join(__dirname,'../assets/kragsta-icon.svg'),'utf8');
    await page.setContent(`<style>body{margin:0}#preview{display:grid;place-items:center;width:192px;height:192px;background:#f7f7f2}svg{width:112px;height:112px}</style><div id="preview">${mark}</div>`);
    await page.locator('#preview').screenshot({path:path.join(__dirname,'previews/kragsta-symbol.png')});
    console.log('Saved compact symbol and mobile preview.');
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exit(1);});
