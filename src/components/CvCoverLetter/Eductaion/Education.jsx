import React, { useState, useEffect } from "react";
import { Form, Button, DatePicker, Checkbox, Select,message } from "antd";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";
import { PlusCircleOutlined } from "@ant-design/icons";
import "./Education.css";
import { postApiWithAuth, getApiWithAuth } from "../../../utils/api";
import { API_URL } from "../../../utils/constants";
import dayjs from "dayjs";

const Education = ({ setCurrent, current }) => {
  const [data, setData] = useState(null);

  const [educationArray, setEducationArray] = useState([]);
  const [resultArrayData, setResultArrayData] = useState([]);
  const [isCheck, setIsCheck] = useState(true);
  const { Option } = Select;

  const handleGetApi = async () => {
    const response = await getApiWithAuth(API_URL.GETEDUCATION);
    if (response.data?.status === 200) {
      setData(response.data.data);
    }
    else{
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
      ? (sendDaata = { education_data: data,junior_data: [] })
      : (sendDaata = { education_data: data, junior_data: resData });

    const respose = await postApiWithAuth(API_URL.POSTEDUCATION, sendDaata);
    if (respose.data.status === 201) {
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
    setEducationArray(
      educationArray.map((item) => {
        return item.index === arrayIndex
          ? { ...item, dataValue: { ...item.dataValue, [name]: date } }
          : item;
      })
    );
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

  const educationItems = (item, index) => {
    return (
      <>
        <div className="eduFormDouble" key={index} style={{ marginTop: "3%" }}>
          <div className="eduFormDoubleItem">
            <Form.Item
              label="School Name"
              name={`school ${index}`}
              className="eduItemLable"
              rules={[
                {
                  required: item?.dataValue.school ? false : true,
                  message: "Please input your school!",
                },
              ]}
            >
              <MyCareerGuidanceInputField
                placeholder="e.g School Name"
                type="input"
                name="school"
                onChange={(event) => onChangeHandle(event, index, 1)}
                inputValue={item?.dataValue.school}
                isPrefix={false}
              />
            </Form.Item>
          </div>
          <div className="expFormDoubleItem">
            <Form.Item
              name={`year ${index}`}
              label="Month/year"
              className="eduItemLable"
              rules={[
                {
                  required: item?.dataValue.year ? false : true,
                  message: "Please input Month/year!",
                },
              ]}
            >
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
              ]}
            >
              <MyCareerGuidanceInputField
                placeholder="Exam Taken"
                type="input"
                name="examtaken"
                onChange={(event) => onChangeHandle(event, index, 1)}
                inputValue={item?.dataValue.examtaken}
                isPrefix={false}
              />
            </Form.Item>
          </div>
        </div>
      </>
    );
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
              ]}
            >
              <MyCareerGuidanceInputField
                placeholder="e.g. Subject"
                type="input"
                name="subject"
                onChange={(event) => onChangeHandle(event, index, 2)}
                inputValue={item?.dataValue?.subject}
                isPrefix={false}
              />
            </Form.Item>
          </div>
          <div className="expFormDoubleItem">
            <Form.Item
              label="Level"
              name={`level ${index}`}
              className="skillItemLable"
              rules={[
                {
                  required: item?.dataValue.level ? false : true,
                  message: "Please Select 1 Option",
                },
              ]}
            >
              <Select
                placeholder="Select"
                onChange={(event) => handleChange(event, "level", index)}
                optionLabelProp="label"
                className="eduSelect eduSelectItem"
                defaultValue={item?.dataValue?.level}
              >
                {levelArray.map((item) => {
                  return (
                    <Option
                      value={item.value}
                      key={item.value}
                      label={item.label}
                    >
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
            label="Result"
            name={`result ${index}`}
            className="skillItemLable"
            rules={[
              {
                required: item?.dataValue.result ? false : true,
                message: "Please Select 1 Option",
              },
            ]}
          >
            <Select
              placeholder="Select"
              onChange={(event) => handleChange(event, "result", index)}
              optionLabelProp="label"
              className="eduSelect eduSelectItem"
              defaultValue={item?.dataValue?.result}
            >
              {resultArray.map((item) => {
                return (
                  <Option
                    value={item.value}
                    key={item.value}
                    label={item.label}
                  >
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
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
                      }}
                    />
                  </span>{" "}
                  Add Another Education
                </Button>
              </Form.Item>
            </div>

            <div className="eduJunDiv">Include Junior Cert Results *</div>
            <div className="eduJunCheckDiv">
              <Form.Item>
                <Checkbox
                  className="eduJunCheckBox"
                  checked={isCheck}
                  onChange={() => {
                    setIsCheck(!isCheck);
                  }}
                >
                  Yes
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Checkbox
                  className="eduJunCheckBox"
                  checked={!isCheck}
                  onChange={() => {
                    setIsCheck(!isCheck);
                  }}
                >
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
                              level: "",
                              result: "",
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
                          }}
                        />
                      </span>{" "}
                      Add Another Result
                    </Button>
                  </Form.Item>
                </div>
              </>
            ) : (
              ""
            )}

            <div className="eduItemButton">
              <Form.Item>
                <Button className="eduButtonBack" type="primary" onClick={prev}>
                  BACK
                </Button>
              </Form.Item>

              <Form.Item>
                <Button className="eduButton" type="primary" htmlType="submit">
                  NEXT
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Education;
