import React from 'react'
import Navbar from './Navbar';
import Aside from './Aside';
import Main from './Main';
import Right from './Right';

const CareerDashboard = () => {
  return (
    <div className='main' class='h-[100%] w-[100%] bg-[#F5F5F5] grid grid-cols-10 grid-rows-[90px,500px] gap-[2px] sm:h-[100%] sm:w-[100%] sm:gap-[2px] sm:grid sm:grid-cols-5 sm:grid-rows-[60px,380px] md:h-[100%] md:w-[100%] md:gap-[2px] md:grid md:grid-cols-5 md:grid-rows-[60px,555px,500px] ' >
      <div className='career' class=' bg-white w-[100%] h-[590px] col-span-6 sm:row-span-2   ' >
        <Main/>
      </div>
      <div className='rightaside' class=' bg-white col-span-4 h-[590px] sm:col-span-5  sm:row-span-2  md:row-span-3 md:hidden md:col-span-5'  >
        <Right/>
      </div>
    </div> 
  )
}

export default CareerDashboard;
