import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import "./PersonalProfile.css";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { API_URL } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import { putApiWithAuth } from "../../../utils/api";
import phoneIcon from "../../../assets/phone.svg";

import axios from "axios";

const { TextArea } = Input;

const PersonalProfile = ({ setCurrent, current }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [profileObject, setProfileObject] = useState({ id: null });
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [nextBtn, setNextBtn] = useState(false);
  const [savedTotalStep, setSavedTotalStep] = useState();
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [userData, setUserData] = useState({});
  const [enableDownloadCV, setEnableDownloadCV] = useState(false);

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setProfileObject({ ...profileObject, [name]: value });
  };

  const onSubmit = () => {
    handleUpdateApi();
  };

  const handleUpdateApi = async () => {
    const respose = await postApiWithAuth(API_URL.POSTPROFILE, [profileObject]);
    if (respose.data.status === 201 || respose.data.status === 200) {
      setCurrent(current + 1);
    } else {
      message.error(respose.data.message);
    }
  };

  const handleGetApi = async () => {
    const response = await getApiWithAuth(API_URL.GETPROFILE);

    if (response.data?.status === 200 && response.data.data.length > 0) {
      setProfileObject(response.data.data[0]);
      form.setFieldsValue({
        full_name: response.data.data[0].full_name,
        email: response.data.data[0].email,
        number: response.data.data[0].number,
        address: response.data.data[0].address,
        address2: response.data.data[0].address2,
        town: response.data.data[0].town,
        city: response.data.data[0].city,
        eircode: response.data.data[0].eircode,
        objective: response.data.data[0].objective,
      });
    }
  };

  const getUserData = async () => {
    const response = await getApiWithAuth(API_URL.GETUSER2);

    if (response.data.data["current_step"] > 1) {
      setNextBtn(true);
      setSavedTotalStep(response.data.data["current_step"]);
    }
    if (response.data.status === 200) {
      setUserData(response.data.data);
      if (response.data.data.cv_completed === true) {
        setDownloadBtn(true);
      }
    }
    if (response.data.data.current_step !== 1) {
      setIsInputDisabled(true);
    } else {
      setIsInputDisabled(false);
    }
  };
  const edit = () => {
    setIsInputDisabled(false);
  };

  useEffect(() => {
    handleGetApi();
    getUserData();
  }, []);
  const SavePdf = async (e) => {
    e.preventDefault();
    var token = localStorage.getItem("access_token", "");

    const response = await axios.get(
      `${'${process.env.REACT_APP_BASE_URL}'}cv/cv/`,
      {
        responseType: "blob", // Set the response type to 'blob'
        headers: {
          Authorization: `Bearer ${token}`, // Set the Authorization header
        },
      }
    );

    // Create a blob from the response data
    const pdfBlob = new Blob([response.data], { type: "application/pdf" });

    // Create a temporary URL for the blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Create a link and initiate the download
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${userData.full_name}'s.pdf`; // Set the desired filename

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the temporary URL
    URL.revokeObjectURL(pdfUrl);
  };

  const handleNextClick = () => {
    if (savedTotalStep >= current) {
      // Assuming you have a total of 6 steps
      setCurrent(current + 1);
      navigate(`?step=${current + 1}`);
    }
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
          <Form layout="vertical" form={form} onFinish={onSubmit}>
            <div className="profileFormEmail">
              <div className="profileFormEmailItem">
                <Form.Item
                  label="Full Name"
                  name="full_name"
                  className="profileItemLable"
                  rules={[
                    { required: true, message: "Please input your Full Name!" },
                  ]}
                  style={{ fontFamily: "YourFontFamily", fontWeight: "bold" }}
                >
                  <MyCareerGuidanceInputField
                    placeholder="Maria Murphy"
                    type="input"
                    name="full_name"
                    onChange={onChangeHandle}
                    inputValue={profileObject?.full_name}
                    isPrefix={false}
                    // disabled={isInputDisabled}
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
                    inputValue={profileObject?.email}
                    isPrefix={false}
                    // disabled={isInputDisabled}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="profileFormItem">
              <Form.Item
                label="Phone Number"
                className="profileItemLable"
                name="number"
                rules={[
                  {
                    required: true,
                    message: "Please input your Phone Number!",
                  },
                ]}
              >
                <MyCareerGuidanceInputField
                  placeholder="Phone Number"
                  isPrefix={false}
                  name="number"
                  type="input"
                  onChange={onChangeHandle}
                  inputValue={profileObject?.number}
                />
              </Form.Item>
            </div>
            <div className="profileFormItem">
              <Form.Item
                label="Address Line 1"
                name="address"
                className="profileItemLable"
                rules={[
                  {
                    required: true,
                    message: "Please input your Address line 1!",
                  },
                ]}
              >
                <MyCareerGuidanceInputField
                  placeholder="Address line 1"
                  type="input"
                  name="address"
                  onChange={onChangeHandle}
                  inputValue={profileObject?.address}
                  isPrefix={false}
                  // disabled={isInputDisabled}
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
                    required: false,
                    message: "Please input your Address line 2!",
                  },
                ]}
              >
                <MyCareerGuidanceInputField
                  placeholder="Address line 2"
                  type="input"
                  name="address2"
                  onChange={onChangeHandle}
                  inputValue={profileObject?.address2}
                  isPrefix={false}
                  // disabled={isInputDisabled}
                />
              </Form.Item>
            </div>

            <div className="profileFormEmail profileFormItem">
              <div style={{ width: "48%" }} className="mobileLayout">
                <Form.Item
                  label="County"
                  name="town"
                  className="profileItemLable"
                  rules={[
                    { required: true, message: "Please input your County!" },
                  ]}
                >
                  <MyCareerGuidanceInputField
                    placeholder="EG:Kildare"
                    type="input"
                    name="town"
                    onChange={onChangeHandle}
                    inputValue={profileObject?.town}
                    isPrefix={false}
                    // disabled={isInputDisabled}
                  />
                </Form.Item>
              </div>
              <div style={{ width: "24%" }} className="mobileLayout">
                <Form.Item
                  label="Town/Area/City"
                  name="city"
                  className="profileItemLable"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Town/Area/City!",
                    },
                  ]}
                >
                  <MyCareerGuidanceInputField
                    placeholder="Clonmel/Coolock"
                    type="input"
                    name="city"
                    onChange={onChangeHandle}
                    inputValue={profileObject?.city}
                    isPrefix={false}
                    // disabled={isInputDisabled}
                  />
                </Form.Item>
              </div>
              <div style={{ width: "24%" }} className="mobileLayout">
                <Form.Item
                  label="Eircode"
                  name="eircode"
                  className="profileItemLable"
                  rules={[
                    {
                      required: false,
                      message: "Please input your Eircode!",
                    },
                  ]}
                >
                  <MyCareerGuidanceInputField
                    placeholder="DXX XXXX"
                    type="input"
                    name="eircode"
                    onChange={onChangeHandle}
                    inputValue={profileObject?.eircode}
                    isPrefix={false}
                    // disabled={isInputDisabled}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="profileFormItem">
              <Form.Item
                label="Personal Statement"
                name="objective"
                className="profileItemLable"
                rules={[
                  {
                    required: false,
                    message: "Please input your Personal Statement!",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Write Your Personal Statement......"
                  className="inputFieldStyle"
                  inputValue={profileObject?.objective}
                  name="objective"
                  onChange={onChangeHandle}
                  // disabled={isInputDisabled}
                />
              </Form.Item>
            </div>
            <div className="personalItemButton">
              {nextBtn && (
                <Button
                  className="eduButtonBack"
                  type="primary"
                  onClick={handleNextClick}
                >
                  Next
                </Button>
              )}
              <div className="buttonEducation">
                {downloadBtn && (
                  <Button
                    className={
                      downloadBtn === false
                        ? "disabledBtn me-3"
                        : "skillsButton me-3 "
                    }
                    type="primary"
                    htmlType="submit"
                    onClick={(e) => SavePdf(e)}
                  >
                    Download CV
                  </Button>
                )}
                <Button
                  className="eduButton"
                  type="primary"
                  htmlType="submit"
                  // disabled={isInputDisabled}>
                >
                  Save
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default PersonalProfile;
