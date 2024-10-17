"use client"
import AnalyticsVehicle from '@/components/pages/Admin/fleet/analyticsVehicle/AnalyticsVehicle'
import { useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const params = useParams()
  const id = params.id
  return (
    <AnalyticsVehicle id={id as string} />
  )
}

export default Page
