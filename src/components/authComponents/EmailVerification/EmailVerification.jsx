import React from 'react'
import mycareer from '../../../assets/mycareer.png';
import image from '../../../assets/image.png';

const EmailVerification = () => {
  return (
         <div className='Email' class='h-[655px] w-[100%]  flex items-center justify-center sm:w-[100%] sm:h-[560px] md:w-[100%] md:h-[560px] lg:w-[100%] lg:h-[560px] xl:w-[100%] xl:h-[100%]' >
          <div  class='h-[560px] w-[45%]  flex flex-col justify-between sm:w-[100%] md:w-[100%] lg:w-[65%]  ' >
            <div className='mycareer' class='h-[100px] w-[90%] sm:w-[100%]  flex items-center justify-start' >
                <img src={mycareer} class='h-auto w-[150px] sm:ml-2 md:ml-2 lg:ml-2' />
            </div>
            <div className='forget' class='h-[339px] w-[90%] sm:w-[100%]  flex flex-col items-center justify-evenly' >
                <div class='h-[90px] w-[85%]  flex flex-col ml-9 justify-start gap-1' >
                <h2 class='font-bold text-2xl' >Email Verification</h2>
              <p class='text-[#737373] mb-4 ' >Please enter the 4-digit verification code
              that was sent to your email</p>
                </div>
                <div class='h-[100px] w-[85%]  ml-9  flex items-center justify-between px-5 py-5 sm:px-3' >
                <input type='text' name='text' placeholder='4' class='h-[50px] w-[54px] bg-[#DADADA] rounded-md px-5'  />
                <input type='text' name='text' placeholder='3' class='h-[50px] w-[54px] bg-[#DADADA] rounded-md  px-5'  />
                <input type='text' name='text' placeholder='' class='h-[50px] w-[54px] bg-[#DADADA] rounded-md px-5 '  />
                <input type='text' name='text' placeholder='' class='h-[50px] w-[54px] bg-[#DADADA] rounded-md px-5 '  />
                </div>
                <button class='h-[40px] w-[250px] bg-[#0575E6] text-white rounded-md ml-9 ' >Continue</button>
            </div>
            <div class='h-[120px] w-[90%] sm:w-[100%] flex items-end' >
                    <p class='text-[#8A8A8A] sm:text-[12px] sm:ml-2 md:ml-2 lg:ml-2' >© 2023 My Career Guidance. All Rights Reserved</p>
                </div>
                </div>
            <div className='rightside' class=' bg-cover    rounded-md sm:hidden md:hidden' >
         <img src={image} class='h-[560px] w-[100%]' />
        </div>
      </div>
  )
}

export default EmailVerification
