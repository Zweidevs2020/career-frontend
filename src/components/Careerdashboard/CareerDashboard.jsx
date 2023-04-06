import React from 'react'
import Navbar from './Navbar';
import Aside from './Aside';
import Main from './Main';
import Right from './Right';

const CareerDashboard = () => {
  return (
    <div className='main' class='h-[100vh] w-[100%] bg-[#F5F5F5] grid grid-cols-10 grid-rows-[90px,560px] gap-[2px] sm:h-[100%] sm:w-[100%] sm:grid sm:grid-cols-5 sm:grid-rows-[60px,450px] ' >
      <div className='aside' class='bg-[#F8FAFC] col-span-2 row-span-2 sm:hidden ' >
        <Aside/>
      </div>
      <div className='navbar' class='bg-[#F8FAFC] col-span-8 flex items-center justify-between sm:col-span-5 sm:flex sm:items-center sm:justify-around ' >
        <Navbar/>
      </div>
      <div className='career' class='bg-white col-span-5 sm:row-span-2  ' >
        <Main/>
      </div>
      <div className='rightaside' class='bg-white col-span-3 sm:col-span-5  sm:row-span-2' >
        <Right/>
      </div>
    </div>
  )
}

export default CareerDashboard;
