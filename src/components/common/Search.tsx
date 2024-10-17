/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Fragment, useState } from "react";
import useLocation from "@/app/hooks/useLocation";

type propsType={
  onSelect:(location:any)=>void,
  placeholder?:string
  listName?:string
}
const Search = ({onSelect,placeholder,listName}:propsType) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { getSuggestions } = useLocation();
  const fetchSuggestions = async (query: string) => {
    const res= await getSuggestions(query);
    if(res){
      setSuggestions(res.data);
    }
  };
  return (
    <Fragment>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => fetchSuggestions(e.target.value)}
        list={listName}
      />
      {suggestions && suggestions.length > 0 && (
        <ul className="relative">
          {suggestions.map((suggestion, index) => (
            <li className="cursor-pointer" key={index} onClick={() => {onSelect(suggestion); setSuggestions([]); }}>
              {(suggestion as any).display_name}
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
};

export default Search;
