import React from "react"

import { Globals } from "../context/AppContext.jsx"

import { OverlayScrollbarsComponent } from "overlayscrollbars-react"

const EdgedScrollbar= ({ children, colors=["var(--cv-indent-0)", "var(--cv-indent-1)"], options={}, events={}, ...rest })=>{

  const
    { eventdata, actions }= React.useContext(Globals),
    [scrollbar_ref, set_scrollbar_ref]= React.useState(null)
    
  React.useEffect(function(){
    if(scrollbar_ref){

      const event= actions.getEventdata('mousemove')

      for(let sbref of scrollbar_ref){

        const 
        bbox= sbref.getBoundingClientRect(),
        x= event.clientX - bbox.x,
        y= event.clientY - bbox.y

        sbref.style.setProperty("--cv-musrel-x", `${x}px`)
        sbref.style.setProperty("--cv-musrel-y", `${y}px`)
      }
    }
  },[eventdata.mousemove.timestamp])

  // scrollbar initialization
  
  rest.className= (rest?.className??"") + " fx-edgedscrollbar fx-colorize"

  function onInitialize(instance){
    if(instance){
      set_scrollbar_ref([
        instance.elements().scrollbarHorizontal.scrollbar.querySelector(".os-scrollbar-handle"),
        instance.elements().scrollbarVertical.scrollbar.querySelector(".os-scrollbar-handle")
      ])
    }
  }

  return (
    <OverlayScrollbarsComponent 
      {...rest}
      options={options}
      events={Object.assign({ initialized: onInitialize }, events)}
      defer
      style={{ "--fx-col-pri": colors[0], "--fx-col-sec": colors[1] }}
    >
      {children}
    </OverlayScrollbarsComponent>
  )
}

export default EdgedScrollbar