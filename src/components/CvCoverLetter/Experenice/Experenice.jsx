import React, { useState, useEffect } from "react";
import {
  Select,
  Form,
  Button,
  Input,
  DatePicker,
  Checkbox,
  message,
} from "antd";
import MyCareerGuidanceInputField from "../../commonComponents/MyCareerGuidanceInputField/MyCareerGuidanceInputField";
import "./Experenice.css";
import { PlusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { API_URL } from "../../../utils/constants";
const { TextArea } = Input;
const { Option } = Select;

const Experenice = ({ setCurrent, current }) => {
  const [data, setData] = useState(null);
  const [downloadBtn, setDownloadBtn]=useState(false);
  const [expereniceArray, setExpereniceArray] = useState([]);
  const [isCurrentCheck, setIsCurrentCheck] = useState(false);
  const getExperiance = async () => {
    const response = await getApiWithAuth(API_URL.GETEXPERIANCE);
    if (response.data?.status === 200) {
      setData(response.data.data);
    } else {
      message.error("Fail to load Data");
    }
  };

  useEffect(() => {
    getExperiance();
  }, []);
  const titleArray = [
    { label: "Assistant", value: "1" },
    { label: "Work Shadow", value: "2" },
    { label: "Other", value: "3" },
  ];
  useEffect(() => {
    if (data !== null) {
      if (data.length > 0) {
        setExpereniceArray(
          data.map((item, indexx) => {
            return {
              index: indexx,
              dataValue: item,
            };
          })
        );
      } else {
        setExpereniceArray([
          {
            index: 0,
            dataValue: {
              id: null,
              jobtitle: "",
              company: "",
              country: "",
              city: "",
              startdate: dayjs().format("DD-MM-YYYY"),
              enddate: dayjs(dayjs()).add(1, "day").format("DD-MM-YYYY"),
              description: "",
              is_current_work: false,
            },
          },
        ]);
      }
    }
  }, [data]);

  const onSubmit = async () => {
    let data = createArrayData(expereniceArray);
    const respose = await postApiWithAuth(API_URL.POSTEXPERIANCE, data);
    if (respose.data.status === 201) {
      setCurrent(current + 1);
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
    if (current !== 1) setCurrent(current - 1);
  };

  const onChangeHandle = (e, arrayIndex) => {
    const { name, value } = e.target;
    setExpereniceArray(
      expereniceArray.map((item) => {
        return item.index === arrayIndex
          ? { ...item, dataValue: { ...item.dataValue, [name]: value } }
          : item;
      })
    );
  };
  const handleChange = (value, name, arrayIndex) => {
    setExpereniceArray(
      expereniceArray.map((item) => {
        return item.index === arrayIndex
          ? { ...item, dataValue: { ...item.dataValue, [name]: value } }
          : item;
      })
    );
  };
  const onChangeDate = (name, date, arrayIndex) => {
    setExpereniceArray(
      expereniceArray.map((item) => {
        return item.index === arrayIndex
          ? { ...item, dataValue: { ...item.dataValue, [name]: date } }
          : item;
      })
    );
  };

  const SavePdf = async () => {
    // let data = createArrayData(referArray);

    const respose = await getApiWithAuth(API_URL.SAVEPDF);
    console.log("================res get", respose);
    if (respose.data.status === 201) {
      // setCurrent(current + 1);
    } else {
      message.error(respose.data.message);
    }
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
          <h1 className="expHead">Tell us about your most recent job</h1>
          <p className="expSubHeading">We’ll start there and work backward.</p>
        </div>
        <div className="expForm">
          <Form layout="vertical" onFinish={onSubmit}>
            {expereniceArray.map((item, index) => {
              return (
                <>
                  <div
                    key={index}
                    className="expFormDouble"
                    style={{ marginTop: "3%" }}
                  >
                    <div className="expFormDoubleItem">
                      <Form.Item
                        label="Job Title"
                        name={`jobtitle ${index}`}
                        className="skillItemLable"
                        rules={[
                          {
                            required: item?.dataValue.jobtitle ? false : true,
                            message: "Please Select 1 Option",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select"
                          onChange={(event) =>
                            handleChange(event, "jobtitle", index)
                          }
                          optionLabelProp="label"
                          className="eduSelect eduSelectItem"
                          defaultValue={item?.dataValue?.jobtitle}
                        >
                          {titleArray.map((item) => {
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
                    <div className="expFormDoubleItem">
                      <Form.Item
                        label="Company Name"
                        name={`company ${index}`}
                        className="expItemLable"
                        rules={[
                          {
                            required: item?.dataValue.company ? false : true,
                            message: "Please input Company Name!",
                          },
                        ]}
                      >
                        <MyCareerGuidanceInputField
                          placeholder="e.g H&M"
                          type="input"
                          name="company"
                          onChange={(event) => onChangeHandle(event, index)}
                          inputValue={item?.dataValue?.company}
                          isPrefix={false}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="expFormDouble">
                    <div className="expFormDoubleItem">
                      <Form.Item
                        label="City"
                        name={`city ${index}`}
                        className="expItemLable"
                        rules={[
                          {
                            required: item?.dataValue.city ? false : true,
                            message: "Please input City!",
                          },
                        ]}
                      >
                        <MyCareerGuidanceInputField
                          placeholder="e.g Cebu City, Cebu"
                          type="input"
                          name="city"
                          onChange={(event) => onChangeHandle(event, index)}
                          inputValue={item?.dataValue.city}
                          isPrefix={false}
                        />
                      </Form.Item>
                    </div>
                    <div className="expFormDoubleItem">
                      <Form.Item
                        label="Country"
                        name={`country ${index}`}
                        className="expItemLable"
                        rules={[
                          {
                            required: item?.dataValue.country ? false : true,
                            message: "Please input Country!",
                          },
                        ]}
                      >
                        <MyCareerGuidanceInputField
                          placeholder="e.g Philippines"
                          type="input"
                          name="country"
                          onChange={(event) => onChangeHandle(event, index)}
                          inputValue={item?.dataValue?.country}
                          isPrefix={false}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="expFormDouble">
                    <div className="expFormDoubleItem">
                      <Form.Item
                        label="Start Date"
                        name={`startdate ${index}`}
                        className="expItemLable"
                        rules={[
                          {
                            required: item?.dataValue.startdate ? false : true,
                            message: "Please input start date!",
                          },
                        ]}
                      >
                        <DatePicker
                          onChange={(date, dateString) =>
                            onChangeDate("startdate", dateString, index)
                          }
                          className="expDateInputFieldStyle"
                          format={"DD-MM-YYYY"}
                          value={dayjs(item?.dataValue.startdate, "DD-MM-YYYY")}
                          defaultValue={dayjs(
                            item?.dataValue.startdate,
                            "DD-MM-YYYY"
                          )}
                        />
                      </Form.Item>
                    </div>
                    <div className="expFormDoubleItem">
                      <Form.Item
                        label="End Date"
                        name={`enddate ${index}`}
                        className="expItemLable"
                        rules={[
                          {
                            required: item?.dataValue.enddate ? false : true,
                            message: "Please input end Date!",
                          },
                        ]}
                      >
                        <DatePicker
                          onChange={(date, dateString) =>
                            onChangeDate("enddate", date, dateString)
                          }
                          format={"DD-MM-YYYY"}
                          value={dayjs(item?.dataValue.enddate, "DD-MM-YYYY")}
                          defaultValue={dayjs(
                            item?.dataValue.enddate,
                            "DD-MM-YYYY"
                          )}
                          disabled={item?.dataValue.is_current_work}
                          className="expDateInputFieldStyle"
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div>
                    <Form.Item
                      label="Description"
                      name={`description ${index}`}
                      className="expItemLable"
                      rules={[
                        {
                          required: item?.dataValue.description ? false : true,
                          message: "Please input your Description!",
                        },
                      ]}
                    >
                      <TextArea
                        rows={4}
                        placeholder="Add Description"
                        name="description"
                        className="inputFieldStyle"
                        defaultValue={item?.dataValue?.description}
                        onChange={(event) => onChangeHandle(event, index)}
                      />
                    </Form.Item>
                  </div>

                  <div>
                    <Checkbox
                      className="expCheckBox"
                      name="is_current_work"
                      inputValue={item?.dataValue?.is_current_work}
                      onChange={(e) => {
                        setExpereniceArray(
                          expereniceArray.map((item) => {
                            return item.index === index
                              ? {
                                  ...item,
                                  dataValue: {
                                    ...item.dataValue,
                                    is_current_work: e.target.checked,
                                  },
                                }
                              : item;
                          })
                        );
                        setIsCurrentCheck(!isCurrentCheck);
                      }}
                    >
                      I Currently Work here
                    </Checkbox>
                  </div>
                </>
              );
            })}

            <div>
              <Form.Item>
                <Button
                  className="expAddButton"
                  onClick={() =>
                    setExpereniceArray((oldarr) => [
                      ...oldarr,
                      {
                        index: expereniceArray.length,
                        dataValue: {
                          id: null,
                          jobtitle: "",
                          company: "",
                          country: "",
                          city: "",
                          startdate: dayjs().format("DD-MM-YYYY"),
                          enddate: dayjs(dayjs())
                            .add(1, "day")
                            .format("DD-MM-YYYY"),
                          description: "",
                          is_current_work: false,
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
              <Button
                  className={downloadBtn === false ? "disabledBtn me-3": "skillsButton me-3 "}
                  type="primary"
                  htmlType="submit"
                  onClick={SavePdf}
                >
                  Download CV
                </Button>
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
