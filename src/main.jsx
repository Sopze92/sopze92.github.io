import React from "react"
import ReactDOM from "react-dom/client"

import { _initialize } from "./context/AppGlobals.jsx"
import Layout from "./Layout.jsx"

import "./res/xtrap.css"
import "./res/styles.css"
import "./res/effects.css"

Number.prototype.clamp = function(min, max) { return this < min ? min : this > max ? max : this }

_initialize()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);