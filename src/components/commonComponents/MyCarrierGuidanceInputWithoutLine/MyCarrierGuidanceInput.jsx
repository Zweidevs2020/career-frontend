import React from "react";
import "./MyCarrierInput.css";


const Input=()=>
{
    return(
        <input
        className="inputCarrer"
        type="text"
        name="input"
        placeholder="eg Accountant"
        class="  sm:text-[8px] md:text-[8px] xl:text-[11px] px-2 h-[50px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[97%] rounded-md border-solid border-2 border-gray-400 outline-none "
      />
    )
}
export default Input;