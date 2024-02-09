const deviceDesktop= checkDeviceDesktop();

function checkDeviceDesktop(){
  const includes= ['win64', 'win32', 'linux', 'unix', 'mac', 'macos', 'mac os'];
  const excludes= ['android', 'ios', 'mobile', 'tablet'];
  const useragent= navigator.userAgent.toLowerCase();
  return !excludes.some((e) => useragent.includes(e)) && includes.some((e) => useragent.includes(e));
}

!function(){

  const TAB_PATH_STR= "./resources/html/%0.html";

  const TAB_CONTAINER= document.getElementById("tab-container");
  const TAB_BUTTONS= [];
  const DEFAULT_TAB= 0;
  
  var WORDS_PANNERS= [];
  var bANY_PANNER= false;

  {
    const lButtons= document.getElementsByTagName("button");
    let p;
    for(const b of lButtons) {
      if(p=b.getAttribute("tab")) {
        TAB_BUTTONS.push({element:b, page:p});
        b.addEventListener("click", function(ev){handleButtonTab(ev.target) });
      }
    }
  }
  
  const _getTabButtonByName= (n) => TAB_BUTTONS.find(b => b.page === n);
  
  function handleButtonTab(e){
    for(const b of TAB_BUTTONS) { 
      if(b.includes) {
        for(const c of (b.includes)) c.remove(); 
        b.includes= undefined;
      }
      if( b.element === e ) {
        e.classList.add("active"); 
        b.element.setAttribute("aria-current", "page");
      }
      else {
        b.element.classList.remove("active");
        b.element.removeAttribute("aria-current");
      }
    }
    loadPage(e.getAttribute("tab"));
  }
  
  function parseCurrentUrl() {
    const queryStr= window.location.search;
    const page= queryStr? new URLSearchParams(queryStr).entries().next().value[0].toLowerCase() : TAB_BUTTONS[DEFAULT_TAB].page;
    if((b=_getTabButtonByName(page))) {
      handleButtonTab(b.element);
      window.history.replaceState(null, null, window.location.origin);
    }
    else onPageNotFound();
  }

  function loadPage(page){
    HTMLBuilder.loadHTML(TAB_PATH_STR.replace("%0", page), page, onPageLoaded, onPageNotFound);
  }

  function onPageLoaded(htmlobj){

    TAB_CONTAINER.innerHTML= "";
    TAB_CONTAINER.append(htmlobj.element);

    if((b=_getTabButtonByName(htmlobj.name))){
      b.includes= htmlobj.includes?? undefined;
      for(const i of b.includes) document.body.append(i);
    }

    if(deviceDesktop) {
      WORDS_PANNERS= document.getElementsByClassName("wordspanner");
      bANY_PANNER= WORDS_PANNERS && WORDS_PANNERS.length > 0;
      updatePanners();
    }
  }

  function onPageNotFound(){ window.location.assign(`${window.location.origin}/404`); };

  if(deviceDesktop){
    function updatePanners(){
      if(bANY_PANNER){
        for(const e of WORDS_PANNERS) {
          let box = e.getBoundingClientRect();
          e.style.transform = `translate(0, ${box.y*.03}%)`;
        };
      }
    }

    let u= true;
    document.addEventListener("scroll", (e) => {
      if(u=!u) window.requestAnimationFrame(function () { updatePanners(); });
    });
  }

  parseCurrentUrl();
}();