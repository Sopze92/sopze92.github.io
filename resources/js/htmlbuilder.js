/* 
  Author: Sergio Sopze @ 2024
*/
class ObjectHTML {
  constructor(element, name, includes=undefined){
    this.name=name; this.element=element; this.includes= includes;
  }

  _destructor(){
    if(includes){
      for(const d of includes) d.remove();
      includes= undefined;
    }
  }
}

class HTMLBuilder {

  static #__ErrorElement= (str) => this.#_fromString(`<p class="fs-1 fw-bold text-danger">${str}</p>`);
  static #ERROR= {
    "html_notloaded":this.#__ErrorElement("ERR: HTML file not loaded"),
    "htmlstr_cantread":this.#__ErrorElement("ERR: bad html string"),
    "include_nullelement":this.#__ErrorElement("ERR: got null include element"),
    "include_cantread":this.#__ErrorElement("ERR: unable to read include (bad type)")
  };

  /**
    @param {String} path File to load
    @param {String} name Internal name to refeer this html chunk
    @param {function(ObjectHTML)} onSuccess Success callback
    @param {function} onFailure Failure callback
  */
  static loadHTML(file, name, onSuccess, onFailure){
    //console.log(`called loadHTML: f:${file}, n:${name}, os:${onSuccess.name}, of:${onFailure.name}`);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange= () => {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          let node= this.#_fromString(xhttp.responseText);
          let includes= this.#_loadIncludes(node);
          onSuccess(node ? new ObjectHTML(node, name, includes) : this.#ERROR("html_notloaded"));
        }
        if (xhttp.status == 404) onFailure();
      };
    };
    xhttp.open("GET", file, true);
    xhttp.send();
  }

  static #_loadIncludes(node){
    //console.log(`called #_loadIncludes: n:${node}`);
    if(!node) return [this.#ERROR["include_nullelement"]];
    let i, t, result= [];
    for(i of node.getElementsByTagName("include")) {
      for(t of this.#INCLUDE_TYPES){
        if(i.hasAttribute(t.attrName)) result.push(t.read(i)?? this.#ERROR["include_cantread"]);
      }
    }
    return result;
  }

  static #_fromString(str, trim = true) {
    if(trim) str= str.trim();
    if(!str) return this.#ERROR["htmlstr_cantread"];

    const template = document.createElement('template');
    template.innerHTML = str;
    return template.content.children[0];
  }
    
  static #_readIncludeScript(i){
    let e= document.createElement("script");
    e.setAttribute("src", i.getAttribute("script"));
    return e;
  }

  static #INCLUDE_TYPES= [
    {attrName:"script",read:this.#_readIncludeScript}
  ];
};