import React, { useState, useEffect, useRef } from "react";
import sideAuthImage from "../../../assets/kid-front-page-min.png";
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
  dayArray31,
  dayArray30,
  dayArray28,
  monthArray,
  createFormDataObject,
  convertBase64,
} from "../../../utils/helper";
import moment from "moment";
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
  const currentYear = moment().year();
  const disabledDate = (current) => {
    return current.year() > currentYear;
  };
  // console.log("===yearrr beforeee", dobSave);

  const onChangeYearInternal = (date) => {
    onChangeYear(date?.year());
  };

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

  // const handleSelectMonth = (m) => {
  //   setDobSave({ ...dobSave, month: m });
  // };


  const handleSelectDay = (d) => {
    console.log("====dayyyy", d);
    setDobSave({ ...dobSave, day: d });
  };

  useEffect(() => {
    console.log("===dob", dobSave);
  }, [dobSave]);

  const onChangeYear = (date) => {
    console.log("======yearrr", date);
    setDobSave({ ...dobSave, year: date });
    // setDobSave({ ...dobSave, year: date?.$y });
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

    if (response?.data?.success) {
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
  const handleSelectMonth = (m) => {
    // Update the selected month
    setDobSave({ ...dobSave, month: m });

    // Clear the day value if it's not valid for the selected month
    if (dobSave.day) {
      const isValidDayForMonth =
        (m === "02" && dobSave.day >= 1 && dobSave.day <= 28) ||
        (["04", "06", "09", "11"].includes(m) &&
          dobSave.day >= 1 &&
          dobSave.day <= 30) ||
        (["01", "03", "05", "07", "08", "10", "12"].includes(m) &&
          dobSave.day >= 1 &&
          dobSave.day <= 31);
      if (!isValidDayForMonth) {
        setDobSave((prevDobSave) => ({ ...prevDobSave, day: "" }));
      }
    }
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
                option.children.toLowerCase().startsWith(input.toLowerCase())
              } // Filter options based on user input (show options that start with the input)
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
                  onClick={() => {
                    setOpen(false);
                    setData({ ...data, school: newSchools });
                  }}
                  style={{ background: "#1476b7" }}
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
                  options={
                    dobSave.month === "01" &&
                    "03" &&
                    "05" &&
                    "07" &&
                    "08" &&
                    "10" &&
                    "12"
                      ? dayArray31
                      : dobSave.month === "02"
                      ? dayArray28
                      : dobSave.month === "04" && "06" && "09" && "11"
                      ? dayArray30
                      : dobSave.month === "undefined"
                      ? dayArray28
                      : dayArray31
                  }
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
                {/* <DatePicker
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
                    /> */}
                <DatePicker
                  picker="year"
                  placeholder="Year"
                  className="inputSelectFieldStyle"
                  onChange={onChangeYearInternal}
                  disabledDate={disabledDate}
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
          © 2023 My Guidance. All Rights Reserved
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
