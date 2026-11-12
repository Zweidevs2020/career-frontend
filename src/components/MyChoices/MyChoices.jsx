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
import caoLevel8Icon from "../../assets/myChoicesTiles/cao-level-8.png";
import caoLevel67Icon from "../../assets/myChoicesTiles/cao-level-6-7.png";
import plcLevel5Icon from "../../assets/myChoicesTiles/plc-level-5.png";
import tertiaryIcon from "../../assets/myChoicesTiles/tertiary-degrees.png";
import apprenticeshipsIcon from "../../assets/myChoicesTiles/apprenticeships.png";
import ucasNiIcon from "../../assets/myChoicesTiles/ucas-northern-ireland.png";
import euDegreesIcon from "../../assets/myChoicesTiles/eu-degrees.png";
import otherOptionsIcon from "../../assets/myChoicesTiles/other-options.png";

import { useNavigate } from "react-router-dom";
import "./MyChoices.css";
const MyChoices = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [choices, setChoices] = useState([]);
  const [userGetChoices, setUserGetChoices] = useState([]);
  const [data, setData] = useState([]);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });


  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  const choicesData = [
    {
      id: "level8",
      icon: caoLevel8Icon,
      name: "CAO Level 8",
    },
    {
      id: "level6",
      icon: caoLevel67Icon,
      name: "CAO Level 6 & 7",
    },
    {
      id: "level5",
      icon: plcLevel5Icon,
      name: "PLC Level 5",
    },
    {
      id: "tertiary",
      icon: tertiaryIcon,
      name: "Tertiary Degrees",
    },
    {
      id: "apprentice",
      icon: apprenticeshipsIcon,
      name: "Apprenticeships",
    },
    {
      id: "ucas-ni",
      icon: ucasNiIcon,
      name: "UCAS Northern Ireland",
    },
    {
      id: "eu_courses",
      icon: euDegreesIcon,
      name: "EU Degrees (In English)",
    },
    {
      id: "other",
      icon: otherOptionsIcon,
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
      <div className="educationalGuidanceMain">
        <div className="educationalGuidanceSecond ">
          <div className="welcomeHaddingText ml-4 !text-white" >My Choices</div>
          <div
            style={{
              marginTop: 10,
              background: "#BB9BE0",
              minHeight: 168,
              borderRadius: 10,
              padding: 15,
            }}
          >
            {loading ? (
              <Spin className="noDataChoices" />
            ) : (
              <div className="myChoicesTiles">
                {choicesData.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index === 4 && (
                      <figure className="myChoicesQuoteTile">
                        <span className="myChoicesQuoteMark" aria-hidden="true">
                          &ldquo;
                        </span>
                        <span className="myChoicesQuoteEyebrow">Stay motivated</span>
                        <blockquote className="myChoicesQuoteText">
                          Your effort today gives you{" "}
                          <span className="myChoicesQuoteHighlight">
                            choices tomorrow.
                          </span>
                        </blockquote>
                        <span className="myChoicesQuoteBar" aria-hidden="true" />
                      </figure>
                    )}
                    <button
                      type="button"
                      className="myChoicesTile"
                      aria-label={item.name}
                      onClick={() => {
                        if (item.id === "apprentice") {
                          navigate("/my-choice-edit", {
                            state: { dataa: item, isApprentice: true },
                          });
                        } else {
                          navigate("/my-choice-edit", {
                            state: { dataa: item },
                          });
                        }
                      }}
                    >
                      <img
                        src={item.icon}
                        alt={item.name}
                        width="340"
                        height="340"
                        decoding="async"
                      />
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyChoices;
