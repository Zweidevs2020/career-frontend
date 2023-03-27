import React, { useState, useEffect } from "react";
import sideAuthImage from "../../../asserts/sideAuthImage.png";
import myCareerGuidanceIcon from "../../../asserts/myCareerGuidanceIcon.png";
import usernameIcon from "../../../asserts/usernameIcon.svg";
import nameIcon from "../../../asserts/nameIcon.svg";

import lockIcon from "../../../asserts/lockIcon.svg";
import dropdownIcon from "../../../asserts/dropdownIcon.svg";
import { Link } from "react-router-dom";
import { DatePicker, Form, Image, Select, Upload } from "antd";
import {
  MyCareerGuidanceInputField,
  MyCareerGuidanceButton,
} from "../../commonComponents";
import { API_URL } from "../../../utils/constants";
import { getApiWithoutAuth, postApiWithoutAuth } from "../../../utils/api";
import "./SignupStyle.css";
import {
  dayArray,
  monthArray,
  createFormDataObject,
} from "../../../utils/helper";
const Signup = () => {
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [schools, setSchools] = useState([]);
  const [fileDate, setFileDate] = useState([]);
  const [dobSave, setDobSave] = useState({});
  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handlerSubmit = async () => {
    console.log("========================== e", fileDate);
    const file = createFormDataObject(data);
    console.log(file);
    for (const key of file.entries()) {
      console.log(key[0], key[1]);
    }
    setLoading(true);
    const response = await postApiWithoutAuth(API_URL.SIGNIN, {
      ...data,
      dob: `${dobSave.year}-${dobSave.month}-${dobSave.day}`,
    });
    console.log("=============================", response, data);
    if (response.success) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const onChangeUpload = (e) => {
    console.log("========================== e", e.fileList);
    setData({ ...data, profile: e.fileList });
  };
  const handleSelect = (schoolValue) => {
    console.log("==========================", schoolValue);
    setData({ ...data, school_name: schoolValue });
  };
  const handleSelectMonth = (m) => {
    console.log("==========================", m);
    setDobSave({ ...dobSave, month: m });
  };
  const handleSelectDay = (d) => {
    console.log("==========================", d);
    setDobSave({ ...dobSave, day: d });
  };
  const onChangeYear = (date) => {
    console.log(date?.$y);
    setDobSave({ ...dobSave, year: date?.$y });
  };

  useEffect(() => {
    getSchools();
  }, []);

  const getSchools = async () => {
    const response = await getApiWithoutAuth(API_URL.GETUSERSCHOOL);
    console.log("========================== get school", response);

    if (response.success) {
      const school = response.data?.map((item) => {
        return {
          value: item.id,
          label: item.school_name,
        };
      });
      setSchools(school);
      setLoading(false);
    } else {
      setLoading(false);
      setSchools([
        {
          value: 1,
          label: "St. Leo's College",
        },
        {
          value: 2,
          label: "St Mary's Academy CBS",
        },
        {
          value: 3,
          label: "Borris Vocational School",
        },
      ]);
    }
  };
  useEffect(() => {
    console.log("==========================  school", schools);
  }, [schools]);
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
              prefix={nameIcon}
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
              // { required: true, message: "Please input your Password!" },
              {
                required: true,
                pattern: new RegExp(
                  /^(?=.*\d)(?=.*?[@$!%*#?&^_.,-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
                ),
                message:
                  "Password Must contain Number , Special Character , upper case letter, lower case letter, min length 8",
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
          <Form.Item
            name="school_name"
            rules={[{ required: true, message: "Please Select School!" }]}
          >
            <Select
              placeholder={"School"}
              options={schools}
              name="school_name"
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
          </Form.Item>

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <div style={{ width: "33%" }}>
              <Form.Item
                name="month"
                rules={[{ required: true, message: "Please Select Month!" }]}
              >
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
              </Form.Item>
            </div>
            <div style={{ width: "28%" }}>
              <Form.Item
                name="day"
                rules={[{ required: true, message: "Please Select Day!" }]}
              >
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
              </Form.Item>
            </div>
            <div style={{ width: "30%" }}>
              <Form.Item
                name="year"
                rules={[{ required: true, message: "Please Select Year!" }]}
              >
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
              </Form.Item>
            </div>
          </div>
          <Form.Item
            name="picture"
            rules={[{ required: true, message: "Please Add Picture!" }]}
          >
            <Upload
              beforeUpload={() => false}
              listType="picture"
              name={"ali"}
              maxCount={1}
              onChange={onChangeUpload}
              showUploadList={true}
              style={{ height: 64 }}
            >
              <MyCareerGuidanceButton
                label="Add Profile Picture"
                className={"signInButtonStyle"}
                type="button"
                icon={
                  <div style={{ color: "#D3D3D3", marginRight: 10 }}>
                    <Image
                      preview={false}
                      src={nameIcon}
                      width={20}
                      style={{ paddingRight: 4 }}
                    />
                    |
                  </div>
                }
              />
            </Upload>
          </Form.Item>
          <MyCareerGuidanceButton
            label="Sign Up"
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
