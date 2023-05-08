import React, { useState, useEffect } from "react";
import { Form, Button, Input, DatePicker, Checkbox } from "antd";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";
import "./Experenice.css";
import { PlusCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const Experenice = ({ setCurrent, current }) => {
  const [expereniceArray, setExpereniceArray] = useState([
    {
      index: 0,
      dataValue: {
        jobTitle: "",
        cName: "",
        country: "",
        city: "",
        sDate: "",
        eDate: "",
        description: "",
        check: "",
      },
    },
  ]);
  const [isCurrentCheck, setIsCurrentCheck] = useState(false);
  const [expereniceData, setExpereniceData] = useState({});
  const [index, setIndex] = useState(0);

  const onSubmit = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    if (current != 1) setCurrent(current - 1);
  };

  const onChangeHandle = (e, arrayIndex) => {
    const { name, value } = e.target;
    setIndex(arrayIndex);
    setExpereniceData({ ...expereniceData, [name]: value });
  };

  const onChangeDate = (name, date, dateString) => {
    setExpereniceData({ ...expereniceData, [name]: dateString });
  };

  const expereniceItem = (item, index) => {
    return (
      <>
        <div className="expFormDouble" style={{ marginTop: "5%" }}>
          <div className="expFormDoubleItem">
            <Form.Item
              label="Job Title"
              name="jobTitle"
              className="expItemLable"
              rules={[
                { required: true, message: "Please input your Job Title!" },
              ]}
            >
              <MyCareerGuidanceInputField
                placeholder="e.g Retail  Sales Associate"
                type="input"
                name="jobTitle"
                onChange={(event) => onChangeHandle(event, index)}
                inputValue={expereniceArray[index]?.jobTitle}
                isPrefix={false}
              />
            </Form.Item>
          </div>
          <div className="expFormDoubleItem">
            <Form.Item
              label="Company Name"
              name="cName"
              className="expItemLable"
              rules={[
                { required: true, message: "Please input Company Name!" },
              ]}
            >
              <MyCareerGuidanceInputField
                placeholder="e.g H&M"
                type="input"
                name="cName"
                onChange={(event) => onChangeHandle(event, index)}
                inputValue={expereniceArray[index]?.cName}
                isPrefix={false}
              />
            </Form.Item>
          </div>
        </div>

        <div className="expFormDouble">
          <div className="expFormDoubleItem">
            <Form.Item
              label="City"
              name="city"
              className="expItemLable"
              rules={[{ required: true, message: "Please input city!" }]}
            >
              <MyCareerGuidanceInputField
                placeholder="e.g Cebu City, Cebu"
                type="input"
                name="city"
                onChange={(event) => onChangeHandle(event, index)}
                inputValue={expereniceArray?.city}
                isPrefix={false}
              />
            </Form.Item>
          </div>
          <div className="expFormDoubleItem">
            <Form.Item
              label="Country"
              name="country"
              className="expItemLable"
              rules={[{ required: true, message: "Please input Country!" }]}
            >
              <MyCareerGuidanceInputField
                placeholder="e.g Philippines"
                type="input"
                name="country"
                onChange={(event) => onChangeHandle(event, index)}
                inputValue={expereniceArray?.country}
                isPrefix={false}
              />
            </Form.Item>
          </div>
        </div>

        <div className="expFormDouble">
          <div className="expFormDoubleItem">
            <Form.Item
              label="Start Date"
              name="sDate"
              className="expItemLable"
              rules={[{ required: true, message: "Please input start date!" }]}
            >
              <DatePicker
                onChange={(date, dateString) =>
                  onChangeDate("sDate", date, dateString)
                }
                className="expDateInputFieldStyle"
              />
            </Form.Item>
          </div>
          <div className="expFormDoubleItem">
            <Form.Item
              label="End Date"
              name="eDate"
              className="expItemLable"
              rules={[{ required: true, message: "Please input Country!" }]}
            >
              <DatePicker
                onChange={(date, dateString) =>
                  onChangeDate("eDate", date, dateString)
                }
                disabled={isCurrentCheck}
                className="expDateInputFieldStyle"
              />
            </Form.Item>
          </div>
        </div>

        <div>
          <Form.Item
            label="Description"
            name="description"
            className="expItemLable"
            rules={[
              {
                required: true,
                message: "Please input your Description!",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Add Description"
              name="description"
              className="inputFieldStyle"
              inputValue={expereniceArray[index]?.description}
              onChange={(event) => onChangeHandle(event, index)}
            />
          </Form.Item>
        </div>

        <div>
          <Checkbox
            className="expCheckBox"
            name="check"
            inputValue={expereniceArray[index]?.check}
            onChange={() => {
              setExpereniceData({ ...expereniceData, check: !isCurrentCheck });
              setIsCurrentCheck(!isCurrentCheck);
            }}
          >
            I Currently Work here
          </Checkbox>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (Object.keys(expereniceData).length > 0) {
      let filterData = expereniceArray.filter((item) => item.index !== index);
      filterData.push({
        index: index,
        dataValue: expereniceData,
      });
      setExpereniceArray(filterData);
    }
  }, [expereniceData]);

  return (
    <>
      <div className="flex flex-col justify-center">
        <div>
          <h1 className="expHead">Tell us about your most recent job</h1>
          <p className="expSubHeading">We’ll start there and work backward.</p>
        </div>
        <div className="expForm">
          <Form layout="vertical" onFinish={onSubmit}>
            {expereniceArray.length > 0
              ? expereniceArray.map((item, index) => {
                  return expereniceItem(item, index);
                })
              : ""}

            <div>
              <Form.Item>
                <Button
                  className="expAddButton"
                  onClick={() =>
                    setExpereniceArray((oldarr) => [
                      ...oldarr,
                      {
                        index: index + 1,
                        dataValue: {
                          jobTitle: "",
                          cName: "",
                          country: "",
                          city: "",
                          sDate: "",
                          eDate: "",
                          description: "",
                          check: "",
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
                  Add Another Position
                </Button>
              </Form.Item>
            </div>
            <div className="expItemButton">
              <Form.Item>
                <Button className="expButtonBack" type="primary" onClick={prev}>
                  Back
                </Button>
              </Form.Item>
              <Form.Item>
                <Button className="expButton" type="primary" htmlType="submit">
                  Next
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Experenice;
