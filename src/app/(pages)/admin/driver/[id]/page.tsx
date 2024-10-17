"use client"
import AnalyticsDriver from '@/components/pages/Admin/driver/particularDriver/AnalyticsDriver'
import { useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const params = useParams()
  const id = params.id
  return (
    <AnalyticsDriver id={id as string} />
  )
}

export default Page
