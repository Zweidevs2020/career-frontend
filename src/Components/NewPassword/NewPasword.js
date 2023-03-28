import React from 'react'
import mycareer from '../../assets/mycareer.png';
import image from '../../assets/image.png';
import eyeball from '../../assets/eyeball.svg'
const NewPasword = () => {
  return (
    <div className='Email' class='h-[630px] w-[90%] flex items-center justify-center' >
    <div className='left' class='h-[560px] w-[45%] flex flex-col  items-center justify-around ' >
    <div className='mycareer' class='h-[100px] w-[90%] flex items-center justify-start' >
        <img src={mycareer} class='h-auto w-[150px]' />
    </div>
    <div className='forget' class='h-[389px] w-[90%] flex flex-col items-center justify-around ' >
        <div class='h-[90px] w-[85%]  flex flex-col ml-9 justify-start gap-1 ' >
        <h2 class='font-bold text-2xl' >Create New Password</h2>
      <p class='text-[#737373] mb-4 ' >Your new password must be different from previous used password.</p>
        </div>
        <div class='h-[200px] w-[85%] ml-9 flex flex-col justify-around' >
        <div className='inputpassword' class='h-[72px] w-[100%]  flex items-center justify-around rounded-md border-solid border-2 border-gray-400' >
         <div className='inpt-feild' class='h-[60px] w-[80%]' >
            <label class='h-2 text-md  font-Poppins text-[#9D9C9D]' >Password</label>
            <input type='text' placeholder=' ***************' class='border-none h-[35px] w-[100%] text-[20px]' />
         </div>
         <div className='icon-field' class='h-[60px] w-[10%]  flex items-center justify-center ' >
            <img src={eyeball} class='h-[14px]' />
         </div>
        </div>
        <p class='text-[#9D9C9D] text-[16px]' >Must be at least 8 characters.</p>
        <div className='inputconfirm' class='h-[72px] w-[100%] flex items-center justify-around rounded-md border-solid border-2 border-gray-400 ' >
        <div className='inpt-feild' class='h-[60px] w-[80%]' >
            <label class='h-2 text-md  font-Poppins text-[#9D9C9D]' >Confirm Password</label>
            <input type='text' placeholder=' **************' class='border-none h-[35px] w-[100%] text-[20px]' />
         </div>
         <div className='icon-field' class='h-[60px] w-[10%]  flex items-center justify-center ' >
            <img src={eyeball} class='h-[14px]' />
         </div>
        </div>
        <p class='text-[#9D9C9D] text-[16px]' >Both Password Must Match.</p>
        </div>
        <button class='h-[55px] w-[85%] bg-[#0575E6] text-white rounded-md ml-9 ' >Update Password</button>
    </div>
    <div class='h-[100px] w-[90%]  flex items-end' >
            <p class='text-[#8A8A8A]' >© 2023 My Career Guidance. All Rights Reserved</p>
        </div>

    </div>
    <div className='rightside' class=' bg-cover    rounded-md' >
 <img src={image} class='h-[560px] w-[100%]' />
</div>
</div>
  )
}

export default NewPasword
