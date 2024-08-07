import React, { useEffect, useState, useRef } from "react";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import styles from "./azureDashboard.module.css";
// import AnswerLogo from "/src/assets/answers.png";
import TypingEffect from "../commonComponents/TypingEffect";
import { Spin } from "antd";
import {
  MyCareerGuidanceButton,
  MyCareerGuidanceInputField,
} from "../../components/commonComponents";
const HelperComponent = ({
  index,
  messageRef,
  item,
  currentAnswerPrint,
  setCurrentAnswerPrint,
  isSpinnerOuter,
  setDisableFields,
  userEmail,
  isLastIndexChat,
}) => {
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [testing, setTesting] = useState(null);
  const textRef = useRef(null);
  {
    console.log("======================item");
  }
  useEffect(() => {
    setCurrentAnswerIndex(item.answers?.length ? item.answers.length - 1 : 0);
  }, [item]);

  const handlePrevious = (length) => {
    if (currentAnswerIndex === 0) return;
    setCurrentAnswerIndex(currentAnswerIndex - 1);
    setCurrentAnswerPrint(false);
  };

  const handleNext = (length) => {
    if (currentAnswerIndex === length - 1) return;
    setCurrentAnswerIndex(currentAnswerIndex + 1);
    setCurrentAnswerPrint(false);
  };

  useEffect(() => {
    textRef.current &&
      textRef.current.scrollIntoView({
        behavior: "auto",
      });
    return () => {};
  }, [testing]);

  return (
    <div key={index} ref={messageRef}>
      <div className={styles.messageArrayQuestionWrapper}>
        <div className={styles.messageArrayQuestion}>
          <div
            style={{
              width: 28,
              height: 28,
              padding: 14,
              // marginTop: 5,
              borderRadius: "50%",
              marginRight: 20,
              background: "black",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 600,
            }}
          >
            {userEmail?.charAt(0).toUpperCase()}
          </div>
          <p>
            {item.question?.charAt(0).toUpperCase() + item.question?.slice(1)}
          </p>
        </div>
      </div>
      <div className={styles.messageArrayAnswerWrapper}>
        {item.answers?.length > 1 ? (
          <div
            style={{
              marginLeft: 25,
              color: "black",
              display: "flex",
              alignSelf: "flex-start",
            }}
          >
            <CaretLeftOutlined
              onClick={() => handlePrevious(item.answers.length)}
              style={{
                color: currentAnswerIndex === 0 ? "grey" : "black",
              }}
            />

            <span>
              {currentAnswerIndex + 1}/{item.answers.length}
            </span>

            <CaretRightOutlined
              onClick={() => handleNext(item.answers.length)}
              style={{
                color:
                  currentAnswerIndex === item.answers.length - 1
                    ? "grey"
                    : "black",
              }}
            />
          </div>
        ) : null}
        <div className={styles.messageArrayAnswer}>
          {isSpinnerOuter && currentAnswerPrint && <Spin />}
          {item.lastAnswer &&
          currentAnswerPrint &&
          currentAnswerIndex == item.answers.length - 1 ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ display: "flex" }}>
                  {/* <img
                src={AnswerLogo}
                alt="AppLogo"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  marginRight: 10,
                  marginTop: 15,
                  background: "red",
                }}
              /> */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      padding: 14,
                      // marginTop: 5,
                      borderRadius: "50%",
                      marginRight: 20,
                      background: "red",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: 600,
                    }}
                  >
                    {userEmail?.charAt(0).toUpperCase()}
                  </div>
                  <TypingEffect
                    text={item.answers[currentAnswerIndex]?.text}
                    key={index}
                    setDisableFields={setDisableFields}
                    setTesting={setTesting}
                    isLastIndex={currentAnswerIndex == item.answers.length - 1}
                  />
                </div>
              </div>
              {isLastIndexChat ? (
                <div
                  ref={messageRef}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    marginTop: 20,
                  }}
                >
                  <MyCareerGuidanceButton
                      // className={styles.responseButton}
                      // showSpinner={regenerateAnswerSpinner}
                      // disabled={disableFields}
                      // onClick={() => {
                      //   regenerateAnswer(
                      //     messageArray.questions[
                      //       messageArray.questions.length - 1
                      //     ]
                      //   );
                      // }}
                      label={
                        <span>
                          {/* <SyncOutlined spin={false} />{" "} */}
                          {"Download"}
                        </span>
                      }
                    />
                </div>
              ) : null}
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              {/* <img
                src={AnswerLogo}
                alt="AppLogo"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  marginRight: 20,
                  marginTop: 15,
                  background: "red",
                }}
              /> */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  padding: 14,
                  // marginTop: 5,
                  borderRadius: "50%",
                  marginRight: 20,
                  background: "red",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 600,
                }}
              >
                {userEmail?.charAt(0).toUpperCase()}
              </div>

              <pre
                style={{
                  width: "100%",
                  overflow: "auto",
                  wordWrap: "break-word",
                }}
              >
                <code
                  className={styles.messageArrayAnswer}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    whiteSpace: "pre-wrap",
                    width: "100%",
                  }}
                >
                  {item.answers[currentAnswerIndex]?.text}
                </code>
              </pre>
            </div>
          )}
        </div>

        <div ref={testing === null ? null : textRef}></div>
      </div>
    </div>
  );
};

export default HelperComponent;
