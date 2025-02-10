import React, { useState } from "react";
import sideAuthImage from "../../../assets/kid-front-page (1).jpg";
import myCareerGuidanceIcon from "../../../assets/my-guidance-logo.png";
import usernameIcon from "../../../assets/usernameIcon.svg";
import lockIcon from "../../../assets/lockIcon.svg";
import phoneIcon from "../../../assets/phone.svg";
import { Link } from "react-router-dom";
import { API_URL } from "../../../utils/constants";
import { postApiWithoutAuth } from "../../../utils/api";
import { setToken } from "../../../utils/LocalStorage";
import { Checkbox, Form, Image, Tabs, message } from "antd";
import {
  MyCareerGuidanceInputField,
  MyCareerGuidanceButton,
} from "../../commonComponents";
import { useNavigate } from "react-router-dom";
import "./LoginStyle.css";
import { useSubscribe } from "../../../context/subscribe";
import { resolveModuleName } from "typescript";

const Login = () => {
  const navigate = useNavigate();
  const { setSubscribe } = useSubscribe();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("student");
  const [data, setData] = useState({});
  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handlerSubmit = async () => {
    setLoading(true);
    const response = await postApiWithoutAuth(API_URL.SIGNIN, {
      ...data,
      email: data.email.toLowerCase(),
    });
    if (response?.status === 200) {
      message.success("Login Successfully");
      setLoading(false);
      setToken(response?.data?.access);
      setSubscribe(response.data.is_subscribed);

      if (response.data.is_subscribed) {
        navigate("/dashboard");
      } else {
        navigate("/checkout");
      }
    } else if (response?.status === 400) {
      message.error(response.data.message);
      setLoading(false);
    } else {
      setLoading(false);
      message.success(response?.data?.detail);
    }
  };
  // const handlerSubmit2 = async () => {
  //   navigate("/conselorDashboard");
  // };
  const handlerSubmit2 = async () => {
    setLoading(true);
    const response = await postApiWithoutAuth(API_URL.CONSELOR_SIGN_IN, {
      ...data,
      email: data.email.toLowerCase(),
    });
    if (response?.status === 200) {
      console.log(response, "response");
      message.success("Login Successfully");
      setLoading(false);
      // SetConselorToken(response?.access)
      document.cookie = `conselorToken=${
        response?.data?.access
      }; path=/; max-age=${7 * 24 * 60 * 60}; Secure; SameSite=Strict`;
      // setConselorToken(response?.data?.access);
      // setSubscribe(response.data.is_subscribed);

      if (response?.data?.access) {
        navigate("/conselorDashboard");
      } else {
        return;
      }
    } else if (response?.status === 400 || response?.status === 403) {
      console.log(response, "");
      message.error(response.data.message?.non_field_errors);
      setLoading(false);
    } else {
      setLoading(false);
      message.success(response?.data?.detail);
    }
  };

  const onCheckHandle = (e) => {
    const { name, checked } = e;
  };

  return (
    <div className="mainDiv">
      <div className="leftDiv">
        <Image preview={false} src={myCareerGuidanceIcon} width={207} />
        <Tabs
          activeKey={activeTab}
          onChange={(activeTab) => {
            setActiveTab(activeTab);
            setData({});
          }}
          centered
          className="responsiveTabs"
        >
          <Tabs.TabPane
            tab="Student Login"
            key="student"
            // style={{ display: "flex", justifyContent: "center" }}
          >
            <Form
              onFinish={handlerSubmit}
              className="formStyle"
              autoComplete={false}
              style={{ margin: "auto" }}
            >
              <div className="welcomeHaddingText">Welcome to My Guidance.</div>
              <div
                className="welcomeHaddingText"
                style={{ fontWeight: "normal" }}
              >
                Please login or register an account.
              </div>
              {/* <div className="textStyle18" style={{ marginBottom: 10 }}>
                Enter your email and password
              </div> */}
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email Address!",
                  },
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
                  // {
                  //   required: true,
                  //   pattern: new RegExp(
                  //     /^(?=.*\d)(?=.*?[@$!%*#?&^_.,-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
                  //   ),
                  //   message: "Invalid Credentials",
                  //   validateTrigger: ["onSubmit"],
                  // },
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
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
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
                <Link to="/forget-password" className="textStyle14">
                  Forgot Password?
                </Link>
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
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="
Counsellor Login"
            key="counselor"
          >
            <Form
              onFinish={handlerSubmit2}
              className="formStyle"
              autoComplete={false}
              style={{ margin: "auto" }}
            >
              <div className="welcomeHaddingText">Welcome to My Guidance.</div>
              <div
                className="welcomeHaddingText"
                style={{ fontWeight: "normal" }}
              >
                Please login or register an account.
              </div>
              {/* <div className="textStyle18" style={{ marginBottom: 10 }}>
            Enter your email and password
          </div> */}
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email Address!",
                  },
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
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
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
                {/* <Link to="/forget-password" className="textStyle14">
                  Forgot Password?
                </Link> */}
              </span>
              <MyCareerGuidanceButton
                label="Sign In"
                className="signInButton"
                type="primary"
                htmlType="submit"
                loading={loading}
              />
              {/* <div
                className="textStyle16"
                style={{ display: "flex", justifyContent: "center" }}
              >
                Don't have an account?&nbsp;&nbsp;
                <Link to="/sign-up" className="linkStyle">
                  Sign Up
                </Link>
              </div> */}
            </Form>
          </Tabs.TabPane>
        </Tabs>

        <span className="allRights">
          © 2023 My Guidance. All Rights Reserved
        </span>
      </div>
      <div className="mobileScreenImage">
        <img
          src={sideAuthImage}
          style={{
            objectFit: "cover",
            height: "100vh",
            width: "100%",
            borderRadius: "20px",
          }}
          alt="img"
        />
      </div>
    </div>
  );
};
export default Login;
