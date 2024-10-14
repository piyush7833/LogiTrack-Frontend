import React from 'react'

type propsType={
    text:string,
    onClick:()=>void
    cls?:'secondary' | 'primary'
    disabled?:boolean
}
const Button = ({text,onClick,cls,disabled}:propsType) => {
  return (
    <button disabled={disabled}  className={` disabled:cursor-not-allowed disabled:bg-blue-300 cursor-pointer rounded-sm flex items-center justify-center px-primaryX py-primaryY ${cls==="secondary"?`bg-white hover:bg-slate-300`:' bg-blue-700 hover:bg-blue-500'} border-blue-700 border-[1px]`} onClick={()=>onClick()}>
      {text}
    </button>
  )
}

export default Button
