import React, { useState, useEffect } from "react";
import "./Interest.css";
import { Form, Button, Input, message } from "antd";
import axios from "axios";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../../../utils/constants";

const Interest = ({ setCurrent, current }) => {
  const [downloadBtn, setDownloadBtn] = useState(false);
  const { TextArea } = Input;
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [nextBtn, setNextBtn] = useState(false);
  const [savedTotalStep,setSavedTotalStep]=useState()
  const [textData, setTextData] = useState({ id: null });
  const [isInputDisabled, setIsInputDisabled] = useState(true);


  const onsubmit = async () => {

    const respose = await postApiWithAuth(API_URL.POSTINTREST, [textData]);

    if (respose.data.status === 201) {
      setCurrent(current + 1);
    } else {
      message.error("Error, Please try again");
    }
  };

  const prev = () => {
    if (current != 1) setCurrent(current - 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTextData({ ...textData, [name]: value });
  };

  const getIntrest = async () => {
    const response = await getApiWithAuth(API_URL.GETINTREST);

    if (response.data?.status === 200) {
      if (response.data.data.length > 0) {
        setTextData(response.data.data[0]);
      }
    }
  };

  const SavePdf = async (e) => {
    e.preventDefault();
    var token = localStorage.getItem("access_token", "");

    const response = await axios.get(
      `${process.env.REACT_APP_LINK_BASE_URL}cv/cv/`,
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
    link.download = `${userData.full_name}.pdf`; // Set the desired filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the temporary URL
    URL.revokeObjectURL(pdfUrl);
  };

  const getUserData = async () => {
    const response = await getApiWithAuth(API_URL.GETUSER2);
    if (response.data.data["current_step"] > 1) {
      setNextBtn(true)
      setSavedTotalStep(response.data.data["current_step"])
    }
    if (response.data.data.current_step !== 4) {
      setIsInputDisabled(true);
    } else {
      setIsInputDisabled(false);
    }
    if (response.data.status === 200) {
      setUserData(response.data.data);
      if (response.data.data.cv_completed === true) {
        setDownloadBtn(true);
      }
    }
  }

  const edit = () => {
    setIsInputDisabled(false)
  }

  useEffect(() => {
    getIntrest();
    getUserData();
  }, []);
  const handleNextClick = () => {
    if (savedTotalStep >= current) { 
      setCurrent(current + 1);
      navigate(`?step=${current + 1}`);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center">
        <div>
          <h1 className="interestHead">What interests do you have?</h1>
          <p className="interestSubHeading">Include All Hobbies and Intrests</p>
        </div>
        <div className="interestForm">
          <Form layout="vertical" onFinish={onsubmit}>
            <div>
              <Form.Item
                label="Interest"
                className="interestItemLable"
                rules={[
                  { required: true, message: "Please input your Interest!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder={textData.interests || "Write Your Interests......"}
                  className="inputFieldStyle"
                  value={textData.interests}
                  name="interests"
                  onChange={handleChange}
                // disabled={isInputDisabled}
                />
              </Form.Item>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mobileLayout">
              <div className="interestItemButton">
                <Form.Item>
                  <Button
                    className="skillsButton me-3"
                    type="primary"
                    onClick={prev}
                  >
                    Back
                  </Button>
                </Form.Item>
                {nextBtn && (  <Form.Item>
                  <Button
                    className="skillsButton me-3"
                    type="primary"
                    onClick={handleNextClick}
                  >
                    Next
                  </Button>
                </Form.Item>
                )}
              </div>
              <div className="buttonEducation">
                <Form.Item>

                  {downloadBtn && (<Button
                    className={
                      downloadBtn === false
                        ? "disabledBtn me-3"
                        : "skillsButton me-3 "
                    }
                    type="primary"
                    htmlType="submit"
                    onClick={(e) => SavePdf(e)}>
                    Download CV
                  </Button>)}
                  <Button
                    className="interestButton"
                    type="primary"
                    htmlType="submit"
                  // disabled={isInputDisabled}

                  >
                    Save
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Interest;
