import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import NavBar from "./module/Navbar.jsx";
import Footer from "./module/Footer.jsx";

import { Globals, Constants } from "./context/AppContext.jsx";

const App= ()=>{

  const
    { ready, settings, pagedata, actions }= React.useContext(Globals),
    [ page, set_Page ]= React.useState(useParams().page),
    nav= useNavigate(),
    PageElement= pagedata ? pagedata.content: null

  React.useEffect(()=>{
    if(!actions.setPage(page)) nav("/404")
    nav(`/${page}`)
  },[page])

  React.useEffect(()=>{
    set_Page(pagedata.data._name)
  },[pagedata.data])

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
    else if(pagedata){
      nav(`/${pagedata.data._name}`)
    }
    return ()=>{ if(timeoutID != -1) clearTimeout(timeoutID); }
  }, [pagedata]);

  return ( ready.page &&
    <>
      <NavBar/>
      <PageElement />
      <Footer/>
    </>
  )
}

export default App;
