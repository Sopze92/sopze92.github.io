import React from 'react'

import "../res/css/title.css"

import img_title_bg from "../res/img/title/bg.webp"
import img_title_at from "../res/img/title/at.webp"
import img_title_s from "../res/img/title/s.webp"

import svg_title_name from "../res/img/title/name.svg"
import svg_title_motto from "../res/img/title/motto.svg"
import svg_title_full from "../res/img/title/full.svg"

var bTicking= false

const Title= ()=>{
  
  const 
    title= React.useRef(null),
    [styles, setStyles]= React.useState(["", ""])

  React.useEffect(()=> {
    console.log("addingEL")
    window.addEventListener('mousemove', onMouseMove)
    return ()=>{ window.removeEventListener('mousemove', onMouseMove)}
  },[])

  function onMouseMove(e) {
    if(!bTicking){
      e.preventDefault(); e.stopPropagation()
      bTicking= true
      window.requestAnimationFrame(
        ()=>{
          if(title.current){
            let angx= .0, angy= .0, movx= .0, movy= .0;
            const 
              [x, y]= [e.clientX, e.clientY],
              box = title.current.getBoundingClientRect(),
              halfBoxWidth= box.width * .5,
              halfBoxHeight= box.height * .5,
              musx= x - box.x - halfBoxWidth,
              musy= y - box.y - halfBoxHeight,
              pxfactor= 100.0 / box.width * 200
        
            angx = musy * .0045;
            angy = musx * .0025;
            movx = musx * -.0125;
            movy = musy * -.0125;
        
            setStyles([
              `translate(${-movx.clamp(-pxfactor, pxfactor)}px, ${-movy.clamp(-pxfactor, pxfactor)}px)`,
              `perspective(200px) rotateX(${angx}deg) rotateY(${angy}deg) translate(${-movx*.75}px, ${-movy*.25}px)`
            ])
            bTicking= false
          }
        }
      )
    }
  }

  return (
    <>
      <div id="home-title-container" aria-hidden="true" className="col-10 col-lg-7 mx-auto cba">
        <div className="position-relative">
          <div id="home-title" className="d-flex justify-content-center show-over-md no-select">
            <img ref={title} id="home-title-3D" src={img_title_bg} style={{transform: styles[0]}}/>
            <div id="home-title-bg">
              <img width="60%" src={svg_title_full} style={{transform: styles[1]}}/>
            </div>
          </div>
          <div id="home-title" className="d-flex justify-content-center w-100 show-until-md">
            <img id="home-title-3D" src={img_title_bg}/>
            <div id="home-title-bg-simple">
              <img className="mx-auto" width="70%" src={svg_title_name}/>
              <img className="mx-auto mt-n4" width="80%" src={svg_title_motto}/>
            </div>
          </div>
          <img id="home-title-img-at" className="opacity-75" src={img_title_at}></img>
          <img id="home-title-img-s" className="opacity-75" src={img_title_s}></img>
        </div>
      </div>
    </>
  )
}

const Page= ()=>{
  return (
    <>
{/*     TAB-HOME */}
      <div className="container-fluid px-0 mx-0 overflow-hidden page-start">
        <div className="row section-padding" >
          <Title />
        </div>
        <div className="row d-flex justify-content-center subsection-padding gap-page-social">
          <div className="col-4 col-md-12 d-flex justify-content-center gap-page-social">
            <div className="m-0 p-0 row-over-md gap-page-social">
              <a className="p-3 m-2 btn-page-social fs-5 fx-edgedbutton"><img hb-src="img-soc:ghub" /><span>GITHUB</span></a>
              <a className="p-3 m-2 btn-page-social fs-5 fx-edgedbutton"><img hb-src="img-soc:lin" /><span>LINKEDIN</span></a>
            </div>
            <div className="m-0 p-0 row-over-md gap-page-social">
              <a className="p-3 m-2 btn-page-social fs-5 fx-edgedbutton"><img hb-src="img-soc:arts" /><span>ARTSTATION</span></a>
              <a className="p-3 m-2 btn-page-social fs-5 fx-edgedbutton"><img hb-src="img-soc:sfab" /><span>SKETCHFAB</span></a>
            </div>
          </div>
        </div>
        <div className="row section-padding">
          <div className="col">
            <p id="home-subtitle" className="mono text-center ts-bottom no-select">
{/*               TODO: each word is made by its own theme
                Artist: a nice picture
                Programmer: a programmed animation
                Developer: a buildup fx, modular, 3D
                Gamer: just joy */}
{/*               <span id="fx_artist">Artist</span> · <span id="fx_coder" >Programmer</span> · <span id="fx_developer" >Developer</span> · <span id="fx_gamer">Gamer</span> */}
              <span className="fw-bold text-warning">SITE UNDER CONSTRUCTION</span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page;