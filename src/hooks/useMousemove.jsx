import React from "react"

import { EventData } from "../context/AppGlobals.jsx"

const useMousemove= ()=>{
  const [mousemove, set_mousemove]= React.useState(null)

  React.useEffect(()=>{
    let interval_id= setInterval(function() { if(EventData.mousemove) set_mousemove(EventData.mousemove) }, 33)
    return () => { clearInterval(interval_id) }
  },[])

  return mousemove
}

export default useMousemove