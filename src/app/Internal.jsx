import React from "react"
import { useNavigate } from "react-router-dom"

// component to redirect the navigator
export const Redirector=({ url, replace })=>{
	const nav= useNavigate()
  React.useEffect(()=>{ nav(url, { replace: replace!==undefined }) },[])
  return null
}

// generic healthcheck
export const HealthCheck=()=>{
	return "ok"
}

// generic 404
export const NotFound_Generic= ()=>{
  return (
    <>
      <p className="fw-bold text-center p-0 fs-1">404</p>
    </>
  )
}