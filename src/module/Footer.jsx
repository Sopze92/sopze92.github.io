import React from "react"

import { Globals } from "../context/AppContext.jsx"
import { StaticData } from "../context/AppGlobals.jsx"

const Footer= ({ type }) => {

  //console.log(`Using footer: ${type}`)

  const 
    { ready, pagedata, settings, actions }= React.useContext(Globals),
    [ data, setData ]= React.useState(null)

  React.useEffect(()=>{
    if(pagedata.footer){
      setData(ready.setup ? actions.getObjectByName("footer", type) : null)
    }
  }, [pagedata.footer?? false])

  return ( data &&
    <div id="footer-container" className="navbar section-dark w-100 m-0">
      { data.render.includes("links") &&
        <div className="row w-100 m-0 p-0 px-3 d-flex justify-content-end">
          <div className="col-2 m-0 p-0 pt-sm-2 pe-sm-4 no-select d-flex justify-content-end">
              <ul className="nav mt-0 d-flex flex-column">
                <li className="nav-item" role="presentation"><button className="nav-link fs-tab fw-bold p-0 py-1 footer-tab-item" role="tab" type="button" onClick={()=>console.log("hb-lnk-page=resumee")} >C.V.</button></li>
                <li className="nav-item" role="presentation"><button className="nav-link fs-tab fw-bold p-0 py-1 footer-tab-item" role="tab" type="button" onClick={()=>console.log("hb-lnk-page=aboutme")} >About me</button></li>
              </ul>
          </div>
        </div>
      }
      { data.render.includes("text") &&
        <div className="row w-100 m-0 px-3 d-flex justify-content-center">
            <div className="col-12 container-fluid flex-column m-auto no-select">
              <p className="fs-4c text-center m-0">
                2022-{StaticData.date[2]} · Sergio &apos;<b>Sopze</b>&apos; del Pino · Spain ·<br/>
                · Built with <b>Vite</b> + <b>React</b> using <b>Bootstrap</b> + <i>custom <b>CSS</b></i> ·
              </p>
              <p className="fs-4c text-center">· <a href={`mailto:${settings.general.email}`} target="_blank" rel="noopener noreferrer">{settings.general.email}</a> ·</p>
            </div>
        </div>
      }
    </div>
  );
}

export default Footer;