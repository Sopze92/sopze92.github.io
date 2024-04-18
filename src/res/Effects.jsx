export const FrostedGlass= ()=>{
  return (
    <>
      <div className="m-0 p-0 position-absolute w-100 h-100 no-pointer">
        {
          Array(8).fill(null).map((e,i)=>
            <div key={`frostedglass-layer-${i}`} className={`bg-frostedglass-complex layer${i}`} />
          )
        }
      </div>
    </>
  )
}