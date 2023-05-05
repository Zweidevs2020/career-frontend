import React, { useState } from "react";
import "./Skill.css";
import { Form, Select, Button } from "antd";

const Skill = ({ setCurrent, current }) => {
  const [selectOption, setSelectOption] = useState([]);
  const { Option } = Select;

  const optionArray = [
    { label: "React.js", value: "React.js" },
    { label: "Next.js", value: "Next.js" },
    { label: "Antd", value: "Antd" },
    { label: "Bootstrap", value: "Bootstrap" },
    { label: "R Studio", value: "rStudio" },
    { label: "Java", value: "java" },
    { label: "Machine Learning", value: "Machine Learning" },
    { label: "Data Science", value: "Data Science" },
    { label: "Matlab", value: "Matlab" },
  ];

  const onsubmit = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    if (current != 1) setCurrent(current - 1);
  };

  const handleChange = (value) => {
    setSelectOption(value);
  };
  return (
    <>
      <div className="flex flex-col justify-center">
        <div>
          <h1 className="skillsHead">Skills</h1>
          <p className="skillsSubHeading">Include All skills that you have</p>
        </div>
        <div className="skillsForm">
          <Form layout="vertical" onFinish={onsubmit}>
            <div>
              <Form.Item
                label="Skill"
                name="skills"
                className="skillItemLable"
                rules={[
                  { required: true, message: "Please Select atleast 1 Option" },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select Option"
                  onChange={handleChange}
                  optionLabelProp="label"
                >
                  {optionArray.map((item) => {
                    return (
                      <Option value={item.value} label={item.label}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
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

export default Skill;
