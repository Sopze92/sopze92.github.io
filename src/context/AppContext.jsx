import React from 'react'

import { _FetchJsonData } from "../res/lib/util.js"

const _APP_PATH= "app"
const _PORTFOLIO_PATH= "ptf"

export const Constants= Object.freeze({
  APP_MODE: { standard:0, util:1, project:2 },
  LEAVE_MODE: { link:0, mailto:1, project:2 },
  
  MISSING_FILE_STRING: '<b class="col-1">Missing file</b>',
  MISSING_TEXT_STRING: '<b class="col-1">Missing text string</b>',
  UNSAFE_HTML_STRING: '<b class="col-1">Unsafe Html detected</b>',

  INVALID_OVERLAY_ELEMENT: <b className="col-1">Invalid Overlay ID</b>
})

export const Functions= Object.freeze({
  checkHtmlSafety: (text)=>{
    return text.match(/<[^>]*(\s|script|javascript|=)+[^>]*>/g)== null
  },

  getOverlayElement: (id)=>{
    return _OVERLAY_COMPONENT_[id]
  },
  
  voidEvent: (e)=>{
    e.preventDefault()
    e.stopPropagation()
    return false
  }
})

import OverlaySlideshow from "../module/OverlaySlideshow.jsx"

const _OVERLAY_COMPONENT_= Object.freeze({
  slideshow: OverlaySlideshow
})

const _ERROR_RESOURCE_= Object.freeze({
  name: "ERROR",
  class: "",
  img: "",
  col: ["#FF00FF", "#FF00FF"]
})

export const Globals= React.createContext(null)

const AppContext= ReactComponent=>{
  const GlobalsWrapper= ()=>{
    const 
      [ globals, setGlobals ]= React.useState(
        globalsState({
          actions: ()=> globals.actions,
          get: {
            ready:        ()=> globals.ready,
            timestamp:    ()=> globals.timestamp,
            settings:     ()=> globals.settings,
            eventdata:    ()=> globals.eventdata,
            resources:    ()=> globals.resources,
            content:      ()=> globals.content,
            portfolio:    ()=> globals.portfolio,
            pagedata:     ()=> globals.pagedata,
            overlaydata:  ()=>globals.overlaydata,
          },
          set: {
            ready:        (newData)=> _setGlobal({ ready: Object.assign(globals.ready, newData ? newData : { setup:false, page:false } ) }),
            timestamp:    (newData)=> _setGlobal({ timestamp: Object.assign(globals.timestamp, newData ? newData : { page:false } ) }),
            settings:     (newData, replace=false)=> _setGlobal({ main: replace ? newData : Object.assign(globals.settings, newData) }),
            eventdata:    (newData, replace=false)=> _setGlobal({ main: replace ? newData : Object.assign(globals.eventdata, newData) }),
            resources:    (newData, replace=false)=> _setGlobal({ main: replace ? newData : Object.assign(globals.resources, newData) }),
            content:      (newData, replace=false)=> _setGlobal({ main: replace ? newData : Object.assign(globals.content, newData) }),
            portfolio:    (newData, replace=false)=> _setGlobal({ main: replace ? newData : Object.assign(globals.portfolio, newData) }),
            pagedata:     (newData, replace=false)=> _setGlobal({ main: replace ? newData : Object.assign(globals.pagedata, newData) }),
            overlaydata:  (newData, replace=false)=> _setGlobal({ main: replace ? newData : Object.assign(globals.overlaydata, newData) }),
				  }
        })
    )

    const _setGlobal= (newData)=> {

			const newGlobals= {}
      for(let [k,v] of Object.entries(globals)){
        newGlobals[k]= v
      }
			for(const k in newData) newGlobals[k]= newData[k]
			setGlobals(newGlobals)
    }

    React.useEffect(()=>{ 
      globals.actions._initialize() 
    },[])

    React.useEffect(()=>{

      let scrollbar= true
      for (const [, v] of Object.entries(globals.overlaydata)) {
        if(v.active) {
          scrollbar= false
          break;
        }
      }
      document.body.classList.toggle("hidescroll", !scrollbar)

    },[globals.overlaydata.timestamp])

		return (
			<Globals.Provider value={globals}>
				<ReactComponent/>
			</Globals.Provider>
		)
  }
  return GlobalsWrapper
}

export default AppContext

// #region GLOBALSTATE

const globalsState= ({ actions, get, set })=> {
  return {
    ready: { setup:false, page:false, portfolioList:false, portfolioBody:false },
    timestamp: { page: 0 },
    settings: {},
    eventdata: { mousemove: {}, scroll: {} },
    content: {},
    resources: {},
    portfolio: {},
    pagedata: {},
    overlaydata: { slideshow:{} },

    actions: {

      // #region GENERAL

      _initialize: async ()=>{

        set.ready({ setup:false })

        const 
          builder= await _FetchJsonData(_APP_PATH, "settings.json"),
          resources= await _FetchJsonData(_APP_PATH, "resources.json"),
          qry= !window.location.search ? builder.default.query : window.location.search,
          content= { header: Object.keys(builder.header), footer: Object.keys(builder.footer), page: Object.keys(builder.page) }
          
        if (!builder.variables) builder.variables = {}
        
        for(const e in builder.page) builder.page[e] = { ...structuredClone(builder.default.page), ...builder.page[e], _name: e }
        
        _resolveImagePaths(["social", "lang", "tech", "engine", "app"])

        delete builder.default
      
        set.settings({...builder, qry })
        set.resources(resources)
        set.content(content)
        
        set.ready({ setup:true })

        function _resolveImagePaths(types){
          for(const i in types){
            const 
              _type= types[i],
              imgroot= resources[_type]._imgroot
            for(const e in resources[_type]) {
              if(e=="_imgroot") continue
              else {
                const src= resources[_type][e].src
                resources[_type][e].src= src ? `${imgroot}/${src}` : null
              }
            }
            delete resources[_type]._imgroot
          }
        }
      },

      setEventdata: (e)=>{
        const new_eventdata= {}

        switch(e.type??null){
          case 'mousemove':
            new_eventdata.mousemove= { timestamp: Date.now(), event: e }
            break
          case 'scroll':
            new_eventdata.scroll= { timestamp: Date.now(), event: e }
            break
        }
        set.eventdata({ ...get.eventdata(), ...new_eventdata } )
      },

      getEventdata: (name)=>{
        return get.eventdata()[name]?.event?? {}
      },

      submitContactForm: async(data)=>{
        const res= await fetch("https://fabform.io/f/W8Kl5O7", { method: "POST", body: data })
        console.log(res.ok)
        return res.ok
      },

      // #region PAGE

      setPage: (name)=>{

        set.ready({page: false})
        const _name= actions().parsePageName(name)

        if(_name){
          const data= get.settings().page[_name]

          if(!data.indent) data.indent= get.settings().general.indent;

          set.pagedata(data)
          set.ready({page: data != null})
          return data != null
        }
        return false
      },

      setPageDirty: (hard=false)=>{
        set.timestamp({ page: Date.now(), pageHard: hard })
      },

      getPageTitle: (name)=>{
        const _name= actions().parsePageName(name)
        return _name ? get.settings().page[_name].title : "ERR"
      },
      
      getHeader: (name)=>{ return actions().getObjectByName("header", name) },
      getFooter: (name)=>{ return actions().getObjectByName("footer", name) },

      getResourceList: (typename)=> Object.keys(get.resources()[typename]??{}),
      getAllResources: (typename)=> Array.from(Object.values(get.resources()[typename]?? {})).filter(e=>typeof e === 'object'),
      getResource: (name)=> {
        const path= name.includes(':') ? name.split(":") : name
        return get.resources()[path[0]][path[1]]?? _ERROR_RESOURCE_
      },

      getObjectByName: (type, name)=>{
        if(!name) return get.settings()[type].default
        let obj= get.settings()[type][name]?? null
        return obj==="NULL" ? null : obj
      },

      setIndentColor: (value)=>{
        if(!value) value= get.settings().general.indent
        const new_pagedata= structuredClone(get.pagedata())
        new_pagedata.indent= value

        set.pagedata(new_pagedata)
      },
      
      // #endregion

      // #region PORTFOLIO

      loadPortfolioElement: async(id)=>{
        
        set.ready({portfolioBody: false})

        let 
          body= {},
          success= false
        
        try{
          body= await _FetchJsonData(_PORTFOLIO_PATH, id + ".json")

          //console.log(`parsing item with id: ${id}`)

          body.name= id
          if(body.description && !Functions.checkHtmlSafety(body.description)) body.description=Constants.UNSAFE_HTML_STRING
          
          if(body.content?.length?? -1 > 0){
            for(let i in body.content) ensureHtmlSafety(body.content[i])
          }

          success= true
        }
        catch(e){
          console.log(`Unable to read portfolio file: ${id}.json`)
         }

        set.portfolio({...get.portfolio(), body})
        set.ready({portfolioBody: success})

        function ensureHtmlSafety(element){
          
          switch(element.type?? -1){

            case "row":
            case "col":
              //console.log(`found div with ${element.data.length} elements`)
              for(let i in element.data) ensureHtmlSafety(element.data[i])
              break
            case "txt":
            case "txt:blk":
              //console.log("found text")
              if (!Functions.checkHtmlSafety(element.data)) {
                console.log("unsafe HTML detected: ", element.data)
                element.data= Constants.UNSAFE_HTML_STRING
              }
              break
            case "txt:ol":
            case "txt:ul":
              //console.log(`found list with ${element.data.length} elements`)
              for(let i in element.data){
                if (!Functions.checkHtmlSafety(element.data[i])) {
                  console.log("unsafe HTML detected: ", element.data[i])
                  element.data[i]= Constants.UNSAFE_HTML_STRING
                }
              }
              break
          }
        }
      },

      loadPortfolio: async( reset=false )=>{
        set.ready({portfolioList: false, portfolioBody: get.ready().portfolioBody && !reset})
        
        const 
          portfolio= await _FetchJsonData(_APP_PATH, "portfolio.json")

        for(let i in portfolio.items){
          if(portfolio.items[i].name && !Functions.checkHtmlSafety(portfolio.items[i].name)) portfolio.items[i].name=Constants.UNSAFE_HTML_STRING
        }

        set.portfolio({...get.portfolio(), ...portfolio})
        set.ready({portfolioList: portfolio != null})
      },

      getPortfolioItem: (name)=>{
        try{
          if(get.ready().portfolio){
            const item= get.portfolio().content[name]
            return {...item, id:name, timestamp: Date.now() }
          }
        }
        catch(e){
          console.log(e)
          set.portfolio({ active: null })
          return null
        }
      },
      
      // #endregion

      // #region OVERLAYS

      setOverlayData: (id, data)=>{
        const new_overlaydata= structuredClone(get.overlaydata())
        new_overlaydata[id]= data
        new_overlaydata.timestamp= Date.now()
        set.overlaydata(new_overlaydata)
      },

      clearOverlayData: (id)=>{
        actions().setOverlayData(id, {active:false})
      },

      // #endregion

      // #region PARSERS
  
      parsePageName: (name)=>{
        const cfg= get.settings()
        return cfg.page[name] ? name : cfg.aliases[name] ? cfg.aliases[name] : null
      },
      
      parseQuery: (query)=>{
        const params= query.split(/(?=-|:)/);
        return actions().resolvePage({
          page: getParam('?'),
          post: getParam('-'),
          section: getParam(':')
        })
        function getParam(char){ 
          const param= params.find(e=>e[0]===char) 
          return param? param.slice(1) : null }
      },

      navigateQuery: (query)=>{ 
        actions().setPage(
          get.pagedata(
            actions().parseQuery(query)
          )
        )},
    
      resolvePage: (data)=>{
        if(data.page === "project"){
          return { 
            _name: "",
            page: get.settings().page.leaving,
            post: data.post,
            leaving: true,
            leavemode: Constants.LEAVE_MODE.project
          };
        }
        else{
          const _page= actions().getObjectByName("page", data.page)
          if(_page){
            return {
              header: actions().getObjectByName("header", _page.header),
              footer: actions().getObjectByName("footer", _page.footer),
              page: _page,
              post: data.post,
              section: data.section,
              title: _page.showTitle? _page.title : ""
            }
          }
          else {
            console.warn("null or bad pagedata provided, fallback to default")
            onPageFailedSoft()
          }
        }
        return null
      }
      
      // #endregion
    }
  }
}
// #endregion