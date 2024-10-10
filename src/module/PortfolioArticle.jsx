import React from "react"

import { Globals, Functions } from "../context/AppContext.jsx"

import useCustomTags from '../hooks/useCustomTags.jsx'

import { EdgedResourceIcon } from "../component/EdgedIcon.jsx"
import { CarouselRowSimple, CarouselRow, CarouselColumn } from '../component/Carousel.jsx'

const PortfolioArticle= ()=>{

  const
    { portfolio, actions }= React.useContext(Globals),
    [animStyle, set_animStyle]= React.useState("border-anim")

  const customTags= useCustomTags()

  React.useEffect(()=>{
    
    if(portfolio.body) {
      set_animStyle("border-anim")
      setTimeout(()=>{
        set_animStyle("")
      }, 250)

      actions.setIndentColor(portfolio.body.indent??null)
    }
  },[portfolio.body])

  function parsePortfolioContent(element, idx=null){

    const k= idx? `pf-ae-${idx}` : null

    switch(element.type?? -1){
      // ORGANIZATION
      case "sep":
        return <div key={k} className="ptf-separator"/>
      case "row":
        return <div key={k} className={"row d-flex " + (element.css?? "")}>
          {
            element.data.map((e,i)=>
              parsePortfolioContent(e,i)
            )
          }
        </div>
      case "col":
        return <div key={k} className={"col d-flex flex-column " + (element.css?? "")}>
          {
            element.data.map((e,i)=>
              parsePortfolioContent(e,i)
            )
          }
        </div>
      case "box":
        return (
          <div key={k} className="ptf-width-limit">
            <div className={element.css?? "ptf-frame"}>
              <div className="wrapper">
                { 
                  parsePortfolioContent(element.data.content)
                }
              </div>
              <p {...customTags.innerHtml(element.data.text)}/>
            </div>
          </div>
        )
      // IMAGE / MULTIMEDIA
      case "img":
        return <img key={k} className={`ptf-width-limit ${element.css?? ""}`} src={element.abs ? element.src : parseImageSrc(element.src)}/>
      case "img:box":
        {
          const lsrc= element.data.abs ? element.data.src : parseImageSrc(element.data.src)
          return (
            <div key={k} className="ptf-width-limit">
              <div className={element.css?? "ptf-frame"}>
                <div className="wrapper">
                  <a className="d-block" onClick={(e)=>Functions.voidEvent(e)} href={lsrc} target="_blank">
                    <img className="framed-img" src={lsrc}/>
                  </a>
                </div>
                <p {...customTags.innerHtml(element.data.text)}/>
              </div>
            </div>
          )
        }
      case "vid:box":
        {
          const lsrc= element.data.abs ? element.data.src : parseImageSrc(element.data.src)
          return (
            <div key={k} className="ptf-width-limit">
              <div className={element.css?? "ptf-frame"}>
                <div className="wrapper">
                  <video className="framed-video" controls autoPlay loop>
                    <source src={lsrc}/>
                  </video>
                </div>
                <p {...customTags.innerHtml(element.data.text)}/>
              </div>
            </div>
          )
        }
      // CAROUSEL
      case "img:xcar-":
        {
          const ldata= structuredClone(element.data);
          for(let i in element.data){
            if(!ldata[i].abs) ldata[i].src= parseImageSrc(ldata[i].src)
            delete ldata[i].abs
          }
          return <CarouselRowSimple key={k} items={ldata}/>
        }
      case "img:xcar":
        {
          const ldata= structuredClone(element.data);
          for(let i in element.data){
            if(!ldata[i].abs) ldata[i].src= parseImageSrc(ldata[i].src)
            delete ldata[i].abs
          }
          return <CarouselRow key={k} aspect={element.aspect} items={ldata}/>
        }
      case "img:ycar":
        {
          const ldata= structuredClone(element.data);
          for(let i in element.data){
            if(!ldata[i].abs) ldata[i].src= parseImageSrc(ldata[i].src)
            delete ldata[i].abs
          }
          return <CarouselColumn key={k} aspect={element.aspect} items={ldata}/>
        }
      // TEXT
      case "txt":
        return <p key={k} className={element.css?? null} {...customTags.innerHtml(element.data)}/>
      case "txt:ol":
      case "txt:ul":
        {
          const 
            TagElement= element.type=="txt:ol" ? 'ol' : 'ul',
            separator= element.separator ? <span>{element.separator}</span> : " "
  
          return (
            <TagElement key={k} className={`clist ${element.css?? "ptf-textlist"}`}>
              { element.data.map((e,i)=>
                <li key={`${k}-${i}`}>{separator}<p {...customTags.innerHtml(e)}/></li>
              )}
            </TagElement>
          )
        }
      case "txt:blk":
        return (
          <div key={k} className={"ptf-textblock " + (element.css?? "")}>
            { element.data.split('\n').map((e,i)=>
              <p key={`${k}-${i}`} {...customTags.innerHtml(e)}/>
            )}
          </div>
        )
      case "lnk":
        return <a key={k} href={parseLinkHref(element.href??"#")} target="_blank" className={element.css?? null} {...customTags.innerHtml(element.data)}/>
      case "lnk:ol":
      case "lnk:ul":
        {
          const 
            TagElement= element.type=="txt:ol" ? 'ol' : 'ul',
            separator= element.separator ? <span>{element.separator}</span> : " "
  
          return (
            <TagElement key={k} className={`clist ${element.css?? "ptf-textlist"}`}>
              { element.data.map((e,i)=>
                <li key={`${k}-${i}`}>{separator}<a href={parseLinkHref(e[0])} target="_blank" {...customTags.innerHtml(e[1])}/></li>
              )}
            </TagElement>
          )
        }
      // EMBEDINGS
      case "emb:youtube":
        return (
          <div key={k} className={`embed youtube ${element.full ? "full" : ""}`}>
            <iframe referrerPolicy="strict-origin-when-cross-origin" src={`https://www.youtube-nocookie.com/embed/${element.id}`}/>
          </div>
        )
      case "emb:sketchfab":
        return (
          <div key={k} className={`embed sketchfab ${element.full ? "full" : ""}`}>
            <iframe referrerPolicy="strict-origin-when-cross-origin" src={`https://sketchfab.com/models/${element.id}/embed?dnt=1`}/>
          </div>
        )
      // FONT
      case "fon":
        return (
          <div className={`dev-font-preview font-${element.data}`}>
          {
            Array.from("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=_&.,:;+-*()[]{}%$!?¿¡/\\~<>@#").map((e,i)=>
              <span key={`fc-${i}`}>{e}</span>
            )
          }
          </div>
        )
    }
    
    return <p key={k} className="text-danger">unknown element type at index {idx}: {element.type}</p>
  }

  function parseImageSrc(srcAttr){
    return `res/img/${srcAttr.replace("{0}", portfolio.body.name)}`
  }

  function parseLinkHref(text){
    let _text= text
    if(text.includes('{g}')) _text= _text.replace(`{g}`, "https://sopze92.github.io")
    return _text
  }

  return (
    <div className={`col-8 ptf-content ${animStyle}`}>
      <div className="d-flex flex-column ptf-title-block">
        {
          portfolio.body.titlepic?.replace && 
          <img className="w-75 mx-auto" src={portfolio.body.titlepic.absolute ? portfolio.body.titlepic : parseImageSrc(portfolio.body.titlepic.src)} alt={portfolio.body.title}/>
          ||
          <p className="text-center m-0 pt-3 fs-1 no-select fw-semibold">{portfolio.body.title}</p>
        }
        <p className="text-center m-0 pb-3 fs-3 no-select">- <span {...customTags.innerHtml(portfolio.body.description)}/> -</p>
        { portfolio.body.titlepic && !portfolio.body.titlepic.replace &&
          <img className="w-75 mx-auto" src={portfolio.body.titlepic.absolute ? portfolio.body.titlepic : `res/img/ptf/${portfolio.body.titlepic.src}`}/>
        }
      </div>
      { portfolio.body.header &&
        <div className="d-flex justify-content-center my-auto ptf-header-block">
          {
            portfolio.body.header.map((e,i)=> 
              <EdgedResourceIcon key={`pf-ah-${i}`} resource={actions.getResource(e)}/>
            )
          }
        </div>
      }
      <div className="d-flex flex-column ptf-content-block">
        { 
          portfolio.body.content.map((e,i)=>
            parsePortfolioContent(e,i)
          )
        }
      </div>
    </div>
    )
}

export default PortfolioArticle