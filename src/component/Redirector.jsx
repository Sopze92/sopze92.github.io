import React from 'react'
import { useNavigate } from 'react-router-dom'

const Redirector= ({ absolute=false, path="/" }) => {
  const nav= useNavigate()
  React.useEffect(()=>{
    if(absolute) window.location.href=path
    else nav(path) 
  },[])
  return null
}

export default Redirector