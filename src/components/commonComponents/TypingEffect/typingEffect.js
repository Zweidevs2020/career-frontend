import React, { useState, useEffect, useRef } from "react";
import styles from "./typingEffectStyle.module.css";

const TypingEffect = ({ text, setDisableFields, setTesting,isLastIndex }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let words = text.split(" ");
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= words.length) {
        clearInterval(interval);
        setDisableFields((pre) => false);
        return;
      }
      setDisplayedText((prevText) => {
        const newText = prevText.trim() + " " + words[currentIndex];
        currentIndex++;
        return newText;
      });
    }, 60);
  }, [text]);

  useEffect(() => {
    setTesting(displayedText);
  }, [displayedText]);

  return (
    <pre style={{ width: "100%", overflow: "auto", wordWrap: "break-word" }}>
      <code
        className={styles.messageArrayAnswer}
        style={{
          display: "flex",
          flexDirection: "column",
          whiteSpace: "pre-wrap",
          width: "100%",
        }}
      >
        {displayedText}
        </code>
    </pre>
  );
};

export default TypingEffect;
