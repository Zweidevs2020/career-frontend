import React, { useEffect, useState } from "react";
import { Button, message, Spin } from "antd";
import { API_URL } from "../../utils/constants";
import {
  getApiWithAuth,
  patchApiWithAuth,
  postApiWithAuth,
} from "../../utils/api";
import { MyCareerGuidanceButton } from "../../components/commonComponents";
import tickIcon from "../../assets/tickIcon.svg";
import Choice1 from "../../assets/Choice1.svg";
import Choice2 from "../../assets/Choice2.svg";
import Choice3 from "../../assets/Choice3.svg";
import Choice4 from "../../assets/Choice4.svg";
import Choice5 from "../../assets/Choice5.svg";

import { useNavigate } from "react-router-dom";
import "./MyChoices.css";
const MyChoices = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [choices, setChoices] = useState([]);
  const [userGetChoices, setUserGetChoices] = useState([]);
  const [data, setData] = useState([]);

  const choicesData = [
    {
      id: "level8",
      icon: Choice1,
      name: "Level 8 Hons Degrees",
    },
    {
      id: "level6",
      icon: Choice2,
      name: "Level 6/7 Ord Degrees of Higher Cert",
    },
    {
      id: "level5",
      icon: Choice3,
      name: "Level 5 PLC/ Further Ed  ",
    },
    {
      id: "apprentice",
      icon: Choice4,
      name: "Level 5/6/7 or 8 Apprenticeships",
    },
    {
      id: "other",
      icon: Choice5,
      name: "Other Options",
    },
  ];
  useEffect(() => {
    getChoices();
  }, []);
  useEffect(() => {
    if (data === undefined) {
      setUserGetChoices([]);
    } else {
      if (data?.length > 0) {
        const filteredOptions = choicesData.filter((option) =>
          data.includes(option.id)
        );

        setUserGetChoices(filteredOptions);
      }
    }
  }, [data]);
  const getChoices = async () => {
    setLoading(true);
    const response = await getApiWithAuth(API_URL.GETCHOICES);
    if (response.data.status === 200) {
      setData(response.data.data[0]);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const selectedChoices = async (selectedItem) => {
    if (!choices.some((choice) => choice.id === selectedItem.id)) {
      if (choices.length + userGetChoices.length < 3) {
        setChoices([...choices, selectedItem]);
      } else {
        message.error("Not Add more then 3 choices");
      }
    } else {
      let filtered_array = choices.filter((item) => item.id != selectedItem.id);
      setChoices(filtered_array);
    }
  };

  const addChoices = async () => {
    if (choices.length === 0) {
      message.error("Select At least one choice");
    } else {
      const postData = choices.map((item) => {
        return {
          [item.id]: true,
        };
      });
      const response = await postApiWithAuth(API_URL.GETCHOICES, postData);
      if (response.data.status === 200) {
        message.success("Choice add successfully");
        setChoices([]);
        getChoices();
        setLoading(false);
      } else {
        setLoading(false);
        message.error("Fail to add");
      }
    }
  };

  const removeChoices = async (data) => {
    const postData = [data].map((item) => {
      return {
        [item.id]: false,
      };
    });
    const response = await postApiWithAuth(API_URL.REMOVECHOICES, postData);
    if (response.data.status === 200) {
      message.success("Choice remove successfully");
      setChoices([]);
      getChoices();
    } else {
      setLoading(false);
      message.error("Fail to remove");
    }
  };
  return (
    <>
      <div className="educationalGuidanceMainDiv">
        <div className="educationalGuidanceSecondDiv">
          <div className="welcomeHaddingText pb-3">Choices</div>
          <div
            style={{
              marginTop: 10,
              background: "#FFFFFF",
              minHeight: 168,
              borderRadius: 10,
              padding: 15,
            }}
          >
            {loading ? (
              <Spin className="noDataChoices" />
            ) : (
              choicesData.map((item, index) => {
                return (
                  <div className={"choicesWithoutBorder"} key={index}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "95px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={item.icon}
                          alt="cyberLegendLogo"
                          className="ps-4"
                        />
                        <div className="ps-4 quizHeadingStyle">{item.name}</div>
                      </div>
                      <div>
                        <Button
                          className="addChoicesButton me-3 "
                          type="primary"
                          htmlType="b"
                          onClick={() =>
                            navigate("/my-choice-edit", {
                              state: { dataa: item },
                            })
                          }
                        >
                          Edit
                        </Button>
                        {/* <Button
                          className="removeChoicesButton me-3 "
                          type="primary"
                          htmlType="b"
                          onClick={() => removeChoices(item)}
                        >
                          Remove
                        </Button> */}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <div className="welcomeHaddingText pt-3">No Selected Choices!</div>
            <Button
              className="addChoicesButton me-3 "
              type="primary"
              htmlType="b"
              onClick={addChoices}
            >
              Add Choice
            </Button>
          </div>
          {choicesData
            .filter(
              (choice) =>
                !userGetChoices.some(
                  (userChoice) => userChoice.id === choice.id
                )
            )
            .map((item, index) => {
              return (
                <div
                  className={
                    choices.some((selectedItem) => selectedItem.id === item.id)
                      ? "choicesWithBorder"
                      : "choicesWithoutBorder"
                  }
                  key={index}
                  onClick={() => selectedChoices(item)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      height: "95px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={item.icon}
                        alt="cyberLegendLogo"
                        className="ps-4"
                      />
                      <div className="ps-4 quizHeadingStyle">{item.name}</div>
                    </div>
                    {choices.some(
                      (selectedItem) => selectedItem.id === item.id
                    ) ? (
                      <img
                        src={tickIcon}
                        alt="cyberLegendLogo"
                        className="pe-4"
                      />
                    ) : null}
                  </div>
                </div>
              );
            })} */}
        </div>
      </div>
    </>
  );
};

export default MyChoices;
