{
  const deviceDesktop= checkDeviceDesktop();
  
  if(deviceDesktop){

    const titlebg = document.getElementById("home-title-3D");
    const title = document.getElementById("home-title-bg").children[0];
    var angx= .0, angy= .0, movx= .0, movy= .0, scale= 1.0;
  
    function transformElements(x, y) {
      let box = titlebg.getBoundingClientRect();
  
      const musx= x - box.x - box.width * .5;
      const musy= y - box.y - box.height * .5;
      const pxfactor= 100.0 / box.width * 200;
  
      angx = musy * .0025;
      angy = musx * .0025;
      movx = musx * -.0125;
      movy = musy * -.0125;
  
      titlebg.style.transform = `translate(${-movx.clamp(-pxfactor, pxfactor)}px, ${-movy.clamp(-pxfactor, pxfactor)}px)`;
      title.style.transform = `perspective(200px) rotateX(${angx}deg) rotateY(${angy}deg) translate(${-movx*.75}px, ${-movy*.25}px)`;
    }
  
    document.addEventListener("mousemove", (e) => {
      window.requestAnimationFrame(function () {
          transformElements(e.clientX, e.clientY);
      });
    });
  
    Number.prototype.clamp = function(min, max) {
      return Math.min(Math.max(this, min), max);
    };
  }

  function checkDeviceDesktop(){
    const includes= ['win64', 'win32', 'linux', 'unix', 'mac', 'macos', 'mac os'];
    const excludes= ['android', 'ios', 'mobile', 'tablet'];
    const useragent= navigator.userAgent.toLowerCase();
    return !excludes.some((e) => useragent.includes(e)) && includes.some((e) => useragent.includes(e));
  }
}

window.onresize= function () { console.log('width:' + window.innerWidth); };
