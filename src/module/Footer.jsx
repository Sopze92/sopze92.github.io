import React from "react";

import { Globals } from "../context/AppContext.jsx";

const Footer= ({ type }) => {

  const 
    { ready, actions }= React.useContext(Globals),
    [ data, setData ]= React.useState(null)

  React.useEffect(()=>{
    setData(ready.setup ? actions.getObjectByName("footer", type) : null)
  }, [ready.setup])

  return ( data &&
    <div id="footer-container" className="navbar section-dark w-100 m-0">
      { data.render.includes("link") &&
        <div className="row w-100 m-0 p-0 px-3 d-flex justify-content-end">
          <div className="col-2 m-0 p-0 pt-sm-2 pe-sm-4 no-select d-flex justify-content-end">
              <ul className="nav mt-0 d-flex flex-column">
                <li className="nav-item" role="presentation"><button className="nav-link fs-tab fw-bold p-0 py-1 footer-tab-item" role="tab" type="button" onClick={()=>console.log("hb-lnk-page=resumee")} >C.V.</button></li>
                <li className="nav-item" role="presentation"><button className="nav-link fs-tab fw-bold p-0 py-1 footer-tab-item" role="tab" type="button" onClick={()=>console.log("hb-lnk-page=aboutme")} >About me</button></li>
              </ul>
          </div>
        </div>
      }
      { data.render.includes("text")  &&
        <div className="row w-100 m-0 px-3 d-flex justify-content-center">
            <div className="col-12 container-fluid flex-column m-auto no-select">
              <p className="fs-4c text-center m-0">© 2022-{0} · Sergio &apos;<b>Sopze</b>&apos; del Pino Arroyo · Spain ·</p>
              <p className="fs-4c text-center">· <a href="mailto:" target="_blank" rel="noopener noreferrer">{0}</a> ·</p>
            </div>
        </div>
      }
    </div>
  );
}

export default Footer;