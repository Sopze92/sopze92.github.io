import React from 'react'

import { Globals, Functions, Constants } from "../context/AppContext.jsx"

import EdgedScrollbar from "../component/EdgedScrollbar.jsx"

import PortfolioArticle from "../module/PortfolioArticle.jsx"

import usePagedata from '../hooks/usePagedata.jsx'
import useCustomTags from '../hooks/useCustomTags.jsx'

const Page= ()=>{

  usePagedata("portfolio")
  
  const
    { ready, timestamp, portfolio, eventdata, actions }= React.useContext(Globals),
    [explorerFixed, set_explorerFixed]= React.useState(false),
    [filters, set_filters]= React.useState(null),
    [itemCount, set_itemCount]= React.useState(null)

  const 
    os_ref= React.useRef(null);

  const customTags= useCustomTags()

  React.useEffect(()=>{ async function handle(){
    await actions.loadPortfolio(true)

    const 
      queryParams= new URLSearchParams(window.location.search),
      pArticle= queryParams.get('a'),
      pFilters= queryParams.get('f')?.split(','),
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

    updateFilters(new_filters)

    // initialize article

    const 
      article= (pArticle && portfolio.items.find(e=>e.id==pArticle)) ? pArticle : portfolio.items.find(e=>e.default).id

    if(!ready.portfolioBody || timestamp.pageHard){
      actions.loadPortfolioElement(article)
    }

  } handle() },[timestamp.page])

  // on main scroll
  React.useEffect(()=>{

    const 
      event= actions.getEventdata('scroll'),
      target= event.target

    if(target){
      const 
        fsize= parseFloat(getComputedStyle(target).fontSize),
        fixed= target.scrollTop > (6*fsize)

        if(fixed != explorerFixed) set_explorerFixed(fixed)
    }

  },[eventdata.scroll.timestamp])

  // update filters
  function updateFilters(new_filters){
    set_filters(new_filters)
    if(new_filters) set_itemCount(portfolio.items.filter(e=>
      (e.types ? shouldListElement(e.types, new_filters) : true)
    ).length)
  }

  // filter flick
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
    actions.loadPortfolioElement(id)
  }

  // element showstate compute
  function shouldListElement(types, _filters=filters){
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
    <div className="container-fluid px-0 mx-0 overflow-hidden" style={{"--fx-col-text": "#eee"}}>
      <div className="d-flex ptf-container">
        { ready.portfolioList && 
          (
          <div className="ptf-explorer-container ps-4">
            <div className={`ptf-explorer ${explorerFixed ? "ptf-explorer-fixed" : ""}`}>
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
                            const _classname= (portfolio.body?.name===e.id ? "active " : "") + (!e.types || shouldListElement(e.types) ? "" : "ptf-filtered")
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
            </div>
          </div>
          )
          ||
          (
            __PORTFOLIO_EXPLORER_PLACEHOLDER__
          )
        }
        { ready.portfolioBody && 
          (
            <PortfolioArticle/>
          )
        }
        <div className="col-1"></div>
      </div>
      { portfolio.body && portfolio.body.overlay &&
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

// PLACEHOLDER PAGE

const __PORTFOLIO_EXPLORER_PLACEHOLDER__=
  (
  <div className="col-3 ps-4">
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
  )