import React, { useState } from "react";
import sideAuthImage from "../../../asserts/sideAuthImage.png";
import myCareerGuidanceIcon from "../../../asserts/myCareerGuidanceIcon.png";
import usernameIcon from "../../../asserts/usernameIcon.svg";
import lockIcon from "../../../asserts/lockIcon.svg";
import { Link } from "react-router-dom";
import { API_URL } from "../../../utils/constants";
import { postApiWithoutAuth } from "../../../utils/api";
import { Checkbox, Form, Image } from "antd";
import {
  MyCareerGuidanceInputField,
  MyCareerGuidanceButton,
} from "../../commonComponents";
import "./LoginStyle.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handlerSubmit = async () => {
    setLoading(true);
    const response = await postApiWithoutAuth(API_URL.SIGNIN, data);
    console.log("=============================", response, data);

    if (response.success) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const onCheckHandle = (e) => {
    const { name, checked } = e;
    console.log("==========================", name, checked);
  };

  return (
    <div className="mainDiv">
      <div className="leftDiv">
        <Image preview={false} src={myCareerGuidanceIcon} width={207} />
        <Form onFinish={handlerSubmit} className="formStyle">
          <div className="welcomeHaddingText">Welcome Back</div>
          <div className="textStyle18" style={{ marginBottom: 10 }}>
            Enter your email and password
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
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your Password!" },
              {
                required: true,
                pattern: new RegExp(
                  /^(?=.*\d)(?=.*?[@$!%*#?&^_.,-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
                ),
                message:
                  "Must contain Number , Special Character , upper case letter, lower case letter, min length 8",
              },
            ]}
          >
            <MyCareerGuidanceInputField
              type="password"
              placeholder="Password"
              prefix={lockIcon}
              name="password"
              passwordValue={data.password}
              onChange={onChangeHandle}
            />
          </Form.Item>
          <span
            style={{ display: "flex", justifyContent: "space-between",marginBottom:10 }}
            className="textStyle14"
          >
            <Checkbox
              onChange={(e) => onCheckHandle(e.target)}
              className="textStyle14"
              name="remember"
              defaultChecked="true"
            >
              Remember me
            </Checkbox>
            <span>Forgot Password?</span>
          </span>
          <MyCareerGuidanceButton
            label="Sign In"
            className="signInButton"
            type="primary"
            htmlType="submit"
            loading={loading}
          />
          <div
            className="textStyle16"
            style={{ display: "flex", justifyContent: "center" }}
          >
            Don't have an account?&nbsp;&nbsp;
            <Link to="/sign-up" className="linkStyle">
              Sign Up
            </Link>
          </div>
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
export default Login;
