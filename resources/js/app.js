!function(){

  const TAB_PATH_STR= "./resources/html/tab-%0.html";

  const TAB_CONTAINER= document.getElementById("tab-container");
  const TAB_BUTTONS= [];
  const DEFAULT_TAB= 0;
  
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
      if( b.element === e ) e.classList.add("active"); 
      else b.element.classList.remove("active");
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
    
    //console.log(`callback onPageLoaded: e:${htmlobj.element}, p:${htmlobj.name}, i:${htmlobj.includes}`);

    TAB_CONTAINER.innerHTML= "";
    TAB_CONTAINER.append(htmlobj.element);

    if((b=_getTabButtonByName(htmlobj.name))){
      b.includes= htmlobj.includes?? undefined;
      for(const i of b.includes) document.body.append(i);
    }
  }

  function onPageNotFound(){ window.location.assign(`${window.location.origin}/404`); };

  parseCurrentUrl();
}();