import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import "./PersonalProfile.css";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";

const { TextArea } = Input;

const PersonalProfile = ({ setCurrent, current }) => {
  const [profileObject, setProfileObject] = useState({
    full_name: "",
    email: "",
    address: "",
    address2: "",
    town: "",
    eircode: "",
    city: "",
    objective: "",
  });
  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setProfileObject({ ...profileObject, [name]: value });
  };

  const onSubmit = () => {
    setCurrent(current + 1);
  };

  return (
    <>
      <div className="flex flex-col justify-center">
        <div>
          <h1 className="profileHead">
            What’s the best way for employers to contact you?
          </h1>
          <p className="profileSubHeading">
            We suggest including an email and phone number.
          </p>
        </div>
        <div className="profileForm">
          <Form layout="vertical" onFinish={onSubmit}>
            <div className="profileFormEmail">
              <div className="profileFormEmailItem">
                <Form.Item
                  label="Full Name"
                  name="full_name"
                  className="profileItemLable"
                  rules={[
                    { required: true, message: "Please input your Full Name!" },
                  ]}
                >
                  <MyCareerGuidanceInputField
                    placeholder="e.g Maria"
                    type="input"
                    name="full_name"
                    onChange={onChangeHandle}
                    inputValue={profileObject.full_name}
                    isPrefix={false}
                  />
                </Form.Item>
              </div>
              <div className="profileFormEmailItem">
                <Form.Item
                  label="Email Address"
                  name="email"
                  className="profileItemLable"
                  rules={[
                    { required: true, message: "Please input your Email!" },
                  ]}
                >
                  <MyCareerGuidanceInputField
                    placeholder="e.g mdelacruz@gmail.com"
                    type="input"
                    name="email"
                    onChange={onChangeHandle}
                    inputValue={profileObject.email}
                    isPrefix={false}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="profileFormItem">
              <Form.Item
                label="Address Line 1"
                name="address"
                className="profileItemLable"
                rules={[
                  {
                    required: true,
                    message: "Please input your Temporary Address!",
                  },
                ]}
              >
                <MyCareerGuidanceInputField
                  placeholder="Temporary Address"
                  type="input"
                  name="address"
                  onChange={onChangeHandle}
                  inputValue={profileObject.address}
                  isPrefix={false}
                />
              </Form.Item>
            </div>
            <div className="profileFormItem">
              <Form.Item
                label="Address Line 2"
                name="address2"
                className="profileItemLable"
                rules={[
                  {
                    required: true,
                    message: "Please input your Permanent Address!",
                  },
                ]}
              >
                <MyCareerGuidanceInputField
                  placeholder="Permanent  Address"
                  type="input"
                  name="address2"
                  onChange={onChangeHandle}
                  inputValue={profileObject?.address2}
                  isPrefix={false}
                />
              </Form.Item>
            </div>
            <div className="profileFormEmail profileFormItem">
              <div style={{ width: "48%" }}>
                <Form.Item
                  label="Town"
                  name="town"
                  className="profileItemLable"
                  rules={[
                    { required: true, message: "Please input your Town!" },
                  ]}
                >
                  <MyCareerGuidanceInputField
                    placeholder="e.g Cebu City, Cebu"
                    type="input"
                    name="town"
                    onChange={onChangeHandle}
                    inputValue={profileObject.town}
                    isPrefix={false}
                  />
                </Form.Item>
              </div>
              <div style={{ width: "24%" }}>
                <Form.Item
                  label="City"
                  name="city"
                  className="profileItemLable"
                  rules={[
                    { required: true, message: "Please input your City!" },
                  ]}
                >
                  <MyCareerGuidanceInputField
                    placeholder="e.g Cebu City, Cebu"
                    type="input"
                    name="city"
                    onChange={onChangeHandle}
                    inputValue={profileObject.city}
                    isPrefix={false}
                  />
                </Form.Item>
              </div>
              <div style={{ width: "24%" }}>
                <Form.Item
                  label="Eircodel Code"
                  name="eircode"
                  className="profileItemLable"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Eircodel Code!",
                    },
                  ]}
                >
                  <MyCareerGuidanceInputField
                    placeholder="e.g Cebu City, Cebu"
                    type="input"
                    name="eircode"
                    onChange={onChangeHandle}
                    inputValue={profileObject.eircode}
                    isPrefix={false}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="profileFormItem">
              <Form.Item
                label="Objective"
                name="objective"
                className="profileItemLable"
                rules={[
                  { required: true, message: "Please input your Objective!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Write Your Objective......"
                  className="inputFieldStyle"
                  inputValue={profileObject.objective}
                  name="objective"
                  onChange={onChangeHandle}
                />
              </Form.Item>
            </div>

            <div className="profileItemButton">
              <Form.Item>
                <Button
                  className="profileButton"
                  type="primary"
                  htmlType="submit"
                >
                  Next
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default PersonalProfile;
