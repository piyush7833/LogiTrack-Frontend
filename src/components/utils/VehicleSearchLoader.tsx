import React from 'react'
import LoadingModal from '../common/LoadingModal'
import Skelton from '../common/Skelton'

const VehicleSearchLoader = () => {
  return (
    <div className="fixed inset-0 h-screen bg-gray-100 overflow-hidden z-20">
         <div className="w-4/5 mx-auto">   
      <div className="grid grid-cols-2 gap-6 p-6">
        {Array(8).fill(0).map((_, idx) => (
          <div className="" key={idx}>
            <Skelton  />
          </div>
        ))}
      </div>

      <LoadingModal/>
    </div>
    </div>
  )
}

export default VehicleSearchLoader
