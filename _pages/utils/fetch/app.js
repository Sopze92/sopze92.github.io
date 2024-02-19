!function(){
  const options= {
    url:"",
    method:0,
    cors:0,
    credentials:0,
    headers:{}
  }

  const PREDEFINED_OPTIONS= {
    methods: ["GET", "HEAD", "POST"],
    modes: ["cors", "no-cors", "same-origin", "navigate"],
    credentials: ["include", "same-origin", "omit"]
  }

  const 
    HEADERS_CONTAINER= document.getElementById("fetch-form-header-container"),
    HEADER_TEMPLATE= document.getElementById("fetch-form-header-template"),
    ACTIONS= ["method", "mode", "credentials"],
    DEFAULT= [0, 0, 0, {}],
    START_HEADERS= 4,
    MAX_HEADERS= 32;

  const 
    form= document.getElementById("fetch-form"),
    optbtn= Array.from(form.getElementsByTagName("input")).filter((e)=>{ return (e.hasAttribute("type") && e.getAttribute("type")==="button") && e.hasAttribute("action");});

  optbtn.forEach((e)=>{ 
    let action= e.getAttribute("action");
    let index= ACTIONS.indexOf(action);

    e.value=PREDEFINED_OPTIONS.action[DEFAULT[index]]; 
    e.addEventListener("click", ()=>{onActionClicked(e.getAttribute("action"))}); 
  });

  form.addEventListener("submit", (e)=>{ 
    e.preventDefault(); 
    var entries= Array.from(new FormData(form).entries());
    
    var object = {};
    entries.forEach((v, k) => object[k] = v);

    console.log(object);
  });

  function onActionClicked(idx) {
    console.log(`action clicked: ${idx}`);
  }

  /** Manages adding and removing headers along with its checkboxes and eventListeners, remove by index, add with -1 */
  function changeHeadersAmount(idx){

    var hc= HEADERS_CONTAINER.childElementCount;
    let btndiv;

    for(let i=0; i< hc; i++){
      btndiv= HEADERS_CONTAINER.children[i].children[3];
      btndiv.children[0].removeEventListener("click", onAddHeaderEvent);
      btndiv.children[1].removeEventListener("click", onRemoveHeaderEvent);
    }

    if(idx < 0) {
      let h= HEADER_TEMPLATE.content.cloneNode(true).children[0];
      h.children[3].children[1].setAttribute("hid", hc);
      HEADERS_CONTAINER.append(h);
    }
    else if(idx < hc && hc > 1) HEADERS_CONTAINER.children[idx].remove();

    hc= HEADERS_CONTAINER.childElementCount;

    for(let i=0, btn; i< hc; i++){
      btndiv= HEADERS_CONTAINER.children[i].children[3];
      btn= btndiv.children[0];
      btn.classList.toggle("hidden", i < hc-1);
      btn.addEventListener("click", onAddHeaderEvent);
      btn= btndiv.children[1];
      btn.classList.toggle("hidden", hc < 2);
      btn.addEventListener("click", onRemoveHeaderEvent);
    }
  }

  for(let i=START_HEADERS; i; i--) changeHeadersAmount(-1);
  function onAddHeaderEvent(e) { changeHeadersAmount(e.target.getAttribute(-1)); }
  function onRemoveHeaderEvent(e) { changeHeadersAmount(e.target.getAttribute("hid")); }

  async function sendRequest(url, options) {

    fetch(url, {
          method: "GET",
          headers: new Headers({ 
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }),
          mode: "no-cors"
    }).then(r => {
      if(!r.ok) console.log(`Fetch ERR ${r.status}`);
      else return r.json();
    }).then((dat) => {
      console.log(JSON.stringify(dat));
    })
    .catch((err) => { console.log(`Fetch ERR ${err.message}`) });
  }
}();