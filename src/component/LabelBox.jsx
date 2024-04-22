import React from "react"

const LabelBox= ({ label })=>{
  return (
    <div className="d-flex justify-content-center">
      <div className="fx-labelbox">{label}</div>
    </div>
  )
}

export default LabelBox