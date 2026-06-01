import { Button } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import styles from "./occupational.module.css";

const OccupationalOption = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let param = useParams();
  const [loading, setLoading] = useState(false);
  const [idData, setIdData] = useState({});
  const [idDataArray, setIdDataArray] = useState([]);

  const infoData = location.state || {};
  useEffect(() => {
    getData(infoData);
  }, [infoData]);

  const getData = async (infoData) => {
    setLoading(true);
    const response = await getApiWithAuth(
      `/psychometric/${infoData.buttonitem.path}/${infoData.item.id}/`
    );
    if (response.data.status === 200) {
      if (infoData.buttonitem.path === "study-tips") {
        setIdDataArray(response.data.data);
      } else {
        setIdData(response.data.data);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const dummyText =
    `Lorem ipsum dolor sit amet consectetur adipisicing elit Hic minus fuga nemo perspiciatis nihil dolor ipsum at possimus vel accusamus recusandae quam fugiat qu idem veniam voluptates atque est sequi iste`
      .split(" ")
      .join(", ");

  const escapeHtml = (text = "") =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const formatProfessionalHtml = (content = "") => {
    if (!content || typeof content !== "string") return "";

    const trimmed = content.trim();
    const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(trimmed);
    if (hasHtmlTags) return trimmed;

    const numberedPoints = trimmed.match(/\d+\.\s[\s\S]*?(?=(?:\s+\d+\.\s)|$)/g);
    if (numberedPoints && numberedPoints.length > 1) {
      const listItems = numberedPoints
        .map((point) => point.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean)
        .map((point) => `<li>${escapeHtml(point)}</li>`)
        .join("");

      return `<ol>${listItems}</ol>`;
    }

    const lines = trimmed
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
  };

  return (
    <div className="mySelfTwo">
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <Button
          className="skillsButton"
          type="primary"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>
      <div>
          <div
            className="textStyle18 pt-5 pb-3"
            style={{ color: "#363636", fontWeight: 600 }}
          >
            {infoData.item.question_type} {infoData.buttonitem.name}
          </div>


        {infoData.buttonitem.path === "study-tips" ? (
          idDataArray?.map((item, index) => {
            return (
              <div>
                <div
                  className="textStyle18 pt-1 pb-3"
                  style={{ fontWeight: 600 }}
                >
                </div>
                <div
                  className={`${styles.htmlParser} textStyle18 pt-1 pb-3`}
                  dangerouslySetInnerHTML={{
                    __html: formatProfessionalHtml(item.description),
                  }}
                ></div>
              </div>
            );
          })
        ) : (
          <>
          <div
            className={styles.htmlParser}
            dangerouslySetInnerHTML={{ __html: formatProfessionalHtml(idData.idea) }}
          ></div>
          
          </>
        )}
      </div>
    </div>
  );
};

export default OccupationalOption;
