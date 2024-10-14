"use client"
import ParticularDriver from '@/components/pages/Admin/driver/particularDriver/ParticularDriver'
import { useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const params = useParams()
  const id = params.id
  return (
    <ParticularDriver id={id as string} />
  )
}

export default Page
