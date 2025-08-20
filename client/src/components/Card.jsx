import React from 'react'

const Card = ({image}) => {
  return (
    <div className="w-[150px] h-[250px] bg-[#030326] border-2 border-[blue] rounded-2xl overflow-hidden  ">
        <img src={image} alt="" className="h-full object-cover" />
    </div>
  )
}

export default Card