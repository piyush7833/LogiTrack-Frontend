/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { imgMaps } from '../../../../config/constantMaps'
import Card from '@/components/common/Card'
import useBooking from '@/app/hooks/useBooking'

type propsType={
    locationA:any,
    locationB:any,
    distance:number,
    bookingDatac:any,
    inputValueA:string,
    inputValueB:string,
    vehicleData:any,
    setBookingData:any,
    setDrivers:any,
    isDriver:boolean
}

const Vehicles = ({locationA,locationB,distance,bookingDatac,inputValueA,inputValueB,vehicleData,setBookingData,setDrivers,isDriver}:propsType) => {
    const {createBooking}=useBooking()
    const handleBooking=async(data:any)=>{
        try {
          console.log(data)
          const response =await createBooking(data)
          console.log(response)
          if(response && response.data && !isDriver){
            setBookingData(response.data.booking);
            console.log(response.data.booking)
            console.log(bookingDatac)
            setDrivers(response.data.drivers)
          }
        } catch (error) {
          console.log(error)
        }
      }
  return (
    <div className="flex w-full flex-wrap gap-4 justify-center px-primaryX py-primaryY">
          {vehicleData.map((item:any, index:number) => (
            <Card
              key={index}
              title={item.type}
              desc={item.desc}
              price={item.price}
              time={item.time}
              width="100%"
              img={imgMaps[item.type as keyof typeof imgMaps]}
              onClick={() =>
              {
                console.log("object")
                console.log(bookingDatac)
                if(locationA && locationB && item.price && !bookingDatac){
                  handleBooking({
                    vehicleType: item.type,
                    distance: distance,
                    price: item.price,
                    srcName: inputValueA,
                    destnName: inputValueB,
                    src: { lat: locationA?.lat, lng: locationA?.lng },
                    destn: { lat: locationB?.lat, lng: locationB?.lng },
                    duration: item.time
                  })
                }

              }
              }
            />
          ))}
        </div>
  )
}

export default Vehicles
