import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import "./PersonalProfile.css";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { API_URL } from "../../../utils/constants";
import { putApiWithAuth } from "../../../utils/api";

const { TextArea } = Input;

const PersonalProfile = ({ setCurrent, current }) => {
  const [form] = Form.useForm();

  const [profileObject, setProfileObject] = useState({ id: null });
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(true);

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
        address: response.data.data[0].address,
        address2: response.data.data[0].address2,
        town: response.data.data[0].town,
        city: response.data.data[0].city,
        eircode: response.data.data[0].eircode,
        objective: response.data.data[0].objective,
      });
    }
  };

  const SavePdf = async () => {


    const respose = await getApiWithAuth(API_URL.SAVEPDF);

    if (respose.data.status === 201) {

    } else {
      message.error(respose.data.message);
    }
  };

  const getUserData = async () => {
    const response = await getApiWithAuth(API_URL.GETUSER2);
  
    if (response.data.status === 200) {
      if (response.data.data.cv_completed === true) {
        setDownloadBtn(true);
      }
    }
    if (response.data.data.current_step !== 1) {
      setIsInputDisabled(true);
    } else {
      setIsInputDisabled(false);
    }
  }
  const edit = () => {
    setIsInputDisabled(false)
  }

  useEffect(() => {
    handleGetApi();
    getUserData();
  }, []);

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
                >
                  <MyCareerGuidanceInputField
                    placeholder="Maria Murphy"
                    type="input"
                    name="full_name"
                    onChange={onChangeHandle}
                    inputValue={profileObject?.full_name}
                    isPrefix={false}
                    disabled={isInputDisabled}
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
                    disabled={isInputDisabled}

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
                  disabled={isInputDisabled}
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
                  disabled={isInputDisabled}

                />
              </Form.Item>
            </div>

            <div className="profileFormEmail profileFormItem">
              <div style={{ width: "48%" }}>
                <Form.Item
                  label="Town/Area"
                  name="town"
                  className="profileItemLable"
                  rules={[
                    { required: true, message: "Please input your Town/Area!" },
                  ]}
                >
                  <MyCareerGuidanceInputField
                    placeholder="Clonmel/Coolock"
                    type="input"
                    name="town"
                    onChange={onChangeHandle}
                    inputValue={profileObject?.town}
                    isPrefix={false}
                    disabled={isInputDisabled}

                  />
                </Form.Item>
              </div>
              <div style={{ width: "24%" }}>
                <Form.Item
                  label="County"
                  name="city"
                  className="profileItemLable"
                  rules={[
                    { required: true, message: "Please input your County!" },
                  ]}
                >
                  <MyCareerGuidanceInputField
                    placeholder="EG:Kildare"
                    type="input"
                    name="city"
                    onChange={onChangeHandle}
                    inputValue={profileObject?.city}
                    isPrefix={false}
                    disabled={isInputDisabled}

                  />
                </Form.Item>
              </div>
              <div style={{ width: "24%" }}>
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
                    disabled={isInputDisabled}

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
                  { required: false, message: "Please input your Objective!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Write Your Objective......"
                  className="inputFieldStyle"
                  inputValue={profileObject?.objective}
                  name="objective"
                  onChange={onChangeHandle}
                  disabled={isInputDisabled}

                />
              </Form.Item>
            </div>

            <div className="profileItemButton">
              <div style={{ paddingRight: "10px" }}>
                <Button
                  className={downloadBtn === true ? "skillsButton" : "skillsButton me-3 "}
                  type="primary"
                  onClick={edit}
                >
                  Edit
                </Button>
              </div>

              <div>
                <Button
                  className="profileButton mr-2"
                  type="primary"
                  htmlType="submit"
                  disabled={isInputDisabled}
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