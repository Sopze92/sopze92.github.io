import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import NavBar from "./module/Header.jsx";
import Footer from "./module/Footer.jsx";

import { Globals, Constants } from "./context/AppContext.jsx";

const App= ()=>{

  const
    { ready, settings, pagedata, actions }= React.useContext(Globals),
    { page }= useParams(),
    nav= useNavigate(),
    PageElement= pagedata ? pagedata.content: null

  console.log(React.useContext(Globals))

  React.useEffect(()=>{
    if(!actions.setPage(page)) nav("/404")
  },[])

  React.useEffect(()=>{
    let timeoutID= -1;

    if(pagedata.leaving){
      timeoutID= setTimeout(()=>{
        if(pagedata.leavemode == Constants.LEAVE_MODE.project){
          const project= settings.project[pagedata.post];
          console.log(project);
          if(project) window.location.href=project.relative ? `${window.location.origin}/${project.location}` : project.location;
          else actions.onPageFailedSevere();
        }
      }, 4000);
    }
    return ()=>{ if(timeoutID != -1) clearTimeout(timeoutID); }
  }, [pagedata]);

  return ( ready.page &&
    <>
      <NavBar type={pagedata.header}/>
      <PageElement />
      <Footer type={pagedata.footer}/>
    </>
  )
}

export default App;
