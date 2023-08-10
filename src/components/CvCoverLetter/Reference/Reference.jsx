import React, { useState, useEffect } from "react";
import { Form, Select, Button, message } from "antd";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";
import "./Reference.css";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { API_URL } from "../../../utils/constants";
import { useNavigate, useLocation } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";

const Reference = ({ setCurrent, current }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [downloadBtn, setDownloadBtn]=useState(false);
  const [referArray, setReferArray] = useState([]);
  const { Option } = Select;

  const handleGetApi = async () => {
    const response = await getApiWithAuth(API_URL.GETREFERANCE);
    if (response.data?.status === 200) {
      setData(response.data.data);
    } else {
      message.error("Fail to load Data");
    }
  };

  useEffect(() => {
    handleGetApi();
  }, []);
  useEffect(() => {
    if (data !== null) {
      if (data.length > 0) {
        setReferArray(
          data.map((item, indexx) => {
            return {
              index: indexx,
              dataValue: item,
            };
          })
        );
      } else {
        setReferArray([
          {
            index: 0,
            dataValue: {
              id: null,
              contact_number: "",
              email: "",
              name: "",
              position: "",
            },
          },
        ]);
      }
    }
  }, [data]);

  const onsubmit = async () => {
    let data = createArrayData(referArray);

    const respose = await postApiWithAuth(API_URL.POSTREFERNACE, data);
   
    if (respose.data.status === 201) {
      setCurrent(1);
      message.success("Cv Save Successfully");
      navigate("/cover-letter");
    } else {
      message.error(respose.data.message);
    }
  };

  const SavePdf = async () => {
    let data = createArrayData(referArray);

    const respose = await getApiWithAuth(API_URL.SAVEPDF);
  
    if (respose.data.status === 201) {
     
    } else {
      message.error(respose.data.message);
    }
  };

  const createArrayData = (data) => {
    let array = [];
    data.map((item) => {
      array.push(item.dataValue);
    });

    return array;
  };

  const prev = () => {
    if (current != 1) setCurrent(current - 1);
  };

  const handleChange = (value) => {
    let arr = [];
    for (let i = 0; i < value; i++) {
      arr.push({
        index: i,
        dataValue: {
          id: null,
          name: "",
          position: "",
          contact_number: "",
          email: "",
        },
      });
    }

    setReferArray(arr);
  };

  const onChangeHandleInput = (e, arrayIndex) => {
    const { name, value } = e.target;
    setReferArray(
      referArray.map((item) => {
        return item.index === arrayIndex
          ? { ...item, dataValue: { ...item.dataValue, [name]: value } }
          : item;
      })
    );
  };

  const referenceItems = (item, index) => {
    return (
      <>
        <div style={{ marginTop: "30px" }}>
          <div className="refFormEmail">
            <div className="refFormEmailItem">
              <Form.Item
                label="Name"
                name={`name ${index}`}
                className="refItemLable"
                rules={[{ required: item?.dataValue.name ? false : true, message: "Please input name!" }]}
              >
                <MyCareerGuidanceInputField
                  placeholder="Danial Brot"
                  type="input"
                  name="name"
                  onChange={(e) => onChangeHandleInput(e, index)}
                  inputValue={item?.dataValue?.name}
                  isPrefix={false}
                />
              </Form.Item>
            </div>
            <div className="refFormEmailItem">
              <Form.Item
                label="Position"
                name={`position ${index}`}
                className="refItemLable"
                rules={[{ required: item?.dataValue.position ? false : true, message: "Please input position!" }]}
                style={{ marginBottom: "20px" }}
              >
                <MyCareerGuidanceInputField
                  placeholder="e.g H&M"
                  type="input"
                  name="position"
                  onChange={(e) => onChangeHandleInput(e, index)}
                  inputValue={item?.dataValue?.position}
                  isPrefix={false}
                />
              </Form.Item>
            </div>
          </div>
          <div className="refFormEmail">
            <div className="refFormEmailItem">
              <Form.Item
                label="Contact Phone"
                name={`contact_number ${index}`}
                className="refItemLable"
                rules={[{ required: item?.dataValue.contact_number ? false : true, message: "Please input Contact!" }]}
              >
                <MyCareerGuidanceInputField
                  placeholder="+xx-xxx-xxx-xxxx"
                  type="input"
                  name="contact_number"
                  onChange={(e) => onChangeHandleInput(e, index)}
                  inputValue={item?.dataValue?.contact_number}
                  isPrefix={false}
                />
              </Form.Item>
            </div>
            <div className="refFormEmailItem">
              <Form.Item
                label="Contact Email"
                name={`email ${index}`}
                className="refItemLable"
                rules={[
                  { required: item?.dataValue.email ? false : true, message: "Please input Contact Email!" },
                ]}
                style={{ marginBottom: "20px" }}
              >
                <MyCareerGuidanceInputField
                  placeholder="xyz@gmail.com"
                  type="email"
                  name="email"
                  onChange={(e) => onChangeHandleInput(e, index)}
                  inputValue={item?.dataValue?.email}
                  isPrefix={false}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </>
    );
  };

  const getUserData = async() => {
    const response = await getApiWithAuth(API_URL.GETUSER2);
    if(response.data.status === 200){
     if(response.data.data.cv_completed===true){
      setDownloadBtn(true);
     }
    }
  }

  useEffect(()=>{
    getUserData();
  },[])

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
              {referArray.map((item, index) => {
                {
                  return referenceItems(item, index);
                }
              })}
            </div>
            <div>
              <Form.Item>
                <Button
                  className="expAddButton"
                  onClick={() =>
                    setReferArray((oldarr) => [
                      ...oldarr,
                      {
                        index: referArray.length,
                        dataValue: {
                          id: null,
                          contact_number: "",
                          email: "",
                          name: "",
                          position: "",
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
                  Add Another Referee
                </Button>
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
                  className={downloadBtn === false ? "disabledBtn me-3": "skillsButton me-3 "}
                  type="primary"
                  htmlType="submit"
                  onClick={SavePdf}
                >
                  Download CV
                </Button>
                <Button
                  className="skillsButton"
                  type="primary"
                  htmlType="submit"
                >
                  Save
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
