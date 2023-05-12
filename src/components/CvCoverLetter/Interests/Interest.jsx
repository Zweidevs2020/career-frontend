import React, { useState, useEffect } from "react";
import "./Interest.css";
import { Form, Button, Input, message } from "antd";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { API_URL } from "../../../utils/constants";
const Interest = ({ setCurrent, current }) => {
  const { TextArea } = Input;
  const [textData, setTextData] = useState({ id: null });

  const onsubmit = async () => {
    const respose = await postApiWithAuth(API_URL.POSTINTREST, [textData]);
    if (respose.data.status === 201) {
      setCurrent(current + 1);
    } else {
      message.error("Error, Please try again");
    }
  };

  const prev = () => {
    if (current != 1) setCurrent(current - 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTextData({ ...textData, [name]: value });
  };

  const getIntrest = async () => {
    const response = await getApiWithAuth(API_URL.GETINTREST);
    if (response.data?.status === 200) {
      if (response.data.data.length > 0) {
        setTextData(response.data.data[0]);
      }
    }
  };
  useEffect(() => {
    getIntrest();
  }, []);

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
                className="interestItemLable"
                rules={[
                  { required: true, message: "Please input your Interest!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Write Your Interests......"
                  className="inputFieldStyle"
                  value={textData.interest}
                  name="interest"
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
