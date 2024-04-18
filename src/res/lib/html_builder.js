'use strict';

var htmlBuilder;

!(()=>{

  document.addEventListener("DOMContentLoaded", async (e)=> {
    
    const cfgfile= await fetch("./res/lib/builder.json");
    const resfile= await fetch("./res/lib/resources.json");

    if(cfgfile.status == 200) {
      
      const 
        settings= await cfgfile.json(),
        resources= resfile.status == 200 ? await resfile.json() : null,
        empty= !window.location.search,
        query= empty ? settings.default.query : window.location.search;

      for(const c in settings.composer) settings.composer[c]= Object.assign(structuredClone(settings.default.composer), settings.composer[c], {_name: c});
      for(const p in settings.page) settings.page[p]= Object.assign(structuredClone(settings.default.page), settings.page[p], {_name: p});

      delete settings.default;
      if(!settings.variables) settings.variables= {};

      document.htmlBuilder= new HTMLBuilder(settings, resources, query);
    }
    else console.error("Couldn't initialize HTMLBuilder: unable to load settings");

  }, { once:true, passive:true });

  console.encapsulate= function(groupName, ...objects) {
    console.group(groupName);
    for(const o of objects) console.log(o);
    console.groupEnd();
  }

})();

// ------------------------------------ HTML OBJECT ------------------------------------

class HTMLObject {

  #_type; #_name; #_element; #_resources;

  constructor(type, name, element, resources= undefined){
    this.#_type= type; this.#_name= name; this.#_element= element; this.#_resources= resources;
  }

  compareName= (name) => name === this.#_name;
  compare= (type, name) => type === this.#_type && name === this.#_name;

  onDestroy(){
    this.#_element.destroy();
    for(const e of this.#_resources) e.destroy();
  }
};

// ------------------------------------ HTML BUILDER ------------------------------------

class HTMLBuilder {

  #_titleElement = document.head.getElementsByTagName("TITLE")[0];
  #_siteTitle = this.#_titleElement.textContent;

  #_settings; 
  #_resources;

  #_pageData= { composer: { _name:null }, page: { _composer: null, _name: null } };
  #_pageButtons= [];
  #_pageResources= [[],[],[]];
  #_pageContainers;

  static __ERROR_ELEMENT= (str) => HTMLBuilder.getElementfromString(`<p class="fs-1 fw-bold text-danger">${str}</p>`);
  static _ERROR= {
    HTML_NULLELEMENT: this.__ERROR_ELEMENT("NULL"),
    HTML_NULLSTRING: this.__ERROR_ELEMENT(`ERR: Couldn't create HTML element (NULL string)`),
    HTML_BADSTRING:(str="missingstr") => this.__ERROR_ELEMENT(`ERR: Couldn't create HTML element (bad string): ${str}`),
  };

  static #nullElement= new HTMLObject("null", null, this._ERROR.HTML_NULLELEMENT);

  static ONPAGECREATED_EVENT= new CustomEvent("hb_pagecreated");
  static ONPAGEDESTROYED_EVENT= new CustomEvent("hb_pagedestroyed");

  // ------------------------------------ CONSTRUCTOR ------------------------------------
  constructor(settings, resources, query){

    this.#_pageContainers= Array.from(document.body.children);
    this.#_settings= {
      ...settings,
      list: {
        composer: Object.keys(settings.composer),
        page: Object.keys(settings.page)
      }
    }
    this.#_resources= structuredClone(resources);

    console.encapsulate("HTMLBuilder", this.#_settings, query);
    this.loadQuery(query);
  }

  // ------------------------------------ QUERY PARSER - LOADER ------------------------------------
  // this is called with searchQuery parameters at startup and by clicking on DOM elements with 'hb-lnk-page' attribute set
  loadQuery(query){

    const params= query.split(/(?=-|:)/);

    let pageData= {
          composer: null,
          page: params.find(e=>e[0]==='?'),
          post: params.find(e=>e[0]==='-'),
          section: params.find(e=>e[0]===':'),
        };

    for(const p in pageData) pageData[p]= pageData[p] ? pageData[p].slice(1) : null;
    pageData.composer= this.getComposerForPage(pageData.page);

    if(pageData.page != "project") this.loadPage(pageData);
    else this.navigateProject(pageData.post);
  }

  // loads a page, optionally initializing it on some post and section
  async loadPage(pageData){

    let loaderData= {
          composer: this.#_settings.composer[pageData.composer],
          page: this.#_settings.page[pageData.page],
          steps: [
            pageData.composer !== this.#_pageData.composer,
            pageData.page !== this.#_pageData.page, 
            pageData.post ? true : false, 
            pageData.section ? true : false
          ]
        };

    console.encapsulate("loadPage()", pageData, loaderData);
    let header, footer, page;

    if(!loaderData.composer) this.onPageFailedSevere();
    else if(!loaderData.page) {
      this.#_pageButtons= [];
      this.#_pageData= structuredClone(pageData);
      this.onPageFailedSoft();
    }
    else {

      let filePath= `${loaderData.composer.root}/${loaderData.page._name}`;

      if(loaderData.steps[0]) {
        header=await this.createHeader(this.#_settings.header[loaderData.composer.header], filePath),
        footer=await this.createFooter(this.#_settings.footer[loaderData.composer.footer], filePath);
      }

      if(loaderData.steps[1]) {
        document.dispatchEvent(HTMLBuilder.ONPAGEDESTROYED_EVENT);
        page= await this.createPage(loaderData.composer, loaderData.page, filePath);
      }

      if(loaderData.steps[2] || loaderData.steps[3]) console.log("call post/section handler");

      if(loaderData.page.showtitle) this.#_titleElement.textContent= `${this.#_siteTitle} - ${loaderData.page.title}`;
    }

    if(loaderData.steps[0]){
      this.#_pageContainers[0].innerHTML= this.#_pageContainers[2].innerHTML= "";
      this.#_pageContainers[0].append(header);
      this.#_pageContainers[2].append(footer);
    }

    if(loaderData.steps[1]){
      this.#_pageContainers[1].innerHTML= "";
      this.#_pageContainers[1].append(page);
      document.dispatchEvent(HTMLBuilder.ONPAGECREATED_EVENT);
    }

    this.updateButtons(pageData);

    //console.log(this.#_pageObjects);

    this.#_pageData= pageData;

    // call loadPost code then focusSection, both only if needed

  }

  createButtons(container){
    let pageButtons= this.getElementsWithAttributeFrom(container, "hb-lnk-page");
    for(const button of pageButtons) button.addEventListener('click', (e)=> this.loadQuery(`?${e.target.getAttribute("hb-lnk-page")}`));
  }

  updateButtons(pageData){

    this.#_pageButtons= this.getElementsWithAttributeFrom(document.body, "hb-lnk-page");

    let active;
    for(const button of this.#_pageButtons) {
      active= button.getAttribute("hb-lnk-page")===`${pageData.page}`;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active);
    }
  }

  applyDisplay(container, displayData){
    let element;
    for(const ds in displayData){
      element= this.getElementByBuilderIDFrom(container, ds);
      if(element) element.classList.toggle("hidden", !displayData[ds]);
    }
  }

  applySources(container) {

    let 
      elements= this.getElementsWithAttributeFrom(container, "hb-src"),
      src, value;

    if(elements && elements.length > 0) console.encapsulate("applySources()", elements);

    for(const e of elements){
      try {
        src= e.getAttribute("hb-src").split(":");
        value= this.#_resources.src[src[0]][src[1]];
        if(value) e.setAttribute("src", `${this.#_resources.src._dirs[src[0]]}/${value}`);
      }
      catch {
        console.group("Unable to find src for element");
        console.log([e, src, value]);
        console.groupEnd("Unable to find src for element");
      }
    }
  }

  parseVariables(container){
    
    let varElements= this.getElementsWithAttributeFrom(container, "hb-var");
    
    let name, value;
    for(const v of varElements){
      name= v.getAttribute("hb-var");
      value= this.#_settings.variables[name];
      if(!value) value= HTMLBuilder.getInternalVariable(name);
      if(value) v.innerHTML= value;
    }
  }

  async loadResources(resources, path, containerIndex){
    console.encapsulate("loadResources()", resources);

    this.#_pageResources[containerIndex].forEach(e=>e.remove());

    let element, resid;
    for(const res of resources){
      
      resid= res.shared ? `./_resources/shared/${res.file}` : `${path}/${res.file}`;

      if(res.type==="stylesheet"){
        element= document.createElement("link");
        element.setAttribute("rel", "stylesheet")
        element.setAttribute("href", resid);
      }
      else if(res.type==="script"){
        element= document.createElement("script");
        element.setAttribute("defer", "");
        element.setAttribute("src", resid);
      }

      this.#_pageResources[containerIndex].push(element);
      document.body.append(element);
    }
  }

  async loadPost(postData){

  }

  async focusSection(section){
    
  }

  /** ------------------------------------ CREATE HEADER ------------------------------------ */
  async createHeader(headerData, filePath){

    //console.encapsulate("createHeader()", headerData);
    const header= await HTMLBuilder.fetchHTML(headerData.module);
    
    if(headerData.navbar){
      let 
        navbar= this.getElementByBuilderIDFrom(header, "navbar"),
        navbarItem= this.getElementByBuilderIDFrom(header, "navbar-item"),
        item, button, page;

        for(const ni of headerData.navbar){
          
          item= HTMLBuilder.instantiateTemplate(navbarItem);
          page= this.#_settings.page[ni];
          
          if(page) {

            button= item.getElementsByTagName("BUTTON")[0];
            button.setAttribute("hb-lnk-page", ni);

            button.textContent= page.title?? "untitled";

            navbar.appendChild(item);
          }
          else console.error(`Navbar button '${ni}' was not created: unregistered page`);
        }
        navbarItem.remove();
    }

    this.createButtons(header);

    if(headerData.social){
      let 
        social= this.getElementByBuilderIDFrom(header, "social"),
        socialItem= this.getElementByBuilderIDFrom(header, "social-item"),
        item, link, image;

        for(const si of headerData.social){
          
          item= socialItem.content.cloneNode(true).children[0];

          if((si.link==="email" || this.#_resources.social[si.name]) && this.#_resources.src["img-soc"][si.image]){

            link= item.getElementsByTagName("A")[0];
            image= item.getElementsByTagName("IMG")[0];
  
            if(si.link==="url") link.setAttribute("href", `https://${this.#_resources.social[si.name]}`);
            else if(si.link==="email") link.setAttribute("href", "./_pages/internal/email.html");

            link.setAttribute("target", "_blank");
            image.setAttribute('src', `${this.#_resources.src._dirs["img-soc"]}/${this.#_resources.src["img-soc"][si.image]}}`);

            social.appendChild(item);
          }
          else console.error(`Social button '${si.name}' was not created: unregistered social`);
        }
        socialItem.remove();
    }

    if(headerData.resources) this.loadResources(headerData.resources, filePath, 0);
    if(headerData.display) this.applyDisplay(header, headerData.display);

    this.parseVariables(header);
    this.applySources(header);

    return header;
  }

  /** ------------------------------------ CREATE FOOTER ------------------------------------ */
  async createFooter(footerData, filePath){
    
    //console.encapsulate("createFooter()", footerData);
    const footer= await HTMLBuilder.fetchHTML(footerData.module);
    
    this.createButtons(footer);

    if(footerData.resources) this.loadResources(footerData.resources, filePath, 0);
    if(footerData.display) this.applyDisplay(footer, footerData.display);

    this.parseVariables(footer);
    this.applySources(footer);

    return footer;
  }

  /** ------------------------------------ CREATE PAGE ------------------------------------ */
  async createPage(composerData, pageData, filePath){
    
    //console.encapsulate("createPage()", composerData, pageData);
    const page= await HTMLBuilder.fetchHTML(`${filePath}/module`);
    
    if(pageData.resources) this.loadResources(pageData.resources, filePath, 0);
    if(pageData.display) this.applyDisplay(page, pageData.display);

    this.parseVariables(page);
    this.applySources(page);
    
    return page;
  }

  navigateProject(str){
    let project= this.#_settings.project[str];
    if(project) window.location.href=project.relative ? `${window.location.origin}/${project.location}` : project.location;
    else this.onPageFailedSevere();
  }

  onPageFailedSoft() {

    console.encapsulate("onPageFailedSoft()", this.#_pageData);
    if(this.#_pageData && this.#_pageData.page==="err404") this.onPageFailedSevere();
    else this.loadPage({ composer: "internal", page:"err404" });
  }

  onPageFailedSevere() { 
    window.location.assign(`${window.location.origin}/404`); 
  }
  
  /** ------------------------------------ HELPER FUNCTIONS ------------------------------------ */

  static instantiateTemplate= (template) => template.content.cloneNode(true).children[0];

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
    catch(e) { console.error(e.message); }
    return this.#nullElement.cloneNode(true);
  }
  
  /** Gets the page-parameter from a specifically formatted string */
  static getPage= (str) => str.includes("-") ? str.split('-') : ["default", str]; 

  /** Gets the DOM element with the specified 'bid' attribute's value */
  getElementByBuilderID= (str) =>  document.querySelector(`[b-id="${str}"]`);
  getElementByBuilderIDFrom= (parent, str) =>  parent.querySelector(`[hb-id="${str}"]`);

  /** Gets an array of DOM elements that have the specified attribute */
  getElementsWithAttribute= (str) =>  document.querySelectorAll(`[${str}]`);
  getElementsWithAttributeFrom= (parent, str) =>  parent.querySelectorAll(`[${str}]`);
  
  /** gets the name of the composer for the given page, first ocurrence only, or NULL if page is not registered */
  getComposerForPage= (pname) => this.#_settings.page[pname] ? this.#_settings.page[pname].composer : null;

  static #_DATE_NAMES= {
    DAY_SHORT: ["mon","tue","wed","thu","fri","sat","sun"],
    DAY_FULL: ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],
    MONTH_SHORT: ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],
    MONTH_FULL: ["january","february","march","april","may","june","july","august","september","october","november","december"]
  }

  static getInternalVariable(vname){
    if(vname.includes(':')){
      const vdata= vname.split(':');
      switch(vdata[0].toLowerCase()){
        case "date":
          let date= new Date(Date.now());
          if(vdata[1][0]==="Y"){
            if(vdata[1]==="YYYY") return String(date.getFullYear());
            if(vdata[1]==="YY") return String(date.getFullYear()).slice(2);
          }
          else if(vdata[1][0]==="M"){
            if(vdata[1]==="MMMM") return String(this.#_DATE_NAMES.MONTH_FULL[date.getMonth()]);
            if(vdata[1]==="MMM") return String(this.#_DATE_NAMES.MONTH_SHORT[date.getMonth()]);
            if(vdata[1]==="MM") {var m= date.getMonth(); return String(m < 10 ? `0${m}` : m);}
            if(vdata[1]==="M") return String(date.getMonth());
          }
          else if(vdata[1][0]==="D"){
            if(vdata[1]==="DDDD") return String(this.#_DATE_NAMES.DAY_FULL[date.getDay()]);
            if(vdata[1]==="DDD") return String(this.#_DATE_NAMES.DAY_SHORT[date.getDay()]);
            if(vdata[1]==="DD") {var d= date.getDate(); return String(d < 10 ? `0${d}` : d);}
            if(vdata[1]==="D") return String(date.getDate());
          }
        default: return String("UnknownVariable");
      }
    }
  }
}
