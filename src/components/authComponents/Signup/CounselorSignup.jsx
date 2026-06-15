import { useState, useEffect } from "react";
import sideAuthImage from "../../../assets/kid-front-page (1).jpg";
import myCareerGuidanceIcon from "../../../assets/newlogo.png";
import usernameIcon from "../../../assets/usernameIcon.svg";
import nameIcon from "../../../assets/nameIcon.svg";
import lockIcon from "../../../assets/lockIcon.svg";
import phoneIcon from "../../../assets/phone.svg";
import schoolIcon from "../../../assets/schoolIcon.svg";
import dropdownIcon from "../../../assets/dropdownIcon.svg";
import { Link } from "react-router-dom";
import { Form, Image, Select, message, Checkbox, Modal } from "antd";
import {
  MyCareerGuidanceInputField,
  MyCareerGuidanceButton,
} from "../../commonComponents";
import { API_URL } from "../../../utils/constants";
import { getApiWithoutAuth, postApiWithoutAuth } from "../../../utils/api";
import "./SignupStyle.css";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../../utils/LocalStorage";
import { useSubscribe } from "../../../context/subscribe";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyPolicy from "./PrivacyPolicy";

const CounselorSignup = () => {
  const navigate = useNavigate();
  const { setSubscribe } = useSubscribe();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [schools, setSchools] = useState([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [showSplashScreen, setShowSplashScreen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const showModal = (content) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSelect = (schoolValue) => {
    setData({ ...data, actual_school_name: schoolValue });
  };

  const getSchools = async () => {
    try {
      const response = await getApiWithoutAuth(API_URL.GETUSERSCHOOL);
      if (response?.data?.success) {
        const schoolList = response.data.data?.map((item) => {
          return {
            value: item.school, // Using school name as value since API expects actual_school_name string
            label: item.school,
            county: item.county,
          };
        });
        setSchools(schoolList);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  useEffect(() => {
    getSchools();
  }, []);

  const handlerSaveSubmit = async () => {
    setLoading(true);

    try {
      const payload = {
        name: data.full_name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        actual_school_name: data.actual_school_name,
        password: data.password,
      };

      const response = await postApiWithoutAuth(API_URL.FREE_TRIAL_SIGNUP, payload);

      if (response.status === 200 || response.status === 201) {
        message.success(
          response.data.message || "Your My Guidance Free Trial is ready!"
        );

        const isSubscribed = response.data.is_subscribed || false;
        setSubscribe(isSubscribed);
        
        setShowSplashScreen(true);
        setLoading(false);
      } else {
        setLoading(false);
        message.error(response.data.message || "Signup failed");
      }
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong. Please try again.");
    }
  };

  const handleLoginAsStudent = async () => {
    setLoginLoading(true);
    try {
      const response = await postApiWithoutAuth(API_URL.SIGNIN, {
        email: data.email.toLowerCase(),
        password: data.password,
      });
      if (response?.status === 200) {
        message.success("Logged in as Student");
        setToken(response?.data?.access);
        setSubscribe(response.data.is_subscribed);
        if (response.data.is_subscribed) {
          navigate("/dashboard");
        } else {
          navigate("/checkout");
        }
      } else {
        message.error(response.data.message || "Student login failed");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong during student login.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLoginAsCounselor = async () => {
    setLoginLoading(true);
    try {
      const response = await postApiWithoutAuth(API_URL.CONSELOR_SIGN_IN, {
        email: data.email.toLowerCase(),
        password: data.password,
      });
      if (response?.status === 200) {
        message.success("Logged in as Counselor");
        document.cookie = `conselorToken=${
          response?.data?.access
        }; path=/; max-age=${7 * 24 * 60 * 60}; Secure; SameSite=Strict`;
        navigate("/counsellor-Dashboard");
      } else {
        message.error(response.data.message || "Counselor login failed");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong during counselor login.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="mainDiv">
      {showSplashScreen && (
        <div className="splash-overlay">
          <div className="splash-content">
            <div className="splash-logo">
              <Image
                preview={false}
                src={myCareerGuidanceIcon}
                width={180}
              />
            </div>
            <h2 className="splash-title">Welcome to My Guidance!</h2>
            <p className="splash-text">
              Your account has been created successfully. How would you like to continue?
            </p>
            <div className="splash-buttons">
              <MyCareerGuidanceButton
                label="Login as Student"
                className="splash-button"
                type="primary"
                onClick={handleLoginAsStudent}
                loading={loginLoading}
              />
              <MyCareerGuidanceButton
                label="Login as Counselor"
                className="splash-button"
                type="primary"
                onClick={handleLoginAsCounselor}
                loading={loginLoading}
                style={{ backgroundColor: "#1476b7", borderColor: "#1476b7" }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="leftDiv">
        <Image
          preview={false}
          src={myCareerGuidanceIcon || "/placeholder.svg"}
          width={207}
        />
        <Form
          onFinish={handlerSaveSubmit}
          className="formStyle"
          autoComplete={false}
        >
          <div className="welcomeHaddingText">Hello Counselor</div>
          <div className="textStyle18" style={{ marginBottom: 15 }}>
            <span className="text-blue-800 font-semibold">Signup for Free Trial</span>
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
              inputValue={data.full_name}
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
              type="email"
              name="email"
              onChange={onChangeHandle}
              inputValue={data.email}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Please input your Phone Number!" },
            ]}
          >
            <MyCareerGuidanceInputField
              placeholder="Phone Number"
              prefix={phoneIcon}
              type="input"
              name="phone"
              onChange={onChangeHandle}
              inputValue={data.phone}
            />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Please select a school!" }]}
            style={{ marginBottom: "12px" }}
          >
            <Select
              showSearch
              placeholder="School"
              name="actual_school_name"
              value={data?.actual_school_name}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().startsWith(input.toLowerCase())
              }
              className="inputSelectFieldStyle"
              onChange={handleSelect}
              bordered={false}
              suffixIcon={
                <Image
                  preview={false}
                  src={dropdownIcon || "/placeholder.svg"}
                  width={15}
                  style={{ marginRight: 10 }}
                />
              }
            >
              {schools.map((school, index) => (
                <Select.Option key={index} value={school.value}>
                  {`${school.label}, ${school.county}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                pattern: new RegExp(
                  /^(?=.*\d)(?=.*?[@$!%*#?&^_.,-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
                ),
                message:
                  "Please ensure your password contains at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.",
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
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Please accept the terms and conditions")
                      ),
              },
            ]}
          >
            <Checkbox
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
            >
              I agree to the{" "}
              <a onClick={() => showModal("terms")} className="font-bold text-black ">Terms & Conditions</a> and{" "}
              <a onClick={() => showModal("privacy")}className="font-bold text-black ">Privacy Policy</a>.
            </Checkbox>
          </Form.Item>

          <MyCareerGuidanceButton
            label="Sign Up"
            className="signInButton"
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!agreeToTerms}
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

        <span className="allRights">© 2023 My Guidance. All Rights Reserved</span>
      </div>

      <div className="mobileScreenImage">
        <img
          src={sideAuthImage || "/placeholder.svg"}
          style={{
            objectFit: "cover",
            height: "100vh",
            width: "100%",
            borderRadius: "20px",
          }}
          alt="img"
        />
      </div>
      <Modal
        title={
          modalContent === "terms"
            ? "Terms & Conditions"
            : "Privacy Policy"
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <MyCareerGuidanceButton
            key="back"
            onClick={handleCancel}
            label="Close"
            className="ant-btn ant-btn-primary"
            type="button"
          />,
        ]}
        className="terms-modal"
      >
        {modalContent === "terms" ? (
          <TermsAndConditions />
        ) : (
          <PrivacyPolicy />
        )}
      </Modal>
    </div>
  );
};

export default CounselorSignup;
