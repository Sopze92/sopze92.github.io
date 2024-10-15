import React from "react"
import { useNavigate } from "react-router-dom"

import { Globals } from "../context/AppContext.jsx"

const FrostedGlass= ()=>{
  return (
    <>
      <div className="m-0 p-0 position-absolute w-100 h-100 no-pointer">
        {
          Array(8).fill(null).map((e,i)=>
            <div key={`frostedglass-layer-${i}`} className={`bg-frostedglass-complex layer${i}`} />
          )
        }
      </div>
    </>
  )
}

const NavBarPage= ({ active, title, action }) => {

  return (
    <li className="nav-item" role="presentation">
      <button className={`nav-link fs-tab fw-semibold p-0 py-1 header-tab-item ${active ? "active" : ""}`} role="tab" type="button" onClick={action}>
        {title}
      </button>
    </li>
  )
}

const NavBarLink= ({ resource }) => {
  return (
    <li className="nav-item" role="presentation">
      <a className="nav-link header-socials-item" href={resource.href}>
        <img className="no-select" src={resource.img}/>
      </a>
    </li>
  );
}

const NavBar= ({ type }) => {

  //console.log(`Using header: ${type}`)

  const 
    { ready, eventdata, pagedata, actions }= React.useContext(Globals),
    [ scroll, set_scroll ]= React.useState(0),
    [ showHeader, set_showHeader ]= React.useState(true),
    [ data, set_data ]= React.useState(null),
    nav= useNavigate();

  // self-setup
  React.useEffect(()=>{
    if(pagedata.header){
      set_data(ready.setup ? actions.getHeader(type) : null)
    }
  }, [pagedata.header?? false])
  
  // scroll effect
  React.useEffect(()=>{

    const target= actions.getEventdata('scroll')?.target

    if(target){

      const lscroll= target.scrollTop

      set_showHeader(lscroll <= scroll)
      set_scroll(lscroll)
    }

  },[eventdata.scroll.timestamp])

  // proccesses page link from name
  function getNavbarPageLink(name){

    const bCurrent= name===pagedata._name

    return <NavBarPage 
      key={`hn-${name}`} 
      active={bCurrent} 
      title={actions.getPageTitle(name)} 
      action={bCurrent ? ()=> actions.setPageDirty(true) : ()=>nav(`/${name}`)}
    />
  }

  return ( data &&
    <div id="header-container" className="navbar fixed-top m-0 p-0">
      <div className={`header-wrapper w-100 h-100 ${!showHeader ? "header-hidden" : ""}`}>
        <FrostedGlass />
        <div className="container-fluid h-100">
          <div className="row w-100 m-0 px-3 justify-content-center">
            <div className="col-10 col-lg-9 d-flex flex-column-rev-until-md-row m-0 p-0">
              <div className="col-12 col-md-8 mt-auto mb-0 pt-4 d-flex">
                { data.navbar && 
                    <ul className="nav p-0 mb-0 gap-3">
                      {
                        data.navbar.map(e=> 
                          getNavbarPageLink(e)
                        )
                      }
                    </ul>
                }
              </div>
              <div className="col-12 col-md-4 my-auto pt-2 d-flex justify-content-center justify-content-md-end">
                { data.links && 
                    <ul className="nav p-0 m-0 mb-2">
                      {
                        data.links.map((e,i)=>
                          <NavBarLink 
                            key={`header-social-${e}-${i}`} 
                            resource={actions.getResource(e)} 
                          />
                        )
                      }
                    </ul>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}

export default NavBar;
