import React from "react"

import { Globals } from "../context/AppContext.jsx";

import { FrostedGlass } from "../res/Effects.jsx"

const NavBarLink= ({ active, title, query }) => {

  const 
    { actions }= React.useContext(Globals)

  return (
    <li className="nav-item" role="presentation">
      <button className={`nav-link fs-tab fw-semibold p-0 py-1 header-tab-item ${active ? "active" : ""}`} role="tab" type="button" onClick={()=>actions.navigateQuery(query)}>
        {title}
      </button>
    </li>
  )
}

const NavBarSocial= ({ data }) => {
  //console.log(data)
  return (
    <li className="nav-item" role="presentation">
      <a className="nav-link header-socials-item">
        <img className="no-select" src={data.src}/>
      </a>
    </li>
  );
}

const NavBar= ({ type }) => {

  const 
    { ready, resources, actions }= React.useContext(Globals),
    [ data, setData ]= React.useState(null)

  React.useEffect(()=>{
    setData(ready.setup ? actions.getHeader(type) : null)
  }, [ready.setup])

  return ( data &&
    <div id="header-container" className="navbar fixed-top p-0 m-0">
      <FrostedGlass />
      <div className="container-fluid">
        <div className="row w-100 m-0 px-3 justify-content-center">
          <div className="col-10 col-lg-9 d-flex flex-column-rev-until-md-row m-0 p-0">
            { data.navbar && 
              <div className="col-12 col-md-8 mt-auto mb-0 pt-4 d-flex">
                <ul className="nav p-0 mb-0 gap-3">
                  {
                    data.navbar.map(e=> 
                      <NavBarLink 
                        key={`header-navbar-${e}`} 
                        active={e===data.page} 
                        title={actions.getPageTitle(e)} 
                        query={`?${e}`}
                      />
                    )
                  }
                </ul>
              </div>
            }
            { data.social && 
              <div className="col-12 col-md-4 my-auto pt-2 d-flex justify-content-center justify-content-md-end">
                <ul className="nav p-0 m-0 mb-2">
                  {
                    data.social.map((e,i)=> 
                      <NavBarSocial 
                        key={`header-social-${e}-${i}`} 
                        data={{
                          type: e.type, 
                          link: resources.social[e.name],
                          src: actions.getSrcPath("img_soc", e.image),
                        }} 
                      />
                    )
                  }
                </ul>
              </div>
            }
          </div>
          <div className="col-2 p-0 show-until-md d-flex justify-content-end position-relative" aria-hidden="true">
            <img id="brand-img" className="no-select" src="./_res/img/title/icon.svg"></img>
          </div>
        </div>
      </div>
    </div>
    );
}

export default NavBar;
