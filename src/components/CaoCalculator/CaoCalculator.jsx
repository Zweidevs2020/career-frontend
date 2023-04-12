import React from 'react'
import add from '../../assets/add.svg';
import dropdownicon from '../../assets/dropdownIcon.svg';
import gage from '../../assets/gage.svg'

const CaoCalculator = () => {
  return (
    <div className='calculator' class='grid grid-cols-10 grid-rows-[90px,500px] gap-[2px] ' >
        <div class=' bg-[#f4f6f8]  w-[100%] h-[700px] col-span-10 flex flex-col items-center justify-around'>
            <div class='h-[70px] w-[98%]  flex flex-col justify-around ' >
            <p class='font-bold text-[24px] text-[#474749] ' >My CAO Points:</p>
             <p class='font-light text-[#737373] text-[16px]' >Lorem ipsum is a placeholder text commonly used to demonstrate</p>
            </div>
            <div class='bg-[#f4f6f8] h-[600px] w-[98%] rounded-md flex gap-[3px]'  >
                <div className='subject' class='bg-white rounded-tl-md ml-1 h-[530px] mt-3 w-[70%] flex items-center flex-col' >
                    <div class='h-[50px] w-[98%] px-5 bg-white flex justify-between items-center ' >
                        <p class='text-[22px] font-bold ' > Subjects</p>
                        <div class='h-[30px] w-[30px] flex items-center justify-center bg-[#F8FAFC] rounded-full' >
                        <img src={add} alt="" />
                        </div>
                    </div>
                    <hr class='w-[100%] h-[2px] relative mt-[2px] bg-slate-100'  ></hr>
                    <div class='relative mt-1 bg-white h-[467px] w-[98%] flex flex-col items-center gap-2 ' >
                        <div class='h-[50px] w-[95%] mt-2 bg-[#F4F6F8] flex items-center justify-around' >
                            <div class='h-[40px] w-[23%]  flex items-center justify-center' >
                                <p class='text-[22px] text-[#737373] font-bold' >#</p>
                            </div>
                            <div class='h-[40px] w-[23%]  flex items-center justify-center' >
                                <p class='text-[16px] text-[#737373]  font-bold' >Subject</p>
                            </div>
                            <div class='h-[40px] w-[23%] flex items-center justify-center' >
                                <p class='text-[16px] text-[#737373]  font-bold' >Level</p>
                            </div>
                            <div class='h-[40px] w-[23%] text-[#737373]  flex items-center justify-center' >
                                <p class='text-[16px] font-bold' >Ecpected Grades</p>
                            </div>
                        </div>
                        <div class='h-[50px] w-[95%] bg-[#F4F6F8] flex items-center justify-around' >
                            <div class='h-[40px] w-[23%] rounded-md bg-white flex items-center justify-center' >
                                <p class='text-[14px] text-[#858585] font-light' >01</p>
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >Pick Subjects</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >Higher</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >A1</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                        </div>
                        <div class='h-[50px] w-[95%] bg-[#F4F6F8] flex items-center justify-around' >
                            <div class='h-[40px] w-[23%] rounded-md bg-white flex items-center justify-center' >
                                <p class='text-[14px] text-[#858585] font-light' >01</p>
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >Pick Subjects</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >Higher</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >A1</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                        </div>
                        <div class='h-[50px] w-[95%] bg-[#F4F6F8] flex items-center justify-around' >
                            <div class='h-[40px] w-[23%] rounded-md bg-white flex items-center justify-center' >
                                <p class='text-[14px] text-[#858585] font-light' >01</p>
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >Pick Subjects</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >Higher</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >A1</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                        </div>
                        <div class='h-[50px] w-[95%] bg-[#F4F6F8] flex items-center justify-around' >
                            <div class='h-[40px] w-[23%] rounded-md bg-white flex items-center justify-center' >
                                <p class='text-[14px] text-[#858585] font-light' >01</p>
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >Pick Subjects</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >Higher</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >A1</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                        </div>

                        <div class='h-[50px] w-[95%] bg-[#F4F6F8] flex items-center justify-around' >
                            <div class='h-[40px] w-[23%] rounded-md bg-white flex items-center justify-center' >
                                <p class='text-[14px] text-[#858585] font-light' >01</p>
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >Pick Subjects</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >Higher</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585]' >A1</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px]' />
                            </div>
                        </div>



                    </div>
                </div>
                <div className='points'  class='bg-white rounded-tr-md h-[530px] mt-3 w-[29%] flex flex-col items-center ' >
                <div class='h-[50px] w-[98%] px-5 ml-[2px] bg-white flex justify-between items-center ' >
                        <p class='text-[14px] font-bold ' >Expected Points for Semester 01</p> 
                </div>
                <hr class='w-[100%] h-[2px] relative mt-[2px] bg-slate-100'  ></hr>
                <div class='h-[50px] w-[90%]  relative mt-3 flex items-center justify-start ' >
                    <p class='font-light text-[16px] text-[#474749] ' >CAO Points</p>
                </div>
                <div class='h-[30px] w-[90%]  relative mt-2 flex items-center justify-between px-4 ' >
                    <p class='font-bold text-[14px] text-[#474749] ' >Points</p>
                    <p class='font-light text-[14px] text-[#474749] ' >150</p>
                </div>
                <hr class='w-[100%] h-[1px] relative mt-[4px] bg-slate-100'  ></hr>

                <div class='h-[30px] w-[90%]  relative mt-2 flex items-center justify-between px-4 ' >
                    <p class='font-bold text-[14px] text-[#474749] ' >Bonus Points</p>
                    <p class='font-light text-[14px] text-[#474749] ' >150</p>
                </div>
                <hr class='w-[100%] h-[1px] relative mt-[4px] bg-slate-100'  ></hr>

                <div class='h-[30px] w-[90%] relative mt-2 flex items-center justify-between px-4 ' >
                    <p class='font-bold text-[14px] text-[#474749] ' >Final Points</p>
                    <p class='font-light text-[14px] text-[#474749] ' >295</p>
                </div>
                <hr class='w-[100%] h-[1px] relative mt-[4px] bg-slate-100'  ></hr>

                <div class='h-[267px]  w-[98%] relative mt-3 flex items-center justify-center' >
                    <img src={gage} alt="" />
                </div>



                </div>
              
                <div class='absolute mt-[544px] ml-2 h-[50px] w-[78%] flex items-center justify-end px-2 ' >
                    <div class='  h-[45px] w-[30%] flex items-center justify-evenly ' >
                        <button class='h-[40px] w-[35%] rounded-md bg-white text-[#A8A8A8] '>Clear All</button>
                        <button class='h-[40px] w-[35%] rounded-md bg-white text-[#1476B7] border-2 border-[#1476B7] ' >Calculate</button>
                    </div>
                </div>

            </div>
        </div>
        
    </div>
  )
}

export default CaoCalculator
