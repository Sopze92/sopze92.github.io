import React from "react"

import useMousemove from '../hooks/useMousemove.jsx'

import LabelBox from "./LabelBox.jsx"

const TechIcon= ({ resource })=>{

  const
    element= React.useRef(null),
    mousemove= useMousemove(),
    [style, set_style]= React.useState(null),
    [color, set_color]= React.useState(null)

  React.useEffect(()=>{
    if(resource) _initializeColors()
  },[])

  React.useEffect(function(){ if(mousemove) 
    if(element.current){
      const bbox= element.current.getBoundingClientRect()
      set_style({
          "--cv-musrel-x": `${mousemove.clientX - bbox.x}px`, 
          "--cv-musrel-y": `${mousemove.clientY - bbox.y}px`
        })
    }
  },[mousemove])

  return (
    <div ref={element} className="m-2 box-page-tech fs-5 fx-edgedbox fx-colorize fx-labelbox-container" 
      style={{
        ...style, 
        ...color
        }}>
      <LabelBox label={resource.name} />
      <img src={resource.img} />
    </div>
  )

  function _initializeColors(){
    const color= {
      "--fx-col-pri": resource.col[0], 
      "--fx-col-neg": resource.col[1]
    }
  
    if(resource.col.length > 2) color["--fx-col-text"]= resource.col[2]
    set_color(color)
  }
}

export default TechIcon