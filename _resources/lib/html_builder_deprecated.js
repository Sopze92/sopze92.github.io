// Author: Sergio Sopze @ 2024
class ObjectHTML {
  constructor(element, name){
    this.name=name; this.element=element;
  }
}

/** custom element to enable including aditional scripts/stylesheets when mounting modular pages */
class IncludeResourceElement extends HTMLElement{
  static observedAttributes= ["mode","file"];
  static #INCLUDE_TYPES= [
    {mode:"script",reader:this.#_readIncludeScript},
    {mode:"stylesheet",reader:this.#_readIncludeStyle}
  ];

  constructor() {super();}

  static #_readIncludeScript(i){
    let e= document.createElement("script");
    e.setAttribute("src", i.getAttribute("file"));
    i.appendChild(e);
  }
    
  static #_readIncludeStyle(i){
    let e= document.createElement("link");
    e.setAttribute("type", "text/css");
    e.setAttribute("rel", "stylesheet");
    e.setAttribute("href", i.getAttribute("file"));
    i.appendChild(e);
  }
  
  connectedCallback() {
    console.log(`include-resource: ${this.getAttribute("mode")}[${this.getAttribute("file")}]`);
    for(t of IncludeResourceElement.#INCLUDE_TYPES) if(this.getAttribute("mode")===t.mode) t.reader(this);
  }
}

window.customElements.define("include-resource", IncludeResourceElement);

class HTMLBuilder {

  static #__ErrorElement= (str) => this.#_fromString(`<p class="fs-1 fw-bold text-danger">${str}</p>`);
  static #ERROR= {
    "html_notloaded":this.#__ErrorElement("ERR: HTML file not loaded"),
    "htmlstr_cantread":this.#__ErrorElement("ERR: bad html string"),
    "include_cantread":this.#__ErrorElement("ERR: unable to read include (bad type)")
  };

  /**
    @param {String} path File to load
    @param {String} name Internal name to refeer this html chunk
    @param {function(ObjectHTML)} onSuccess Success callback
    @param {function} onFailure Failure callback
  */
  static loadHTML(file, name, onSuccess, onFailure){
    console.log(`called loadHTML: f:${file}, n:${name}, os:${onSuccess ? onSuccess.name : "null"}, of:${onFailure ? onFailure.name : "null"}`);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange= () => {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          let node= this.#_fromString(xhttp.responseText);
          onSuccess(node ? new ObjectHTML(node, name) : this.#ERROR("html_notloaded"));
        }
        if (xhttp.status == 404) onFailure();
      };
    };
    xhttp.open("GET", file, true);
    xhttp.send();
  }

  static #_fromString(str, trim = true) {
    if(trim) str= str.trim();
    if(!str) return this.#ERROR["htmlstr_cantread"];
    const template = document.createElement('template');
    template.innerHTML = str;
    return template.content.children[0];
  }
};