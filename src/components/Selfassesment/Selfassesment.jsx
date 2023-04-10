import React from 'react'
import Selfnavbar from './Selfnavbar/Selfnavbar'
import Selfaside from './Selfaside/Selfaside';
import Sidebar from '../commonComponents/Layoutcomponents/Sidebar/Sidebar';

const Selfassesment = () => {
  return (
    <>
    <Selfaside/>
    </>

    // <div className='main' class='h-[100%] w-[100%] bg-[#F5F5F5] grid grid-cols-10 grid-rows-[90px,700px] gap-[3px] ' >
    //   <div className='selfaside' class='bg-[#F8FAFC] col-span-2 row-span-2 ' >
    //     <Selfaside/>
    //   </div>
    //   <div className='selfnavbar' class='bg-[#F8FAFC] col-span-8 flex items-center justify-between  ' >
    //     <Selfnavbar/>
    //   </div>
    //   <div className='selfmain' class='bg-blue-500 col-span-8   ' >
    //   </div>
    // </div>
  )
}

export default Selfassesment
