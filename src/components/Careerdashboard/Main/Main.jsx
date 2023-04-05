import React from 'react'
import searchicon from '../../../assets/searchicon.svg'
import imgcard from '../../../assets/imgcard.svg';
import imgcard2 from '../../../assets/imgcard2.svg';
import imgcard3 from '../../../assets/imgcard3.svg';
import imgcard5 from '../../../assets/imgcard5.svg';
import bokimg from '../../../assets/bokimg.svg';
import editimg from '../../../assets/editimg.svg';

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
        <div class='h-[111px] w-[45%]  rounded-xl relative' >
            <img src={imgcard} class=' bg-cover' />
            <p class='absolute top-2 left-6 text-[18px] font-bold text-[#fff] ' >CAO Point Calculator</p>
            <p class='absolute top-8 left-7 text-[12px] font-lighter text-[#fff] ' >Final score is displayed</p>
        </div>
        <div class='h-[111px] w-[45%]  rounded-xl relative' >
        <img src={imgcard5} class=' bg-cover' />
        <p class='absolute top-2 left-6 text-[18px] font-bold text-[#fff] ' >My Goals</p>
            <p class='absolute top-8 left-7 text-[12px] font-lighter text-[#fff] ' >Number of preset questions</p>
        </div>
        <div class='h-[111px] w-[45%]  rounded-xl relative' >
        <img src={imgcard2} class=' bg-cover' />
        <p class='absolute top-2 left-6 text-[18px] font-bold text-[#fff] ' >My Study</p>
            <p class='absolute top-8 left-7 text-[12px] font-lighter text-[#fff] ' >Number of preset questions</p>
        </div>
        <div class='h-[111px] w-[45%]  rounded-xl relative' >
        <img src={imgcard3} class=' bg-cover' />
        <p class='absolute top-2 left-6 text-[18px] font-bold text-[#fff] ' >CV/Cover Letter</p>
            <p class='absolute top-8 left-7 text-[12px] font-lighter text-[#fff] ' >Different text formatting</p>
        </div>
    </div>
    <div class='h-[30px] w-[100%]  flex items-center justify-start ' >
    <div class='h-[40px] w-[53%] ml-8 ' >
            <h1 class='text-[24px] text-[#474749] font-bold ml-1' >My Educational Guidance</h1>
        </div>
    </div>
    <div class='h-[237px] w-[100%] flex flex-col flex-wrap items-center justify-around gap-2' >
        <div class='h-[60px] w-[45%] bg-[#F7F7F7] rounded-lg flex items-center justify-around ' >
            <div class='h-[45px] w-[15%] bg-blue-300 rounded-lg flex items-center justify-center' >
                <img src={bokimg} class='h-[20px]'/>
            </div>
            <div class='h-[45px] w-[50%]  flex flex-col items-start ' >
                <p class='text-[#303030] font-bold' >Quiz 01</p>
                <p class='text-[#BDBDBD] text-[15px]' >8:00 AM - 10:00 AM</p>
            </div>
            <div class='h-[45px] w-[25%]  flex items-center justify-center' >
                <button class='h-[31px] w-[90%] rounded-lg bg-[#1476B7] text-[#fff] text-[11px] ' >Take Test</button>
            </div>
        </div>
        <div class='h-[60px] w-[45%] bg-[#F7F7F7] rounded-lg  flex items-center justify-around ' >
        <div class='h-[45px] w-[15%] bg-blue-300 rounded-lg  flex items-center justify-center' >
                <img src={bokimg} class='h-[20px]'/>
            </div>
            <div class='h-[45px] w-[50%]  flex flex-col items-start ' >
                <p class='text-[#303030] font-bold' >Quiz 02</p>
                <p class='text-[#BDBDBD] text-[15px]' >8:00 AM - 10:00 AM</p>
            </div>
            <div class='h-[45px] w-[25%]  flex items-center justify-center' >
                <button class='h-[31px] w-[90%] rounded-lg bg-[#1476B7] text-[#fff] text-[11px] ' >Take Test</button>
            </div>
        </div>
        <div class='h-[60px] w-[45%] bg-[#F7F7F7] rounded-lg flex items-center justify-around ' >
        <div class='h-[45px] w-[15%] bg-blue-300 rounded-lg  flex items-center justify-center' >
                <img src={bokimg} class='h-[20px]'/>
            </div>
            <div class='h-[45px] w-[50%]  flex flex-col items-start ' >
                <p class='text-[#303030] font-bold' >Quiz 03</p>
                <p class='text-[#BDBDBD] text-[15px]' >8:00 AM - 10:00 AM</p>
            </div>
            <div class='h-[45px] w-[25%]  flex items-center justify-center' >
                <button class='h-[31px] w-[90%] rounded-lg bg-[#1476B7] text-[#fff] text-[11px] ' >Take Test</button>
            </div>
        </div>
        <div class='h-[60px] w-[45%] bg-[#F7F7F7] rounded-lg flex items-center justify-around ' >
        <div class='h-[45px] w-[15%] bg-pink-200 rounded-lg flex items-center justify-center' >
                <img src={editimg} class='h-[25px]'/>
            </div>
            <div class='h-[45px] w-[50%]  flex flex-col items-start ' >
                <p class='text-[#303030] font-bold' >Quiz 04</p>
                <p class='text-[#BDBDBD] text-[15px]' >01:00 PM - 02:00 PM</p>
            </div>
            <div class='h-[45px] w-[25%]  flex items-center justify-center' >
                <button class='h-[31px] w-[90%] rounded-lg bg-[#1476B7] text-[#fff] text-[11px] ' >View Result</button>
            </div>
        </div>
        <div class='h-[60px] w-[45%] bg-[#F7F7F7] rounded-lg flex items-center justify-around  ' >
        <div class='h-[45px] w-[15%] bg-pink-200 rounded-lg  flex items-center justify-center' >
                <img src={editimg} class='h-[25px]'/>
            </div>
            <div class='h-[45px] w-[50%]  flex flex-col items-start ' >
                <p class='text-[#303030] font-bold' >Quiz 05</p>
                <p class='text-[#BDBDBD] text-[15px]' >01:00 PM - 02:00 PM</p>
            </div>
            <div class='h-[45px] w-[25%]  flex items-center justify-center' >
                <button class='h-[31px] w-[90%] rounded-lg bg-[#1476B7] text-[#fff] text-[11px] ' >View Result</button>
            </div>
        </div>
        <div class='h-[60px] w-[45%] bg-[#F7F7F7] rounded-lg flex items-center justify-around ' >
        <div class='h-[45px] w-[15%] bg-pink-200 rounded-lg  flex items-center justify-center' >
                <img src={editimg} class='h-[25px]'/>
            </div>
            <div class='h-[45px] w-[50%]  flex flex-col items-start ' >
                <p class='text-[#303030] font-bold' >Quiz 06</p>
                <p class='text-[#BDBDBD] text-[15px]' >01:00 PM - 02:00 PM</p>
            </div>
            <div class='h-[45px] w-[25%]  flex items-center justify-center' >
                <button class='h-[31px] w-[90%] rounded-lg bg-[#1476B7] text-[#fff] text-[11px] ' >View Result</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default Main
