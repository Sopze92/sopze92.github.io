import React from "react"

import { Globals } from "../context/AppContext.jsx"
import useCustomTags from '../hooks/useCustomTags.jsx'

import EdgedScrollbar from "../component/EdgedScrollbar.jsx"

export const CarouselRowSimple= ({ cssClass, items })=>{

  const 
    { actions }= React.useContext(Globals),
    customTags= useCustomTags()
  
  function handleClick(e, idx){
    e.preventDefault()
    e.stopPropagation()

    actions.setOverlayData('slideshow', {
      active: true,
      content: items,
      current: idx,
      timestamp: Date.now()
    })

    return false
  }

  return (
     <div className={`s-carouselrowsimple ${cssClass?? ""}`}>
      { 
        items.map((e,i)=>{
          return (
            <div key={`car-${i}`} className={"carousel-element-wrapper"}>
              <div className={"carousel-element"}>
                <a className="image-frame-hoverable square-img d-block" onClick={ev=>handleClick(ev,i)} href={e.src}>
                  <img src={e.src}/>
                </a>
                <p className="w-100 text-center" {...customTags.innerHtml(e.title)}/>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export const CarouselRow= ({ cssClass, aspect=null, items })=>{

  const 
    { actions }= React.useContext(Globals),
    [ activeIndex, set_activeIndex]= React.useState(0)
    
  const customTags= useCustomTags()
  
  function handleClickImage(e){
    e.preventDefault()
    e.stopPropagation()
    return false
  }
  
  function handleDoubleclickImage(e){
    e.preventDefault()
    e.stopPropagation()

    actions.setOverlayData('slideshow', {
      active: true,
      content: items,
      current: activeIndex,
      timestamp: Date.now()
    })

    return false
  }

  function handleClickList(e, idx){
    e.preventDefault()
    e.stopPropagation()

    set_activeIndex(idx)

    return false
  }

  return (
     <div className={`s-carouselrow ptf-width-limit ${cssClass?? ""}`}>
      <div className="p-4 carousel-bigimage" {...(aspect ? { style: {aspectRatio: aspect} } : null)} >
        <a className="d-block" onClick={handleClickImage} onDoubleClick={handleDoubleclickImage} href={items[activeIndex].src}>
          <img src={items[activeIndex].src}/>
        </a>
        <div className="carousel-info-panel">
          { items[activeIndex].title && <p className="w-100 fs-2 fw-semibold text-start m-0 ms-3 p-0 pt-2" {...customTags.innerHtml(items[activeIndex].title)}/>}
          { items[activeIndex].desc && <p className="w-100 text-start m-0 mt-1 ms-5 p-0 pb-3" {...customTags.innerHtml(items[activeIndex].desc)}/>}
        </div>
      </div>
      <EdgedScrollbar options={{overflow:{y:'hidden'}, scrollbars:{visibility:'visible'}}} className="carousel-listx osc-flex-row osc-full">
        { 
          items.map((e,i)=>
            <button key={`cs-btn-${i}`} className={`button-img ${activeIndex==i ? "active" : ""}`} onClick={ev=>handleClickList(ev,i)} href={e.src}>
              <img src={e.src}/>
            </button>
          )
        }
      </EdgedScrollbar>
    </div>
  )
}

export const CarouselColumn= ({ cssClass, aspect, items, right= undefined })=>{

  const 
    { actions }= React.useContext(Globals),
    customTags= useCustomTags()
  
  function handleClick(e, idx){
    e.preventDefault()
    e.stopPropagation()

    actions.setOverlayData('slideshow', {
      active: true,
      content: items,
      current: idx,
      timestamp: Date.now()
    })

    return false
  }

  return (
     <div className={`s-carouselrow ${cssClass?? ""}`}>
      { 
        items.map((e,i)=>{
          return (
            <div key={`car-${i}`} className={"carousel-element-wrapper"}>
              <div className={"carousel-element"}>
                <a className="image-frame-hoverable square-img d-block" onClick={ev=>handleClick(ev,i)} href={e.src}>
                  <img src={e.src}/>
                </a>
                <p className="w-100 text-center" {...customTags.innerHtml(e.title)}/>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}