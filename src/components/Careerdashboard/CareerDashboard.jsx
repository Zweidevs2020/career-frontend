import React from 'react'
import Navbar from './Navbar';
import Aside from './Aside';
import Main from './Main';
import Right from './Right';

const CareerDashboard = () => {
  return (
    <div className='main' class='h-[100vh] w-[100%] bg-[#F5F5F5] grid grid-cols-10 grid-rows-[90px,560px] gap-[2px]' >
      <div className='aside' class='bg-[#F8FAFC] col-span-2 row-span-2 ' >
        <Aside/>
      </div>
      <div className='navbar' class='bg-[#F8FAFC] col-span-8 flex items-center justify-between ' >
        <Navbar/>
      </div>
      <div className='career' class='bg-white col-span-5 ' >
        <Main/>
      </div>
      <div className='rightaside' class='bg-white col-span-3' >
        <Right/>
      </div>
    </div>
  )
}

export default CareerDashboard;
