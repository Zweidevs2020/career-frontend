import React from 'react';
import "./MyGoal.css";
import calendar from '../../assets/calender.svg'
const MyGoal = () => {
  return (
    <>
    <div className='mygoal' class='grid grid-cols-10 grid-rows-[90px,500px] gap-[2px] ' >

    <div className='career' class=' bg-white w-[100%] h-[990px] col-span-10   ' >
         
         <div class='w-[100%] h-[985px]  bg-white  flex flex-col justify-evenly items-center  ' >
            <div class='w-[95%] h-[70px] bg-white   flex flex-col justify-around' >
             <p class='font-bold text-[32px] text-[#474749] sm:text-[20px] md:text-[22px] lg:text-[22px] ' >My Goals</p>
             <p class='font-light text-[#737373] text-[16px] sm:text-[12px] md:text-[14px] lg:text-[14px]' >Lorem ipsum is a placeholder text commonly used to demonstrate</p>
            </div>
            <div class='w-[95%] h-[890px] bg-[#F8FAFC] flex flex-col items-center gap-3' >
             <div class='contact  h-[60px] w-[95%]   mt-5 flex flex-col items-start justify-around ' >
             <p class='font-bold text-[22px] text-[#474749] sm:text-[12px] md:text-[16px] lg:text-[18px] ' >What’s the best way for employers to contact you?</p>
             <p class='font-light text-[#737373] text-[16px] sm:text-[12px] md:text-[14px] lg:text-[14px]' >We suggest including an email and phone number.</p>
             </div>
             <div class='contact  h-[90px] w-[95%] flex flex-col items-start justify-around ' >
             <p class='font-light text-[18px] text-[#000] sm:text-[16px] lg:text-[16px] ' >What I want to Become:</p>
             <input type='text' name='input' placeholder='e.g Accountant ' class='h-[50px] w-[98%] px-4 rounded-md border-solid border-2 border-gray-400 outline-none '  />
             </div>
             <div class='contact  h-[90px] w-[95%] flex flex-col items-start justify-around ' >
             <p class='font-light text-[18px] text-[#000] sm:text-[16px] lg:text-[16px] ' >Specific Goal for the Year:</p>
             <input type='text' name='input' placeholder='Get more organized with a daily planner ' class='h-[50px] w-[98%] px-4 rounded-md border-solid border-2 border-gray-400 outline-none '  />
             </div>
             <div class='contact  h-[110px] w-[95%] flex flex-col items-start justify-around  ' >
             <p class='font-light text-[18px] text-[#000] sm:text-[16px] lg:text-[16px] ' >5 Actions to Achieve the Above:</p>
             <div class='w-[100%] h-[70px]  sm:h-[100px] sm:flex-wrap sm:flex flex items-center justify-around ' >
             <input type='text' name='input' placeholder='Write down your goal' class=' sm:text-[8px] md:text-[8px] xl:text-[11px] px-2 h-[50px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[19%] rounded-md border-solid border-2 border-gray-400 outline-none '  />
             <input type='text' name='input' placeholder='Set a deadline' class=' px-2 sm:text-[8px] md:text-[8px] h-[50px] xl:text-[11px] w-[19%] sm:w-[30%] sm:h-[35px] md:h-[38px] rounded-md border-solid border-2 border-gray-400 outline-none '  />
             <input type='text' name='input' placeholder='Work on your mindset' class=' sm:text-[8px] md:text-[8px] px-2 xl:text-[11px] h-[50px] sm:h-[35px] w-[19%] md:h-[38px] sm:w-[30%] rounded-md border-solid border-2 border-gray-400 outline-none '  />
             <input type='text' name='input' placeholder='Develop your skillset' class=' sm:text-[8px] md:text-[8px] px-2 xl:text-[11px] h-[50px] sm:h-[35px] w-[19%] md:h-[38px] sm:w-[30%] rounded-md border-solid border-2 border-gray-400 outline-none '  />
             <input type='text' name='input' placeholder='Reward yourself' class=' px-2 sm:text-[8px] md:text-[8px] h-[50px] xl:text-[11px] w-[19%] sm:h-[35px] sm:w-[30%] md:h-[38px]  rounded-md border-solid border-2 border-gray-400 outline-none '  />
             <input type='text' name='input' placeholder='Reward yourself' class=' md:hidden lg:hidden xl:hidden xxl:hidden px-2 sm:text-[8px] h-[50px] w-[19%] sm:h-[35px] sm:w-[30%]  rounded-md border-solid border-2 border-gray-400 outline-none '  />
             </div>
             </div>
             <div class='contact h-[80px] w-[95%] ' >
                <p class='font-light text-[18px] text-[#000] sm:text-[16px] lg:text-[16px]' >Is this Realistic ?</p>
                <div class='h-[50px] w-[20%]  sm:w-[50%] md:w-[40%] lg:w-[40%] flex items-center '  >
                    <div class='h-[40px] w-[50%] flex items-center justify-around ' >
                        <input type='checkbox' class='h-[40px] w-[25%] border-none text-[#fff] bg-[#1476B7] ' />
                        <p class='text-[#737373] sm:text-[14px] md:text-[16px] text-[18px] ' >Yes</p>
                    </div>
                    <div class='h-[40px] w-[50%]  flex items-center justify-around ' >
                        <input type='checkbox' class='h-[40px] w-[25%] border-none text-[#fff] bg-[#1476B7] ' />
                        <p class='text-[#737373] sm:text-[14px] md:text-[16px] text-[18px] ' >No</p>
                    </div>
                </div>
             </div>
             <div class='contact  h-[90px] w-[95%] flex flex-col justify-around ' >
                <p class='font-light text-[18px] text-[#000]  sm:text-[16px] lg:text-[16px] ' >How Long Do I Have?</p>
                <div class='h-[50px] w-[50%] sm:w-[80%] md:w-[80%] lg:w-[80%] px-4 flex justify-between items-center  rounded-md border-solid border-2 border-gray-400 ' >
                    <p class='text-[#737373]' >03/06/2023</p>
                    <img src={calendar}  class='h-[28px] sm:h-[24px]' />
                </div>
             </div>
             <div class='contact h-[110px] w-[95%] flex items-center justify-center gap-5  rounded-md border-solid border-2 border-gray-400 ' >
              <div class='h-[80px] w-[10%]  flex flex-col items-center justify-center' >
                <p class='text-[#DB614D] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ' >0  :</p>
                <p class='text-[#DB614D] text-[28px] font-bold sm:text-[14px] md:text-[16px] lg:text-[16px] ' >Days</p>
              </div>
              <div class='h-[80px] w-[10%]  flex flex-col items-center justify-center' >
                <p class='text-[#474749] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ' >0  :</p>
                <p class='text-[#474749] text-[28px] font-bold  sm:text-[14px] md:text-[16px] lg:text-[16px] ' >Hours</p>
              </div>
              <div class='h-[80px] w-[10%]  flex flex-col items-center justify-center' >
                <p class='text-[#474749] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ' >0  :</p>
                <p class='text-[#474749] text-[28px] font-bold sm:text-[14px] md:text-[16px] lg:text-[16px] ' >Mins</p>
              </div>
              <div class='h-[80px] w-[10%]  flex flex-col items-center justify-center' >
                <p class='text-[#474749] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ' >0  :</p>
                <p class='text-[#474749] text-[28px] font-bold sm:text-[14px] md:text-[16px] lg:text-[16px] ' >Secs</p>
              </div>
             </div>
             <div class='w-[95%] h-[70px] flex items-center ' >
             <button class='h-[50px] w-[25%] sm:w-[50%] md:w-[50%] lg:w-[40%] rounded-lg bg-[#1476B7] text-[#fff] text-[16px] font-bold ' >Download pdf</button>
            </div>
            </div>
         </div>

      </div>

    </div>
    </>
  )
}

export default MyGoal
