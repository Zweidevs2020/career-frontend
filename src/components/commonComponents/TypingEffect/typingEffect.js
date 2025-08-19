import React, { useState, useEffect } from "react";
import styles from "./typingEffectStyle.module.css";

const TypingEffect = ({ text, setDisableFields, setTesting, isLastIndex }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Ensure that `text` is a string before performing split
  const safeText = text ? String(text) : "";

  console.log("safeText:", safeText); // Log the incoming text

  useEffect(() => {
    let words = safeText.split(" ");
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= words.length) {
        clearInterval(interval);
        setDisableFields(false);
        return;
      }
      setDisplayedText((prevText) => {
        const newText = prevText.trim() + " " + words[currentIndex];
        currentIndex++;
        return newText;
      });
    }, 60); // 60ms interval for typing effect
  }, [safeText]); // Re-run effect if safeText changes

  useEffect(() => {
    console.log("displayedText:", displayedText); // Log the displayedText
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
