import React from 'react'

import { _FetchJsonData } from "../res/lib/util.js"

import Home from "../page/home.jsx"
import Portfolio from "../page/portfolio.jsx"
import AboutMe from "../page/aboutme.jsx"
import Resume from "../page/resume.jsx"
import Services from "../page/services.jsx"
//import Utils from "../page/utils.jsx"
//import Project from "../page/project.jsx"
//
//import Err404 from "./module/err404.jsx"

export const Constants= Object.freeze({
  APP_MODE: { standard:0, util:1, project:2 },
  APP_PAGES: { 
    home:       Home, 
    portfolio:  Portfolio,
    aboutme:    AboutMe,
    services:   Services,
    resume:     Resume,
/*    utils:      Utils,
    project:    Project,
    err404:     Err404*/
  },
  LEAVE_MODE: { link:0, mailto:1, project:2 }
})

const _APP_PATH= "src/app"

export const Globals= React.createContext(null)

const AppContext= ReactComponent=>{
  const GlobalsWrapper= ()=>{
    const 
      [ globals, setGlobals ]= React.useState(
        globalsState({
          get: {
            ready: ()=> globals.ready,
            settings: ()=> globals.settings,
            events: ()=> globals.events,
            resources: ()=> globals.resources,
            content: ()=> globals.content,
            pagedata: ()=> globals.pagedata,

            actions: ()=> globals.actions
          },
          set: {
            ready: (newReady)=> _setGlobal({ ready: Object.assign(globals.ready, newReady ? newReady : { setup:false, page:false } ) }),
            settings: (newSettings, replace=false)=> _setGlobal({ main: replace ? newSettings : Object.assign(globals.settings, newSettings) }),
            events: (newEvents, replace=false)=> _setGlobal({ main: replace ? newEvents : Object.assign(globals.events, newEvents) }),
            resources: (newResources, replace=false)=> _setGlobal({ main: replace ? newResources : Object.assign(globals.resources, newResources) }),
            content: (newContent, replace=false)=> _setGlobal({ main: replace ? newContent : Object.assign(globals.content, newContent) }),
            pagedata: (newPagedata, replace=false)=> _setGlobal({ main: replace ? newPagedata : Object.assign(globals.pagedata, newPagedata) })
          }
        })
    )

    const _setGlobal= (newData)=> {
			const newGlobals= {
        ready: globals.ready,
        settings: globals.settings,
        events: globals.events,
        resources: globals.resources,
        content: globals.content,
        pagedata: globals.pagedata,

        actions: globals.actions
			}
			for(const k in newData) newGlobals[k]= newData[k]
			setGlobals(newGlobals)
    }

    React.useEffect(()=>{ 
      globals.actions._initialize() 
      window.dev_globals= globals
      
      //window.addEventListener('mousemove', (e)=> { _setGlobal( { events: { mousemove: e } } ) })
    },[])

		return (
			<Globals.Provider value={globals}>
				<ReactComponent/>
			</Globals.Provider>
		)
  }
  return GlobalsWrapper
}

export default AppContext

const eventsState= ({ get, set })=> {
  return {
    mousemove: { event: null }
  }
}

const globalsState= ({ get, set })=> {
  return {
    ready: { setup: false, page: false },
    settings: {},
    events: {},
    resources: {},
    content: {},
    pagedata: { content: null },

    actions: {

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

        window._ctx= { settings: {...builder, qry }, resources, content}
        
        set.ready({setup:true})

        function _resolveImagePaths(types){
          for(const i in types){
            const 
              _type= types[i],
              imgroot= resources[_type]._imgroot
            for(const e in resources[_type]) {
              if(e=="_imgroot") continue
              else {
                const img= resources[_type][e].img
                resources[_type][e].img= `${imgroot}/${img}`
              }
            }
            delete resources[_type]._imgroot
          }
        }
      },

      setPage: (name)=>{

        const _name= get.actions().parsePageName(name)

        if(_name){
          const 
            data= get.settings().page[_name],
            content= Constants.APP_PAGES[_name]

          set.pagedata({content, data})
          set.ready({page: content != null})
          return content != null
        }
        return false
      },
  
      parsePageName: (name)=>{
        const cfg= get.settings()
        return cfg.page[name] ? name : cfg.aliases[name] ? cfg.aliases[name] : null
      },
      
      getHeader: (name)=>{ return get.actions().getObjectByName("header", name) },
      getFooter: (name)=>{ return get.actions().getObjectByName("footer", name) },

      getObjectByName: (type, name)=>{
        if(!name) return get.settings()[type].default
        let obj= get.settings()[type][name]?? null
        return obj==="NULL" ? null : obj
      },

      getResource: (reference)=> {
        const path= reference.split(":")
        return get.resources()[path[0]][path[1]]
      },

      getPageTitle: (name)=>{
        const _name= get.actions().parsePageName(name)
        return _name ? get.settings().page[_name].title : "ERR"
      },
      
      getSrcPath: (reference)=>{
        const 
          res= get.resources(),
          path= reference.split(":")
        return `${res.src._dirs[path[0]]}/${res.src[path[0]][path[1]]}`
      },
      
      parseQuery: (query)=>{
        const params= query.split(/(?=-|:)/);
        return get.actions().resolvePage({
          page: getParam('?'),
          post: getParam('-'),
          section: getParam(':')
        })
        function getParam(char){ 
          const param= params.find(e=>e[0]===char) 
          return param? param.slice(1) : null }
      },

      navigateQuery: (query)=>{ set.pagedata(get.actions().parseQuery(query)) },
    
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
          const _page= get.actions().getObjectByName("page", data.page)
          if(_page){
            return {
              header: get.actions().getObjectByName("header", _page.header),
              footer: get.actions().getObjectByName("footer", _page.footer),
              page: _page,
              post: data.post,
              section: data.section,
              title: _page.showTitle? _page.title : ""
            }
          }
          else {
            console.warn("null or bad pageData provided, fallback to default")
            onPageFailedSoft()
          }
        }
        return null
      }
    }
  }
}