import React from 'react'
import searchicon from '../../../assets/searchicon.svg'
import imgcard from '../../../assets/imgcard.svg';
import imgcard2 from '../../../assets/imgcard2.svg';
import imgcard3 from '../../../assets/imgcard3.svg';
import imgcard5 from '../../../assets/imgcard5.svg';

const Main = () => {
  return (
    <>
    <div class='h-[40px] w-[100%] flex items-center justify-between' >
        <div class='h-[40px] w-[53%] ml-8 ' >
            <h1 class='text-[24px] text-[#474749] font-bold ml-1' >Career Guidance</h1>
        </div>
        <div class='h-[40px] w-[25%]  mr-2 flex items-center justify-around ' >
            <img src={searchicon} />
            <input type='text' placeholder='Search...' class='w-[75%] border-none outline-none' />
        </div>
    </div>
    <div class='h-[250px] w-[100%]  flex flex-wrap items-center justify-around ' >
        <div class='h-[111px] w-[45%]  rounded-xl' >
            <img src={imgcard} class=' bg-cover' />
        </div>
        <div class='h-[111px] w-[45%]  rounded-xl' >
        <img src={imgcard5} class=' bg-cover' />
        </div>
        <div class='h-[111px] w-[45%]  rounded-xl' >
        <img src={imgcard2} class=' bg-cover' />
        </div>
        <div class='h-[111px] w-[45%]  rounded-xl' >
        <img src={imgcard3} class=' bg-cover' />
        </div>
    </div>
    <div class='h-[30px] w-[100%]  flex items-center justify-start ' >
    <div class='h-[40px] w-[53%] ml-8 ' >
            <h1 class='text-[24px] text-[#474749] font-bold ml-1' >My Educational Guidance</h1>
        </div>
    </div>
    <div class='h-[237px] w-[100%] bg-blue-500' ></div>
    </>
  )
}

export default Main
