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
  const [form] = Form.useForm();
  const { setSubscribe, updateSchoolSelection } = useSubscribe();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [schools, setSchools] = useState([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [showSplashScreen, setShowSplashScreen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);

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

  const handleAccountTypeSelect = (accountType) => {
    setData((currentData) => ({
      ...currentData,
      account_type: accountType,
    }));
    setIsStudentModalVisible(accountType === "student");
  };

  const chooseCounsellorAccountType = () => {
    form.setFieldsValue({ account_type: "counsellor" });
    setData((currentData) => ({
      ...currentData,
      account_type: "counsellor",
    }));
    setIsStudentModalVisible(false);
  };

  const closeStudentModal = () => {
    form.setFieldsValue({ account_type: undefined });
    setData((currentData) => ({
      ...currentData,
      account_type: undefined,
    }));
    setIsStudentModalVisible(false);
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
    if (data.account_type !== "counsellor") {
      setIsStudentModalVisible(true);
      return;
    }

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
        updateSchoolSelection(response.data.requires_school_selection === true);
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
        <Link to="/" style={{ display: 'inline-block', width: 'fit-content' }}>
          <Image
            preview={false}
            src={myCareerGuidanceIcon || "/placeholder.svg"}
            width={207}
            style={{ cursor: 'pointer' }}
          />
        </Link>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', color: '#1476b7', margin: '15px 0', textDecoration: 'none', fontWeight: 500, fontSize: '15px' }}>
          <span style={{ marginRight: '6px', fontSize: '18px', lineHeight: 1 }}>←</span> Back to Home
        </Link>
        <Form
          form={form}
          onFinish={handlerSaveSubmit}
          className="formStyle"
          autoComplete={false}
        >
          <div className="welcomeHaddingText">Hello Guidance Counsellor</div>
          <div className="textStyle18" style={{ marginBottom: 15 }}>
            <span className="text-blue-800 font-semibold">Signup for Free Trial</span>
          </div>

          <div className="counsellor-only-notice" role="note">
            <span className="counsellor-only-notice__icon" aria-hidden="true">
              i
            </span>
            <div>
              <strong>Guidance Counsellors only</strong>
              <p>
                This free-trial signup is for Guidance Counsellors. Students can{" "}
                <Link to="/login">log in to their account here</Link>.
              </p>
            </div>
          </div>

          <Form.Item
            name="account_type"
            rules={[
              {
                required: true,
                message: "Please select your account type!",
              },
            ]}
          >
            <Select
              placeholder="Are you a Student or Guidance Counsellor?"
              value={data.account_type}
              className="inputSelectFieldStyle account-type-select"
              onChange={handleAccountTypeSelect}
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
              <Select.Option value="counsellor">
                Guidance Counsellor
              </Select.Option>
              <Select.Option value="student">Student</Select.Option>
            </Select>
          </Form.Item>

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
            className="signInButton counselor-signup-submit"
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!agreeToTerms || data.account_type !== "counsellor"}
          />

          <div
            className="textStyle16 mt-[-20px] mb-6 "
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
        title="Student sign-in"
        visible={isStudentModalVisible}
        onCancel={closeStudentModal}
        footer={[
          <MyCareerGuidanceButton
            key="choose-counsellor"
            label="Guidance Counsellor"
            className="student-modal-secondary"
            type="button"
            onClick={chooseCounsellorAccountType}
          />,
          <MyCareerGuidanceButton
            key="student-login"
            label="Go to Student Login"
            className="student-modal-primary"
            type="primary"
            onClick={() => navigate("/login")}
          />,
        ]}
        className="student-login-modal"
      >
        <div className="student-login-modal__content">
          <div className="student-login-modal__icon" aria-hidden="true">
            →
          </div>
          <p>
            Student accounts are not eligible for the Guidance Counsellor free
            trial. Please continue to the student login page.
          </p>
          <Link to="/login">www.myguidance.ie/login</Link>
        </div>
      </Modal>
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
