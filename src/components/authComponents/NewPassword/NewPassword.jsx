import React, { useState } from "react";
import sideAuthImage from "../../../assets/sideAuthImage.png";
import myCareerGuidanceIcon from "../../../assets/myCareerGuidanceIcon.png";
import usernameIcon from "../../../assets/usernameIcon.svg";
import lockIcon from "../../../assets/lockIcon.svg";
import { Link } from "react-router-dom";
import { API_URL } from "../../../utils/constants";
import { patchApiWithOutAuth } from "../../../utils/api";
import { message, Form, Image } from "antd";
import {
  MyCareerGuidanceInputField,
  MyCareerGuidanceButton,
} from "../../commonComponents";
import { useNavigate, useLocation } from "react-router-dom";

const NewPasword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state || {};
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handlerSubmit = async () => {
    setLoading(true);
    const response = await patchApiWithOutAuth(API_URL.NEWPASSWORD, {
      ...data,
      email: email.data.email,
    });

    if (response.data.success) {
      setLoading(false);
      message.success("Password Changed Successfull");
      navigate("/");
    } else {
      setLoading(false);
      message.error(response.data.message[0]);
    }
  };

  const onCheckHandle = (e) => {
    const { name, checked } = e;
  };

  return (
    <div className="mainDiv">
      <div className="leftDiv">
        <Image preview={false} src={myCareerGuidanceIcon} width={207} />
        <Form onFinish={handlerSubmit} className="formStyle">
          <div className="welcomeHaddingText">Create New password</div>
          <div className="textStyle18" style={{ marginBottom: 10 }}>
            Your new password must be different from previous used password.
          </div>
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
          <Form.Item
            name="confirm_password"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please input confirm password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <MyCareerGuidanceInputField
              type="password"
              placeholder="Confirm Password"
              prefix={lockIcon}
              name="confirm_password"
              passwordValue={data.confirm_password}
              dependencies={data.password}
              onChange={onChangeHandle}
            />
          </Form.Item>
          <MyCareerGuidanceButton
            label="Update password"
            className="signInButton"
            type="primary"
            htmlType="submit"
            loading={loading}
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
export default NewPasword;
