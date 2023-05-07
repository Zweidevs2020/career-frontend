import React, { useState, useEffect } from "react";
import { Form, Button, DatePicker } from "antd";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";
import "./Education.css";

const Education = ({ setCurrent, current }) => {
  const [educationData, setEducationData] = useState({});
  const [educationArray, setEducationArray] = useState([
    { index: 0, dataValue: { schoolName: "", monYear: "", examTaken: "" } },
  ]);
  const [index, setIndex] = useState(0);

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
        <div className="eduFormDouble" style={{ marginTop: "5%" }}>
          <div className="eduFormDoubleItem">
            <Form.Item
              label="School Name"
              name="schoolName"
              className="expItemLable"
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
              label="Month/Year"
              name="monYear"
              className="expItemLable"
              rules={[
                {
                  required: true,
                  message: "Please input start Month/Year!",
                },
              ]}
            >
              <DatePicker
                picker="month"
                format={"MM/YYYY"}
                className="expDateInputFieldStyle"
              />
            </Form.Item>
          </div>
        </div>

        <div className="eduFormDouble">
          <div className="eduFormDoubleItem">
            <Form.Item
              label="Exams Taken"
              name="examTaken"
              className="expItemLable"
              rules={[{ required: true, message: "Please input your school!" }]}
            >
              <MyCareerGuidanceInputField
                placeholder="Exam Taken"
                type="input"
                name="examTaken"
                onChange={(event) => onChangeHandle(event, index)}
                inputValue={item?.jobTitle}
                isPrefix={false}
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
