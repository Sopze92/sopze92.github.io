!(()=>{
  if(deviceDesktop){

    const titlebg = document.getElementById("home-title-3D");
    const title = document.getElementById("home-title-bg").children[0];
    var angx= .0, angy= .0, movx= .0, movy= .0;
  
    function transformElements(x, y) {
      let box = titlebg.getBoundingClientRect();
  
      let halfBoxWidth= box.width * .5;
      let halfBoxHeight= box.height * .5;

      const musx= x - box.x - halfBoxWidth;
      const musy= y - box.y - halfBoxHeight;
      const pxfactor= 100.0 / box.width * 200;
  
      angx = musy * .0045;
      angy = musx * .0025;
      movx = musx * -.0125;
      movy = musy * -.0125;
  
      titlebg.style.transform = `translate(${-movx.clamp(-pxfactor, pxfactor)}px, ${-movy.clamp(-pxfactor, pxfactor)}px)`;
      title.style.transform = `perspective(200px) rotateX(${angx}deg) rotateY(${angy}deg) translate(${-movx*.75}px, ${-movy*.25}px)`;
    }
  
    let u= true;
    document.addEventListener("mousemove", (e) => {
      if(u=!u) window.requestAnimationFrame(function () { transformElements(e.clientX, e.clientY); });
    });
  }
})();

