import React, { useState, useEffect } from "react";
import { Form, Button, DatePicker, Select } from "antd";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";
import { PlusCircleOutlined } from "@ant-design/icons";
import "./Education.css";

const Education = ({ setCurrent, current }) => {
  const { Option } = Select;

  const [educationData, setEducationData] = useState({});
  const [educationArray, setEducationArray] = useState([
    {
      index: 0,
      dataValue: {
        schoolName: "",
        location: "",
        degree: "",
        field: "",
        gStartDate: "",
        gEndDate: "",
      },
    },
  ]);
  const [index, setIndex] = useState(0);

  const optionArray = [
    { label: "MS", value: "MS" },
    { label: "BS", value: "BS" },
    { label: "Intermediate", value: "Intermediate" },
  ];

  const onsubmit = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    if (current != 1) setCurrent(current - 1);
  };

  const onChangeHandle = (e, arrayIndex) => {
    const { name, value } = e.target;
    setIndex(arrayIndex);
    setEducationData({ ...educationData, [name]: value });
  };
  const onChangeDate = (name, date, dateString) => {
    setEducationData({ ...educationData, [name]: dateString });
  };

  const handleChange = (value) => {
    setEducationData({ ...educationData, degree: value });
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

  const educationItems = (item, index) => {
    return (
      <>
        <div className="eduFormDouble" style={{ marginTop: "3%" }}>
          <div className="eduFormDoubleItem">
            <Form.Item
              label="School Name"
              name="schoolName"
              className="eduItemLable"
              rules={[{ required: true, message: "Please input your school!" }]}
            >
              <MyCareerGuidanceInputField
                placeholder="e.g School Name"
                type="input"
                name="schoolName"
                onChange={(event) => onChangeHandle(event, index)}
                inputValue={item?.jobTitle}
                isPrefix={false}
              />
            </Form.Item>
          </div>
          <div className="expFormDoubleItem">
            <Form.Item
              label="School Location"
              name="location"
              className="eduItemLable"
              rules={[
                {
                  required: true,
                  message: "Please input your school location!",
                },
              ]}
            >
              <MyCareerGuidanceInputField
                placeholder="e.g Location"
                type="input"
                name="location"
                onChange={(event) => onChangeHandle(event, index)}
                inputValue={item?.location}
                isPrefix={false}
              />
            </Form.Item>
          </div>
        </div>

        <div className="eduFormDouble">
          <div className="eduFormDoubleItem">
            <Form.Item
              label="Degree"
              name="degree"
              className="eduItemLable"
              rules={[{ required: true, message: "Please select one option!" }]}
            >
              <Select
                placeholder="Select Option"
                onChange={handleChange}
                optionLabelProp="label"
              >
                {optionArray.map((item) => {
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
        <div className="eduFormDouble">
          <div style={{ width: "49%" }}>
            <Form.Item
              label="Field of Study"
              name="field"
              className="eduItemLable"
              rules={[{ required: true, message: "Please input your field!" }]}
            >
              <MyCareerGuidanceInputField
                placeholder="e.g Accounting Technology"
                type="input"
                name="field"
                onChange={onChangeHandle}
                inputValue={item?.field}
                isPrefix={false}
              />
            </Form.Item>
          </div>
          <div style={{ width: "24%" }}>
            <Form.Item
              label="Graduation Start Date"
              name="gStartDate"
              className="eduItemLable"
              rules={[
                {
                  required: true,
                  message: "Please input Start Graduation Date!",
                },
              ]}
            >
              <DatePicker
                onChange={(date, dateString) =>
                  onChangeDate("gStartDate", date, dateString)
                }
                className="expDateInputFieldStyle"
              />
            </Form.Item>
          </div>

          <div style={{ width: "24%" }}>
            <Form.Item
              label="Graduation End Date"
              name="gEndDate"
              className="eduItemLable"
              rules={[
                {
                  required: true,
                  message: "Please input End Graduation Date!",
                },
              ]}
            >
              <DatePicker
                onChange={(date, dateString) =>
                  onChangeDate("gEndDate", date, dateString)
                }
                className="expDateInputFieldStyle"
              />
            </Form.Item>
          </div>
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
                        index: index + 1,
                        dataValue: {
                          schoolName: "",
                          location: "",
                          degree: "",
                          field: "",
                          gStartDate: "",
                          gEndDate: "",
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
