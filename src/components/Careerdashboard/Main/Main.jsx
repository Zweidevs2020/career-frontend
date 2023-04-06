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
        <div class='h-[40px] w-[53%] ml-8  sm:ml-2 md:ml-2 sm:flex sm:items-center sm:justify-start md:flex md:items-center md:justify-start md:h-[40px] md:w-[60%]' >
            <h1 class='text-[18px] sm:text-[15px]  text-[#474749] font-bold ml-1' >Career Guidance</h1>
        </div>
        <div class='h-[40px] w-[25%]  mr-2 flex items-center justify-around sm:w-[35%] sm:mr-1 md:mr-1 md:h-[40px] md:w-[30%] ' >
            <img src={searchicon} class='sm:h-[16px] md:h-[18px]' />
            <input type='text' placeholder='Search...' class='w-[75%] sm:w-[70%] border-none outline-none' />
        </div>
    </div>
    <div class='h-[250px] w-[100%]  flex flex-wrap items-center justify-around  sm:h-[160px] md:h-[250px] ' >
        <div class='h-[111px] w-[45%]  rounded-xl relative  sm:h-[57px] md:h-[80px]' >
            <img src={imgcard} class=' bg-cover' />
            <p class='absolute top-2  left-6  text-[18px] sm:top-1 sm:left-2 sm:text-[10px] md:top-1 md:left-4 md:text-[14px] font-bold text-[#fff] ' >CAO Point Calculator</p>
            <p class='absolute top-8  left-7  text-[12px] sm:top-5 sm:left-2 sm:text-[8px] md:top-7 md:left-4 md:text-[10px] font-lighter text-[#fff] ' >Final score is displayed</p>
        </div>
        <div class='h-[111px] w-[45%]  rounded-xl relative sm:h-[57px] md:h-[80px]' >
        <img src={imgcard5} class=' bg-cover' />
        <p class='absolute top-2 left-6 text-[18px]  sm:top-1 sm:left-2 sm:text-[10px]  md:top-1 md:left-4 md:text-[14px] font-bold text-[#fff] ' >My Goals</p>
            <p class='absolute top-8 left-7 text-[12px]  sm:top-5 sm:left-2 sm:text-[8px] md:top-7 md:left-4 md:text-[10px]  font-lighter text-[#fff] ' >Number of preset questions</p>
        </div>
        <div class='h-[111px] w-[45%]  rounded-xl relative sm:h-[57px] md:h-[80px]' >
        <img src={imgcard2} class=' bg-cover' />
        <p class='absolute top-2 left-6 text-[18px]  sm:top-1 sm:left-2 sm:text-[10px] md:top-1 md:left-4 md:text-[14px] font-bold text-[#fff] ' >My Study</p>
            <p class='absolute top-8 left-7 text-[12px]  sm:top-5 sm:left-2 sm:text-[7px] md:top-7 md:left-4 md:text-[10px] font-lighter text-[#fff] ' >Number of preset questions</p>
        </div>
        <div class='h-[111px] w-[45%]  rounded-xl relative sm:h-[57px] md:h-[80px]' >
        <img src={imgcard3} class=' bg-cover' />
        <p class='absolute top-2 left-6 text-[18px]  sm:top-1 sm:left-2 sm:text-[10px] md:top-1 md:left-4 md:text-[14px] font-bold text-[#fff] ' >CV/Cover Letter</p>
            <p class='absolute top-8 left-7 text-[12px]  sm:top-5 sm:left-2 sm:text-[8px] md:top-7 md:left-4 md:text-[10px]  font-lighter text-[#fff] ' >Different text formatting</p>
        </div>
    </div>
    <div class='h-[30px] w-[100%]  flex items-center justify-start ' >
    <div class='h-[40px] w-[53%] ml-8 sm:ml-2 md:ml-2 flex items-center sm:h-[30px] sm:w-[90%] md:w-[90%] ' >
            <h1 class='text-[18px] sm:text-[15px] text-[#474749]  font-bold ml-1' >My Educational Guidance</h1>
        </div>
    </div>
    <div class='h-[237px] w-[100%] flex flex-col flex-wrap items-center justify-around gap-2  sm:h-[220px] ' >
        <div class='h-[60px] w-[45%] bg-[#F7F7F7] rounded-lg flex items-center justify-around sm:h-[50px] sm:w-[47%]  ' >
            <div class='h-[45px] w-[15%] sm:h-[30px] sm:w-[18%] md:h-[35px] md:w-[16%] bg-blue-300 rounded-lg flex items-center justify-center' >
                <img src={bokimg} class='h-[20px] sm:h-[13px] md:h-[15px]'/>
            </div>
            <div class='h-[45px] w-[50%]  flex flex-col items-start sm:h-[30px]  md:h-[35px]' >
                <p class='text-[#303030] sm:text-[13px] md:text-[15px] font-bold' >Quiz 01</p>
                <p class='text-[#BDBDBD] text-[15px] sm:text-[8px] md:text-[11px]' >8:00 AM - 10:00 AM</p>
            </div>
            <div class='h-[45px] w-[25%]  flex items-center justify-center sm:h-[30px] sm:w-[28%]' >
                <button class='h-[31px] w-[90%] sm:h-[25px] sm:w-[98%] rounded-lg bg-[#1476B7] text-[#fff] text-[11px] sm:text-[7px] md:text-[8px] ' >Take Test</button>
            </div>
        </div>
        <div class='h-[60px] w-[45%] bg-[#F7F7F7] rounded-lg  flex items-center justify-around sm:h-[50px] sm:w-[47%] ' >
        <div class='h-[45px] w-[15%] sm:h-[30px] sm:w-[18%] md:h-[35px] md:w-[16%] bg-blue-300 rounded-lg  flex items-center justify-center' >
                <img src={bokimg} class='h-[20px] sm:h-[13px] md:h-[15px]'/>
            </div>
            <div class='h-[45px] w-[50%]  flex flex-col items-start sm:h-[30px] md:h-[35px] ' >
                <p class='text-[#303030] sm:text-[13px]  md:text-[15px] font-bold' >Quiz 02</p>
                <p class='text-[#BDBDBD] text-[15px] sm:text-[8px] md:text-[11px]' >8:00 AM - 10:00 AM</p>
            </div>
            <div class='h-[45px] w-[25%]  flex items-center justify-center sm:h-[30px] sm:w-[28%]' >
                <button class='h-[31px] w-[90%] sm:h-[25px] sm:w-[98%] rounded-lg bg-[#1476B7] text-[#fff] text-[11px]  sm:text-[7px] md:text-[8px]   ' >Take Test</button>
            </div>
        </div>
        <div class='h-[60px] w-[45%] bg-[#F7F7F7] rounded-lg flex items-center justify-around sm:h-[50px] sm:w-[47%]' >
        <div class='h-[45px] w-[15%] sm:h-[30px] sm:w-[18%] md:h-[35px] md:w-[16%] bg-blue-300 rounded-lg  flex items-center justify-center' >
                <img src={bokimg} class='h-[20px] sm:h-[13px] md:h-[15px]'/>
            </div>
            <div class='h-[45px] w-[50%]  flex flex-col items-start sm:h-[30px]  md:h-[35px]' >
                <p class='text-[#303030] sm:text-[13px]  md:text-[15px] font-bold' >Quiz 03</p>
                <p class='text-[#BDBDBD] text-[15px] sm:text-[8px] md:text-[11px]' >8:00 AM - 10:00 AM</p>
            </div>
            <div class='h-[45px] w-[25%]  flex items-center justify-center sm:h-[30px] sm:w-[28%]' >
                <button class='h-[31px] w-[90%] sm:h-[25px] sm:w-[98%] rounded-lg bg-[#1476B7] text-[#fff] text-[11px]  sm:text-[7px] md:text-[8px]  ' >Take Test</button>
            </div>
        </div>
        <div class='h-[60px] w-[45%] bg-[#F7F7F7] rounded-lg flex items-center justify-around sm:h-[50px] sm:w-[47%]' >
        <div class='h-[45px] w-[15%] sm:h-[30px] sm:w-[18%] md:h-[35px] md:w-[16%] bg-pink-200 rounded-lg flex items-center justify-center' >
                <img src={editimg} class='h-[25px] sm:h-[16px] md:h-[17px]'/>
            </div>
            <div class='h-[45px] w-[50%]  flex flex-col items-start sm:h-[30p] md:h-[35px]' >
                <p class='text-[#303030] sm:text-[13px]  md:text-[15px] font-bold' >Quiz 04</p>
                <p class='text-[#BDBDBD] text-[15px] sm:text-[8px] md:text-[11px]' >01:00 PM - 02:00 PM</p>
            </div>
            <div class='h-[45px] w-[25%]  flex items-center justify-center sm:h-[30px] sm:w-[28%]' >
                <button class='h-[31px] w-[90%] sm:h-[25px] sm:w-[98%] rounded-lg bg-[#1476B7] text-[#fff] text-[11px]  sm:text-[7px] md:text-[8px]    ' >View Result</button>
            </div>
        </div>
        <div class='h-[60px] w-[45%] bg-[#F7F7F7] rounded-lg flex items-center justify-around sm:h-[50px] sm:w-[47%] ' >
        <div class='h-[45px] w-[15%] sm:h-[30px] sm:w-[18%] md:h-[35px] md:w-[16%] bg-pink-200 rounded-lg  flex items-center justify-center' >
                <img src={editimg} class='h-[25px] sm:h-[16px] md:h-[17px]'/>
            </div>
            <div class='h-[45px] w-[50%]  flex flex-col items-start sm:h-[30px]  md:h-[35px] ' >
                <p class='text-[#303030] sm:text-[13px]  md:text-[15px] font-bold' >Quiz 05</p>
                <p class='text-[#BDBDBD] text-[15px] sm:text-[8px] md:text-[11px]' >01:00 PM - 02:00 PM</p>
            </div>
            <div class='h-[45px] w-[25%]  flex items-center justify-center sm:h-[30px] sm:w-[28%]' >
                <button class='h-[31px] w-[90%] sm:h-[25px] sm:w-[98%] rounded-lg bg-[#1476B7] text-[#fff] text-[11px]  sm:text-[7px] md:text-[8px]   ' >View Result</button>
            </div>
        </div>
        <div class='h-[60px] w-[45%] bg-[#F7F7F7] rounded-lg flex items-center justify-around sm:h-[50px] sm:w-[47%]' >
        <div class='h-[45px] w-[15%] sm:h-[30px] sm:w-[18%] md:h-[35px] md:w-[16%] bg-pink-200 rounded-lg  flex items-center justify-center' >
                <img src={editimg} class='h-[25px] sm:h-[16px] md:h-[17px]'/>
            </div>
            <div class='h-[45px] w-[50%]  flex flex-col items-start sm:h-[30px]  md:h-[35px] ' >
                <p class='text-[#303030] sm:text-[13px]  md:text-[15px] font-bold' >Quiz 06</p>
                <p class='text-[#BDBDBD] text-[15px] sm:text-[8px] md:text-[11px]' >01:00 PM - 02:00 PM</p>
            </div>
            <div class='h-[45px] w-[25%]  flex items-center justify-center sm:h-[30px] sm:w-[28%]' >
                <button class='h-[31px] w-[90%] sm:h-[25px] sm:w-[98%] rounded-lg bg-[#1476B7] text-[#fff] text-[11px]  sm:text-[7px]  md:text-[8px]  ' >View Result</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default Main
