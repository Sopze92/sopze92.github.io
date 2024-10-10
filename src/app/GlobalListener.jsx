import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Globals } from "../context/AppContext.jsx"

const GlobalListener=()=>{
  const 
    { ready, pagedata, settings, actions }= React.useContext(Globals),
    onLoadRef= React.useRef(null),
    loc= useLocation(),
    nav= useNavigate()

  React.useEffect(()=>{
    const pagetitle= (pagedata.data?.showTitle?? false) ? pagedata.data.title?? null : undefined
    document.title= (pagetitle ? pagetitle + " | " : "") + settings.general.title
  },[loc, pagedata])

  React.useEffect(()=>{
    const 
      appStyle= document.getElementById("app").style,
      indent= pagedata.indent?? settings.general.indent
    
    appStyle.setProperty("--cv-indent-0", indent[0])
    appStyle.setProperty("--cv-indent-1", indent[1])

  },[pagedata.indent])
  
  return <div/>
}

export default GlobalListener