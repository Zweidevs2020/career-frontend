import React, { useState, useEffect } from "react";
import { Form, Button, DatePicker, Checkbox, Select } from "antd";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";
import { PlusCircleOutlined } from "@ant-design/icons";
import "./Education.css";
import { postApiWithAuth } from "../../../utils/api";
import { API_URL } from "../../../utils/constants";

const Education = ({ setCurrent, current }) => {
  const [educationData, setEducationData] = useState({});
  const [educationArray, setEducationArray] = useState([
    {
      index: 0,
      dataValue: {
        school: "",
        year: "",
        examtaken: "",
      },
    },
  ]);
  const [resultData, setResultData] = useState({});
  const [resultArrayData, setResultArrayData] = useState([
    {
      index: 0,
      dataValue: {
        subject: "",
        level: "",
        result: "",
      },
    },
  ]);
  const [index, setIndex] = useState(0);
  const [resultIndex, setResultIndex] = useState(0);
  const [isCheck, setIsCheck] = useState(true);
  const { Option } = Select;

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
    let data = createArrayData(educationArray);
    let resData = createArrayData(resultArrayData);
    const resp = await postApiWithAuth(API_URL.POSTEDU, data);
    console.log(resp);
    const resResult = await postApiWithAuth(API_URL.POSTJUN, resData);
    console.log(resResult);

    //setCurrent(current + 1);
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
      setIndex(arrayIndex);
      setEducationData({ ...educationData, [name]: value });
    } else {
      setResultIndex(arrayIndex);
      setResultData({ ...resultData, [name]: value });
    }
  };
  const onChangeDate = (name, date, dateString) => {
    setEducationData({ ...educationData, [name]: dateString });
  };

  const handleChange = (value, type) => {
    setResultData({ ...resultData, [type]: value });
  };

  useEffect(() => {
    if (Object.keys(educationData).length > 0) {
      let filterData = educationArray.filter((item) => item.index !== index);
      filterData.push({
        index: index,
        dataValue: educationData,
      });
      setEducationArray(filterData);
    }
  }, [educationData]);

  useEffect(() => {
    console.log(resultData);
    if (Object.keys(resultData).length > 0) {
      let filterData = resultArrayData.filter(
        (item) => item.index !== resultIndex
      );
      filterData.push({
        index: resultIndex,
        dataValue: resultData,
      });
      setResultArrayData(filterData);
    }
  }, [resultData]);

  const educationItems = (item, index) => {
    return (
      <>
        <div className="eduFormDouble" style={{ marginTop: "3%" }}>
          <div className="eduFormDoubleItem">
            <Form.Item
              label="School Name"
              name="school"
              className="eduItemLable"
              rules={[{ required: true, message: "Please input your school!" }]}
            >
              <MyCareerGuidanceInputField
                placeholder="e.g School Name"
                type="input"
                name="school"
                onChange={(event) => onChangeHandle(event, index, 1)}
                inputValue={item?.school}
                isPrefix={false}
              />
            </Form.Item>
          </div>
          <div className="expFormDoubleItem">
            <Form.Item
              label="Month/year"
              name="year"
              className="eduItemLable"
              rules={[
                {
                  required: true,
                  message: "Please input Month/year!",
                },
              ]}
            >
              <DatePicker
                picker="month"
                onChange={(date, dateString) =>
                  onChangeDate("year", date, dateString)
                }
                format={"MM/YYYY"}
                className="expDateInputFieldStyle"
              />
            </Form.Item>
          </div>
        </div>

        <div className="eduFormDouble">
          <div className="eduFormDoubleItem">
            <Form.Item
              label="Exam Taken"
              name="examtaken"
              className="eduItemLable"
              rules={[{ required: true, message: "Please input your school!" }]}
            >
              <MyCareerGuidanceInputField
                placeholder="Exam Taken"
                type="input"
                name="examtaken"
                onChange={(event) => onChangeHandle(event, index, 1)}
                inputValue={item?.examtaken}
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
          <div className="eduFormDoubleItem">
            <Form.Item
              label="Subject"
              name="subject"
              className="eduItemLable"
              rules={[{ required: true, message: "Please input your school!" }]}
            >
              <MyCareerGuidanceInputField
                placeholder="e.g. Subject"
                type="input"
                name="subject"
                onChange={(event) => onChangeHandle(event, index, 2)}
                inputValue={item.subject}
                isPrefix={false}
              />
            </Form.Item>
          </div>
          <div className="expFormDoubleItem">
            <Form.Item
              label="Level"
              name="level"
              className="skillItemLable"
              rules={[
                {
                  required: true,
                  message: "Please Select 1 Option",
                },
              ]}
            >
              <Select
                placeholder="Select"
                onChange={(event) => handleChange(event, "level")}
                optionLabelProp="label"
                className="eduSelect eduSelectItem"
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
            name="result"
            className="skillItemLable"
            rules={[
              {
                required: true,
                message: "Please Select 1 Option",
              },
            ]}
          >
            <Select
              placeholder="Select"
              onChange={(event) => handleChange(event, "result")}
              optionLabelProp="label"
              className="eduSelect eduSelectItem"
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

  useEffect(() => {
    console.log("array result", educationArray, resultArrayData);
  }, [educationArray, resultArrayData]);

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
                        index: index + 1,
                        dataValue: {
                          school: "",
                          year: "",
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
                            index: resultIndex + 1,
                            dataValue: {
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
