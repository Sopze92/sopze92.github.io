import React from "react"

import { Globals } from "../context/AppContext.jsx"

const __RESOURCE__= {
  name:null, 
  src:"",
  col:["#777", "#777", "#eee"]
}

export const EdgedButton= ({ name=null, src="", col=["#777", "#777", "var(--cv-indent-0)"], buttons=[0], callback=null, className=null })=>{

  const
    { eventdata, actions }= React.useContext(Globals),
    element= React.useRef(null),
    [coords, set_coords]= React.useState({ x:256, y:192 }),
    [color, set_color]= React.useState(null)

  React.useEffect(()=>{
    const color= {
      "--fx-col-pri": col[0], 
      "--fx-col-neg": col[1]
    }
    if(col[2]) color["--fx-col-text"]= col[2]
    set_color(color)
  },[])

  React.useEffect(function(){ if(eventdata.mousemove) 
    if(element.current){
      
      const event= actions.getEventdata('mousemove')

      const 
        bbox= element.current.getBoundingClientRect(),
        x= event.clientX - bbox.x,
        y= event.clientY - bbox.y

      if(Math.abs(x) < 256 && Math.abs(y) < 192) set_coords({ x: x, y: y })
      else if (coords.x != 256 || coords.y != 192) set_coords({ x: 256, y: 192 })
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
    window.open(resource.href, "_blank")
  }

  return (
    <div style={color} className={className}>
      <button ref={element} className="to-div p-3 m-2 fx-edgedbutton fx-gray" 
      style={{"--cv-musrel-x": `${coords.x}px`, "--cv-musrel-y": `${coords.y}px`}} 
      onMouseDown={(e)=>handleClickButton(e)}>
        { src &&
          <img src={src}/>
        }
        { name &&
          <span>{name}</span>
        }
      </button>
    </div>
  )
}

export const EdgedResourceButton= ({ resource=null, className=null })=>{

  return (
    <EdgedButton {...(resource??__RESOURCE__)} buttons={[0,1]} className={className}/>
  )
}

function _onclick_undefined(label, icon) { console.warn("onClick event was not defined for ButtonEdged with " + (label ? `label: ${label}` : icon ? `icon: ${icon}` : "undefined label/icon"))}