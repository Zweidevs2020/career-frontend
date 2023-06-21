import React, { useState, useEffect, useRef } from "react";
import sideAuthImage from "../../../assets/kid-front-page.jpeg";
import myCareerGuidanceIcon from "../../../assets/my-guidance-logo.png";
import usernameIcon from "../../../assets/usernameIcon.svg";
import nameIcon from "../../../assets/nameIcon.svg";

import lockIcon from "../../../assets/lockIcon.svg";
import dropdownIcon from "../../../assets/dropdownIcon.svg";
import { Link } from "react-router-dom";
import { DatePicker, Form, Image, Select, Upload, message, Button } from "antd";
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
  convertBase64,
} from "../../../utils/helper";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import countyImg from "../../../assets/county.png";
import schoolImg from "../../../assets/schoolimg.png";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [schools, setSchools] = useState([]);
  const [newSchools, setNewSchools] = useState("");
  const [dobSave, setDobSave] = useState({});
  const [open, setOpen] = useState(false);

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handlerSaveSubmit = async () => {
    setLoading(true);
    const response = await postApiWithoutAuth(API_URL.SINGUPUSER, {
      ...data,
      dob: `${dobSave.year}-${dobSave.month}-${dobSave.day}`,
    });
    if (response.status === 200) {
      message.success("User is Created Successfully, You can now Login");
      navigate("/");
    } else {
      setLoading(false);
      message.error(response.data.message);
    }
  };

  const onChangeUpload = async (e) => {
    if (e.fileList.length > 0) {
      const base64 = await convertBase64(e.file);
      setData({ ...data, profile_image: base64 });
    }
  };
  const handleSelect = (schoolValue) => {
    const schoolName = schools.filter((item) => {
      return item.value === schoolValue;
    });
    setData({ ...data, school: schoolName[0].label });
  };

  const handleSelectMonth = (m) => {
    setDobSave({ ...dobSave, month: m });
  };

  const handleSelectDay = (d) => {
    setDobSave({ ...dobSave, day: d });
  };

  const onChangeYear = (date) => {
    setDobSave({ ...dobSave, year: date?.$y });
  };

  useEffect(() => {
    getSchools();
  }, []);

  const handleSchool = (e) => {
    const { value } = e.target;
    setNewSchools(value);
  };

  const getSchools = async () => {
    const response = await getApiWithoutAuth(API_URL.GETUSERSCHOOL);

    if (response.data.success) {
      const school = response.data.data?.map((item) => {
        return {
          value: item.pk,
          label: item.school,
        };
      });
      setSchools(school);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const addNewSchool = () => {
    setData({ ...data, school: newSchools });
  };
  return (
    <div className="mainDiv">
      <div className="leftDiv">
        <Image preview={false} src={myCareerGuidanceIcon} width={207} />
        <Form onFinish={handlerSaveSubmit} className="formStyle">
          <div className="welcomeHaddingText">Hello</div>
          <div className="textStyle18" style={{ marginBottom: 15 }}>
            Signup to Get Started
          </div>
          <Form.Item
            name="full_name"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <MyCareerGuidanceInputField
              placeholder="Full Name"
              prefix={nameIcon}
              type="input"
              name="full_name"
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
            // name="school"
            rules={[{ required: true, message: "Please select a school!" }]}
            style={{ marginBottom: "12px" }}
          >
            <Select
              showSearch // Enable search functionality
              placeholder="School"
              name="school"
              value={data?.school}
              optionFilterProp="children" // Search filter based on option children
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              } // Filter options based on user input
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
            >
              {schools.map((school) => (
                <Select.Option key={school.value} value={school.value}>
                  {school.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <span>If your school is not listed above</span>
          <span
            style={{ cursor: "pointer", color: "#1476b7", paddingLeft: "5px" }}
            onClick={() => setOpen(true)}
          >
            Click here to add
          </span>
          <div className="schoolModalStyling">
            <Modal
              title="Add your school"
              centered
              open={open}
              onOk={() => setOpen(false)}
              footer={[
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => setOpen(false)}
                  style={{background:"#1476b7"}}
                >
                  Update
                </Button>,
              ]}
            >
              <Form>
                <Form.Item
                  name="school"
                  rules={[
                    { required: true, message: "Please input your School!" },
                  ]}
                >
                  <MyCareerGuidanceInputField
                    placeholder="School Name"
                    prefix={schoolImg}
                    type="input"
                    name="school"
                    onChange={handleSchool}
                    onBlur={addNewSchool}
                  />
                </Form.Item>
              </Form>
            </Modal>
          </div>

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
            <div style={{ width: "28%" }}>
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
            name="profile_image"
            // rules={[{ required: true, message: "Please Add Picture!" }]}
          >
            <Upload
              beforeUpload={() => false}
              listType="picture"
              name={"profile_image"}
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
