"use client"
import React, { useEffect, useState } from 'react'
import Button from './Button'
import { useRouter } from 'next/navigation'
import useCookie from '@/app/hooks/useCookie'
import Link from 'next/link'

const Navbar = () => {
    const[showMobileMenu,setShowMobileMenu]=useState(false)
    const {getCookie}=useCookie()
    const role=getCookie('role')
    const router=useRouter()
    const commonLinks=[
        {name:'Home',path:'/'},
        {name:'Bookings',path:'/bookings'},
        {name:'Profile',path:'/profile'}
    ]
    const adminLinks=[
        {name:'Fleet',path:'/admin/fleet'},
        {name:'Analytics',path:'/admin/analytics'},
    ]
    const [links,setLinks]=useState(commonLinks)

    useEffect(()=>{
        if(role==='admin'){
            setLinks([
                ...commonLinks,
                ...adminLinks
            ])
        }
    },[role])

  return (
    <div className='flex justify-between px-primaryX py-primaryY border-[1px] items-center z-10 w-full'>
      <div className="logo">
        <h1>logo</h1>
      </div>
      <div className="links hidden md:flex gap-4">
        {links.map((link,index)=>(
            <Link key={index} href={link.path}><p className='hover:text-blue-700'> {link.name}</p></Link>
        ))}
      </div>
      <div className="btns hidden md:flex gap-4">
        <Button text='Login' cls='secondary' onClick={()=>{router.push('/auth?mode=login')}} />
        <Button text='Signup'  onClick={()=>{router.push('/auth?mode=signup')}} />
      </div>
      <div className="md:hidden">
        <button className="mobile-menu-button" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      {showMobileMenu && (
        <div className="mobile-menu absolute top-full left-0 w-full bg-white flex flex-col items-center gap-4 py-4">
          {links.map((link, index) => (
            <Link key={index} href={link.path}><p className='hover:text-blue-700'> {link.name}</p></Link>
          ))}
          <Button text='Login' cls='secondary' onClick={()=>{router.push('/auth?mode=login')}} />
          <Button text='Signup'  onClick={()=>{router.push('/auth?mode=signup')}} />
        </div>
      )}
      </div>
  )
}

export default Navbar
