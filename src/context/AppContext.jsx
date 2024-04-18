import React from 'react'

import { _FetchJsonData } from "../res/lib/util.js"

import Home from "../page/home.jsx"
//import Portfolio from "../web/page/portfolio.jsx"
//import AboutMe from "../web/page/aboutme.jsx"
//import Resume from "../web/page/resume.jsx"
//import Utils from "../web/page/utils.jsx"
//import Project from "../web/page/project.jsx"
//
//import Err404 from "./web/err404.jsx"

export const Constants= Object.freeze({
  APP_MODE: { standard:0, util:1, project:2 },
  APP_PAGES: { 
    home:       Home, 
/*    portfolio:  Portfolio,
    aboutme:    AboutMe,
    portfolio:  Portfolio,
    services:   Services,
    resume:     Resume,
    utils:      Utils,
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
        gobalsState({
          get: {
            ready: ()=> globals.ready,
            settings: ()=> globals.settings,
            resources: ()=> globals.resources,
            content: ()=> globals.content,
            pagedata: ()=> globals.pagedata,

            actions: ()=> globals.actions
          },
          set: {
            ready: (newReady)=> _set({ ready: Object.assign(globals.ready, newReady ? newReady : {setup:false, page:false} ) }),
            settings: (newSettings, replace=false)=> _set({ main: replace ? newSettings : Object.assign(globals.settings, newSettings) }),
            resources: (newResources, replace=false)=> _set({ main: replace ? newResources : Object.assign(globals.resources, newResources) }),
            content: (newContent, replace=false)=> _set({ main: replace ? newContent : Object.assign(globals.content, newContent) }),
            pagedata: (newPagedata, replace=false)=> _set({ main: replace ? newPagedata : Object.assign(globals.pagedata, newPagedata) })
          }
        })
    )

    const _set= (newData)=> {
			const newGlobals= {
        ready: globals.ready,
        settings: globals.settings,
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
    },[])

		return (
			<Globals.Provider value={globals}>
				<ReactComponent />
			</Globals.Provider>
		)
  }
  return GlobalsWrapper
}

export default AppContext

const gobalsState= ({ get, set })=> {
  return {
    ready: { setup: false, page: false },
    settings: {},
    resources: {},
    content: {},
    pagedata: { content: null },

    actions: {

      _initialize: async ()=>{

        set.ready({ setup:false })

        const 
          builder= await _FetchJsonData(_APP_PATH, "settings.json"),
          resources= await _FetchJsonData(_APP_PATH, "resources.json")
    
        const 
          qry= !window.location.search ? builder.default.query : window.location.search,
          content= { header: Object.keys(builder.header), footer: Object.keys(builder.footer), page: Object.keys(builder.page) }
      
        if (!builder.variables) builder.variables = {}
        
        for(const e in builder.page) builder.page[e] = { ...structuredClone(builder.default.page), ...builder.page[e], _name: e }
      
        delete builder.default
      
        set.settings({...builder, qry })
        set.resources(resources)
        set.content(content)
        
        set.ready({setup:true})
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

      getPageTitle: (name)=>{
        const _name= get.actions().parsePageName(name)
        return _name ? get.settings().page[_name].title : "ERR"
      },
      
      getSrcPath: (root, object)=>{
        return get.resources().src[root][object]
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