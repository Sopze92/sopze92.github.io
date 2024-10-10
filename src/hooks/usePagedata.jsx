import React from "react"

import { Globals } from "../context/AppContext.jsx"

const usePagedata= (name)=>{

  const 
    { actions }= React.useContext(Globals)

  React.useEffect(()=>{
    actions.setPage(name)
  },[])
}

export default usePagedata