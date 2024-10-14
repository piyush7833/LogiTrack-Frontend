"use client"
import ParticularFleet from '@/components/pages/Admin/fleet/particularFleet/ParticlarFleet'
import { useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const params = useParams()
  const id = params.id
  return (
    <ParticularFleet id={id as string} />
  )
}

export default Page
