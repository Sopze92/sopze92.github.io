import React from "react"

import { Globals } from "../context/AppContext.jsx"
import useCustomTags from '../hooks/useCustomTags.jsx'

const OverlaySlideshow= ()=>{

  const 
    { overlaydata, actions }= React.useContext(Globals),
    [ localData, set_localData ]= React.useState({})

  const customTags= useCustomTags()

  React.useEffect(()=>{

    const _data= overlaydata.slideshow
    //if(overlaydata.slideshow.active) console.log("slideshow data: ", overlaydata.slideshow)

    set_localData({
      ..._data,
      motion: [
        _data.active && _data.current > 0,
        _data.active && _data.current < _data.content.length-1,
      ]
    })

  },[overlaydata.slideshow])
  
  function handleClickOutside(e){
    e.preventDefault()
    e.stopPropagation()

    actions.clearOverlayData('slideshow')

    return false
  }

  function handleClickKnob(e, bNext){
    e.preventDefault()
    e.stopPropagation()

    const new_localData= structuredClone(localData)

    if(bNext){ if(localData.motion[1]) new_localData.current+=1 }
    else{ if(localData.motion[0]) new_localData.current-=1 }

    new_localData.motion= [
      new_localData.active && new_localData.current > 0,
      new_localData.active && new_localData.current < new_localData.content.length-1,
    ]

    set_localData(new_localData)
  }

  function getCurrentElement(){
    const data= localData.content[localData.current]

    return (
      <>
        <div className="slideshow-element">
          <div className="slideshow-image">
            <div className="wrapper">
              <a href={data.src}>
                <img src={data.src}/>
              </a>
            </div>
          </div>
          <div className="slideshow-text">
            <p className="text-center fs-2" {...customTags.innerHtml(data.title)}/>
            <p className="text-center fs-4" {...customTags.innerHtml(data.desc)}/>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className={`overlay-bg fx-overlay-bg ${localData.active ? "active" : ""}`} onClick={(e)=>handleClickOutside(e)}>
      { localData.active &&
        (
          <div className="slideshow-container">
            <div className="slideshow-body" onClick={e=>{e.preventDefault(); e.stopPropagation()}}>
              <div className="slideshow-btn slideshow-btn-prev" onClick={e=>handleClickKnob(e, false)}>
                { localData.motion[0] && <svg viewBox="0 0 4 8"><path d="m4,0 0,8L1,4z"/></svg>}
              </div>
              {
                getCurrentElement()
              }
              <div className="slideshow-btn slideshow-btn-next" onClick={e=>handleClickKnob(e, true)}>
                { localData.motion[1] && <svg viewBox="0 0 4 8"><path d="m0,0 3,4L0,8z"/></svg>}
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default OverlaySlideshow