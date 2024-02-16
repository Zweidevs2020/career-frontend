import { Button } from "antd";
import { useEffect, useState } from "react";
import PersonalProfile from "./PersonalProfile/PersonalProfile";
import Skill from "./Skill/Skill";
import "./CvCoverLetter.css";
import Steps from "./Steps/Steps";
import Interest from "./Interests/Interest";
import Reference from "./Reference/Reference";
import Education from "./Eductaion/Education";
import emailIcon from "../../assets/image 2.png";
import docxIcon from "../../assets/images.png";

import Experenice from "./Experenice/Experenice";
import { getApiWithAuth } from "../../utils/api";
import { API_URL } from "../../utils/constants";
import { useLocation } from "react-router-dom";
import { MailOutlined } from "@ant-design/icons";
import axios from "axios";
const CvCoverLetter = () => {
  const location = useLocation();
  const initialStep = new URLSearchParams(location.search).get("step") || 1;
  const [current, setCurrent] = useState(parseInt(initialStep));
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [response, setResponse] = useState(null);
  const [isCvComplete, setIsCvComplete] = useState(false);
  const getUserData = async () => {
    try {
      const response = await getApiWithAuth(API_URL.GETUSER2);

      if (response.data.status === 200) {
        if (response.data.data.cv_completed === true) {
          setDownloadBtn(true);
          setIsCvComplete(true);
        }
      }
      setResponse(response.data.data["current_step"]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    getUserData();

    const searchParams = new URLSearchParams(location.search);
    searchParams.set("step", current);
    window.history.replaceState(
      null,
      "",
      `${location.pathname}?${searchParams}`
    );
  }, [current, location]);

  const sendToEmail = async () => {
    const res = await getApiWithAuth(API_URL.SENDCV);
  };
  const downloadDocs = async (e) => {
    var token = localStorage.getItem("access_token", "");

    const response = await axios.get(
      `${process.env.REACT_APP_LINK_BASE_URL}cv/doc-cv
      `,
      {
        responseType: "blob", // Set the response type to 'blob'
        headers: {
          Authorization: `Bearer ${token}`, // Set the Authorization header
        },
      }
    );
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    var link = document.createElement('a');                     
    var URL = window.URL || window.webkitURL;
    var downloadUrl = URL.createObjectURL(blob);
    link.href = downloadUrl;
    link.style = "display: none";
    link.download = "filename.docx";
    document.body.appendChild(link)
    link.click()
    link.remove() 

  };
  return (
    <>
      <div class="h-[100%] w-[100%] bg-white mt-3">
        <div
          class="h-[100px] ml-9"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 class="font-bold text-[24px] text-[#474749] w-[50%] ">CV</h1>
            {/* <p class="text-[#737373] text-[12px] mt-1">
              Lorem ipsum is a placeholder text commonly used to demonstrate.
            </p> */}
          </div>
          <div style={{ display: "flex"}} className="w-[40%]">
            {downloadBtn && (
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                onClick={() => {
                  downloadDocs();
                }}
              >
                <img
                  src={docxIcon}
                  className="responsive-image"
                  style={{ marginRight: "1rem",width:25,height:25 }}
                />
                <span style={{ marginRight: "2.5rem",width:'100%' }}> DownLoad a Docs</span>
              </span>
            )}
            {downloadBtn && (
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                onClick={() => {
                  sendToEmail();
                }}
              >
                <img
                  src={emailIcon}
                  className="responsive-image"
                  style={{ marginRight: "1rem",width:20,height:20 }}
                />
                <span style={{ width:'100%' }}> Send to Email</span>
              </span>
            )}
          </div>
        </div>

        <div className="cv-Data">
          <div className="ml-2">
            <Steps
              current={response}
              setCurrent={setCurrent}
              currentStep={current}
              isCvComplete={isCvComplete}
            />
          </div>
          {current === 1 ? (
            <PersonalProfile setCurrent={setCurrent} current={current} />
          ) : current === 2 ? (
            <Education setCurrent={setCurrent} current={current} />
          ) : current === 3 ? (
            <Experenice setCurrent={setCurrent} current={current} />
          ) : current === 4 ? (
            <Skill setCurrent={setCurrent} current={current} />
          ) : current === 5 ? (
            <Interest setCurrent={setCurrent} current={current} />
          ) : current === 6 ? (
            <Reference
              setCurrent={setCurrent}
              current={current}
              isCvComplete={isCvComplete}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
export default CvCoverLetter;
