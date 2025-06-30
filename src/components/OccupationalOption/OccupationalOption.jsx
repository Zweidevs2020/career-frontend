import { Button } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
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
  return (
    <div className="educationalGuidanceMainDiv">
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
            style={{ color: "#1476B7", fontWeight: 600 }}
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
                <div className="textStyle18 pt-1 pb-3">{item.description}</div>
              </div>
            );
          })
        ) : (
          <p className="" dangerouslySetInnerHTML={{__html: idData.idea}}></p>
        )}
      </div>
    </div>
  );
};

export default OccupationalOption;
