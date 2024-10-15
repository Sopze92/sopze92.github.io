import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import AppContext, { Globals, Constants } from "./context/AppContext.jsx"

import NavBar from "./module/Navbar.jsx"
import Footer from "./module/Footer.jsx"

import Home from "./view/Home.jsx"
import AboutMe from "./view/AboutMe.jsx"
import Portfolio from "./view/Portfolio.jsx"
import Services from "./view/Services.jsx"
import Resume from "./view/Resume.jsx"

import DevTest from "./view/DevTest.jsx"

import { Redirector, NotFound_Generic, HealthCheck } from "./app/Internal.jsx"

import GlobalListener from "./app/GlobalListener.jsx"

const Layout= ()=>{

  const { ready, pagedata }= React.useContext(Globals)

  return ( ready.setup &&
    (
      <BrowserRouter>
        <Routes>
          <Route strict exact path="/404" element={<NotFound_Generic />} />
          <Route strict exact path="/healthcheck" element={<HealthCheck />} />
          <Route path="*" element={
            <>
            {
              ready.page && 
              <NavBar type={pagedata.header?? null}/>
            }
            <Routes>
              <Route exact path="/" element={(<Redirector url="/home"/>)} />
  
              <Route exact path="/home" element={(<Home />)} />
              <Route exact path="/portfolio" element={(<Portfolio />)} />
              <Route exact path="/services" element={(<Services />)} />
              <Route exact path="/aboutme" element={(<AboutMe />)} />
              <Route exact path="/resume" element={(<Resume />)} />
              
              <Route exact path="/dev" element={(<DevTest />)} />
  
              <Route path="*" element={<NotFound_Generic />} />
            </Routes>
            {
              ready.page && 
              <Footer type={pagedata.footer?? null}/>
            }
            </>
          } />
        </Routes>
        <GlobalListener/>
      </BrowserRouter>
    )
  )
}

export default AppContext(Layout)