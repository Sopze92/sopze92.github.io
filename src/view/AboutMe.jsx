import React from 'react'

import { Globals } from "../context/AppContext.jsx"

import usePagedata from '../hooks/usePagedata.jsx'

const Page= ()=>{
  
  usePagedata("aboutme")

  const
    { pagedata, actions, ready }= React.useContext(Globals),
    [ games, set_games]= React.useState({modded:null, best:null})
            
  React.useEffect(()=>{

    const 
      _gamelist= actions.getResource("content:games"),
      _games_modded= [], _games_best= [], _games_online= []
    let engine, engineResource, game
    
    for(let i=0; i< _gamelist.length; i++){

      engineResource= _gamelist[i].engine
      engine= !engineResource.includes(':') ? actions.getResource(`engine:${engineResource}`) : actions.getResource(engineResource)
      
      game= {..._gamelist[i]}
      if(engine) game.engine= { img: engine.img, name: engine.name, col: engine.col };
      
      if(game.modded) _games_modded.push(game)
      if(game.best) _games_best.push(game)
      if(game.special) _games_special.push(game)
      if(game.online) _games_online.push(game)
    }

    set_games({ modded:_games_modded, best: _games_best})
  }, [ready.setup])

  return (
    <>
{/* PAGES-SERVICES */}
      <div className="container-fluid px-0 mx-0 overflow-hidden section-dark page-start">
        <div className="row d-flex justify-content-center subsection-padding gap-page-social">
          <div className="col-8 col-mobile-11 m-0 p-0 d-flex flex-column align-items-center">
            <div className="row section-padding">
              <div className="section-lit text-center">
                <div className="am-title-container">
                  <p className="no-select am-title">BORN CURIOUS</p>
                  <p className="no-select am-subtitle">1992-2009</p>
                </div>
                <div className="am-text-container">
                  <p><b>H</b>ad my first computer in <b>1995</b>, when I was just <b>3</b> years old, it was a <b>286</b> with <span className="amt-tool">MSDOS</span> and <span className="amt-game">DooM II</span>. Since then I've been fascinated by why and how things work and the possibilities of creation they bring us by simply scratching the surface, specially <b>computers</b>.</p>
                  <span>·</span>
                  <p><b>I</b> remember myself trying to edit any file in every single game I ever had, having success in some of them, as vehicle values in <span className="amt-game">Driver</span> and <span className="amt-game">Carmageddon II</span>, or editing <b>*.pcx</b> images in several click'n'point games.</p>
                  <span>·</span>
                  <p><b>Y</b>ear <b>1999</b>: <span className="amt-game">Half-Life</span> moved me into the world of modding / game content creation thanks to the <span className="amt-tool">GoldSrc</span> <i>Engine SDK</i> <span className="amt-note">(+ magazine tutorials about it)</span>, <span className="amt-tool">WorldCraft</span> and <span className="amt-tool">XSI ModTool</span>. </p>
                  <span>·</span>
                  <p><b>B</b>y the year <b>2002</b> I mostly had switched to model, texture and mission modding in <span className="amt-game">GTA</span>, as the only thing left to learn in <span className="amt-tool">GoldSrc</span> was programming, I tried it but sadly learn to code in <span className="amt-lang">C++</span> wasn't an easy task for a <b>9</b> year old without books nor resources to do so <span className="amt-note">(my only internet access was at my local cybercafe)</span>. Luckily missions in <span className="amt-game">GTA</span> were coded in an own scripting language based on <b>opcodes</b>.</p>
                  <span>·</span>
                  <p><b>K</b>ept doing the same until <b>2005</b>, when I decided to try the <span className="amt-tool">Source</span> engine as it didn't differ too much from <span className="amt-tool">GoldSrc</span>, this time I did achieve something in coding, I even tried to remake <span className="amt-game">DooM II</span> on it using <span className="amt-tool">VS-2005</span>, <span className="amt-tool">3DSMax</span>, <span className="amt-tool">Sculptris</span>, <span className="amt-tool">Valve Hammer Editor</span> <span className="amt-note">(formerly WorldCraft)</span>. Then, in the mid of <b>2006</b> I finally got <b>Internet access</b> at home.</p>
                  <span>·</span>
                  <p><b>F</b>astforward to <b>2009</b>, after getting internet access I spent all this time modding games here and there while learning all I could about computers and how to create anything on them. I ended up discarding my <span className="amt-game">DooM II</span> remake and, after finding this blog called <b>The Word of Notch</b> where a guy was posting how he was creating a game based on a grid of <b>3D</b> cubes —now known as <span className="amt-game">Minecraft</span>, I moved to inspect it, learn it and mod it as soon as I could, while learning <span className="amt-lang">Java</span> in the process <span className="amt-note">(and the world around programming)</span> just to create my own <b>games</b>, <b>tools</b>, <b>filetypes</b>, anything I needed... and in short:</p>
                  <p className="amt-conclusion">becaming a <b>Game Developer</b>.</p>
                </div>
              </div>
              <div className="section-padding"/>
              <div className="section-lit text-center">
                <div className="am-title-container">
                  <p className="no-select am-title">ROAD TO GAMEDEV</p>
                  <p className="no-select am-subtitle">2009-2019</p>
                </div>
                <div className="am-text-container">
                  <p><b>I</b> spent some time messing with <span className="amt-lang">Java</span> just to understand <span className="amt-game">Minecraft</span>'s source code. I didn't found it too difficult as I already had some surface knowledge in <span className="amt-lang">C++</span> due <span className="amt-tool">Source</span> engine modding, so I already knew the common base to understand any modern programming language. Also learnt <span className="amt-tool">Photoshop</span> and <span className="amt-tool">PaintDotNet</span> just to make my textures easier <span className="amt-note">(they were still horribles)</span>, as I was using <span className="amt-tool">MSPaint</span>, <span className="amt-tool">Gimp</span> and <span className="amt-tool">Wally</span> to this day.</p>
                  <span>·</span>
                  <p><b>I</b> made a vast lot of things in <span className="amt-lang">Java</span><span className="amt-foot">*</span> using the <span className="amt-tool">Eclipse IDE</span>, most of them were useless <b>tools</b> and <b>games</b> that I made just to know how to. Others started as serious projects that were discarded as soon as I learnt how to develop the main concept or feature I was in pursuit of, just to move to the next challenge. To mention a few finished projects: a <b>SNES *.smc</b> reader and image extractor, a <b>SNES to PNG</b> image converter and palette editor, a custom <b>data-filetype</b> with hierachy system and a per-byte key-lock encryption system, a <b>*.dae 3D</b> file reader and visualizer, a custom <b>package-filetype</b> based in the aforementioned <b>data-filetype</b>... I also started a bunch of game projects of a variety of genres like <b>First Person</b>, <b>RPG</b> and <b>click'n'point</b>, etc...</p>
                  <span>·</span>
                  <p><b>D</b>idn't made the full transition to <span className="amt-lang">C#</span> until I discovered <span className="amt-tool">Unity</span> around <b>2015</b>, were <span className="amt-note">(as many others)</span> I stupidly tried to make a huge sandbox videogame like <span className="amt-game">Grand Theft Auto III</span> <span className="amt-note">(that was rapidly discarded)</span>. I also made a vast lot of things in <span className="amt-tool">Unity</span>, but as I did with <span className="amt-lang">Java</span>, most of them are also unfinished projects of which I made the main concept just to know how to.</p>
                  <span>·</span>
                  <p><b>B</b>y <b>2018</b> I had several personal projects finished in <span className="amt-tool">Unity</span>, a lot of reusable code implementing gameplay features and an own library to help me develop future <span className="amt-tool">Unity</span> projects faster. By this date I also had been learning <span className="amt-tool">Unreal Engine</span>, both because it uses <span className="amt-lang">C++</span> <span className="amt-note">(which I liked most)</span> and a different approach on how to proceed in development terms, so I wanted to learn about it just in case I ever need it. On that moment I wasn't aware, but I was</p>
                  <p className="amt-conclusion">laying the foundations of my <b>GameDev Career</b>.</p>
                </div>
                <p className="am-footnote">* - I still have leftovers of a lot of those projects, althought most of them don't even work anymore</p>
              </div>
              <div className="section-padding"/>
              <div className="section-lit text-center">
                <div className="am-title-container">
                  <p className="no-select am-title">SETTLING MY CAREER</p>
                  <p className="no-select am-subtitle">2019-2022</p>
                </div>
                <div className="am-text-container">
                  <p><b>T</b>hankfully <span className="amt-event">Covid-19</span> didn't turn life too different for me, I slightly moved from <span className="amt-tool">Unreal Engine</span> and <span className="amt-tool">Unity</span> and decided to spent the confinment making myself better. I improved some of my skills like 3D modeling in <span className="amt-tool">Blender</span>, <b>2D</b> drawing in my favorite styles <span className="amt-note">(pixelart, handpaint, realistic)</span> and with several tools, and videogame music production with <span className="amt-tool">FLStudio</span>. I also learnt to create fonts with <span className="amt-tool">Type 3.2</span> and to use new tools like <span className="amt-tool">Maya</span>, <span className="amt-tool">Substance Painter</span>, <span className="amt-tool">Marmoset</span>, <span className="amt-tool">Inkscape</span>, <span className="amt-tool">Illustrator</span>, etc...</p>
                  <span>·</span>
                  <p><b>W</b>orth mentioning I learnt <b>SNES</b> Rom-Hacking, which immediatelly got me attracted to <b>SNES</b> programming <span className="amt-note">(as it is my favorite console)</span> so I decided to learn <span className="amt-lang">65c816 assembly language</span> , it was easier than I though, I guess it was because I've always loved memory management as well as writing compact and efficient code, and that's the main mindset to be able to code in <b>assembly language</b>.</p>
                  <span>·</span>
                  <p><b>I</b> ended up loving <b>assembly language</b> even more than <span className="amt-lang">C++</span>, altough I know it barely has practical uses nowadays other than using it as a <b>hobby</b> <span className="amt-note">(EG: making SNES games)</span>, at the same time I think it's important to learn it just to understand how programming works at the lowest level, so low that is basically <b>physical level</b>.</p>
                  <span>·</span>
                  <p><b>A</b></p>
                  <p className="amt-conclusion"><b></b>.</p>
                </div>
              </div>
            </div>
          </div>
{/*           <div className="col-7 m-0 p-0 d-flex flex-column align-items-center">
            {games.modded &&
              <div className="row section-padding">
                <p className="w-100 text-center m-0 py-3 fs-2 no-select">GAMES I'VE MODDED</p>
                <p className="w-100 text-center m-0 py-3 fs-4">
                  This is the list of the games I could recall, there were a lot more, dozens of unknown great games made by unlucky developers, most games back in the day often used common formats for its files, and the files were just sitting in folders, so they were pretty easy to modify, a lot of them had variables, configs and some other internal data exposed in simple plain text files with custom extensions.
                </p>
                <div className="d-flex w-100 gamelist-container">
                  <ul className="gamelist">
                    {games.modded.map((e,i)=>
                      <li key={`mgl-${i}`} className="gamelist-element">
                        <div className="gamelist-engine"><img src={e.engine.img}/></div>
                        <div className="gamelist-year font-monospace">{e.year}</div>
                        <span className="gamelist-title">{e.name}</span>
                      </li>)}
                  </ul>
                </div>
                <p className="w-100 text-center m-0 py-3 fs-4">
                  E.G.: I remember a 2D action side-scroller made by a company named Armadillo Software, I liked that game a lot, and every single image was in *.bmp format so I changed a lot of visuals and animations there. At this day I couldn't remember the title, and I haven't found a single thing about the existence of that company.
                </p>
                <p className="w-100 text-center m-0 py-3 fs-4">
                  Unfortunatelly, most of the content I've created along all this years is lost forever or resting in old (pre-sata) HDDs at my parent's house (I think I've never threw away a single HDD in my entire life) as it was before I had internet access in 2006
                </p>
              </div>
            }
            {games.best &&
              <div className="row section-padding">
                <p className="w-100 text-center m-0 py-3 fs-2 no-select">'FAVORITE' GAMES</p>
                <p className="w-100 text-center m-0 py-3 fs-4">
                  I've played an endless amount of games, sadly I'm one of those persons that cannot pick no favorites. Obviously the games I've modded most would be in some favorites list if I could write one, but theres also a lot of games I love of which I've never found a way to mod, or never wanted to.
                  <br/>Here's the more accurate list I could came with:
                </p>
                <div className="d-flex w-100 gamelist-container">
                  <ul className="gamelist">
                    {games.best.map((e,i)=>
                      <li key={`mgl-${i}`} className="gamelist-element">
                        <div className="gamelist-engine"><img src={e.engine.img}/></div>
                        <div className="gamelist-year font-monospace">{e.year}</div>
                        <span className="gamelist-title">{e.name}</span>
                      </li>)}
                  </ul>
                </div>
                <p className="w-100 text-center m-0 py-3 fs-4">
                  Then there's a lot of non-favorites-but-still-special games, maybe some of them are just because they were my firsts pick of a genre, some others might be attached to moments... whatever it is, they have a place inside me forever:                </p>

              </div>
            }
          </div> */}
        </div>
      </div>
    </>
  )
}

export default Page;