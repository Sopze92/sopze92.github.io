import React from 'react'

import { Globals, Functions, Constants } from "../context/AppContext.jsx"

import EdgedScrollbar from "../component/EdgedScrollbar.jsx"

import PortfolioArticle from "../module/PortfolioArticle.jsx"

import usePagedata from '../hooks/usePagedata.jsx'
import useCustomTags from '../hooks/useCustomTags.jsx'

import Share from '../res/img/common/share.svg'
import Clipboard from '../res/img/common/clipboard.svg'
import GripVertical from '../res/img/common/grip_vertical.svg'

const Page= ()=>{

  usePagedata("portfolio")
  
  const
    { ready, timestamp, portfolio, eventdata, actions }= React.useContext(Globals),
    [explorerFixed, set_explorerFixed]= React.useState(false),
    [explorerStyle, set_explorerStyle]= React.useState(null),
    [filters, set_filters]= React.useState(null),
    [queryParams, set_queryParams]= React.useState(getNavigatorBaseQuery()),
    [itemCount, set_itemCount]= React.useState(null),
    [buttonInfo_text, set_buttonInfo_text]= React.useState(""),
    [buttonInfo_timeout, set_buttonInfo_timeout]= React.useState(null),
    explorerWrapper_ref= React.useRef(null),
    article_ref= React.useRef(null)

  const customTags= useCustomTags()

  React.useEffect(()=>{ async function handle(){
    await actions.loadPortfolio(true)
    Functions.setScroll(0, 0)

    const 
      pArticle= queryParams.a?? portfolio.items.find(e=>e.default).id,
      pFilters= queryParams.f,
      new_filters= {}

    // intialize filters

    let type
    if(pFilters){
      for(let i=0; i< portfolio.types.length; i++){
        type= portfolio.types[i]
        new_filters[type.id]= {
          state: pFilters.includes(type.id),
          mode: type.mode
        }
      }
    }
    else {
      for(let i=0; i< portfolio.types.length; i++){
        type= portfolio.types[i]
        new_filters[type.id]= {
          state: type.active || true,
          mode: type.mode
        }
      }
    }

    // initialize article

    const _article= portfolio.items.find(e=>e.id==pArticle)

    if(!ready.portfolioBody || timestamp.pageHard){
      actions.loadPortfolioElement(_article.id)
    }

    setTimeout(() => {
      toggleExplorer()
      if(window.innerWidth < 992) Functions.scrollTo(0, window.innerWidth < 992 ? (window.innerHeight + (Constants.DESKTOP ? 40 : 30)) : 0 )
    }, 250)

    updateFilters(new_filters)

  } handle() },[timestamp.page])

  // on main scroll
  React.useEffect(()=>{

    if(Constants.DESKTOP){

      const 
        event= actions.getEventdata('scroll'),
        target= event.target
  
      if(target){
        const 
          fsize= parseFloat(getComputedStyle(target).fontSize),
          fixed= target.scrollTop > (6*fsize)
  
          if(fixed != explorerFixed) set_explorerFixed(fixed)
      }
    }

  },[eventdata.scroll.timestamp])

  // update query params on URL
  React.useEffect(()=>{
    
    if (ready.portfolioBody && window.history.replaceState) {

      const url = new URL(window.location.href)
      url.search = ""

      if(queryParams){
        let _params= []
        if(queryParams.f) _params.push("f=" + queryParams.f.join(','))
        if(queryParams.a) _params.push("a=" + queryParams.a)
        url.search = _params.length > 0 ? "?" + _params.join('&') : ""
      }

      if(!url.href != window.location.href) {
        window.history.replaceState({ path: url.origin, type: "query" }, "", url)
      }
    }

  },[queryParams])

  function getNavigatorBaseQuery(){
    const _queryParams= new URLSearchParams(window.location.search)
    return {f:_queryParams.get('f'), a:_queryParams.get('a')}
  }

  // update filters
  function updateFilters(new_filters){
    set_filters(new_filters)
    if(new_filters) set_itemCount(portfolio.items.filter(e=>
      shouldListElement(e.types, new_filters)
    ).length)
    
    set_queryParams({...queryParams, f:Object.keys(new_filters).filter(e=>new_filters[e].state)})
  }

  // filter click
  function handleFilterClick(name){
    const new_filters= structuredClone(filters)
    new_filters[name].state= !new_filters[name].state
    updateFilters(new_filters)
  }

  // filter doubleclick
  function handleFilterDoubleclick(name){
    const new_filters= structuredClone(filters)
    for(const [k,] of Object.entries(new_filters))
    {
      new_filters[k].state= k==name
    }
    updateFilters(new_filters)
  }

  // element click
  async function handleElementClick(id){
    if(await actions.loadPortfolioElement(id)){
      setTimeout(() => { 
        Functions.scrollTo(0, window.innerWidth < 992 ? (window.innerHeight + (Constants.DESKTOP ? 40 : 30)) : 0 )
        toggleExplorer()
      }, 125)
    }

    set_queryParams({...queryParams, a:id})
  }

  // share click
  async function handleShareClick(e){
    
    let data
    if(portfolio.body.name=="0_welcome")
      data= {
        title: "At Sopze's",
        text: "Portfolio page",
        url: window.location.toString().split('?')[0]
      }
    else 
      data= {
        title: "At Sopze's - Portfolio",
        text: Functions.cleanRichText(portfolio.body.title),
        url: `${window.location.toString().split('?')[0]}?a=${portfolio.body.name}`
      }

    const result= await actions.share(data)
    updateButtonInfoText(result ? "Thanks for sharing!" : "Couldn't share article!")
  }

  // clipboard click
  async function handleClipboardClick(e){
    const result= await actions.clipboard(portfolio.body.name=="0_welcome" ? window.location.toString().split('?')[0] : `${window.location.toString().split('?')[0]}?a=${portfolio.body.name}`)
    updateButtonInfoText(result ? "URL copied to clipboard!" : "Couldn't copy URL!")
  }

  // explorer toggle
  function toggleExplorer(){
    if(explorerStyle) set_explorerStyle(null)
    else set_explorerStyle({"--cv-explorer-margin": `${-explorerWrapper_ref.current.clientWidth}px`})
  }

  function updateButtonInfoText(text){
    set_buttonInfo_text(text)
    if(buttonInfo_timeout) clearTimeout(buttonInfo_timeout)
    set_buttonInfo_timeout(setTimeout(()=>{ set_buttonInfo_text("") }, 1500))
  }

  // element showstate compute
  function shouldListElement(types, _filters=filters){

    if(!types) return false
    else if(types.length == 0) return true 

    let 
      result= false,
      filter
    for(let i=0; i< types.length; i++){

      filter= _filters[types[i]]

      if(filter.state) result= true
      else if(filter.mode=="and") return false
    }
    return result
  }
  
  // ----------------------------- RETURN

  return ( 
    <>
    <div className="container-fluid px-0 mx-0" style={{"--fx-col-text": "#eee"}}>
      <div className="d-flex ptf-container">
        { ready.portfolioList && 
          (
          <div className="ptf-explorer-container ptf-start" style={explorerStyle}>
            <div ref={explorerWrapper_ref} className={`ptf-explorer-wrapper ${(explorerFixed && Constants.DESKTOP) ? "ptf-fixed" : ""}`}>
              <button onClick={()=>toggleExplorer()} className="to-div ptf-explorer-toggler"><GripVertical/></button>
              <div className="ptf-explorer">
                <p className="text-center m-0 py-3 fs-3 no-select fw-semibold">Portfolio Explorer</p>
                <div>
                  { filters &&
                    <>
                    { portfolio.types &&
                      <ul className="d-flex mx-1 my-0 p-0 ptf-explorer-types">
                        { portfolio.types.map(e=>
                            <li key={`pf-ht-${e.id}`} className={`mode-${e.mode} ${filters[e.id].state ? "active" : ""}`} onClick={()=>handleFilterClick(e.id)} onDoubleClick={()=>handleFilterDoubleclick(e.id)}>{e.name}</li>
                          )
                        }
                      </ul>
                    }
                    { portfolio.items &&
                      <EdgedScrollbar className="ptf-explorer-list-wrapper" options={{overflow:{x:'hidden'}, scrollbars:{visibility:'visible'}}}>
                        <ul className="d-flex flex-column fs-5 ptf-explorer-list">
                          {
                            portfolio.items.map(e=> {
                              const _classname= (portfolio.body?.name===e.id ? "active " : "") + (shouldListElement(e.types) ? "" : "ptf-filtered")
                              return <li key={`pf-he-${e.id}`} className={_classname != "" ? _classname : null} onClick={()=>handleElementClick(e.id)} {...customTags.innerHtml(e.name)}/>
                            })
                          }
                          <li className={(itemCount > 0 ? "ptf-filtered" : "") + " text-warning text-center ptf-noitems"}>Nothing to show...</li>
                        </ul>
                      </EdgedScrollbar>
                    }
                    </>
                  }
                </div>
                { Functions.isHttps() && 
                  (
                    <>
                      <div className="d-flex ptf-explorer-sharebuttons p-3 gap-3">
                        { navigator.canShare &&
                          <button disabled={!ready.portfolioBody} className="to-div" onClick={(e)=>handleShareClick(e)}><Share/></button>
                        }
                        <button disabled={!ready.portfolioBody} className="to-div" onClick={(e)=>handleClipboardClick(e)}><Clipboard/></button>
                      </div>
                      <p className="text-center fs-4">{buttonInfo_text}</p>
                    </>
                  )
                }
              </div>
            </div>
          </div>
          )
          ||
          (
            __PORTFOLIO_EXPLORER_PLACEHOLDER__
          )
        }
        <div ref={article_ref} className={`${Constants.DESKTOP ? "col-12 col-xl-9" : "col-12"} ptf-start edgedicon-portfolio`}>
        { ready.portfolioBody && 
          (
            <PortfolioArticle portfolioNavigator={handleElementClick}/>
          )
        }
        </div>
      </div>
      { Constants.DESKTOP && portfolio.body && portfolio.body.overlay &&
        <div className="overlay-container">
          { portfolio.body.overlay.map((e,i)=>
              {
                const Element= Functions.getOverlayElement(e.type)
                return Element ? <Element key={`pf-ol-${i}`} /> : Constants.INVALID_OVERLAY_ELEMENT
              }
            )
          }
        </div>
      }
    </div>
    </>
  )
}

export default Page

// PLACEHOLDER

const __PORTFOLIO_EXPLORER_PLACEHOLDER__=
  (
  <div className="ptf-explorer-container ptf-start">
    <div className="ptf-explorer-wrapper">
      <div className="ptf-explorer-toggler"/>
      <div className="ptf-explorer">
        <p className="text-center m-0 py-3 fs-3 no-select fw-semibold">Portfolio Explorer</p>       
        <ul className="d-flex justify-content-evenly ptf-explorer-types placeholder-glow">   
          <li className="active"><span className="placeholder">000</span></li>
          <li className="active"><span className="placeholder">000</span></li>
          <li className="active"><span className="placeholder">000</span></li>
          <li className="active"><span className="placeholder">000</span></li>
        </ul>
        <div className="ptf-explorer-list-wrapper">
          <ul className="d-flex flex-column fs-5 ptf-explorer-list placeholder-glow">
            <li className=""><span className="placeholder col-7"></span></li>
            <li className=""><span className="placeholder col-4"></span></li>
            <li className=""><span className="placeholder col-11"></span></li>
            <li className=""><span className="placeholder col-5"></span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  )