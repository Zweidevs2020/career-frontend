import React, { useState, useEffect } from "react";
import "./Skill.css";
import { Form, Select, Button, message } from "antd";
import axios from "axios";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../../../utils/constants";
const Skill = ({ setCurrent, current }) => {
  const [selectOption, setSelectOption] = useState([]);
  const [selectOption2, setSelectOption2] = useState([]);
  const navigate = useNavigate();
  const [userSkillData, setUserSkillsData] = useState([]);
  const [userData, setUserData] = useState({});
  const [nextBtn, setNextBtn] = useState(false);
  const [savedTotalStep,setSavedTotalStep]=useState()
  const [userQualityData, setUserQualityData] = useState([]);
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(true);

  const { Option } = Select;

  const optionArray = [
    {
      label: "SELF STARTER",
      discription:
        "I take initiative and take on projects independently, I can work without supervision",
      value: "1",
    },
    {
      label: "People Skills",
      discription:
        "I am liked by others. I can interact, influence and communicate well with other people",
      value: "2",
    },
    {
      label: "Critical Thinking Skills",
      discription:
        "I can look at a situation, find the cause of the problem and then come up with a solution.",
      value: "3",
    },
    {
      label: "Practical Skills",
      discription: "I enjoy being physically involved in a project or task",
      value: "4",
    },
    {
      label: "Communication Skills",
      discription:
        "I can absorb, share and understand ideas or information. I can communicate well through written or spoken words",
      value: "5",
    },
    {
      label: "Teamwork Skills",
      discription:
        "I enjoy working in a group of people to achieve a common aim",
      value: "6",
    },
    {
      label: "Information Skills",
      discription:
        "I use technology daily for sending messages, video calls, searching the internet, filing, cloud storage and social media on any device",
      value: "7",
    },
    {
      label: "Creative Skills",
      discription:
        "I can think about problems differently and can find interesting ways to approach tasks. I see things from a unique perspective",
      value: "8",
    },
    {
      label: "Critical Problem Solving",
      discription:
        "I have the ability to use knowledge, facts and data to effectively solve problems. I can think on my feet, assess problems and find solutions",
      value: "9",
    },
  ];

  const optionArrayQualities = [
    {
      label: "Intuitive",
      description:
        "I have the ability to understand or know something by instinct.",
      value: "1",
    },
    {
      label: "Persistent",
      description:
        "I am determined to see projects through to the end. I don't give up easily.",
      value: "2",
    },
    {
      label: "Enthusiastic",
      description:
        "I have an active and motivated attitude. I get satisfaction from getting things done and pursuing my goals.",
      value: "3",
    },
    {
      label: "Persuasive",
      description:
        "I have the ability to persuade and help others see and agree with my point of view.",
      value: "4",
    },
    {
      label: "Empathic",
      description:
        "I have the ability to feel and understand what others need.",
      value: "5",
    },
    {
      label: "Patient",
      description:
        "I am able to behave calmly in the face of frustration or annoyance.",
      value: "6",
    },
    {
      label: "A Good Listener",
      description:
        "I can make others feel supported and can create a safe environment in which issues can be discussed.",
      value: "7",
    },
    {
      label: "Expressive",
      description:
        "I am positive, social, and generous. I enjoy being included.",
      value: "8",
    },
  ];

  const getSkills = async () => {
    const response = await getApiWithAuth(API_URL.GETSKILLS);
  
    if (response.data?.status === 200) {
      let array = [];
      let array2 = [];
      let array3 = [];
      let array4 = [];
  
      response.data.data.skill_data.forEach((item) => {
        array.push(item.skill_dropdown);
        array2.push({ id: item.id, skill_dropdown: item.skill_dropdown });
      });
  
      response.data.data.quality_data.forEach((item) => {
        if (item.quality_dropdown) {
          array3.push(item.quality_dropdown);
          array4.push({ id: item.id, quality_dropdown: item.quality_dropdown });
        }
      });
  
      setSelectOption(array);
      setUserSkillsData(array2);
      setSelectOption2(array3);
      setUserQualityData(array4);
    } else {
      message.error("Fail to load Data");
    }
  };
  
  useEffect(() => {
    getSkills();
  }, []);
  

  const onsubmit = async () => {
    const result = [];

    const result2 = [];

    selectOption.forEach((value) => {
      const match = userSkillData.find((obj) => obj.skill_dropdown === value);
      console.log('========match',match)
      if (match) {
        result.push({ id: null, skill_dropdown: match.skill_dropdown });
      } else {
        result.push({ id: null, skill_dropdown: value });
        
      }
    });
    selectOption2.forEach((value) => {
      const match = userQualityData.find(
        (obj) => obj.quality_dropdown === value
      );
      if (match) {
        result2.push({ id: null, quality_dropdown: match.quality_dropdown });

      } else {
        result2.push({ id: null, quality_dropdown: value });
      }
    });

    const respose = await postApiWithAuth(API_URL.POSTSKILLS, {
      skill_data: result,
      quality_data: result2,
    });
    console.log('==========================res',respose)
    if (respose.data.status === 201 || respose.data.status === 200) {
    
      setCurrent(current + 1);
    } else {
      message.error(respose.data.message);
    }
  };
  const prev = () => {
    if (current != 1) setCurrent(current - 1);
  };

  const handleChange = (value) => {
    setSelectOption(value);
  };
  const handleChange2 = (value) => {
    setSelectOption2(value);
  };



  const getUserData = async () => {
    const response = await getApiWithAuth(API_URL.GETUSER2);
  
    if (response.data.data["current_step"] > 1) {
      setNextBtn(true)
      setSavedTotalStep(response.data.data["current_step"])
    }
    if (response.data.data.current_step !== 4) {
      setIsInputDisabled(true);
    } else {
      setIsInputDisabled(false);
    }

    if (response.data.status === 200) {
      setUserData(response.data.data);
      if (response.data.data.cv_completed === true) {
        setDownloadBtn(true);
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const edit = () => {
    setIsInputDisabled(false)
  }
  const SavePdf = async (e) => {
    e.preventDefault();
    var token = localStorage.getItem("access_token", "");

    const response = await axios.get(
      `${process.env.REACT_APP_LINK_BASE_URL}cv/cv/`,
      {
        responseType: "blob", 
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

   
    const pdfBlob = new Blob([response.data], { type: "application/pdf" });

 
    const pdfUrl = URL.createObjectURL(pdfBlob);

  
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${userData.full_name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(pdfUrl);
  };
  const handleNextClick = () => {
    if (savedTotalStep >= current) { 
      setCurrent(current + 1);
      navigate(`?step=${current + 1}`);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center">
        <div>
          <h1 className="skillsHead">Skills and Qualities</h1>
          <p className="skillsSubHeading">Include All skills that you have</p>
        </div>
        <div className="skillsForm">
          <Form layout="vertical" onFinish={onsubmit}>
            <div>
              <Form.Item
                label="Skill"
                // name="skills"
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
                  value={selectOption}
                  // disabled={isInputDisabled}
                >
                  {optionArray.map((item) => {
                    return (
                      <Option value={item.value} label={item.label}>
                        <div>
                          <div>{item.label}</div>
                          <div>{item.discription}</div>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Qualities"
                // name="skills"
                className="skillItemLable"
                rules={[
                  { required: true, message: "Please Select atleast 1 Option" },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select Option"
                  onChange={handleChange2}
                  optionLabelProp="label"
               
                  value={selectOption2}
                  // disabled={isInputDisabled}
                >
                  
                  {optionArrayQualities.map((item) => {
                  
                    return (
                      <Option value={item.value} label={item.label}>
                     <div>
                  
                          <div>{item.label}</div>
                          <div>{item.description}</div>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between'}} className="mobileLayout">
            <div className="skillsItemButton">
              <Form.Item>
                <Button
                  className="skillsButtonBack me-3"
                  type="primary"
                  onClick={prev}
                >
                  Back
                </Button>
              </Form.Item>
              {nextBtn && ( <Form.Item>
                <Button
                  className="skillsButtonBack me-3"
                  type="primary"
                  onClick={handleNextClick}
                 
                >
                  Next
                </Button>
              </Form.Item>
              )}
              </div>
              <div className="buttonEducation">
              <Form.Item>
               
                 {downloadBtn &&( <Button
                className={
                  downloadBtn === false
                    ? "disabledBtn me-3"
                    : "skillsButton me-3 "
                }
                type="primary"
                htmlType="submit"
                onClick={(e) => SavePdf(e)}>
                Download CV
              </Button>)}
                <Button
                  className="skillsButton"
                  type="primary"
                  htmlType="submit"
                  // disabled={isInputDisabled}
                >
                  Save
                </Button>
              </Form.Item>
            </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Skill;
