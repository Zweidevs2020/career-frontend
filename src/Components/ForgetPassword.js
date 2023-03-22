import React from 'react'
import mycareer from '../assets/mycareer.png'
// import icon from '../assets/icon.png'
import image from '../assets/image.png'
function ForgetPassword () {
    return (
      <div className='container' class='h-[600px] w-[90%] flex items-center justify-center' >
        <div className='leftside' class='h-[560px] w-[45%]  flex flex-col  items-center justify-around' >
            <div className='mycareer' class='h-[100px] w-[90%] flex items-center justify-start' >
                <img src={mycareer} class='h-[50px] w-[150px]' />
            </div>
            <div className='forget' class='h-[250px] w-[90%] flex flex-col items-center justify-around' >
              <h2 class='font-bold text-2xl' >Forget your Password?</h2>
              <p class='text-[#737373] mb-4 ' >Enter the email associated with your <br/>
                account and we'll send an email with <br/>
                instructions to reset your password.</p>
                <input type='text' name='text' placeholder='Email Address' class='h-[40px] rounded-md border-solid border-2 border-gray-400  ' />
                <button class='h-[40px] w-[250px] bg-[#0575E6] text-white rounded-md ' >Send Request</button>
            </div>
            <div class='h-[120px] w-[90%]  flex items-end' >
                    <p class='text-[#8A8A8A]' >© 2023 My Career Guidance. All Rights Reserved</p>
                </div>
        </div>
        <div className='rightside' class='h-[560px] w-[45%]   rounded-md' >
         <img src={image} class='h-[560px] w-[100%]' />
        </div>
        
      </div>
    )
  }

export default ForgetPassword
