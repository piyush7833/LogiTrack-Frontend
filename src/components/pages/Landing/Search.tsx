/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import useMap from '@/app/hooks/useMap';
import React, { useState } from 'react'

interface Suggestion {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
  }

type propsType={
    setLocationA:any,
    setLocationB:any
    inputValueA:string,
    inputValueB:string,
    setInputValueA:React.Dispatch<React.SetStateAction<string>>,
    setInputValueB:React.Dispatch<React.SetStateAction<string>>,
    mapRef:any
}
const Search = ({setLocationA,setLocationB,inputValueA,inputValueB,setInputValueA,setInputValueB,mapRef}:propsType) => {
    const [suggestionsA, setSuggestionsA] = useState<Suggestion[]>([]);
    const [suggestionsB, setSuggestionsB] = useState<Suggestion[]>([]);
    const {handleSearch,handleBlur,handleSelectLocation}=useMap()
  return (
    <div>
          {["Pickup", "Destination"].map((loc, index) => (
            <div className="mb-4" key={loc}>
              <input
                type="text"
                placeholder={`Enter ${loc} Location`}
                className="p-2 border rounded w-full"
                value={index === 0 ? inputValueA : inputValueB}
                onChange={(e) => handleSearch(e.target.value,index===0,setInputValueA,setInputValueB,setSuggestionsA,setSuggestionsB) }
                onBlur={() => handleBlur(index === 0,setSuggestionsA,setSuggestionsB)}
              />
              {(index === 0 ? suggestionsA : suggestionsB).length > 0 && (
                <ul
                  className="absolute z-30 bg-white border rounded mt-1 w-full max-h-48 overflow-y-auto shadow-lg"
                  style={{ pointerEvents: "auto" }}
                >
                  {(index === 0 ? suggestionsA : suggestionsB).map(
                    (suggestion) => (
                      <li
                        key={suggestion.place_id}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onMouseDown={() =>
                          handleSelectLocation(suggestion, index === 0,setLocationA,setLocationB,setInputValueA,setInputValueB,setSuggestionsA,setSuggestionsB,mapRef)
                        }
                      >
                        {suggestion.display_name}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
  )
}

export default Search
