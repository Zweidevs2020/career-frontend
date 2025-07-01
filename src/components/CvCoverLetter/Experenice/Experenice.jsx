import React, { useState, useEffect } from "react";
import {
  Select,
  Form,
  Button,
  Input,
  DatePicker,
  Checkbox,
  message,
} from "antd";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";
import "./Experenice.css";
import { DeleteColumnOutlined, PlusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  deleteApiWithAuth,
  getApiWithAuth,
  postApiWithAuth,
} from "../../../utils/api";
import Delete from "../../../assets/delete.png";
import { API_URL } from "../../../utils/constants";

const { TextArea } = Input;
const { Option } = Select;

const Experenice = ({ setCurrent, current }) => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [expereniceArray, setExpereniceArray] = useState([]);
  const [savedTotalStep, setSavedTotalStep] = useState();
  const [isCurrentCheck, setIsCurrentCheck] = useState(false);
  const [nextBtn, setNextBtn] = useState(false);
  const [userData, setUserData] = useState({});
  const [isInputDisabled, setIsInputDisabled] = useState(true);

  const getExperiance = async () => {
    const response = await getApiWithAuth(API_URL.GETEXPERIANCE);
    if (response.data?.status === 200) {
      setData(response.data.data);
    } else {
      message.error("Fail to load Data");
    }
  };

  useEffect(() => {
    getExperiance();
  }, []);

  const titleArray = [
    { label: "Assistant", value: "1" },
    { label: "Work Shadow", value: "2" },
    { label: "Other", value: "3" },
  ];
  useEffect(() => {
    if (data !== null) {
      if (data.length > 0) {
        setExpereniceArray(
          data.map((item, indexx) => {
            return {
              index: indexx,
              dataValue: item,
            };
          })
        );
      } else {
        setExpereniceArray([
          {
            index: 0,
            dataValue: {
              id: null,
              job_title: "",
              company: "",
              country: "",
              city: "",
              startdate: dayjs(dayjs()).subtract(1, "day").format("DD-MM-YYYY"),
              enddate: dayjs().format("DD-MM-YYYY"),
              description: "",
              is_current_work: false,
            },
          },
        ]);
      }
    }
  }, [data]);

  const onSubmit = async () => {
    let data = createArrayData(expereniceArray);
    const respose = await postApiWithAuth(API_URL.POSTEXPERIANCE, data);

    if (respose.data.status === 201) {
      setCurrent(current + 1);
    } else {
      message.error(respose.data.message);
    }
  };

  const edit = () => {
    setIsInputDisabled(false);
  };

  const createArrayData = (data) => {
    let array = [];
    data.map((item) => {
      array.push(item.dataValue);
    });

    return array;
  };
  const prev = () => {
    if (current !== 1) setCurrent(current - 1);
  };

  const onChangeHandle = (e, arrayIndex) => {
    const { name, value } = e.target;
    setExpereniceArray(
      expereniceArray.map((item) => {
        return item.index === arrayIndex
          ? { ...item, dataValue: { ...item.dataValue, [name]: value } }
          : item;
      })
    );
  };
  const handleChange = (value, name, arrayIndex) => {
    setExpereniceArray(
      expereniceArray.map((item) => {
        return item.index === arrayIndex
          ? { ...item, dataValue: { ...item.dataValue, [name]: value } }
          : item;
      })
    );
  };
  const onChangeDate = (name, date, arrayIndex) => {
    if (name === "enddate") {
      if (dayjs(date, "DD-MM-YYYY").isAfter(dayjs())) {
        message.error("End date cannot be in the future.");
        return;
      }
    }

    setExpereniceArray(
      expereniceArray.map((item) => {
        return item.index === arrayIndex
          ? { ...item, dataValue: { ...item.dataValue, [name]: date } }
          : item;
      })
    );
  };

  const SavePdf = async (e) => {
    e.preventDefault();
    var token = localStorage.getItem("access_token", "");

    const response = await axios.get(
      `${'https://api-dev.classroomguidance.ie/'}cv/cv/`,
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
    if (response.data.status === 200) {
      if (response.data.data["current_step"] > 1) {
        setNextBtn(true);
        setSavedTotalStep(response.data.data["current_step"]);
      }
      setUserData(response.data.data);
      if (response.data.data.current_step !== 3) {
        setIsInputDisabled(true);
      } else {
        setIsInputDisabled(false);
      }
      if (response.data.data.cv_completed === true) {
        setDownloadBtn(true);
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  const handleDeleteExperience = async (id) => {
    try {
      setExpereniceArray((prevArray) =>
        prevArray.filter((item) => item.dataValue.id !== id)
      );

      const response = await deleteApiWithAuth(
        `${API_URL.DELETE_EXPERIENCE}/${id}/`
      );

      if (response.data.status === 204) {
        message.success("Experience entry deleted successfully.");
      } else {
        message.error("Failed to delete the experience entry.");
        setExpereniceArray((prevArray) => [
          ...prevArray,
          expereniceArray.find((item) => item.dataValue.id === id),
        ]);
      }
    } catch (error) {
      console.error("Error deleting the experience entry:", error);
      message.error("An error occurred while deleting the experience entry.");
      setExpereniceArray((prevArray) => [
        ...prevArray,
        expereniceArray.find((item) => item.dataValue.id === id),
      ]);
    }
  };
  const handleNextClick = () => {
    if (savedTotalStep >= current) {
      setCurrent(current + 1);
      navigate(`?step=${current + 1}`);
    }
  };
  const disabledDate = (current) => {
    const today = dayjs().startOf("day");

    return current < today;
  };

  return (
    <>
      <div className="flex flex-col justify-center">
        <div>
          <h1 className="expHead">Tell us about your most recent job</h1>
          <p className="expSubHeading">We’ll start there and work backward.</p>
        </div>
        <div className="expForm">
          <Form layout="vertical" onFinish={onSubmit}>
            {expereniceArray.map((item, index) => {
              return (
                <>
                  <div
                    key={index}
                    className="expFormDouble"
                    style={{ marginTop: "3%" }}
                  >
                    <div className="expFormDoubleItem">
                      <Form.Item
                        label="Job Title"
                        name={`job_title ${index}`}
                        className="expItemLable"
                        rules={[
                          {
                            required: item?.dataValue.job_title ? false : true,
                            message: "Please input Job Title!",
                          },
                        ]}
                      >
                        <MyCareerGuidanceInputField
                          placeholder={
                            item?.dataValue?.job_title ||
                            "e.g Retail Sales Associate"
                          }
                          type="input"
                          name="job_title"
                          onChange={(event) => onChangeHandle(event, index)}
                          inputValue={item?.dataValue?.job_title}
                          isPrefix={true}
                          // disabled={isInputDisabled}
                        />
                      </Form.Item>
                    </div>
                    <div className="expFormDoubleItem">
                      <Form.Item
                        label="Company Name"
                        name={`company ${index}`}
                        className="expItemLable"
                        rules={[
                          {
                            required: item?.dataValue.company ? false : true,
                            message: "Please input Company Name!",
                          },
                        ]}
                      >
                        <MyCareerGuidanceInputField
                          placeholder={"e.g H&M"}
                          type="input"
                          name="company"
                          onChange={(event) => onChangeHandle(event, index)}
                          inputValue={item?.dataValue?.company}
                          isPrefix={true}
                          // disabled={isInputDisabled}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="expFormDouble">
                    <div className="expFormDoubleItem">
                      <Form.Item
                        label="Town/Area"
                        name={`city ${index}`}
                        className="expItemLable"
                        rules={[
                          {
                            required: item?.dataValue.city ? false : true,
                            message: "Please input City!",
                          },
                        ]}
                      >
                        <MyCareerGuidanceInputField
                          placeholder="Town/Area/City"
                          type="input"
                          name="city"
                          onChange={(event) => onChangeHandle(event, index)}
                          inputValue={item?.dataValue.city}
                          isPrefix={true}
                          // disabled={isInputDisabled}
                        />
                      </Form.Item>
                    </div>
                    <div className="expFormDoubleItem">
                      <Form.Item
                        label="County"
                        name={`country ${index}`}
                        className="expItemLable"
                        rules={[
                          {
                            required: item?.dataValue.country ? false : true,
                            message: "Please input Country!",
                          },
                        ]}
                      >
                        <MyCareerGuidanceInputField
                          placeholder="Dublin"
                          type="input"
                          name="country"
                          onChange={(event) => onChangeHandle(event, index)}
                          inputValue={item?.dataValue?.country}
                          isPrefix={true}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="expFormDouble">
                    <div className="expFormDoubleItem">
                      <Form.Item
                        label="Start Date"
                        name={`startdate ${index}`}
                        className="expItemLable"
                        rules={[
                          {
                            required: item?.dataValue.startdate ? false : true,
                            message: "Please input start Date!",
                          },
                        ]}
                      >
                        <DatePicker
                          onChange={(date, dateString) =>
                            onChangeDate("startdate", dateString, index)
                          }
                          format={"DD-MM-YYYY"}
                          disabledDate={(current) => {
                            let customDate = dayjs().format("DD-MM-YYYY");
                            return (
                              current &&
                              current > dayjs(customDate, "DD-MM-YYYY")
                            );
                          }}
                          value={
                            item?.dataValue.present
                              ? dayjs().format("DD-MM-YYYY")
                              : dayjs(item?.dataValue.startdate, "DD-MM-YYYY")
                          }
                          defaultValue={dayjs(
                            item?.dataValue.startdate,
                            "DD-MM-YYYY"
                          )}
                          className="expDateInputFieldStyle"
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
                        ]}
                      >
                        <DatePicker
                          onChange={(date, dateString) =>
                            onChangeDate("enddate", dateString, index)
                          }
                          format={"DD-MM-YYYY"}
                          // disabledDate={(current) => {
                          //   let customDate = item.dataValue.startdate;
                          //   return (
                          //     current &&
                          //     current < dayjs(customDate, "DD-MM-YYYY")
                          //   );
                          // }}
                          disabled={item?.dataValue.is_current_work}
                          disabledDate={(current) => {
                            let customDate = dayjs().format("DD-MM-YYYY");
                            return (
                              (current &&
                                current > dayjs(customDate, "DD-MM-YYYY")) ||
                              current <
                                dayjs(item.dataValue.startdate, "DD-MM-YYYY")
                            );
                          }}
                          value={
                            item?.dataValue.present
                              ? dayjs().format("DD-MM-YYYY")
                              : dayjs(item?.dataValue.enddate, "DD-MM-YYYY")
                          }
                          defaultValue={dayjs(
                            item?.dataValue.enddate,
                            "DD-MM-YYYY"
                          )}
                          className="expDateInputFieldStyle"
                        />
                      </Form.Item>

                      <div>
                        <Checkbox
                          className="expCheckBox"
                          name="is_current_work"
                          inputValue={item?.dataValue?.is_current_work}
                          onChange={(e) => {
                            setExpereniceArray(
                              expereniceArray.map((item) => {
                                return item.index === index
                                  ? {
                                      ...item,
                                      dataValue: {
                                        ...item.dataValue,
                                        is_current_work: e.target.checked,
                                      },
                                    }
                                  : item;
                              })
                            );
                            setIsCurrentCheck(!isCurrentCheck);
                          }}
                        >
                          I am currently working here
                        </Checkbox>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Form.Item
                      label="Description"
                      name={`description ${index}`}
                      className="expItemLable"
                      rules={[
                        {
                          required: item?.dataValue.description ? false : true,
                          message: "Please input your Description!",
                        },
                      ]}
                    >
                      <TextArea
                        rows={4}
                        placeholder="Add Description"
                        name="description"
                        className="inputFieldStyle"
                        defaultValue={item?.dataValue?.description}
                        onChange={(event) => onChangeHandle(event, index)}
                        // disabled={isInputDisabled}
                      />
                    </Form.Item>
                    <div className="mainContainerDelete">
                      <img
                        className="deleteSubject"
                        src={Delete}
                        onClick={() =>
                          handleDeleteExperience(item.dataValue.id)
                        }
                      />
                    </div>
                  </div>
                </>
              );
            })}

            <div>
              <Form.Item>
                <Button
                  className="expAddButton"
                  onClick={() =>
                    setExpereniceArray((oldarr) => [
                      ...oldarr,
                      {
                        index: expereniceArray.length,
                        dataValue: {
                          id: null,
                          job_title: "",
                          company: "",
                          country: "",
                          city: "",
                          startdate: dayjs(dayjs())
                            .subtract(1, "day")
                            .format("DD-MM-YYYY"),
                          enddate: dayjs().format("DD-MM-YYYY"),
                          description: "",
                          is_current_work: false,
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
                    Add Another Position
                  </span>
                </Button>
              </Form.Item>
            </div>

            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="mobileLayout"
            >
              <div className="expItemButton">
                <Form.Item>
                  <Button
                    className="expButtonBack me-3"
                    type="primary"
                    onClick={prev}
                  >
                    Back
                  </Button>
                </Form.Item>
                {nextBtn && (
                  <Form.Item>
                    <Button
                      className="expButtonNext me-3"
                      type="primary"
                      onClick={handleNextClick}
                    >
                      Next
                    </Button>
                  </Form.Item>
                )}
              </div>
              <Form.Item>
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
                    className="expButton"
                    type="primary"
                    htmlType="submit"
                    // disabled={isInputDisabled}
                  >
                    Save
                  </Button>
                </div>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Experenice;
