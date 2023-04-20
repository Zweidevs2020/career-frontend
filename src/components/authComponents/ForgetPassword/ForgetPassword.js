import React, { useState } from "react";
import sideAuthImage from "../../../assets/sideAuthImage.png";
import myCareerGuidanceIcon from "../../../assets/myCareerGuidanceIcon.png";
import usernameIcon from "../../../assets/usernameIcon.svg";
import { API_URL } from "../../../utils/constants";
import { postApiWithoutAuth } from "../../../utils/api";
import { Form, Image, message } from "antd";
import {
  MyCareerGuidanceInputField,
  MyCareerGuidanceButton,
} from "../../commonComponents";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handlerSubmit = async () => {
    setLoading(true);
    const response = await postApiWithoutAuth(API_URL.FORGETPASSWORD, data);
    if (response.status === 200) {
      setLoading(false);
      message.success("Code send Successfully");

      navigate("/email-verification", { state: { data } });
    } else {
      message.error(response.data[0]);
      setLoading(false);
    }
  };

  return (
    <div className="mainDiv">
      <div className="leftDiv">
        <Image preview={false} src={myCareerGuidanceIcon} width={207} />
        <Form onFinish={handlerSubmit} className="formStyle">
          <div className="welcomeHaddingText">Forget your Password?</div>
          <div className="textStyle18" style={{ marginBottom: 10 }}>
            Enter the email associated with your account and we’ll send an email
            with instructions to reset your password.
          </div>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your Email Address!" },
            ]}
          >
            <MyCareerGuidanceInputField
              placeholder="Email Address"
              prefix={usernameIcon}
              type="input"
              name="email"
              onChange={onChangeHandle}
              inputValue={data.email}
            />
          </Form.Item>
          <MyCareerGuidanceButton
            label="Send request"
            className="signInButton"
            type="primary"
            htmlType="submit"
            loading={loading}
            backgroundColor="#0575E6"
          />
        </Form>
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
export default ForgetPassword;
