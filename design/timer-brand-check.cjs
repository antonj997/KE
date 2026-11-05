const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
async function main(){
  const browser=await chromium.launch({headless:true,...(process.env.PREVIEW_BROWSER?{executablePath:process.env.PREVIEW_BROWSER}:{channel:'chrome'})});
  try{
    const page=await browser.newPage({viewport:{width:390,height:980}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.clock.install({time:new Date('2026-11-03T08:42:00+01:00')});
    await page.goto(process.env.PREVIEW_URL||require('node:url').pathToFileURL(path.join(__dirname,'../index.html')).href);
    await page.getByRole('button',{name:'Prova appen',exact:false}).click();
    const live=page.locator('#live-phone');
    await live.getByRole('button',{name:'Öppna jobbet',exact:true}).click();
    await live.getByRole('button',{name:'Starta timer',exact:true}).click();
    assert.equal(await live.locator('.phone-content .timer-bar').count(),1,'Job timer must be inline in the job content');
    assert.equal(await live.locator('.running-job').count(),0,'Job screen must not show the global status bar');
    await page.clock.fastForward(90000);
    await live.getByRole('button',{name:'Idag',exact:true}).click();
    assert.equal(await live.locator('.running-job').count(),1,'A running job must remain visible on the home screen');
    assert.match(await live.locator('.running-job').innerText(),/Pågår/);
    assert.match(await live.locator('.running-job').innerText(),/Nya uttag i kök/);
    assert.equal(await live.locator('[data-timer]').innerText(),'00:01:30');
    assert.equal(await live.getByRole('img',{name:'Kragsta Elektriska'}).count(),1);
    assert(await live.getByRole('img',{name:'Kragsta Elektriska'}).evaluate(img=>img.complete&&img.naturalWidth>0),'Brand vector must load');
    await page.clock.fastForward(4935000);
    await live.locator('.phone').screenshot({path:path.join(__dirname,'previews/mobile-running-job.png')});
    for(const width of [390,320]){
      await page.setViewportSize({width,height:980});
      const geometry=await live.locator('.phone').evaluate(el=>{
        const bar=el.querySelector('.running-job').getBoundingClientRect(),nav=el.querySelector('.phone-nav').getBoundingClientRect(),frame=el.getBoundingClientRect(),content=el.querySelector('.phone-content').getBoundingClientRect(),logo=el.querySelector('.app-wordmark').getBoundingClientRect(),status=el.querySelector('.phone-status').getBoundingClientRect();
        const indicator=el.querySelector('.running-job'),style=getComputedStyle(indicator);
        return {barTop:bar.top,contentTop:content.top,statusBottom:status.bottom,logoRight:logo.right,height:bar.height,barBottom:bar.bottom,navTop:nav.top,barLeft:bar.left,barRight:bar.right,left:frame.left,right:frame.right,doc:document.body.scrollWidth,viewport:innerWidth,radii:[style.borderTopLeftRadius,style.borderTopRightRadius,style.borderBottomLeftRadius,style.borderBottomRightRadius].map(parseFloat),overflow:indicator.scrollWidth-indicator.clientWidth};
      });
      assert(geometry.height<=48,'Global timer should be a narrow status bar');
      assert(geometry.radii.every(radius=>radius>=20),'Timer status must keep the app’s rounded shape');
      assert.equal(geometry.overflow,0,'Timer content must fit inside its rounded element');
      assert(geometry.barBottom<=geometry.contentTop+.5,'Status bar must sit above the scrolling content');
      assert(geometry.barTop>=geometry.statusBottom-.5,'Status bar must sit below phone system indicators');
      assert(geometry.barLeft>=geometry.logoRight+8,'Status bar must leave the K logo clear on the left');
      assert(geometry.barBottom<=geometry.navTop,'Timer must not cover navigation');
      assert(geometry.barLeft>=geometry.left&&geometry.barRight<=geometry.right,'Timer must fit in the phone');
      assert(geometry.doc<=geometry.viewport,'No page overflow on narrow phones');
    }
    await page.setViewportSize({width:390,height:980});
    await live.getByRole('button',{name:'Kunder',exact:true}).click();
    assert.equal(await live.locator('[data-timer]').innerText(),'01:23:45');
    await live.getByRole('button',{name:'Öppna pågående jobb',exact:false}).click();
    assert.equal(await live.locator('[data-timer]').count(),1,'Only one timer surface per screen');
    assert.equal(await live.locator('.phone-content .timer-bar').count(),1);
    assert.equal(await live.locator('.running-job').count(),0);
    await live.locator('.toast').evaluateAll(els=>els.forEach(el=>el.remove()));
    await live.locator('.phone').screenshot({path:path.join(__dirname,'previews/mobile-job-inline-timer.png')});
    await live.getByRole('button',{name:'Stoppa och spara tid',exact:true}).click();
    assert.equal(await live.locator('.running-job').count(),0);
    await live.getByRole('button',{name:'Tid & material',exact:true}).click();
    assert.match(await live.innerText(),/Arbetstid från timer/);
    assert.match(await live.innerText(),/1 h 24 min/);
    assert.equal(await live.getByText('Arbetstid från timer',{exact:true}).count(),1,'Timer session is saved once');
    await live.getByRole('button',{name:'Fakturor',exact:true}).click();
    await live.locator('.invoice-list-row').first().click();
    await live.getByRole('button',{name:'Förhandsgranska fakturan',exact:false}).click();
    await live.locator('.doc-logo img').evaluate(img=>img.decode());
    for(const width of [390,320]){
      await page.setViewportSize({width,height:980});
      const layout=await live.locator('.doc-header').evaluate(el=>{
        const box=el.getBoundingClientRect(),logo=el.querySelector('.doc-logo').getBoundingClientRect(),title=el.querySelector('.doc-title').getBoundingClientRect(),paper=el.closest('.preview-document');
        return {right:Math.abs(logo.right-box.right),top:Math.abs(logo.top-box.top),gap:logo.left-title.right,overflow:paper.scrollWidth-paper.clientWidth};
      });
      assert(layout.right<1&&layout.top<1&&layout.gap>=13&&layout.overflow===0,JSON.stringify(layout));
      if(width===390){
        await live.locator('.preview-document').screenshot({path:path.join(__dirname,'previews/invoice-logo-top-right.png')});
        await live.locator('.phone').screenshot({path:path.join(__dirname,'previews/invoice-modern-logo.png')});
      }
    }
    assert.deepEqual(errors,[]);
    console.log('Inline job timer, top-right status bar clear of logo/content at 390/320px, timer continuity and single save: OK');
    console.log('Top-right invoice logo aligned and no overflow at 390/320px: OK');
    console.log('Kragsta Elektriska app identity: OK');
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exit(1);});
