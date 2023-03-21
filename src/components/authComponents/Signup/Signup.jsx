import React, { useState } from "react";
import sideAuthImage from "../../../asserts/sideAuthImage.png";
import myCareerGuidanceIcon from "../../../asserts/myCareerGuidanceIcon.png";
import usernameIcon from "../../../asserts/usernameIcon.svg";
import lockIcon from "../../../asserts/lockIcon.svg";
import dropdownIcon from "../../../asserts/dropdownIcon.svg";
import { Link } from "react-router-dom";
import { DatePicker, Form, Image, Select, Upload } from "antd";
import {
  MyCareerGuidanceInputField,
  MyCareerGuidanceButton,
} from "../../commonComponents";
import "./SignupStyle.css";
import { dayArray, monthArray } from "../../../utils/helper";
const Signup = () => {
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ remember: true });

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handlerSubmit = () => {
    console.log("=============================", data);
    setLoading(true);
    setLoading(false);
  };

  const onCheckHandle = (e) => {
    const { name, checked } = e;
    console.log("==========================", name, checked);
    setData({ ...data, [name]: checked });
  };

  const onChangeUpload = (e) => {
    console.log("========================== e", e);

    // setNewData(JSON.parse(value));
  };
  const handleSelect = (month) => {
    console.log("==========================", month);

    // setNewData(JSON.parse(value));
  };
  const handleSelectMonth = (month) => {
    console.log("==========================", month);

    // setNewData(JSON.parse(value));
  };
  const handleSelectDay = (day) => {
    console.log("==========================", day);

    // setNewData(JSON.parse(value));
  };
  const onChangeYear = (date) => {
    console.log(date?.$y);
  };
  return (
    <div className="mainDiv">
      <div className="leftDiv">
        <Image preview={false} src={myCareerGuidanceIcon} width={207} />
        <Form onFinish={handlerSubmit} className="formStyle">
          <div className="welcomeHaddingText">Hello</div>
          <div className="textStyle18" style={{ marginBottom: 10 }}>
            Signup to Get Started
          </div>
          <Form.Item
            name="fullname"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <MyCareerGuidanceInputField
              placeholder="Full Name"
              prefix={usernameIcon}
              type="input"
              name="fullname"
              onChange={onChangeHandle}
              inputValue={data.name}
            />
          </Form.Item>
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
          <Select
            placeholder="School"
            options={[
              {
                value: "jack",
                label: "Jack",
              },
              {
                value: "lucy",
                label: "Lucy",
              },
              {
                value: "Yiminghe",
                label: "yiminghe",
              },
              {
                value: "disabled",
                label: "Disabled",
              },
            ]}
            className="inputSelectFieldStyle"
            onChange={handleSelect}
            bordered={false}
            suffixIcon={
              <Image
                preview={false}
                src={dropdownIcon}
                width={15}
                style={{ marginRight: 10 }}
              />
            }
          />

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <div style={{ width: "33%" }}>
              <Select
                placeholder="Month"
                name="month"
                options={monthArray}
                className="inputSelectFieldStyle"
                onSelect={handleSelectMonth}
                bordered={false}
                suffixIcon={
                  <Image
                    preview={false}
                    src={dropdownIcon}
                    width={15}
                    style={{ marginRight: 10 }}
                  />
                }
              />
            </div>
            <div style={{ width: "28%" }}>
              <Select
                placeholder="Day"
                name="day"
                options={dayArray}
                className="inputSelectFieldStyle"
                onSelect={handleSelectDay}
                bordered={false}
                suffixIcon={
                  <Image
                    preview={false}
                    src={dropdownIcon}
                    width={15}
                    style={{ marginRight: 10 }}
                  />
                }
              />
            </div>
            <div style={{ width: "30%" }}>
              <DatePicker
                picker="year"
                placeholder="Year"
                className="inputSelectFieldStyle"
                onChange={onChangeYear}
                suffixIcon={
                  <Image
                    preview={false}
                    src={dropdownIcon}
                    width={15}
                    style={{ marginRight: 10 }}
                  />
                }
              />
            </div>
          </div>
          <div>
            <Upload
              beforeUpload={() => false}
              listType="picture"
              name={"ali"}
              maxCount={1}
              onChange={onChangeUpload}
              showUploadList={true}
            >
              <MyCareerGuidanceButton
                label="Add Profile Picture"
                className={"signInButtonStyle"}
                type="button"
                icon={
                  <div style={{ color: "#D3D3D3" }}>
                    <Image
                      preview={false}
                      src={usernameIcon}
                      width={20}
                      style={{ paddingRight: 5 }}
                    />
                    |
                  </div>
                }
              />
            </Upload>
          </div>
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
            Already have an account?&nbsp;&nbsp;
            <Link to="/" className="linkStyle">
              Login
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
export default Signup;
