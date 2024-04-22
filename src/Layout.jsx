import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import AppContext, { Globals } from "./context/AppContext.jsx";

import Redirector from "./component/Redirector.jsx"
import App from "./App.jsx"
import { Err404 } from "./module/Internal.jsx"

const defaultRoute= "/home"

const Layout= ()=>{

  const { ready }= React.useContext(Globals)

  return ( ready.setup &&
    <BrowserRouter>
      <Routes>
        <Route exact path="/:page" element={(<App />)} />
				<Route exact path="/" element={(<Redirector path={defaultRoute}/>)} />

        <Route path="*" element={(<Err404/>)}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppContext(Layout)