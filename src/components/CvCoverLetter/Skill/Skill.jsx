import React from 'react';
import { Select } from 'antd';

const Skill = () => {
    const skill = ['MS word' , 'Digital Marketing' , 'FreeLancer']
  return (
    <>
     <div class='w-[98%] h-[100px]  flex flex-col justify-center' >
      <h1 class='font-bold text-[24px] ml-3 ' >Skills</h1>
      <p class='ml-3 text-[#737373]' >Include All skills that you have</p>
    </div>

    <div class='w-[98%] h-[200px]  mt-5  flex flex-col justify-center' >
      <h1 class='font-bold text-[18px] ml-3 ' >Skill*</h1>
      <Select placeholder='Select One' mode='multiple' allowClear style={{width:'90%',height:'34px',marginLeft:'10px'}} >
        {skill.map((skl,Index)=>{
            return <Select.Option key={Index} value={skl} >{skl}</Select.Option>
        })}
      </Select>
    </div>
    </>
  )
}

export default Skill
