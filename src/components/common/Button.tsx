import React from 'react'

type propsType={
    text:string,
    onClick:()=>void
    cls?:'secondary' | 'primary'
}
const Button = ({text,onClick,cls}:propsType) => {
  return (
    <div className={`cursor-pointer rounded-sm flex items-center justify-center px-primaryX py-primaryY ${cls==="secondary"?`bg-white hover:bg-slate-300`:' bg-blue-700 hover:bg-blue-500'} border-blue-700 border-[1px]`} onClick={()=>onClick()}>
      {text}
    </div>
  )
}

export default Button
