'use strict';

var htmlBuilder;

!(()=>{

  document.addEventListener("DOMContentLoaded", async (e)=> {
    
    const file= await fetch("./_resources/lib/builder.json");
    if(file.status==200) {

      let query= window.location.search;
      const settings= await file.json();

      const queryparams= query ? Array.from(new URLSearchParams(query.toLowerCase()).entries()) : undefined;

      document.htmlBuilder= new HTMLBuilder(settings, queryparams);
    }
    else console.error("Couldn't initialize HTMLBuilder: no settings provided");

  }, { once:true, passive:true });

})();

class HTMLObject {

  #_type; #_name; #_content;

  constructor(type, name, content){
    this.#_type= type; this.#_name= name; this.#_content= content;
  }

  compareName= (name) => name === this.#_name;
  compare= (type, name) => type === this.#_type && name === this.#_name;

  onDestroy(){
    for(const e of this.#_content) e.destroy();
  }
};

class HTMLBuilder {

  #_titleElement = document.head.getElementsByTagName("TITLE")[0];
  #_defaultTitle = this.#_titleElement.textContent;

  #_settings;

  #_pageData;
  #_pageObjects;

  static __ERROR_ELEMENT= (str) => HTMLBuilder.getElementfromString(`<p class="fs-1 fw-bold text-danger">${str}</p>`);
  static _ERROR= {
    HTML_NULLELEMENT: this.__ERROR_ELEMENT("NULL"),
    HTML_NULLSTRING: this.__ERROR_ELEMENT(`ERR: Couldn't create HTML element (NULL string)`),
    HTML_BADSTRING:(str="missingstr") => this.__ERROR_ELEMENT(`ERR: Couldn't create HTML element (bad string): ${str}`),
  };

  static #nullElement= new HTMLObject("null", null, this._ERROR.HTML_NULLELEMENT);

  /** ------------------------------------ CONSTRUCTOR ------------------------------------ */
  constructor(settings, queryparams){

    if(!queryparams) queryparams= [HTMLBuilder.getPage(settings.default.index)];
    else if (queryparams[0][1]==="") queryparams[0]= HTMLBuilder.getPage(queryparams[0][0]);

    this.#_settings= settings;
    this.parseQueryParams(queryparams);
  }

  /** ------------------------------------ PARAMETER PARSER ------------------------------------ */
  parseQueryParams(queryParams) {

    let queryPage= queryParams[0].length > 1 ? queryParams[0] : ["default", queryParams[0]] ;
  
    if(queryPage[0] != "project") {

      // TODO: look for e (element, for sidebars only) and s (sections, for auto-scroll and/or focusing)

      let pageData= { 
        composer: this.getComposerObject(queryPage[0]),
        page: this.getPageObject(queryPage[0], queryPage[1]),
        post: queryParams.find(e => e[0]=== "post")?? undefined,
        section: queryParams.find(e => e[0]=== "section")?? undefined
      }

      this.loadPage(pageData);
    }
    else this.navigateProject(queryPage[1])
  }

  /** get a complete composer, filling missing data with with default values, or null if invalid composer */
  getComposerObject= (name) => this.#_settings.composer[name] ? Object.assign(this.#_settings.default.composer, this.#_settings.composer[name]) : null;

  /** returns a complete page, filling missing data with with default values, or null if invalid page */
  getPageObject= (composer, name) => this.#_settings.page[composer] && this.#_settings.page[composer][name] ? Object.assign(this.#_settings.default.page, this.#_settings.page[composer][name]) : null;

  async loadPage(pageData){

    this.#_pageData= pageData;
    console.log(pageData);

    if(!pageData.composer) this.onPageFailedSevere();
    else if(!pageData.page) this.onPageFailedSoft();
    else{
      if(!pageData.page.hidetitle) this.#_titleElement.textContent= `${this.#_defaultTitle} - ${pageData.page.title}`;

      let header, footer, page, post;

      // is any page currently loaded
      if(this.#_pageObjects && this.#_pageObjects.length > 0){

        header= this.#_pageObjects.find(e => e.type==="header"),
        footer= this.#_pageObjects.find(e => e.type==="footer");
        page= this.#_pageObjects.find(e => e.type==="page");
        post= this.#_pageObjects.find(e => e.type==="post");

        if(!header.compareName(pageData.composer.header)) {
          header.onDestroy();
          header= await this.createHeader(this.#_settings.header[pageData.composer.header]);
        }

        if(!footer.compareName(pageData.composer.footer)) {
          footer.onDestroy();
          footer= await this.createFooter(this.#_settings.footer[pageData.composer.footer]);
        }

        // always remove this, force reload pages and posts
        if(page) page.onDestroy();
        if(post) post.onDestroy();
      } 
      else {
        header= await this.createHeader(this.#_settings.header[pageData.composer.header]);
        footer= await this.createFooter(this.#_settings.footer[pageData.composer.footer]);
      }

      this.#_pageObjects= [];
      this.#_pageObjects.push(...[header, page, post, footer]);
    }

    console.log(this.#_pageObjects);
  }

  createHeader(headerData){
    return HTMLBuilder.fetchHTML(headerData.module);
  }

  createFooter(footerData){
    return HTMLBuilder.fetchHTML(footerData.module);
  }

  navigateProject(str){

    let project= this.#_settings.page.project[str];
    if(project) window.location.assign(project.relative ? `${window.location.origin}/${project.location}` : project.location);
    else this.onPageFailedSevere();
  }

  onPageFailedSoft() {

    console.log("404 soft");
    //this.loadPage({ composer: Object.assign(this.#_pageData.composer, this.#_settings.composer.internal, this.#_settings.page.internal.404 });
  }

  onPageFailedSevere() { window.location.assign(`${window.location.origin}/404`); }
  
  /** ------------------------------------ HELPER FUNCTIONS ------------------------------------ */

  static getElementfromString(str, trim = true) {
    if(trim) str= str.trim();
    if(!str) return _ERROR.HTML_NULLSTRING;
    const template = document.createElement('template');
    if(!template) return this._ERROR.HTML_BADSTRING(str); 
    template.innerHTML = str;
    return template.content.children[0];
  }
  
  static async fetchHTML(file) {
    try {
      let result= await fetch(`${file}.html`);
      let text= await result.text();
      let element= this.getElementfromString(text);
      return element;
    } 
    catch(e) {
      console.error(e.message);
    }
    return this.#nullElement.cloneNode(true);
  }
  
  /** Gets the page-parameter from a specifically formatted string */
  static getPage= (str) => str.includes("-") ? str.split('-') : ["default", str]; 

  /** Gets the DOM element with the specified 'bid' attribute's value */
  getElementByBuilderID= (str) =>  document.querySelector(`[bid="${str}"]`);

  /** Gets an array of DOM elements that have the specified attribute */
  getElementsWithAttribute= (str) =>  document.querySelectorAll(`[${str}]`);
}
