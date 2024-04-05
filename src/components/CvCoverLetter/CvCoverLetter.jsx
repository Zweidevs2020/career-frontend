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
import pdfIcon from "../../assets/images.jpeg";

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
  const [userData, setUserData] = useState({});

  const getUserData = async () => {
    try {
      const response = await getApiWithAuth(API_URL.GETUSER2);

      if (response.data.status === 200) {
        setUserData(response.data.data);
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
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    var link = document.createElement("a");
    var URL = window.URL || window.webkitURL;
    var downloadUrl = URL.createObjectURL(blob);
    link.href = downloadUrl;
    link.style = "display: none";
    link.download = "filename.docx";
    document.body.appendChild(link);
    link.click();
    link.remove();
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
    link.download = `${userData.full_name}'s.pdf`; // Set the desired filename

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the temporary URL
    URL.revokeObjectURL(pdfUrl);
  };
  return (
    <>
      <div class="h-[100%] w-[100%] bg-white mt-3">
        <div
          class="h-[100%] pt-5 pb-5 ml-9 mr-10 flex flex-wrap justify-between items-center  sm:flex-col sm:items-start"
        >
          <div>
            <h1 className="font-bold text-[24px] text-[#474749]">CV</h1>
        
          </div>
          <div style={{ display: "flex",justifyContent:'flex-start' }} className=" sm:flex-col flex-wrap ">
            {downloadBtn && (
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  marginTop:5
                }}
                onClick={(e) => SavePdf(e)}
              >
                <img
                  src={pdfIcon}
                  className="responsive-image"
                  style={{ marginRight: "1rem", width: 25, height: 25 }}
                />
                <span style={{ marginRight: "2.5rem", width: "100%" }}>
                  {" "}
                  Download a PDF
                </span>
              </span>
            )}
            {downloadBtn && (
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  marginTop:5
                }}
                onClick={() => {
                  downloadDocs();
                }}
              >
                <img
                  src={docxIcon}
                  className="responsive-image"
                  style={{ marginRight: "1rem", width: 25, height: 25 }}
                />
                <span style={{ marginRight: "2.5rem", width: "100%" }}>
                  {" "}
                  Download a Docs
                </span>
              </span>
            )}
            {downloadBtn && (
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  marginTop:5
                }}
                onClick={() => {
                  sendToEmail();
                }}
              >
                <img
                  src={emailIcon}
                  className="responsive-image"
                  style={{ marginRight: "1rem", width: 20, height: 20 }}
                />
                <span style={{ width: "100%" }}> Send to Email</span>
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
