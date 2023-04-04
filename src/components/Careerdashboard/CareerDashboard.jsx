import React from 'react'
import Navbar from './Navbar';

const CareerDashboard = () => {
  return (
    <div className='main' class='h-[100vh] w-[100%] bg-[#F5F5F5] grid grid-cols-5 grid-rows-[90px,560px] gap-[2px]' >
      <div className='aside' class='bg-[#F8FAFC] col-span-1 row-span-2 ' ></div>
      <div className='navbar' class='bg-[#F8FAFC] col-span-4 flex items-center justify-around ' >
        <Navbar/>
      </div>
      <div className='career' class='bg-white col-span-3 ' ></div>
      <div className='rightaside' class='bg-white' ></div>
    </div>
  )
}

export default CareerDashboard;
