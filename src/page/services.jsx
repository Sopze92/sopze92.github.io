import React from 'react'

import { Globals } from "../context/AppContext.jsx"

const Page= ()=>{

  const
    { pagedata, actions }= React.useContext(Globals)

  return (
    <>
{/* PAGES-SERVICES */}
    <div className="container-fluid px-0 mx-0 overflow-hidden section-dark page-start">
      <div className="row">
          { pagedata.data._name }
      </div>
    </div>
    </>
  )
}

export default Page;