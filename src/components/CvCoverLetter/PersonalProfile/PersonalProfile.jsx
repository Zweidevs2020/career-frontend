import React from 'react';
import { Input } from 'antd';

const PersonalProfile = () => {
  return (
    <>
    <div class='w-[98%] h-[60px]  flex flex-col justify-center' >
      <h1 class='font-bold text-[18px] ml-3 ' >What’s the best way for employers to contact you?</h1>
      <p class='ml-3 text-[#737373]' >We suggest including an email and phone number.</p>
    </div>
    <div class='w-[98%] h-[80px] mt-2 flex items-center justify-around ' >
      <div class='w-[48%] h-[75px]  flex flex-col justify-center' >
        <p class='font-lighter text-[16px]' >Full Name*</p>
        <Input placeholder='e.g Maria' allowClear style={{height:'45px',width:'95%'}} />
      </div>
      <div class='w-[48%] h-[75px]  flex flex-col justify-center  ' >
      <p class='font-lighter text-[16px]' >Email Address*</p>
        <Input placeholder='e.g mdelacruz@gmail.com' allowClear style={{height:'45px',width:'94%'}} />
      </div>
    </div>
    <div class='w-[98%] h-[80px]  mt-2 flex flex-col justify-center ' >
    <p class='font-lighter text-[16px] ml-3' >Address Line 1*</p>
        <Input placeholder='Temporary Address' allowClear style={{height:'45px',width:'95%',marginLeft:'12px'}} />
    </div>
    <div class='w-[98%] h-[80px]  mt-2 flex flex-col justify-center ' >
    <p class='font-lighter text-[16px] ml-3' >Address Line 2*</p>
        <Input placeholder='Permanent Address' allowClear style={{height:'45px',width:'95%',marginLeft:'12px'}} />
    </div>
    <div class='w-[98%] h-[110px]  mt-2 flex items-center ' >
     <div class='h-[100px] w-[98%]  flex items-center justify-around '  >
      <div class='h-[80px] w-[40%]  flex flex-col justify-center ' >
      <p class='font-lighter text-[16px] ml-3' >Town*</p>
        <Input placeholder='e.g Cebu City, Cebu' allowClear style={{height:'45px',width:'95%',marginLeft:'12px'}} />
      </div>
      <div class='h-[80px] w-[28%] flex flex-col justify-center  ' >
      <p class='font-lighter text-[16px] ml-2' >City*</p>
        <Input placeholder='e.g Cebu City, Cebu' allowClear style={{height:'45px',width:'95%',marginLeft:'8px'}} />
      </div>
      <div class='h-[80px] w-[28%] flex flex-col justify-center ' >
      <p class='font-lighter text-[16px] ml-2' >Eircodel code*</p>
        <Input placeholder='e.g Cebu City, Cebu' allowClear style={{height:'45px',width:'92%',marginLeft:'8px'}} />
      </div>
     </div>
    </div>
    <div  class='w-[98%] h-[120px] mt-2 flex flex-col  ' >
    <p class='font-lighter text-[16px] ml-3' >Objective*</p>
        <Input placeholder='Write your Objective' allowClear style={{height:'90px',width:'95%',marginLeft:'12px'}} />
    </div>
    </>
  )
}

export default PersonalProfile
