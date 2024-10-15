import React from "react"

const LabelBox= ({ label, variant=null })=>{
  return (
    <div className="labelbox-wrapper">
      <div className={`fx-labelbox ${variant??""}`}>{label}</div>
    </div>
  )
}

export default LabelBox