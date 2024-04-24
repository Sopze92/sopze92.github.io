import React from "react"

import useMousemove from '../hooks/useMousemove.jsx'

const EdgedButton= ({ resource })=>{

  const
    element= React.useRef(null),
    mousemove= useMousemove(),
    [style, set_style]= React.useState(null)

  React.useEffect(function(){ if(mousemove) 
    if(element.current){
      const bbox= element.current.getBoundingClientRect()
      set_style({
          "--cv-musrel-x": `${(mousemove.clientX - bbox.x).toFixed(2)}px`, 
          "--cv-musrel-y": `${(mousemove.clientY - bbox.y).toFixed(2)}px`
        })
    }
  },[mousemove])

  return (
    <a ref={element} className="p-3 m-2 btn-page-social fs-5 fx-edgedbutton" style={style} onClick={()=>{console.log("clicked!")}}>
      <img src={resource.img} />
      <span>{resource.name}</span>
    </a>
  )
}

function _onclick_undefined(label, icon) { console.warn("onClick event was not defined for ButtonEdged with " + (label ? `label: ${label}` : icon ? `icon: ${icon}` : "undefined label/icon"))}

export default EdgedButton