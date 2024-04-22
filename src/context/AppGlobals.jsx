
export const EventData= {
  mousemove: null
}

export const _initialize= ()=> {
  window.addEventListener('mousemove', _setMousemove)

  function _setMousemove(e) { EventData.mousemove= e }
}