
export const EventData= {
  mousemove: null
}

export const StaticData= {
  date: _simpleDate(new Date())
}

export const _initialize= ()=> {
  window.addEventListener('mousemove', _setMousemove)

  function _setMousemove(e) { EventData.mousemove= e }
}

function _simpleDate(date){
  return [date.getDate(), date.getMonth(), date.getFullYear()]
}