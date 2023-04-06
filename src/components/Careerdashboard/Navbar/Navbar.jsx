import React from 'react'
import pf from '../../../assets/pf.svg'
const Navbar = () => {
  return (
    <>
    <div class='h-[80px] w-[45%]  flex items-center justify-center sm:h-[50px] sm:w-[58%]' >
    <p class='text-[#1476B7] text-[22px] sm:text-[10px] ' >Hello <strong> Bruno Fernandes</strong>, welcome back!</p>
    </div>
     <div class='h-[80px] w-[45%]  flex items-center justify-end  sm:h-[50px] sm:w-[40%]' >
        <div class='bg-[#1476B7] h-[65px] w-[60%] lg:mr-8 rounded-xl flex items-center justify-around  sm:h-[40px] sm:w-[98%] '>
            <img src={pf} class='h-[55px] sm:h-[25px]' />
            <div class='h-[55px] w-[70%] flex flex-col justify-center ' >
                <p class='text-[#fff] sm:text-[10px]  ' >Bruno Fernandes</p>
                <p class='text-[#fff] text-[12px] sm:text-[8px]  '>Bruno@gmail.com</p>
            </div>
        </div>
     </div>
     </>
  )
}

export default Navbar
