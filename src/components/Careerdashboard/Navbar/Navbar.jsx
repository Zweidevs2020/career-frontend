import React from 'react'
import navImg from '../../../assets/navImg.svg'
const Navbar = () => {
  return (
    <>
    <div class='h-[80px] w-[45%]  flex items-center justify-center' >
    <p class='text-[#1476B7] text-[22px] ' >Hello <strong> Bruno Fernandes</strong>, welcome back!</p>
    </div>
     <div class='h-[80px] w-[45%]  flex items-center justify-end' >
        <div class='bg-[#1476B7] h-[65px] w-[60%] mr-8 rounded-xl flex items-center justify-around'>
            <img src={navImg} class='h-[55px]' />
            <div class='h-[55px] w-[70%] flex flex-col justify-center' >
                <p class='text-[#fff]' >Bruno Fernandes</p>
                <p class='text-[#fff] text-[12px] '>Bruno@gmail.com</p>
            </div>
        </div>
     </div>
     </>
  )
}

export default Navbar
