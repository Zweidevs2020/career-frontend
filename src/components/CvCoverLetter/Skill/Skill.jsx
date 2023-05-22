import React, { useState, useEffect } from "react";
import "./Skill.css";
import { Form, Select, Button, message } from "antd";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { API_URL } from "../../../utils/constants";
const Skill = ({ setCurrent, current }) => {
  const [selectOption, setSelectOption] = useState([]);
  const [userSkillData, setUserSkillsData] = useState([]);
  const [downloadBtn, setDownloadBtn]=useState(false);

  const { Option } = Select;

  const optionArray = [
    { label: "SELF STARTER", value: "1" },
    { label: "People Skills", value: "2" },
    { label: "Critical Thinking Skills", value: "3" },
    { label: "Practical Skills", value: "4" },
    { label: "Communication Skills", value: "5" },
    { label: "Teamwork Skills", value: "6" },
    { label: "Information Skills", value: "7" },
    { label: "Creative Skills", value: "8" },
    { label: "Critical Problem Solving", value: "9" },
  ];
  const getSkills = async () => {
    const response = await getApiWithAuth(API_URL.GETSKILLS);
    if (response.data?.status === 200) {
      let array = [];
      let array2 = [];
      response.data.data.map((item, index) => {
        array.push(item.skill_dropdown);
        array2.push({ id: item.id, skill_dropdown: item.skill_dropdown });
      });
      setSelectOption(array);
      setUserSkillsData(array2);
    } else {
      message.error("Fail to load Data");
    }
  };

  useEffect(() => {
    getSkills();
  }, []);

  const onsubmit = async () => {
    const result = [];
    selectOption.forEach((value) => {
      const match = userSkillData.find((obj) => obj.skill_dropdown === value);
      if (match) {
        result.push(match);
      } else {
        result.push({ id: null, skill_dropdown: value });
      }
    });

    const respose = await postApiWithAuth(API_URL.POSTSKILLS, result);
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
          <h1 className="skillsHead">Skills</h1>
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
                  // defaultValue={userSkillData}
                  value={selectOption}
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
