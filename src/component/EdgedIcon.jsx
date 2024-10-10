import React from "react"

import { Globals } from "../context/AppContext.jsx"

import LabelBox from "./LabelBox.jsx"

const __RESOURCE__= {
  name:null, 
  src:null,
  col:["#777","#777"],
  href:null
}

export const EdgedIcon= ({ name=__RESOURCE__.name, src=__RESOURCE__.src, href=__RESOURCE__.href, buttons=[0], bgsize=1.0, callback=null, col=__RESOURCE__.col, className=null })=>{

  const
    { eventdata, actions }= React.useContext(Globals),
    element= React.useRef(null),
    [coords, set_coords]= React.useState({ x:128, y:128 }),
    [style, set_style]= React.useState(null)

  const 
    ElementType= href ? 'button' : 'div',
    bsvg= false

  React.useEffect(()=>{

    const n= 128*bgsize

    const _style= {
      "--fx-edi-bgs-px": `${n}px`,
      "--fx-edi-bgh-px": `${n*-.5}px`,
      "--fx-col-pri": col[0], 
      "--fx-col-neg": col[1]??__RESOURCE__.col[1]
    }
    if(col[2]) _style["--fx-col-text"]= col[2]
    if(col[3]) {
      _style["--fx-svg-nrm"]= col[3]
      _style["--fx-svg-hov"]= col[4]??col[3]
    } 
    else if(col[4]) _style["--fx-svg-hov"]= col[4]

    set_style(_style)
  },[])

  React.useEffect(function(){
    if(element.current){

      const event= actions.getEventdata('mousemove')

      const 
        bbox= element.current.getBoundingClientRect(),
        x= event.clientX - bbox.x,
        y= event.clientY - bbox.y

      const n= 128*bgsize

      if(Math.abs(x) < n && Math.abs(y) < n) set_coords({ x: x, y: y })
      else if (coords.x != n || coords.y != n) set_coords({ x: n, y: n })
    }
  },[eventdata.mousemove.timestamp])

  function handleClickButton(e){
    if(buttons.includes(e.button)){
      e.preventDefault()
      e.stopPropagation()
      if(callback) callback(e)
      else handleClickButtonDefault(e)
    }
  }
  
  function handleClickButtonDefault(e){
    window.open(href, "_blank")
  }

  return (
    <div style={style} className={`edgedicon ${className??""}`}>
      <ElementType 
        ref={element} 
        className={`${href? "to-div " : ""} m-2 box-page-tech fs-5 fw-semibold fx-colorize fx-edgedbox fx-labelbox-container`}
        style={{"--cv-musrel-x": `${coords.x}px`, "--cv-musrel-y": `${coords.y}px`}}
        {...(href? {onMouseDown:(e)=>handleClickButton(e)} : {})}>
        { name &&
          <LabelBox label={name} />
        }
        { src && src != "" &&
          <img src={src} />
        }
      </ElementType>
    </div>
  )
}

export const EdgedResourceIcon= ({ resource=null, className=null, ...rest })=>{

  return (
    <EdgedIcon {...(Object.assign(structuredClone(__RESOURCE__), resource??{}))} {...rest} className={className}/>
  )
}