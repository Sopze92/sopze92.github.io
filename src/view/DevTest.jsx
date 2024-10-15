import React from 'react'

import "../res/css/title.css"

import { Globals, Constants } from "../context/AppContext.jsx"

import usePagedata from '../hooks/usePagedata.jsx'

import { EdgedButton, EdgedResourceButton } from "../component/EdgedButton.jsx"
import { EdgedResourceIcon } from "../component/EdgedIcon.jsx"

const __CONTACT_FORM_DEFAULT__= { name:"", email:"", subject:"", message:"" }

const Page= ()=>{

  usePagedata("home")

  const
    { actions }= React.useContext(Globals)

  return (
    <>
{/* TAB-HOME */}
      <div className="container-fluid px-0 mx-0 overflow-hidden">
        
        <div className="row big-section-separator"/>

        <div className="col col-lg-8 d-flex flex-column justify-content-center m-0 mx-auto p-0 fw-semibold edgedicon-home" style={{"--fx-col-text": "#eee"}}>
          <div className="row col-below-lg justify-content-center mx-auto px-0 pt-0 pb-7 techbox-multicontainer">
            <div className="d-flex flex-column techbox-container align-items-center">
              <p className="m-0 py-3 fs-4 no-select">Languages</p>
              <div className="d-flex edgedicon-container justify-content-center my-auto">
                {
                  <EdgedResourceIcon resource={actions.getResource("app:blender")}/>
                }
              </div>
            </div>
            <div className="d-flex flex-column techbox-container align-items-center">
              <p className="m-0 py-3 fs-4 no-select">Game Engines</p>
              <div className="d-flex edgedicon-container justify-content-center my-auto">
                {
                  <EdgedResourceIcon resource={actions.getResource("app:blender")}/>
                }
              </div>
            </div>
          </div>
          <div className="row justify-content-center mx-auto px-0 pt-0 pb-7 gap-5">
            <div className="d-flex flex-column techbox-container align-items-center">
              <p className="m-0 py-3 fs-4 no-select">Technologies</p>
              <div className="d-flex edgedicon-container justify-content-center my-auto">
                {
                  <EdgedResourceIcon resource={actions.getResource("app:blender")}/>
                }
              </div>
            </div>
          </div>
          <div className="row justify-content-center mx-auto px-0 pt-0 pb-7 gap-5">
            <div className="d-flex flex-column techbox-container align-items-center">
              <p className="m-0 py-3 fs-4 no-select">Software</p>
              <div className="d-flex edgedicon-container justify-content-center my-auto">
                {
                  <EdgedResourceIcon resource={actions.getResource("app:blender")}/>
                }
              </div>
            </div>
          </div>
        </div>

        <div className="row big-section-separator"/>

      </div>
    </>
  )
}

export default Page;