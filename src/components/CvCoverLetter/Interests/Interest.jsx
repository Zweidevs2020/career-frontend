import React, { useState } from "react";
import "./Interest.css";
import { Form, Button, Input } from "antd";

const Interest = ({ setCurrent, current }) => {
  const { TextArea } = Input;
  const [textData, setTextData] = useState("");

  const onsubmit = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    if (current != 1) setCurrent(current - 1);
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setTextData(value);
  };

  return (
    <>
      <div className="flex flex-col justify-center">
        <div>
          <h1 className="interestHead">What interests do you have?</h1>
          <p className="interestSubHeading">Include All Hobbies and Intrests</p>
        </div>
        <div className="interestForm">
          <Form layout="vertical" onFinish={onsubmit}>
            <div>
              <Form.Item
                label="Interest"
                name="interest"
                className="interestItemLable"
                rules={[
                  { required: true, message: "Please input your Interest!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Write Your Interests......"
                  className="inputFieldStyle"
                  inputValue={textData}
                  name="objective"
                  onChange={handleChange}
                />
              </Form.Item>
            </div>

            <div className="interestItemButton">
              <Form.Item>
                <Button
                  className="interestButtonBack"
                  type="primary"
                  onClick={prev}
                >
                  BACK
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  className="interestButton"
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

export default Interest;
