const deviceDesktop= checkDeviceDesktop();

function checkDeviceDesktop(){
  const useragent= navigator.userAgent.toLowerCase();
  return !(['android', 'ios', 'mobile', 'tablet'].some((e) => useragent.includes(e))) && 
    ['win64', 'win32', 'linux', 'unix', 'mac', 'macos', 'mac os'].some((e) => useragent.includes(e));
}

!(()=>{

  const PAGE_PATH_STR= "./resources/html/%0.html";
  const PAGES= [];

  const PAGE_CONTAINER= document.getElementById("page-content");
  const PAGE_BUTTONS= Array.from(document.getElementsByTagName("button")).filter(e => e.hasAttribute("page"));
  const PAGE_DEFAULT= "home";
  
  var pageCurrent= "index";
  var pagePanners= [];

  PAGE_BUTTONS.forEach((b)=>{if(b.hasAttribute("page")) b.addEventListener("click", function(e){loadPage(e.target.getAttribute("page")) })});
  
  /** Loads a full page and updates active buttons accordly */
  function loadPage(file){
    if(pageCurrent === file) return;
    loaderPath= file.includes("/") ? file : `pages/${file}`;
    for(const btn of PAGE_BUTTONS) {
      if(btn.getAttribute("page")===file) {
        btn.classList.add("active");
        btn.setAttribute("aria-current", "true");
      } 
      else {
        btn.classList.remove("active");
        btn.removeAttribute("aria-current");
      }
    }
    HTMLBuilder.loadHTML(PAGE_PATH_STR.replace("%0", loaderPath), file, onPageLoaded, onPageFailedSoft);
  }

  /** Loads a section defined by the type */
  function loadSection(file, type){
    HTMLBuilder.loadHTML(PAGE_PATH_STR.replace("%0", type ? `${type}/${file}` : file), file, onSectionLoaded, load404Section);
  }

  /** Loads a section defined by the type */
  function loadProject(file, type){
    HTMLBuilder.loadHTML(PAGE_PATH_STR.replace("%0", type ? `${type}/${file}` : file), file, onSectionLoaded, load404Section);
  }
  
  function parseCurrentUrl() {
    const queryParams= (t= window.location.search)? Array.from(new URLSearchParams(t).entries()) : undefined;
    if(!queryParams) loadPage(PAGE_DEFAULT);
    else if(queryParams.length > 0) loadPage(queryParams[0][1] ? `${queryParams[0][0]}/${queryParams[0][1]}` : queryParams[0][0]);
    else onPageFailedSoft();
  }

  function onPageLoaded(htmlobj) {
    PAGE_CONTAINER.innerHTML= "";
    PAGE_CONTAINER.append(htmlobj.element);

    pageCurrent= htmlobj.name;

    if(deviceDesktop) {
      pagePanners= Array.from(document.getElementsByClassName("wordspanner"));
      updatePanners();
    }
  }

  function onPageFailedSoft(){ HTMLBuilder.loadHTML(PAGE_PATH_STR.replace("%0", `pages/404`), 404, onPageLoaded, onPageFailedSevere); }
  function onSectionFailedSoft() { HTMLBuilder.loadHTML(PAGE_PATH_STR.replace("%0", `pages/404`), file, null, onSectionFailedSevere); }

  function onPageFailedSevere() { window.location.assign(`${window.location.origin}/404`); }
  function onSectionFailedSevere() { console.log("NOT IMPLEMENTED: on404SectionLoaded()"); }

  if(deviceDesktop){
    function updatePanners(){ pagePanners.forEach((e)=>{ e.style.transform = `translate(0, ${e.getBoundingClientRect().y*.03}%)`; })}

    let bShouldUpdate= true;
    document.addEventListener("scroll", (e) => {
      if(bShouldUpdate=!bShouldUpdate) window.requestAnimationFrame(function () { updatePanners(); });
    });
  }

  parseCurrentUrl();
})();