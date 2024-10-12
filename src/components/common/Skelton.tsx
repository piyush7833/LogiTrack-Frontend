import React from 'react'

const Skelton = () => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg animate-pulse flex flex-col gap-5">
        
    <div className="flex w-full">
    <div className="h-10 w-10 bg-gray-300 mr-4 rounded-md"></div>
    <div className="flex flex-col w-full">
    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
    </div>
    </div>
    <div className="flex w-full">
    <div className="h-10 w-10 bg-gray-300 mr-4 rounded-md"></div>
    <div className="flex flex-col w-full">
    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
    </div>
    </div>
  </div>
  )
}

export default Skelton
