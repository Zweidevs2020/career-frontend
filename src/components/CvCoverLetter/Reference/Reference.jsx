import React, { useState, useEffect } from "react";
import { Form, Select, Button } from "antd";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";
import "./Reference.css";

const Reference = ({ setCurrent, current }) => {
  const [selectOption, setSelectOption] = useState([]);
  const [referenceData, setReferenceData] = useState({});
  const [referArray, setReferArray] = useState([]);
  const [index, setIndex] = useState(0);
  const { Option } = Select;

  const onsubmit = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    if (current != 1) setCurrent(current - 1);
  };

  const handleChange = (value) => {
    let arr = [];
    for (let index = 0; index < value; index++) {
      arr.push(index);
    }

    setSelectOption(arr);
  };

  const onChangeHandleInput = (e, arrayIndex) => {
    const { name, value } = e.target;
    setIndex(arrayIndex);
    setReferenceData({ ...referenceData, [name]: value });
  };

  useEffect(() => {
    if (Object.keys(referenceData).length > 0) {
      let filterData = referArray.filter((item) => item.index !== index);
      filterData.push({
        index: index,
        dataValue: referenceData,
      });
      setReferArray(filterData);
    }
  }, [referenceData]);

  const referenceItems = (item) => {
    return (
      <>
        <div style={{ marginTop: "30px" }}>
          <div className="refFormEmail">
            <div className="refFormEmailItem">
              <Form.Item
                label="Name"
                name="name"
                className="refItemLable"
                rules={[{ required: true, message: "Please input name!" }]}
              >
                <MyCareerGuidanceInputField
                  placeholder="Danial Brot"
                  type="input"
                  name="name"
                  onChange={(e) => onChangeHandleInput(e, item)}
                  inputValue={referArray[item]?.name}
                  isPrefix={false}
                />
              </Form.Item>
            </div>
            <div className="refFormEmailItem">
              <Form.Item
                label="Position"
                name="position"
                className="refItemLable"
                rules={[{ required: true, message: "Please input position!" }]}
                style={{ marginBottom: "20px" }}
              >
                <MyCareerGuidanceInputField
                  placeholder="e.g H&M"
                  type="input"
                  name="position"
                  onChange={(e) => onChangeHandleInput(e, item)}
                  inputValue={referArray[item]?.position}
                  isPrefix={false}
                />
              </Form.Item>
            </div>
          </div>
          <div className="refFormEmail">
            <div className="refFormEmailItem">
              <Form.Item
                label="Contact Phone"
                name="contact"
                className="refItemLable"
                rules={[{ required: true, message: "Please input name!" }]}
              >
                <MyCareerGuidanceInputField
                  placeholder="+xx-xxx-xxx-xxxx"
                  type="input"
                  name="phone"
                  onChange={(e) => onChangeHandleInput(e, item)}
                  inputValue={referArray[item]?.phone}
                  isPrefix={false}
                />
              </Form.Item>
            </div>
            <div className="refFormEmailItem">
              <Form.Item
                label="Contact Email"
                name="email"
                className="refItemLable"
                rules={[{ required: true, message: "Please input position!" }]}
                style={{ marginBottom: "20px" }}
              >
                <MyCareerGuidanceInputField
                  placeholder="xyz@gmail.com"
                  type="input"
                  name="email"
                  onChange={(e) => onChangeHandleInput(e, item)}
                  inputValue={referArray[item]?.email}
                  isPrefix={false}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </>
    );
  };

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
              <Form.Item
                label="Do you want to Include Refrences"
                name="skills"
                className="skillItemLable"
                rules={[{ required: true, message: "Please Select 1 Option" }]}
              >
                <Select
                  placeholder="Select One Option"
                  onChange={handleChange}
                  optionLabelProp="label"
                >
                  <Option value={1} key={1} label={"One"}>
                    One
                  </Option>
                  <Option value={2} key={2} label={"Two"}>
                    Two
                  </Option>
                  <Option value={3} key={3} label={"Three"}>
                    Three
                  </Option>
                </Select>
              </Form.Item>
            </div>
            <div>
              {selectOption.map((item) => {
                {
                  return referenceItems(item);
                }
              })}
            </div>

            <div className="skillsItemButton">
              <Form.Item>
                <Button
                  className="skillsButtonBack"
                  type="primary"
                  onClick={prev}
                >
                  BACK
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  className="skillsButton"
                  type="primary"
                  htmlType="submit"
                >
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

export default Reference;
