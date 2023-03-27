import React from 'react'
import mycareer from '../../assets/mycareer.png';
import image from '../../assets/image.png';

const Email = () => {
  return (
         <div className='Email' class='h-[630px] w-[90%] flex items-center justify-center' >
            <div className='left' class='h-[560px] w-[45%] flex flex-col  items-center justify-around' >
            <div className='mycareer' class='h-[100px] w-[90%] flex items-center justify-start' >
                <img src={mycareer} class='h-auto w-[150px]' />
            </div>
            <div className='forget' class='h-[339px] w-[90%] flex flex-col items-center justify-around' >
                <div class='h-[90px] w-[85%]  flex flex-col ml-9 justify-start gap-1' >
                <h2 class='font-bold text-2xl' >Email Verification</h2>
              <p class='text-[#737373] mb-4 ' >Please enter the 4-digit verification code
              that was sent to your email</p>
                </div>
                <div class='h-[100px] w-[85%] ml-9 flex items-center justify-between px-5 py-5 ' >
                <input type='text' name='text' placeholder='4' class='h-[50px] w-[54px] bg-[#DADADA] rounded-md px-5'  />
                <input type='text' name='text' placeholder='3' class='h-[50px] w-[54px] bg-[#DADADA] rounded-md  px-5'  />
                <input type='text' name='text' placeholder='' class='h-[50px] w-[54px] bg-[#DADADA] rounded-md px-5 '  />
                <input type='text' name='text' placeholder='' class='h-[50px] w-[54px] bg-[#DADADA] rounded-md px-5 '  />
                </div>
                <button class='h-[40px] w-[250px] bg-[#0575E6] text-white rounded-md ml-9 ' >Continue</button>
            </div>
            <div class='h-[120px] w-[90%]  flex items-end' >
                    <p class='text-[#8A8A8A]' >© 2023 My Career Guidance. All Rights Reserved</p>
                </div>

            </div>
            <div className='rightside' class=' bg-cover    rounded-md' >
         <img src={image} class='h-[560px] w-[100%]' />
        </div>
      </div>
  )
}

export default Email
