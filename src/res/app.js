const deviceDesktop= checkDeviceDesktop();

function checkDeviceDesktop(){
  const useragent= navigator.userAgent.toLowerCase();
  return !(['android', 'ios', 'mobile', 'tablet'].some((e) => useragent.includes(e))) && 
    ['win64', 'win32', 'linux', 'unix', 'mac', 'macos', 'mac os'].some((e) => useragent.includes(e));
}

!(()=>{

  if(deviceDesktop){

    const 
      _rootElement= document.querySelector(":root"),
      _randomCoordsPoolSize= 32,
      _randomCoordsPool= [],
      mousemoveSubscriptions= [],
      frostedGlassCoords= { x:0, y:0, mx:0, my:0 };

    document.addEventListener("hb_pagecreated", onPageCreatedEvent);
    document.addEventListener('mousemove', onMouseMovedEvent);

    function initialize(){
      for(let i=0; i< _randomCoordsPoolSize; i++){
        _randomCoordsPool.push( (32 + Math.random()*192) * (Math.random() > .5 ? 1 : -1) );
      }
    }
    
    function onPageCreatedEvent() {
      pagePanners= document.getElementsByClassName("wordspanner");
      document.addEventListener("hb_pagedestroyed", onPageDestroyedEvent);
      document.addEventListener("scroll", onPageScrollEvent);
      
      const elements= document.body.querySelectorAll("[js-subscribe]");
      for(const e of elements) {
        if(e.getAttribute("js-subscribe") === "mousemove") mousemoveSubscriptions.push(e);
      }
    }

    function onPageDestroyedEvent(){
      document.removeEventListener("hb_pagedestroyed", onPageDestroyedEvent);
      document.removeEventListener("scroll", onPageScrollEvent);
      mousemoveSubscriptions.splice(0, mousemoveSubscriptions.length);
    }

    let _bShouldUpdate= false;
    function onPageScrollEvent() { _bShouldUpdate= !_bShouldUpdate; if(_bShouldUpdate) { window.requestAnimationFrame(render); } }
    
    function onMouseMovedEvent(e) { 
/*       _rootElement.style.setProperty("--cv-mouse-pos-x", `${e.clientX}px`); 
      _rootElement.style.setProperty("--cv-mouse-pos-y", `${e.clientY}px`); 
      _rootElement.style.setProperty("--cv-mouse-page-x", `${e.pageX}px`); 
      _rootElement.style.setProperty("--cv-mouse-page-y", `${e.pageY}px`); 
      _rootElement.style.setProperty("--cv-mouse-delta-x", `${e.movementX}px`); 
      _rootElement.style.setProperty("--cv-mouse-delta-y", `${e.movementY}px`);  */
      
      let bbox;
      for(const s of mousemoveSubscriptions) {
        bbox= s.getBoundingClientRect();
        s.style.setProperty("--cv-mouse-relative-x", `${e.clientX - bbox.x}px`);
        s.style.setProperty("--cv-mouse-relative-y", `${e.clientY - bbox.y}px`);
      }
    }

    function render() {

      let 
        x= _randomCoordsPool[Math.floor(Math.random()*_randomCoordsPoolSize)],
        y= _randomCoordsPool[Math.floor(Math.random()*_randomCoordsPoolSize)];

      frostedGlassCoords.x+= x*.125;
      frostedGlassCoords.y+= y*.125;
      frostedGlassCoords.mx+= x;
      frostedGlassCoords.my+= y;

      let v;
      for(const i in frostedGlassCoords){
        v= frostedGlassCoords[i];
        frostedGlassCoords[i]= v > 1024 ? v-1024 : v < -1024 ? v+1024 : v; 
      }

      _rootElement.style.setProperty("--cv-frostedglass-x", `${frostedGlassCoords.x}px`);
      _rootElement.style.setProperty("--cv-frostedglass-y", `${frostedGlassCoords.y}px`);
      _rootElement.style.setProperty("--cv-frostedglass-mx", `${frostedGlassCoords.mx}px`);
      _rootElement.style.setProperty("--cv-frostedglass-my", `${frostedGlassCoords.my}px`);
    }

    initialize();
  }
})();