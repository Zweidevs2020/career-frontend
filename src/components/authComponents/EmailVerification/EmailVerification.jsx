// import React from 'react'
// import mycareer from '../../../assets/mycareer.png';
// import image from '../../../assets/image.png';

// const EmailVerification = () => {
//   return (
//          <div className='Email' class='h-[655px] w-[100%]  flex items-center justify-center sm:w-[100%] sm:h-[560px] md:w-[100%] md:h-[560px] lg:w-[100%] lg:h-[560px] xl:w-[100%] xl:h-[100%]' >
//           <div  class='h-[560px] w-[45%]  flex flex-col justify-between sm:w-[100%] md:w-[100%] lg:w-[65%]  ' >
//             <div className='mycareer' class='h-[100px] w-[90%] sm:w-[100%]  flex items-center justify-start' >
//                 <img src={mycareer} class='h-auto w-[150px] sm:ml-2 md:ml-2 lg:ml-2' />
//             </div>
//             <div className='forget' class='h-[339px] w-[90%] sm:w-[100%]  flex flex-col items-center justify-evenly' >
//                 <div class='h-[90px] w-[85%]  flex flex-col ml-9 justify-start gap-1' >
//                 <h2 class='font-bold text-2xl' >Email Verification</h2>
//               <p class='text-[#737373] mb-4 ' >Please enter the 4-digit verification code
//               that was sent to your email</p>
//                 </div>
//                 <div class='h-[100px] w-[85%]  ml-9  flex items-center justify-between px-5 py-5 sm:px-3' >
//                 <input type='text' name='text' placeholder='4' class='h-[50px] w-[54px] bg-[#DADADA] rounded-md px-5'  />
//                 <input type='text' name='text' placeholder='3' class='h-[50px] w-[54px] bg-[#DADADA] rounded-md  px-5'  />
//                 <input type='text' name='text' placeholder='' class='h-[50px] w-[54px] bg-[#DADADA] rounded-md px-5 '  />
//                 <input type='text' name='text' placeholder='' class='h-[50px] w-[54px] bg-[#DADADA] rounded-md px-5 '  />
//                 </div>
//                 <button class='h-[40px] w-[250px] bg-[#0575E6] text-white rounded-md ml-9 ' >Continue</button>
//             </div>
//             <div class='h-[120px] w-[90%] sm:w-[100%] flex items-end' >
//                     <p class='text-[#8A8A8A] sm:text-[12px] sm:ml-2 md:ml-2 lg:ml-2' >© 2023 My Career Guidance. All Rights Reserved</p>
//                 </div>
//                 </div>
//             <div className='rightside' class=' bg-cover    rounded-md sm:hidden md:hidden' >
//          <img src={image} class='h-[560px] w-[100%]' />
//         </div>
//       </div>
//   )
// }

// export default EmailVerification

import React, { useState } from "react";
import sideAuthImage from "../../../assets/sideAuthImage.png";
import myCareerGuidanceIcon from "../../../assets/myCareerGuidanceIcon.png";
import usernameIcon from "../../../assets/usernameIcon.svg";
import { API_URL } from "../../../utils/constants";
import { postApiWithoutAuth } from "../../../utils/api";
import { Form, Image } from "antd";
import { MyCareerGuidanceButton } from "../../commonComponents";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import "./EmailVerificationStyle.css";
const EmailVerification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const handlerSubmit = async () => {
    setLoading(true);
    const response = await postApiWithoutAuth(API_URL.FORGETPASSWORD, otp);
    console.log(
      "=============================",
      API_URL.SIGNIN,
      response,
      "====",
      otp
    );
    if (response.success) {
      setLoading(false);
      navigate("/new-password");
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="mainDiv">
      <div className="leftDiv">
        <Image preview={false} src={myCareerGuidanceIcon} width={207} />
        <div className="emailVerificationStyleLeft">
          <div className="emailVerificationStyleLeftInner">
            <div className="welcomeHaddingText">Email Verification</div>
            <div className="textStyle18" style={{ marginBottom: 10 }}>
              Please enter the 4-digit verification code that was sent to your
              email
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginTop: 15,
                marginBottom: 15,
              }}
            >
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderSeparator={<span className="boxesPadding"></span>}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  height: 50,
                  width: 54,
                  borderRadius: 10,
                  background: "rgba(218, 218, 218, 0.56)",
                }}
              />
            </div>
            <MyCareerGuidanceButton
              label="Continue"
              className="signInButton"
              type="primary"
              htmlType="submit"
              loading={loading}
              backgroundColor="#0575E6"
              disabled={otp?.length < 4}
              onClick={() => {
                handlerSubmit();
              }}
            />
          </div>
        </div>
        <span className="allRights">
          © 2023 My Career Guidance. All Rights Reserved
        </span>
      </div>
      <div className="rightImageStyle">
        <Image
          preview={false}
          src={sideAuthImage}
          width={"100%"}
          height="100%"
        />
      </div>
    </div>
  );
};
export default EmailVerification;
