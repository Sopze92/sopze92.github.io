!function(){

  const TAB_PATH_STR= "./resources/html/tab-%0.html";

  const TAB_CONTAINER= document.getElementById("tab-container");
  const TAB_BUTTONS= [];
  const DEFAULT_TAB= 0;

  function init(){
    const lButtons= document.getElementsByTagName("button");
    let p;
    for(const b of lButtons) {
      if(p=b.getAttribute("tab")) {
        TAB_BUTTONS.push({element:b, page:p});
        b.addEventListener("click", function(ev){handleButtonTab(ev.target) });
      }
    }
  }
  
  function handleButtonTab(e){
    for(const b of TAB_BUTTONS) { 
      if(b.children) {
        for(const c of b.children ) c.remove(); 
        b.children= undefined;
      }
      if( b.element === e ) e.classList.add("active"); 
      else b.element.classList.remove("active");
    }
    insertHtml(e.getAttribute("tab"));
  }
  
  function parseCurrentUrl() {
    const queryStr= window.location.search;
    const page= queryStr? new URLSearchParams(queryStr).entries().next().value[0].toLowerCase() : TAB_BUTTONS[DEFAULT_TAB].page
    if((b=TAB_BUTTONS.filter(e => e.page === page)).length > 0) {
      handleButtonTab(b[0].element);
      window.history.replaceState(null, null, window.location.origin);
    }
    else bring404();
  }

  function insertHtml(page){
    const file= `./resources/html/tab-${page}.html`;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200)  {

            let node= fromString(this.responseText);

            TAB_CONTAINER.innerHTML= "";
            TAB_CONTAINER.append(node);

            let inc;
            let b;
            for(const e of (node.getElementsByTagName("include"))){
              if(e.hasAttribute("script")){
                inc= document.createElement("script");
                inc.setAttribute("src", e.getAttribute("script"));
                b=TAB_BUTTONS.filter(j => j.page === page)[0];
                if(!b.children) b.children= [];
                b.children.push(document.body.appendChild(inc));
              }
            }
          }
          if (this.status == 404) bring404();
        }
      }
    xhttp.open("GET", file, true);
    xhttp.send();
  }

  function bring404(){ window.location.assign(`${window.location.origin}/404.html`); };

  function fromString(html, trim = true) {
    html = trim ? html.trim() : html;
    if (!html) return null;

    const template = document.createElement('template');
    template.innerHTML = html;
    const result = template.content.children;

    if (result.length === 1) return result[0];
    return result;
  }

  init();
  parseCurrentUrl();
}();