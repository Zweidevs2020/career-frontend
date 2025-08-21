import React, { useState, useEffect } from "react";
import { Form, Select, Button, message } from "antd";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";
import "./Reference.css";
import {
  deleteApiWithAuth,
  getApiWithAuth,
  postApiWithAuth,
} from "../../../utils/api";
import { API_URL } from "../../../utils/constants";
import { useNavigate, useLocation } from "react-router-dom";
import Delete from "../../../assets/delete.png";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const Reference = ({ setCurrent, current, downloadDocs }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [referArray, setReferArray] = useState([]);
  const [userData, setUserData] = useState({});
  const [referenceCount, setReferenceCount] = useState(0);
  const { Option } = Select;

  const handleGetApi = async () => {
    const response = await getApiWithAuth(API_URL.GETREFERANCE);

    if (response.data?.status === 200) {
      setData(response.data.data);
      setReferenceCount(response.data.data.length);
    } else {
      message.error("Fail to load Data");
    }
  };

  useEffect(() => {
    handleGetApi();
  }, []);
  useEffect(() => {
    if (data !== null) {
      if (data.length > 0) {
        setReferArray(
          data.map((item, indexx) => {
            return {
              index: indexx,
              dataValue: item,
            };
          })
        );
      } else {
        setReferArray([
          {
            index: 0,
            dataValue: {
              id: null,
              contact_number: "",
              email: "",
              name: "",
              position: "",
            },
          },
        ]);
      }
    }
  }, [data]);

  const onsubmit = async (e) => {
    e.preventDefault();
    let data = createArrayData(referArray);

    const respose = await postApiWithAuth(API_URL.POSTREFERNACE, data);

    if (respose.data.status === 201) {
      // setCurrent(1);
      message.success("Your CV is saved successfully");
      handleGetApi();
      getUserData();
    } else {
      message.error(respose.data.message);
    }
  };

  // const SavePdf = async (e) => {
  //   e.preventDefault();
  //   var token = localStorage.getItem("access_token", "");

  //   const response = await axios.get(
  //     `${'https://api.classroomguidance.ie/'}cv/cv/`,
  //     {
  //       responseType: "blob", // Set the response type to 'blob'
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Set the Authorization header
  //       },
  //     }
  //   );

  //   // Create a blob from the response data
  //   const pdfBlob = new Blob([response.data], { type: "application/pdf" });

  //   // Create a temporary URL for the blob
  //   const pdfUrl = URL.createObjectURL(pdfBlob);
  //   // Create a link and initiate the download
  //   const link = document.createElement("a");
  //   link.href = pdfUrl;
  //   link.download = `${userData.full_name}'s.pdf`; // Set the desired filename
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);

  //   // Clean up the temporary URL
  //   URL.revokeObjectURL(pdfUrl);
  // };
  const SavePdf = async (e) => {
    e.preventDefault();
    try {
      var token = localStorage.getItem("access_token", "");

      const response = await axios.get(
        `${'https://api.classroomguidance.ie/'}cv/doc-cv
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
      message.success(
        "Download initiated! Please choose a location to save the file."
      );
    } catch (error) {
      console.error("Error downloading document:", error);
      message.error("Failed to download document. Please try again.");
    }
  };
  const handleDeleteReference = async (id) => {
    try {
      setReferArray((prevArray) =>
        prevArray.filter((item) => item.dataValue.id !== id)
      );
      const response = await deleteApiWithAuth(
        `${API_URL.UPDATE_REFERENCE}/${id}/`
      );

      if (response.data.status === 204) {
        message.success("Reference entry deleted successfully.");
      } else {
        message.error("Failed to delete the reference entry.");
        setReferArray((prevArray) => [
          ...prevArray,
          referArray.find((item) => item.dataValue.id === id),
        ]);
      }
    } catch (error) {
      console.error("Error deleting the reference entry:", error);
      message.error("An error occurred while deleting the reference entry.");
      setReferArray((prevArray) => [
        ...prevArray,
        referArray.find((item) => item.dataValue.id === id),
      ]);
    }
  };

  const createArrayData = (data) => {
    let array = [];
    data.map((item) => {
      array.push(item.dataValue);
    });

    return array;
  };

  const prev = () => {
    if (current != 1) setCurrent(current - 1);
  };

  const handleChange = (value) => {
    let arr = [];
    for (let i = 0; i < value; i++) {
      arr.push({
        index: i,
        dataValue: {
          id: null,
          name: "",
          position: "",
          contact_number: "",
          email: "",
        },
      });
    }

    setReferArray(arr);
  };

  const onChangeHandleInput = (e, arrayIndex) => {
    const { name, value } = e.target;
    setReferArray(
      referArray.map((item) => {
        return item.index === arrayIndex
          ? { ...item, dataValue: { ...item.dataValue, [name]: value } }
          : item;
      })
    );
  };

  const referenceItems = (item, index) => {
    return (
      <>
        <div style={{ marginTop: "30px" }}>
          <div className="refFormEmail">
            <div className="refFormEmailItem">
              <Form.Item
                label="Name"
                name={`name ${index}`}
                className="refItemLable"
                rules={[
                  {
                    required: item?.dataValue.name ? false : true,
                    message: "Please input name!",
                  },
                ]}
              >
                <MyCareerGuidanceInputField
                  placeholder="Danial Brot"
                  type="input"
                  name="name"
                  onChange={(e) => onChangeHandleInput(e, index)}
                  inputValue={item?.dataValue?.name}
                  isPrefix={true}
                />
              </Form.Item>
            </div>
            <div className="refFormEmailItem">
              <Form.Item
                label="Position"
                name={`position ${index}`}
                className="refItemLable"
                rules={[
                  {
                    required: item?.dataValue.position ? false : true,
                    message: "Please input position!",
                  },
                ]}
                style={{ marginBottom: "20px" }}
              >
                <MyCareerGuidanceInputField
                  placeholder="e.g H&M"
                  type="input"
                  name="position"
                  onChange={(e) => onChangeHandleInput(e, index)}
                  inputValue={item?.dataValue?.position}
                  isPrefix={true}
                />
              </Form.Item>
            </div>
          </div>
          <div className="refFormEmail">
            <div className="refFormEmailItem">
              <Form.Item
                label="Contact Phone"
                name={`contact_number ${index}`}
                className="refItemLable"
                rules={[
                  {
                    required: item?.dataValue.contact_number ? false : true,
                    message: "Please input Contact!",
                  },
                ]}
              >
                <MyCareerGuidanceInputField
                  placeholder="+xx-xxx-xxx-xxxx"
                  type="input"
                  name="contact_number"
                  onChange={(e) => onChangeHandleInput(e, index)}
                  inputValue={item?.dataValue?.contact_number}
                  isPrefix={true}
                />
              </Form.Item>
            </div>
            <div className="refFormEmailItem">
              <Form.Item
                label="Contact Email"
                name={`email ${index}`}
                className="refItemLable"
                rules={[
                  {
                    required: item?.dataValue.email ? false : true,
                    message: "Please input Contact Email!",
                  },
                ]}
                style={{ marginBottom: "20px" }}
              >
                <MyCareerGuidanceInputField
                  placeholder="xyz@gmail.com"
                  type="email"
                  name="email"
                  onChange={(e) => onChangeHandleInput(e, index)}
                  inputValue={item?.dataValue?.email}
                  isPrefix={true}
                />
              </Form.Item>
            </div>
          </div>
          {referenceCount > 1 && index > 0 && (
            <div className="mainContainerDelete">
              <img
                className="deleteSubject"
                src={Delete}
                onClick={() => handleDeleteReference(item.dataValue.id)}
              />
            </div>
          )}
        </div>
      </>
    );
  };

  const getUserData = async () => {
    const response = await getApiWithAuth(API_URL.GETUSER2);
    if (response.data.status === 200) {
      setUserData(response.data.data);
      setDownloadBtn(response.data.data.cv_completed);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <>
      <div className="flex flex-col justify-center">
        <div>
          <h1 className="refHead">References</h1>
          <p className="refSubHeading">
            Add anything else you want employers to know.
          </p>
        </div>
        <div className="refForm">
          <Form layout="vertical" onFinish={onsubmit}>
            <div>
              {referArray.map((item, index) => {
                {
                  return referenceItems(item, index);
                }
              })}
            </div>
            <div>
              <Form.Item>
                <Button
                  className="expAddButton"
                  onClick={() =>
                    setReferArray((oldarr) => [
                      ...oldarr,
                      {
                        index: referArray.length,
                        dataValue: {
                          id: null,
                          contact_number: "",
                          email: "",
                          name: "",
                          position: "",
                        },
                      },
                    ])
                  }
                >
                  <span>
                    <PlusCircleOutlined
                      style={{
                        fontSize: "20px",
                        display: "flex",
                        alignItems: "center",
                        marginRight: "10px",
                        color: "#1476b7",
                      }}
                    />
                  </span>{" "}
                  <span style={{ color: "#1476b7", fontFamily: "Poppins" }}>
                    Add Another Referee
                  </span>
                </Button>
              </Form.Item>
            </div>
            <div className="skillsItemButton">
              <Form.Item>
                <Button
                  className="skillsButtonBack"
                  type="primary"
                  onClick={prev}
                >
                  Back
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  className={"skillsButton me-3 "}
                  type="primary"
                  disabled={!downloadBtn}
                  htmlType="submit"
                  onClick={(e) => SavePdf(e)}
                >
                  Download CV
                </Button>
                <Button
                  className="skillsButton"
                  type="primary"
                  htmlType="submit"
                  onClick={(e) => onsubmit(e)}
                >
                  Save
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Reference;
