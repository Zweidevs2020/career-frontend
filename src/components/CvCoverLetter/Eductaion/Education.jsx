import React, { useState, useEffect } from "react";
import { Form, Button, DatePicker, Checkbox, Select, message } from "antd";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";
import { PlusCircleOutlined } from "@ant-design/icons";
import "./Education.css";
import { Input } from "antd";
import {
  postApiWithAuth,
  getApiWithAuth,
  deleteApiWithAuth,
} from "../../../utils/api";
import Delete from "../../../assets/delete.png";
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";
import axios from "axios";
import { API_URL } from "../../../utils/constants";
import moment from "moment";

const Education = ({ setCurrent, current }) => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [educationArray, setEducationArray] = useState([]);
  const [resultArrayData, setResultArrayData] = useState([]);
  const [savedTotalStep, setSavedTotalStep] = useState();
  const [isCheck, setIsCheck] = useState(true);
  const [nextBtn, setNextBtn] = useState(false);
  const [userData, setUserData] = useState({});
  const [isCurrentCheck, setIsCurrentCheck] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [subjectCount, setSubjectCount] = useState(0);
  const [educationCount, setEducationCount] = useState(0);

  const { Option } = Select;

  const handleGetApi = async () => {
    const response = await getApiWithAuth(API_URL.GETEDUCATION);
   

    setSubjectCount(response.data.data['junior_data'].length)
    setEducationCount(response.data.data['education_data'].length)
    if (response.data?.status === 200) {
      setData(response.data.data);
    } else {
      message.error("Fail to load Data");
    }
  };

  useEffect(() => {
    handleGetApi();
  }, []);

  useEffect(() => {
    if (data !== null) {
      if (data.education_data.length > 0) {
        setEducationArray(
          data.education_data.map((item, indexx) => {
            return {
              index: indexx,
              dataValue: item,
              setIndex: indexx,
            };
          })
        );
      } else {
        setEducationArray([
          {
            index: 0,
            dataValue: {
              id: null,
              school: "",
              year: dayjs().format("MM/YYYY"),
              examtaken: "",
              enddate: dayjs(dayjs()).format("DD-MM-YYYY"),
              present: false,
            },
          },
        ]);
      }
      if (data.junior_data.length > 0) {
        setResultArrayData(
          data.junior_data.map((item, indexx) => {
            return {
              index: indexx,
              dataValue: item,
            };
          })
        );
      } else {
        setResultArrayData([
          {
            index: 0,
            dataValue: {
              id: null,
              subject: "",
              level: "",
              result: "",
            },
          },
        ]);
      }
    }
  }, [data]);

  const levelArray = [
    { label: "Common", value: "1" },
    { label: "Higher", value: "2" },
    { label: "Ordinary", value: "3" },
  ];

  const resultArray = [
    { label: "HIGHER MERIT", value: "1" },
    { label: "MERIT", value: "2" },
    { label: "ACHIEVED", value: "3" },
    { label: "PARTIALLY ACHIEVED", value: "4" },
    { label: "NOT GRADED", value: "5" },
  ];

  const onsubmit = async () => {

    let sendDaata = {};
    let data = createArrayData(educationArray);
    let resData = createArrayData(resultArrayData);

    !isCheck
      ? (sendDaata = { education_data: data, junior_data: [] })
      : (sendDaata = { education_data: data, junior_data: resData });
    console.log("ending date", sendDaata)
    const respose = await postApiWithAuth(API_URL.POSTEDUCATION, sendDaata);
    if (respose.data.status === 201) {
      setSubjectCount(subjectCount + 1);
      setCurrent(current + 1);
    } else {
      message.error(respose.data.message);
    }
  };

  const prev = () => {
    if (current != 1) setCurrent(current - 1);
  };

  const createArrayData = (data) => {
    let array = [];
    data.map((item) => {
      array.push(item.dataValue);
    });

    return array;
  };
  const onChangeHandle = (e, arrayIndex, type) => {
    const { name, value } = e.target;

    if (type === 1) {
      setEducationArray(
        educationArray.map((item) => {
          return item.index === arrayIndex
            ? { ...item, dataValue: { ...item.dataValue, [name]: value } }
            : item;
        })
      );
    } else {
      setResultArrayData(
        resultArrayData.map((item) => {
          return item.index === arrayIndex
            ? { ...item, dataValue: { ...item.dataValue, [name]: value } }
            : item;
        })
      );
    }
  };
  const onChangeDate = (name, date, arrayIndex) => {
    console.log("date chnage", name, date, arrayIndex);
    if (name === "enddate") {
      if (dayjs(date, "DD-MM-YYYY").isAfter(dayjs())) {
        message.error("End date cannot be in future");
        return;
      } else {
        setEducationArray(
          educationArray.map((item) => {
            return item.index === arrayIndex
              ? { ...item, dataValue: { ...item.dataValue, [name]: date } }
              : item;
          })
        );
      }
    } else if (name === "year") {
      if (dayjs(date, "MM/YYYY").isAfter(dayjs())) {
        message.error("Start date cannot be in future.");
        return;
      } else {
        setEducationArray(
          educationArray.map((item) => {
            return item.index === arrayIndex
              ? { ...item, dataValue: { ...item.dataValue, [name]: date } }
              : item;
          })
        );
      }
    }
  };


  const handleChange = (value, name, arrayIndex) => {
    setResultArrayData(
      resultArrayData.map((item) => {
        return item.index === arrayIndex
          ? { ...item, dataValue: { ...item.dataValue, [name]: value } }
          : item;
      })
    );
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


  const getUserData = async () => {
    const response = await getApiWithAuth(API_URL.GETUSER2);
    console.log("useddd data", response)
    if (response.data.status === 200) {
      if (response.data.data["current_step"] > 1) {
        setNextBtn(true)
        setSavedTotalStep(response.data.data["current_step"])
      }
      setUserData(response.data.data);
      if (response.data.data.cv_completed === true) {
        setDownloadBtn(true);
      }
    }
    if (response.data.data.current_step !== 2) {
      setIsInputDisabled(true);
    } else {
      setIsInputDisabled(false);
    }
  };
  const edit = () => {
    setIsInputDisabled(false);
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => { }, [educationArray]);


  const handleNextClick = () => {
    if (savedTotalStep >= current) {
      setCurrent(current + 1);
      navigate(`?step=${current + 1}`);
    }
  };
  const disabledDate = current => {
    const today = dayjs().startOf('day');
    
    return current < today;
  };

  const educationItems = (item, index) => {
    return (
      <>
        <div className="eduFormDouble" key={index} style={{ marginTop: "3%" }}>
          <div className="eduFormDoubleItem">
            <Form.Item
              label="Place of Study"
              name={`school ${index}`}
              className="eduItemLable"
              rules={[
                {
                  required: item?.dataValue.school ? false : true,
                  message: "Please input your school!",
                },
              ]}>
              <MyCareerGuidanceInputField
                placeholder="e.g School Name"
                type="input"
                name="school"
                onChange={(event) => onChangeHandle(event, index, 1)}
                inputValue={item?.dataValue.school}
                isPrefix={true}
              // disabled={isInputDisabled}
              />
            </Form.Item>
          </div>
          <div className="expFormDoubleItem">
            <Form.Item
              name={`year ${index}`}
              label="Start Date"
              className="eduItemLable"
              rules={[
                {
                  required: item?.dataValue.year ? false : true,
                  message: "Please input Month/year!",
                },
              ]}>
              <DatePicker
                picker="month"
                onChange={(date, dateString) =>
                  onChangeDate("year", dateString, index)
                }
                name="year"
                format={"MM/YYYY"}
                value={dayjs(item?.dataValue.year, "MM/YYYY")}
                defaultValue={dayjs(item?.dataValue.year, "MM/YYYY")}
                className="expDateInputFieldStyle"
              // disabled={isInputDisabled}
              />
            </Form.Item>
          </div>
        </div>

        <div className="eduFormDouble">
          <div className="eduFormDoubleItem">
            <Form.Item
              label="Exam Taken"
              name={`examtaken ${index}`}
              className="eduItemLable"
              rules={[
                {
                  required: item?.dataValue.examtaken ? false : true,
                  message: "Please input your Exam!",
                },
              ]}>
              <MyCareerGuidanceInputField
                placeholder="Exam Taken"
                type="input"
                name="examtaken"
                onChange={(event) => onChangeHandle(event, index, 1)}
                inputValue={item?.dataValue.examtaken}
                isPrefix={true}
              // disabled={isInputDisabled}
              />
            </Form.Item>
          </div>
          <div className="expFormDoubleItem">
            <Form.Item
              label="End Date"
              name={`enddate ${index}`}
              className="expItemLable"
              rules={[
                {
                  required: item?.dataValue.enddate ? false : true,
                  message: "Please input end Date!",
                },
              ]}>
              <DatePicker
                onChange={(date, dateString) =>
                  onChangeDate("enddate", dateString, index)
                }
                format={"DD-MM-YYYY"}

                value={
                  item?.dataValue.present 
                    ? dayjs().format("DD-MM-YYYY") 
                    : dayjs(item?.dataValue.enddate, "DD-MM-YYYY") 
                }
             
                defaultValue={dayjs(item?.dataValue.enddate, "DD-MM-YYYY")}
                disabled={item?.dataValue.present }
               
                className="expDateInputFieldStyle"
              />
            </Form.Item>
            <div>
              <Checkbox
                className="expCheckBox"
                name="present"
                inputValue={item?.dataValue?.present}
                // disabled={isInputDisabled}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setEducationArray((prevArray) =>
                    prevArray.map((educationItem) =>
                      educationItem.index === item.index
                        ? {
                          ...educationItem,
                          dataValue: {
                            ...educationItem.dataValue,
                            present: e.target.checked,
                            enddate: isChecked ? dayjs().format("DD-MM-YYYY") : educationItem.dataValue.enddate,
                          },
                        }
                        : educationItem
                    )
                  );
                  setIsCurrentCheck(!isCurrentCheck);
                }}>
                I'm still studying here
              </Checkbox>

              <div className="mainContainerDelete">
                {educationCount > 1 && index > 0 && (
                  <img
                    className="deleteSubject"
                    src={Delete}
                    onClick={() => handleDeleteEducation(item.dataValue.id)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  const handleDeleteEducation = async (id) => {
    try {
      setEducationArray((prevArray) =>
        prevArray.filter((item) => item.dataValue.id !== id)
      );
      const response = await deleteApiWithAuth(`${API_URL.DELETE}/${id}/`);
      if (response.data.status === 204) {
        message.success("Education entry deleted successfully.");
      } else {
        message.error("Failed to delete the education entry.");
        setEducationArray((prevArray) => [
          ...prevArray,
          educationArray.find((item) => item.dataValue.id === id),
        ]);
      }
    } catch (error) {
      console.error("Error deleting the education entry:", error);
      message.error("An error occurred while deleting the education entry.");
      setEducationArray((prevArray) => [
        ...prevArray,
        educationArray.find((item) => item.dataValue.id === id),
      ]);
    }
  };

  const handleDeleteJuniorCert = async (id) => {
    try {
      setResultArrayData((prevArray) =>
        prevArray.filter((item) => item.dataValue.id !== id)
      );

      const response = await deleteApiWithAuth(
        `${API_URL.DELETE_RESULT}/${id}/`
      );

      if (response.data.status === 204) {
        message.success("Junior Cert entry deleted successfully.");
        setSubjectCount(subjectCount - 1);
      } else {
        message.error("Failed to delete the Junior Cert entry.");
        setResultArrayData((prevArray) => [
          ...prevArray,
          resultArrayData.find((item) => item.dataValue.id === id),
        ]);
      }
    } catch (error) {
      console.error("Error deleting the Junior Cert entry:", error);
      message.error("An error occurred while deleting the Junior Cert entry.");
      setResultArrayData((prevArray) => [
        ...prevArray,
        resultArrayData.find((item) => item.dataValue.id === id),
      ]);
    }
  };

  const educationResult = (item, index) => {
    return (
      <>
        <div className="eduFormDouble">
          <div className="eduFormDoubleItem mt-3">
            <Form.Item
              label="Subject"
              name={`subject ${index}`}
              className="eduItemLable"
              rules={[
                {
                  required: item?.dataValue.subject ? false : true,
                  message: "Please input your subject",
                },
              ]}>
              <MyCareerGuidanceInputField
                placeholder="e.g. Subject"
                type="input"
                name="subject"
                onChange={(event) => onChangeHandle(event, index, 2)}
                inputValue={item?.dataValue?.subject}
                isPrefix={true}
              // disabled={isInputDisabled}
              />
            </Form.Item>
          </div>
          <div className="expFormDoubleItem mt-3">
            <Form.Item
              label="Level"
              name={`level ${index}`}
              className="skillItemLable"
              rules={[
                {
                  required: item?.dataValue.level ? false : true,
                  message: "Please Select 1 Option",
                },
              ]}>
              <Select
                placeholder="Select Level"
                onChange={(event) => handleChange(event, "level", index)}
                optionLabelProp="label"
                className="eduSelect eduSelectItem"
                defaultValue={item?.dataValue?.level ? item?.dataValue?.level : null}
              // disabled={isInputDisabled}
              >
                {levelArray.map((item) => {
                  return (
                    <Option
                      value={item.value}
                      key={item.value}
                      label={item.label}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
        </div>

        <div className="expFormDoubleItem">
          <Form.Item
            defaultValue="Result"
            label="Result"
            name={`result ${index}`}
            className="skillItemLable"
            rules={[
              {
                required: item?.dataValue.result ? false : true,
                message: "Please Select 1 Option",
              },
            ]}>
            <Select
              placeholder="Select Result"
              onChange={(event) => handleChange(event, "result", index)}
              optionLabelProp="label"
              className="eduSelect eduSelectItem"

              defaultValue={item?.dataValue?.level ? item?.dataValue?.level : null}
            // disabled={isInputDisabled}>
            >
              {resultArray.map((item) => {

                return (
                  <Option
                    value={item.value}
                    key={item.value}
                    label={item.label}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

        </div>
        <div className="mainContainerDelete">
          {subjectCount > 1 && index > 0 && (
            <img
              className="deleteSubject"
              src={Delete}
              // disabled={isInputDisabled}
              onClick={() => handleDeleteJuniorCert(item.dataValue.id)}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex flex-col justify-center">
        <div>
          <h1 className="eduHead">Tell us about your Education</h1>
          <p className="eduSubHeading">
            Include every school, even if you're still there or didn't graduate.
          </p>
        </div>
        <div className="eduForm">
          <Form layout="vertical" onFinish={onsubmit}>
            {educationArray.length > 0
              ? educationArray.map((item, index) => {
                return educationItems(item, index);
              })
              : ""}

            <div>
              <Form.Item>
                <Button
                  className="eduAddButton"
                  onClick={() =>
                    setEducationArray((oldarr) => [
                      ...oldarr,
                      {
                        index: educationArray.length,
                        dataValue: {
                          id: null,
                          school: "",
                          year: dayjs().format("MM/YYYY"),
                          examtaken: "",
                          enddate: dayjs(dayjs())
                            .format("DD-MM-YYYY"),
                          present: false,
                        },
                      },
                    ])
                  }>
                  <span>
                    <PlusCircleOutlined
                      style={{
                        fontSize: "20px",
                        display: "flex",
                        alignItems: "center",
                        marginRight: "10px",
                        color: '#1476b7'
                      }}
                    />
                  </span>{" "}
                  <span style={{ color: '#1476b7' ,fontFamily:'Poppins'}}>Add Another Place of Study</span>
                </Button>
              </Form.Item>
            </div>

            <div className="eduJunDiv" style={{fontFamily:'Poppins'}}>Include Junior Cert Results *</div>
            <div className="eduJunCheckDiv">
              <Form.Item>
                <Checkbox
                  className="eduJunCheckBox"
                  // disabled={isInputDisabled}
                  checked={isCheck}
                  onChange={() => {
                    setIsCheck(!isCheck);
                  }}>
                  Yes
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Checkbox
                  className="eduJunCheckBox"
                  // disabled={isInputDisabled}
                  checked={!isCheck}
                  onChange={() => {
                    setIsCheck(!isCheck);
                  }}>
                  No
                </Checkbox>
              </Form.Item>
            </div>
            {isCheck && educationArray.length > 0 ? (
              <>
                {resultArrayData.map((item, index) => {
                  return educationResult(item, index);
                })}
                <div>
                  <Form.Item>
                    <Button
                      className="eduAddButton"
                      onClick={() =>
                        setResultArrayData((oldarr) => [
                          ...oldarr,
                          {
                            index: resultArrayData.length,
                            dataValue: {
                              id: null,
                              subject: "",
                              level: null,
                              result: "",
                            },
                          },
                        ])
                      }>
                      <span>
                        <PlusCircleOutlined
                          style={{
                            fontSize: "20px",
                            display: "flex",
                            alignItems: "center",
                            marginRight: "10px",
                            color: '#1476b7'
                          }}
                        />
                      </span>{" "}
                      <span style={{ color: "#1476b7",fontFamily:'Poppins' }}> Add Another Subject</span>
                    </Button>
                  </Form.Item>
                </div>
              </>
            ) : (
              ""
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mobileResposiveEducation">
              <div className="eduItemButton">
                <Button className="eduButtonBack me-3" type="primary" onClick={prev}>
                  Back
                </Button>
                {nextBtn && (<Button className="eduButtonNext me-3" type="primary" onClick={handleNextClick}>
                  Next
                </Button>)}
              </div>
              <div className="buttonEducation">

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

export default Education;
