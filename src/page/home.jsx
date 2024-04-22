import React from 'react'

import "../res/css/title.css"

import { Globals, Constants } from "../context/AppContext.jsx"

import useMousemove from '../hooks/useMousemove.jsx'

import img_title_bg from "../res/img/title/bg.webp"
import img_title_at from "../res/img/title/at.webp"
import img_title_s from "../res/img/title/s.webp"

import svg_title_name from "../res/img/title/name.svg"
import svg_title_motto from "../res/img/title/motto.svg"
import svg_title_full from "../res/img/title/full.svg"

const Title= ()=>{
  
  const 
    title= React.useRef(null),
    mousemove= useMousemove(),
    [styles, setStyles]= React.useState(["", ""])

  React.useEffect(function(){ if(mousemove) 
    if(title.current){
      let angx= .0, angy= .0, movx= .0, movy= .0
      const 
        [x, y]= [mousemove.clientX, mousemove.clientY],
        box = title.current.getBoundingClientRect(),
        halfBoxWidth= box.width * .5,
        halfBoxHeight= box.height * .5,
        musx= x - box.x - halfBoxWidth,
        musy= y - box.y - halfBoxHeight,
        pxfactor= 100.0 / box.width * 200
  
      angx = musy * .0045
      angy = musx * .0025
      movx = musx * -.0125
      movy = musy * -.0125
  
      setStyles([
        `translate(${-movx.clamp(-pxfactor, pxfactor)}px, ${-movy.clamp(-pxfactor, pxfactor)}px)`,
        `perspective(200px) rotateX(${angx}deg) rotateY(${angy}deg) translate(${-movx*.75}px, ${-movy*.25}px)`
      ])
    }
  },[mousemove])

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

import EdgedButton from "../component/EdgedButton.jsx"
import TechIcon from "../component/EdgedIcon.jsx"

const Page= ()=>{

  const
    { pagedata, actions }= React.useContext(Globals)

  return (
    <>
{/* TAB-HOME */}
      <div className="container-fluid px-0 mx-0 overflow-hidden page-start">
        <div className="row section-padding" >
          <Title />
        </div>
        <div className="row d-flex justify-content-center subsection-padding gap-page-social">
          <div className="col-4 col-md-12 d-flex justify-content-center gap-page-social">
            <div className="m-0 p-0 row-over-md gap-page-social">
              <EdgedButton resource={actions.getResource("social:github")}/>
              <EdgedButton resource={actions.getResource("social:linkedin")}/>
            </div>
            <div className="m-0 p-0 row-over-md gap-page-social">
              <EdgedButton resource={actions.getResource("social:artstation")}/>
              <EdgedButton resource={actions.getResource("social:sketchfab")}/>
            </div>
          </div>
        </div>
        <div className="row section-padding">
          <div className="col">
            <p id="home-subtitle" className="mono text-center ts-bottom no-select">
{/*         TODO: each word is made by its own theme
              Artist: a nice picture
              Programmer: a programmed animation
              Developer: a buildup fx, modular, 3D
              Gamer: just joy */}
{/*           <span id="fx_artist">Artist</span> · <span id="fx_coder" >Programmer</span> · <span id="fx_developer" >Developer</span> · <span id="fx_gamer">Gamer</span> */}
              <span className="fw-bold text-warning">SITE UNDER CONSTRUCTION</span>
            </p>
          </div>
        </div>

        <div className="d-flex flex-column container-fluid m-0 p-0 fw-semibold justify-content-center" style={{"--fx-col-text": "#eee"}}>
          <div className="row row-over-md justify-content-center mx-auto my-4 px-0 py-4 gap-4">
            <div className="col-3 techbox-column m-0 p-0 d-flex flex-column align-items-center">
              <p className="w-100 text-center m-0 py-3 fs-4 no-select">Languages</p>
              <div className="d-flex techbox-container justify-content-center my-auto">
                <TechIcon resource={actions.getResource("lang:html")}/>
                <TechIcon resource={actions.getResource("lang:css")}/>
                <TechIcon resource={actions.getResource("lang:javascript")}/>
                <TechIcon resource={actions.getResource("lang:typescript")}/>
                <TechIcon resource={actions.getResource("lang:python")}/>
                <TechIcon resource={actions.getResource("lang:c")}/>
                <TechIcon resource={actions.getResource("lang:csharp")}/>
                <TechIcon resource={actions.getResource("lang:cplusplus")}/>
                <TechIcon resource={actions.getResource("lang:java")}/>
                <TechIcon resource={actions.getResource("lang:lua")}/>
                <TechIcon resource={actions.getResource("lang:batch")}/>
                <TechIcon resource={actions.getResource("lang:glsl")}/>
                <TechIcon resource={actions.getResource("lang:hlsl")}/>
                <TechIcon resource={actions.getResource("lang:snes")}/>
                <TechIcon resource={actions.getResource("lang:scm")}/>
                <TechIcon resource={actions.getResource("lang:sql")}/>
              </div>
            </div>
            <div className="col-3 techbox-column m-0 p-0 d-flex flex-column align-items-center">
              <p className="w-100 text-center m-0 py-3 fs-4 no-select">Game Engines</p>
              <div className="d-flex techbox-container justify-content-center my-auto">
                <TechIcon resource={actions.getResource("engine:unreal45")}/>
                <TechIcon resource={actions.getResource("engine:unity")}/>
                <TechIcon resource={actions.getResource("engine:unreal3")}/>
                <TechIcon resource={actions.getResource("engine:source")}/>
                <TechIcon resource={actions.getResource("engine:torque3d")}/>
                <TechIcon resource={actions.getResource("engine:renderware")}/>
                <TechIcon resource={actions.getResource("engine:idtech3")}/>
                <TechIcon resource={actions.getResource("engine:idtech2")}/>
                <TechIcon resource={actions.getResource("engine:goldsource")}/>
                <TechIcon resource={actions.getResource("engine:quakeengine")}/>
                <TechIcon resource={actions.getResource("engine:doomengine")}/>
                <TechIcon resource={actions.getResource("engine:smartsim")}/>
              </div>
            </div>
          </div>
          <div className="row row-over-md justify-content-center mx-auto p-0 pb-4 gap-4">
            <div className="col techbox-column m-0 p-0">
              <p className="w-100 text-center m-0 py-3 fs-4 no-select">Technologies</p>
              <div className="d-flex techbox-container-full justify-content-center my-auto">
                <TechIcon resource={actions.getResource("tech:bootstrap")}/>
                <TechIcon resource={actions.getResource("tech:tailwind")}/>
                <TechIcon resource={actions.getResource("tech:react")}/>
                <TechIcon resource={actions.getResource("tech:react_router")}/>
                <TechIcon resource={actions.getResource("tech:sqlalchemy")}/>
                <TechIcon resource={actions.getResource("tech:flask")}/>
                <TechIcon resource={actions.getResource("tech:jquery")}/>
                <TechIcon resource={actions.getResource("tech:jest")}/>
                <TechIcon resource={actions.getResource("tech:i18n")}/>
                <TechIcon resource={actions.getResource("tech:dotnet")}/>
                <TechIcon resource={actions.getResource("tech:imgui")}/>
                <TechIcon resource={actions.getResource("tech:lwjgl")}/>
                <TechIcon resource={actions.getResource("tech:jogl")}/>
                <TechIcon resource={actions.getResource("tech:freeglut")}/>
                <TechIcon resource={actions.getResource("tech:glfw")}/>
              </div>
            </div>
          </div>
          <div className="row row-over-md justify-content-center mx-auto p-0 pb-4 gap-4">
            <div className="col techbox-column m-0 p-0">
              <p className="w-100 text-center m-0 py-3 fs-4 no-select">Software</p>
              <div className="d-flex techbox-container-full justify-content-center my-auto">
                <TechIcon resource={actions.getResource("app:git")}/>
                <TechIcon resource={actions.getResource("app:github")}/>
                <TechIcon resource={actions.getResource("app:figma")}/>
                <TechIcon resource={actions.getResource("app:trello")}/>
                <TechIcon resource={actions.getResource("app:node")}/>
                <TechIcon resource={actions.getResource("app:blender")}/>
                <TechIcon resource={actions.getResource("app:substance_painter")}/>
                <TechIcon resource={actions.getResource("app:substance_designer")}/>
                <TechIcon resource={actions.getResource("app:vscode")}/>
                <TechIcon resource={actions.getResource("app:visualstudio")}/>
                <TechIcon resource={actions.getResource("app:zbrush")}/>
                <TechIcon resource={actions.getResource("app:instamat")}/>
                <TechIcon resource={actions.getResource("app:sketchup")}/>
                <TechIcon resource={actions.getResource("app:marmoset_toolbag")}/>
                <TechIcon resource={actions.getResource("app:paintdotnet")}/>
                <TechIcon resource={actions.getResource("app:photoshop")}/>
                <TechIcon resource={actions.getResource("app:premiere")}/>
                <TechIcon resource={actions.getResource("app:illustrator")}/>
                <TechIcon resource={actions.getResource("app:inkscape")}/>
                <TechIcon resource={actions.getResource("app:postman")}/>
                <TechIcon resource={actions.getResource("app:flstudio")}/>
                <TechIcon resource={actions.getResource("app:notepadplusplus")}/>
                <TechIcon resource={actions.getResource("app:word")}/>
                <TechIcon resource={actions.getResource("app:excel")}/>
                <TechIcon resource={actions.getResource("app:cheatengine")}/>
                <TechIcon resource={actions.getResource("app:ida")}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page;