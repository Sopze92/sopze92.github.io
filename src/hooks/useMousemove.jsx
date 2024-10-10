import React from "react"

import { EventData } from "../context/AppGlobals.jsx"

/**
 *  Custom Hook that polls a Global 'onmousemove' eventListener instead of registering itself so we don't end up with 4000 listeners
 * 
 *  its fixed to poll roughly every 33ms (30fps)
 * 
 *  the eventListener is defined in -> context/AppGlobals.jsx
 * 
 * @returns the mousemove event data
 */
const useMousemove= ()=>{
  const [mousemove, set_mousemove]= React.useState(EventData.mousemove.event?? {})

   React.useEffect(()=>{
    let interval_id= setInterval(function() { set_mousemove(EventData.mousemove.event) }, 33)
    return () => { clearInterval(interval_id) }
  },[])

  return mousemove
}

export default useMousemove