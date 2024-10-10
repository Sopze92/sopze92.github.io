
export const StaticData= {
  date: _simpleDate(new Date())
}

function _simpleDate(date){
  return [date.getDate(), date.getMonth(), date.getFullYear()]
}