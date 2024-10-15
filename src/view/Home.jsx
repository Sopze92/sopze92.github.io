import React from 'react'

import "../res/css/title.css"

import { Globals, Constants } from "../context/AppContext.jsx"

import usePagedata from '../hooks/usePagedata.jsx'

import img_title_bg from "../res/img/title/bg.webp"

import svg_title_at from "../res/img/title/at.svg?url"
import svg_title_s from "../res/img/title/s.svg?url"
import svg_title_name from "../res/img/title/name.svg?url"
import svg_title_motto from "../res/img/title/motto.svg?url"
import svg_title_full from "../res/img/title/full.svg?url"

const Title= ()=>{

  const 
    { actions }= React.useContext(Globals),
    title= React.useRef(null),
    [styles, setStyles]= React.useState({
      "--title-tx": "0px",
      "--title-ty": "0px",
      "--title-prx": "0deg",
      "--title-pry": "0deg",
      "--title-ptx": "0px",
      "--title-pty": "0px"
    })

  // using a constant update interval of 25ms (40fps) because using eventdata.mousemove 
  // as dependecy builds strange lag only after hovering another element, which makes 
  // no sense as there are other components using it as dependency with no problem
  React.useEffect(function(){
    let interval_id= setInterval(function() {
      if(title.current){
  
        const event= actions.getEventdata('mousemove')

        let angx= .0, angy= .0, movx= .0, movy= .0
        const 
          [x, y]= [event.clientX, event.clientY],
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
  
        setStyles({
          '--title-tx': -movx.clamp(-pxfactor, pxfactor) + "px",
          '--title-ty': -movy.clamp(-pxfactor, pxfactor) + "px",
          '--title-prx': angx + "deg",
          '--title-pry': angy + "deg",
          '--title-ptx': -movx*.75 + "px",
          '--title-pty': -movy*.25 + "px"
        })
      }
    }, 25)
    return () => { clearInterval(interval_id) }
  },[])

  return (
    <>
      <div id="home-title-container" aria-hidden="true" className="col-10 col-lg-7 mx-auto cba" style={styles}>
        <div className="position-relative">
          <div id="home-title" className="d-flex justify-content-center no-select">
            { Constants.DESKTOP && 
              (
              <>
                <img ref={title} id="home-title-3D" className="anim" src={img_title_bg}/>
                <div id="home-title-bg-anim">
                  <img width="60%" src={svg_title_full}/>
                </div>
              </>
              )
              ||
              (
              <>
                <img id="home-title-3D" src={img_title_bg}/>
                <div id="home-title-bg">
                  <img className="mx-auto" width="70%" src={svg_title_name}/>
                  <img className="mx-auto mt-n4" width="80%" src={svg_title_motto}/>
                </div>
              </>
              )
            }
          </div>
          <img id="home-title-img-at" className="opacity-75" src={svg_title_at}/>
          <img id="home-title-img-s" className="opacity-75" src={svg_title_s}/>
        </div>
      </div>
    </>
  )
}

import { EdgedButton, EdgedResourceButton } from "../component/EdgedButton.jsx"
import { EdgedResourceIcon } from "../component/EdgedIcon.jsx"

const __CONTACT_FORM_DEFAULT__= { name:"", email:"", subject:"", message:"" }

const Page= ()=>{

  usePagedata("home")

  const
    { actions }= React.useContext(Globals),
    [ showContact, set_showContact]= React.useState(false),
    [ contactForm, set_contactForm] = React.useState(__CONTACT_FORM_DEFAULT__)
    
  function handleFormSubmit(e){
    e.preventDefault()
    const _form = new FormData()
    for(const [k,v] of Object.entries(contactForm)) _form.append(k, v)
    
    console.log(_form)
    //actions.submitContactForm(_form)
    
    set_contactForm(__CONTACT_FORM_DEFAULT__)
  }

  function handleInputChange(e){
    const { name, value } = e.target
    set_contactForm(old => ({ ...old, [name]: value }))
  }

  return (
    <>
{/* TAB-HOME */}
      <div className="container-fluid px-0 mx-0 overflow-hidden page-start">
        
        <div className="row section-padding" >
          <Title />
        </div>

        <div className="row subsection-padding edgedicon-home-social d-flex flex-column justify-content-center gap-page-social">
          <div className="d-flex justify-content-center gap-page-social">
            <EdgedResourceIcon resource={actions.getResource("social:github")} bgsize={1.5}/>
            <EdgedResourceIcon resource={actions.getResource("social:linkedin")} bgsize={1.5}/>
            <EdgedResourceIcon resource={actions.getResource("social:artstation")} bgsize={1.5}/>
            <EdgedResourceIcon resource={actions.getResource("social:sketchfab")} bgsize={1.5}/>
          </div>
          <div className="d-flex justify-content-center gap-page-social">
{/*             <EdgedResourceIcon resource={actions.getResource("social:fab")} bgsize={1.5}/> */}
            <EdgedResourceIcon resource={actions.getResource("social:itchio")} bgsize={1.5}/>
            <EdgedResourceIcon resource={actions.getResource("social:youtube")} bgsize={1.5}/>
            <EdgedResourceIcon resource={actions.getResource("social:twitter")} bgsize={1.5}/>
          </div>
        </div>

{/*         <div className="row d-flex flex-column subsection-padding">
          <EdgedButton name="Contact Me" callback={()=>set_showContact(!showContact)} className="btn-page btn-page-contact mx-auto"/>
          { showContact &&
          <div className="col-8 mx-auto p-0 d-flex flex-column align-items-center">
            <div className="row d-flex section-lit">
              <div className="col-4">
                
              </div>
              <div className="col-8 d-flex justify-content-center text-center">
                <div className="am-title-container">
                  <p className="no-select am-title">CONTACT FORM</p>
                  <p className="no-select am-subtitle">Tell me what's on your mind</p>
                  <form onSubmit={handleFormSubmit}>
                    <div className="d-flex flex-column">
                      <div>
                        <label>Name</label>
                        <input type="text" name="name" onChange={handleInputChange} value={contactForm.name} placeholder="Some name" required/>
                      </div>
                      <div>
                        <label>Email</label>
                        <input type="email" name="email" onChange={handleInputChange} value={contactForm.email} placeholder="Email for contacting back" required/>
                      </div>
                      <div>
                        <label>Subject</label>
                        <input type="text" name="subject" onChange={handleInputChange} value={contactForm.subject} placeholder="What's all about?" required/>
                      </div>
                      <div>
                        <label>Content</label>
                        <input type="text" name="message" onChange={handleInputChange} value={contactForm.message} placeholder="Your thoughts" required/>
                      </div>
                      <button type="submit">Send</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          }
        </div> */}

        <div className="row subsection-padding">
          <div className="col text-center">
            <p id="home-subtitle" className="mono ts-bottom no-select">
              <span id="fx_artist">Artist</span> · <span id="fx_coder" >Programmer</span> · <span id="fx_developer" >Developer</span> · <span id="fx_gamer">Maker</span>
            </p>
          </div>
        </div>
        
        <div className="row big-section-separator"/>

        <div className="col col-lg-8 d-flex flex-column justify-content-center m-0 mx-auto p-0 fw-semibold edgedicon-home" style={{"--fx-col-text": "#eee"}}>
          <div className="row col-below-lg justify-content-center mx-auto px-0 pt-0 pb-7 techbox-multicontainer">
            <div className="d-flex flex-column techbox-container align-items-center">
              <p className="m-0 py-3 fs-4 no-select">Languages</p>
              <div className="d-flex edgedicon-container justify-content-center my-auto">
                {
                  actions.getAllResources("lang").filter(e=>!e.hidden).map((e,i)=>
                    <EdgedResourceIcon key={`rl-l${i}`} resource={e}/>
                  )
                }
              </div>
            </div>
            <div className="d-flex flex-column techbox-container align-items-center">
              <p className="m-0 py-3 fs-4 no-select">Game Engines</p>
              <div className="d-flex edgedicon-container justify-content-center my-auto">
                {
                  actions.getAllResources("engine").filter(e=>!e.hidden).map((e,i)=>
                    <EdgedResourceIcon key={`rl-e${i}`} resource={e}/>
                  )
                }
              </div>
            </div>
          </div>
          <div className="row justify-content-center mx-auto px-0 pt-0 pb-7 gap-5">
            <div className="d-flex flex-column techbox-container align-items-center">
              <p className="m-0 py-3 fs-4 no-select">Technologies</p>
              <div className="d-flex edgedicon-container justify-content-center my-auto">
                {
                  actions.getAllResources("tech").filter(e=>!e.hidden).map((e,i)=>
                    <EdgedResourceIcon key={`rl-t${i}`} resource={e}/>
                  )
                }
              </div>
            </div>
          </div>
          <div className="row justify-content-center mx-auto px-0 pt-0 pb-7 gap-5">
            <div className="d-flex flex-column techbox-container align-items-center">
              <p className="m-0 py-3 fs-4 no-select">Software</p>
              <div className="d-flex edgedicon-container justify-content-center my-auto">
                {
                  actions.getAllResources("app").filter(e=>!e.hidden).map((e,i)=>
                    <EdgedResourceIcon key={`rl-a${i}`} resource={e}/>
                  )
                }
              </div>
            </div>
          </div>
          { false &&
            <div className="row row-over-md justify-content-center mx-auto px-0 pt-0 pb-7 gap-4">
              <div className="col techbox-column m-0 p-0">
                <p className="w-100 text-center m-0 pt-3 fs-4 no-select">Other</p>
                <p className="w-100 text-center m-0 pb-3 no-select">(I wanted to flex but not very relevant nowadays)</p>
                <div className="d-flex edgedicon-container justify-content-center my-auto">
                  {
                    actions.getAllResources("flex").filter(e=>!e.hidden).map((e,i)=>
                      <EdgedResourceIcon key={`rl-a${i}`} resource={e}/>
                    )
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <div className="row subsection-padding">
          <div id="home-foottitle" className="col text-center">
            <p className="mono ts-bottom no-select m-0 p-0">Whatever you set your mind to,</p>
            <p className="mono ts-bottom no-select m-0 p-0"><b>there's always a way</b></p>
            <p className="mono ts-bottom no-select m-0 p-0">to achieve it.</p>
          </div>
        </div>

        <div className="row subsection-padding"/>

      </div>
    </>
  )
}

export default Page;