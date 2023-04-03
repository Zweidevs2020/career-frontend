
import mycareer from '../../../assets/mycareer.png';
import image from '../../../assets/image.png';
import eyeball from '../../../assets/eyeball.svg'
import { useState } from 'react';
const NewPasword = () => {
    const [text , setNewText] = useState("")
    const [confirm , setNewConfirm] = useState("")
    const [state,setstate] = useState(false)
    function updatePassword(){
        setNewText("");
        setNewConfirm("")
    }   
    const toggleBtn =()=>{
          setstate(prevState => !prevState)
    }
  return (
    <div className='Email' class='h-[630px] w-[90%] flex items-center justify-center sm:w-[100%] sm:h-[560px] md:w-[100%] md:h-[560px] lg:w-[100%] lg:h-[560px] xl:w-[100%] xl:h-[560px]' >
    <div className='left' class='h-[560px] w-[45%] flex flex-col  items-center justify-around sm:w-[100%] md:w-[100%] lg:w-[65%] ' >
    <div className='mycareer' class='h-[100px] w-[90%] flex items-center justify-start  sm:w-[100%]' >
        <img src={mycareer} class='h-auto w-[150px] sm:ml-2' />
    </div>
    <div className='forget' class='h-[389px] w-[90%]  flex flex-col items-center justify-around sm:w-[100%] sm:justify-around' >
        <div class='h-[90px] w-[85%]  flex flex-col ml-9 sm:ml-0 justify-start gap-1' >
        <h2 class='font-bold text-2xl sm:text-xl sm:ml-3' >Create New Password</h2>
      <p class='text-[#737373] mb-4 sm:text-[14px] sm:ml-3' >Your new password must be different  from previous used password.</p>
        </div>
        <div class='h-[200px] w-[85%] ml-9 sm:ml-2 flex flex-col justify-around sm:h-[230px]' >
        <div className='inputpassword' class='h-[72px] w-[100%]  flex items-center justify-around rounded-md border-solid border-2 border-gray-400 sm:h-[62px]' >
         <div className='inpt-feild' class='h-[60px] w-[80%]' >
            <label class='h-2 text-md  font-Poppins text-[#9D9C9D]' >Password</label>
            <input type={state ? "text" : "password"} placeholder=' ***************' value={text}  class='border-none h-[35px] sm:h-[30px] w-[100%] text-[20px] outline-none' onChange={(e)=> setNewText(e.target.value)} />
         </div>
         <div className='icon-field' class='h-[60px] w-[10%]  flex items-center justify-center ' >
            <img src={eyeball}  class='h-[14px] sm:h-[12px]' onClick={toggleBtn} />
         </div>
        </div>
        <p class='text-[#9D9C9D] text-[16px]' >Must be at least 8 characters.</p>
        <div className='inputconfirm' class='h-[72px] w-[100%] flex items-center justify-around rounded-md border-solid border-2 border-gray-400 sm:h-[62px]' >
        <div className='inpt-feild' class='h-[60px] w-[80%]' >
            <label class='h-2 text-md  font-Poppins text-[#9D9C9D]' >Confirm Password</label>
            <input type={state ? "text" : "password"} placeholder=' **************'value={confirm} class='border-none h-[35px] sm:h-[30px] w-[100%] text-[20px] outline-none' onChange={(e)=>(setNewConfirm(e.target.value))}/>
         </div>
         <div className='icon-field' class='h-[60px] w-[10%]  flex items-center justify-center ' >
            <img src={eyeball} class='h-[14px] sm:h-[12px]' onClick={toggleBtn} />
         </div>
        </div>
        <p class='text-[#9D9C9D] text-[16px]' >Both Password Must Match.</p>
        </div>
        <button onClick={updatePassword} class='h-[55px] w-[85%] bg-[#0575E6] text-white rounded-md ml-9 sm:ml-2 sm:h-[52px] ' >Update Password</button>
    </div>
    <div class='h-[100px] w-[90%]  flex items-end sm:w-[100%] sm:h-[70px] ' >
            <p class='text-[#8A8A8A] sm:text-[12px] sm:ml-2 ' >© 2023 My Career Guidance. All Rights Reserved</p>
        </div>

    </div>
    <div className='rightside' class=' bg-cover    rounded-md sm:hidden md:hidden' >
 <img src={image} class='h-[560px] w-[100%] lg:w-[100%]' />
</div>
</div>
  )
}

export default NewPasword
