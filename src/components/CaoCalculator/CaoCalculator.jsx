import add from "../../assets/add.svg";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import { MyCareerGuidanceButton } from "../../components/commonComponents";
import { Table, Select } from "antd";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./CaoCalculator.css";

const CaoCalculator = () => {
  const [data, setData] = useState({
    points: 0,
    bonus_points: 0,
    total_points: 0,
  });
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subjectsData, setSubjectData] = useState([]);
  const [subjectsLevelsAll, setSubjectLevelsAll] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjectsLevelsAll2, setSubjectLevelsAll2] = useState([]);
  const [loadingFirst, setLoadingFirst] = useState(false);
  const [loadingSecond, setLoadingSecond] = useState(-1);
  const [loadingThird, setLoadingThird] = useState(-1);

  const subjectHandleSelect = (id, record) => {
    setLoadingSecond(record.No);
    const filter = subjects.filter((item) => item.id === id);

    const level = filter[0].level.map((item) => {
      return {
        value: item.level__subjectlevel,
        label: item.level__subjectlevel,
      };
    });
    let temp = subjectsLevelsAll.filter((item) => item.row !== record.No);
    temp.push({ subjectId: id, row: record.No, level: level });
    let sortArray = temp.sort((a, b) => a.row - b.row);
    setSubjectLevelsAll(sortArray);
    setLoadingSecond(-1);
  };
  const levelHandleSelect = async (levelName, record) => {
    setLoadingThird(record.No);
    let singleData = subjectsLevelsAll.filter((item) => item.row === record.No);

    const response = await getApiWithAuth(
      `calculator/check-level-grade/?level=${levelName}&subject=${singleData[0].subjectId}`
    );
    if (response.data.status === 200) {
      const level = response.data.data.map((item) => {
        return {
          value: item.pk,
          label: item.grade,
        };
      });

      let newArray = singleData.map((item) => {
        return { ...item, GradeData: level, levelId: levelName };
      });
      let temp = grades.filter((item) => item.row !== record.No);
      temp.push(newArray[0]);
      let sortArray = temp.sort((a, b) => a.row - b.row);

      setGrades(sortArray);
      setLoadingThird(-1);
    } else {
      setLoadingThird(-1);
    }
  };
  const handleSelect = async (gradeId, record) => {
    let temp = subjectsLevelsAll2.filter((item) => item.row !== record.No);
    temp.push({ row: record.No, grade: gradeId });
    let sortArray = temp.sort((a, b) => a.row - b.row);
    setSubjectLevelsAll2(sortArray);
  };
  const defaultColumns = [
    {
      title: "#",
      dataIndex: "No",
      align: "center",
    },
    {
      title: "Subject",
      dataIndex: "name",
      align: "center",
      render: (_, record) => (
        <>
          <Select
            placeholder={"Pick Subject"}
            options={subjectsData}
            name="name"
            className="selectFieldStyle"
            onChange={(e) => subjectHandleSelect(e, record)}
            bordered={false}
            loading={loadingFirst}
            value={subjectsLevelsAll[record.No]?.subjectId}
          />
        </>
      ),
    },
    {
      title: "Level",
      dataIndex: "level",
      align: "center",
      render: (_, record) => (
        <>
          <Select
            placeholder={"Higher"}
            options={subjectsLevelsAll[record.No]?.level}
            name="school"
            className="selectFieldStyle"
            onChange={(e) => levelHandleSelect(e, record)}
            bordered={false}
            loading={record.No === loadingSecond}
            value={grades[record.No]?.levelId}
          />
        </>
      ),
    },
    {
      title: "Expected Grades",
      align: "center",
      dataIndex: "grades",
      render: (_, record) => (
        <Select
          placeholder={"A1"}
          options={grades[record.No]?.GradeData}
          name="school"
          className="selectFieldStyle"
          onChange={(e) => handleSelect(e, record)}
          bordered={false}
          loading={record.No === loadingThird}
          value={subjectsLevelsAll2[record.No]?.grade}
        />
      ),
    },
  ];
  const [dataSource, setDataSource] = useState([
    {
      No: 0,
      name: "",
      level: "",
      grades: "",
    },
    {
      No: 1,
      name: "",
      level: "",
      grades: "",
    },
    {
      No: 2,
      name: "",
      level: "",
      grades: "",
    },
  ]);

  useEffect(() => {
    if (subjects.length > 0) {
      const subject = subjects.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setSubjectData(subject);
    }
  }, [subjects]);

  const handleAdd = () => {
    const newData = {
      No: dataSource.length,
      name: "",
      level: "",
      grades: "",
    };

    setDataSource([...dataSource, newData]);
  };

  useEffect(() => {
    getSubject();
  }, []);

  const getSubject = async () => {
    setLoadingFirst(true);
    const response = await getApiWithAuth(API_URL.SUBJECTLIST);
    if (response.data.status === 200) {
      setSubjects(response.data.data);
      setLoadingFirst(false);
    } else {
      setLoadingFirst(false);
    }
  };
  const calCulateData = async () => {
    setLoading(true);
    const response = await postApiWithAuth(
      API_URL.CALCULATEDATA,
      subjectsLevelsAll2
    );
    if (response.data.data.success) {
      setData(response.data.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const clearAllData = async () => {
    setSubjectLevelsAll([]);
    setGrades([]);
    setSubjectLevelsAll2([]);
  };

  return (
    <div className="caoMainDiv">
      <div style={{ background: "white" }}>
        <div className="welcomeHaddingText">
          Let’s Calculate Your Grade Points Average{" "}
        </div>
        <div className="cao2ndText py-3">
          Lorem ipsum is a placeholder text commonly used to demonstrate
        </div>
        <div className="coaInnerf8fafcDiv">
          <div className="welcomeHaddingText">My CAO Points: </div>
          <div className="cao2ndText pb-4">
            Lorem ipsum is a placeholder text commonly used to demonstrate
          </div>
          <div className="coaSubjectDiv p-3">
            <div className="coaSubjectWidth">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div className="textStyle18">Subjects</div>
                <div onClick={handleAdd}>
                  <img src={add} alt="" />
                </div>
              </div>
              <Table
                rowClassName={() => "backgroundF4F6F8"}
                dataSource={dataSource}
                columns={defaultColumns}
                pagination={false}
                // bordered
              />
            </div>
            <div className="coaPointsWidth">
              <div
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(25, 132, 255, 0.1) 100%)",
                }}
              >
                <div style={{ padding: 10 }}>
                  <div className="textStyle18">
                    Expected Points for Semester 01
                  </div>
                  <div>
                    <div className="textStyle18">CAO Points</div>
                    <div className="coaPointTextMain">
                      <div className="coaPointTextStyle">Points</div>
                      <div>{data.points ? data.points : 0}</div>
                    </div>
                    <hr />
                    <div className="coaPointTextMain">
                      <div className="coaPointTextStyle">Bonus Points</div>
                      <div>{data.bonus_points ? data.bonus_points : 0}</div>
                    </div>
                    <hr />
                    <div className="coaPointTextMain">
                      <div className="coaPointTextStyle">Final Points</div>
                      <div>{data.total_points ? data.total_points : 0}</div>
                    </div>
                    <hr />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 20,
                      }}
                    >
                      <div className="circularBarMainDiv">
                        <div style={{ width: 130 }}>
                          <CircularProgressbarWithChildren
                            value={data}
                            minValue={0}
                            maxValue={1000}
                            styles={buildStyles({
                              rotation: 0.72,
                              strokeLinecap: "dashboard",
                              textSize: "19px",
                              pathTransitionDuration: 0.5,
                              pathColor: "#1476B7",
                              textColor: "#263238",
                              trailColor: "#d6d6d6",
                            })}
                          >
                            <div className="welcomeHaddingText">
                              {data.total_points ? data.total_points : 0}
                            </div>
                            <div className="cao2ndText">
                              <strong>Points</strong>
                            </div>
                          </CircularProgressbarWithChildren>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <MyCareerGuidanceButton
                  label="Clear All"
                  className="clearAllButton"
                  type="primary"
                  htmlType="button"
                  // loading={loading}
                  onClick={clearAllData}
                />
                <MyCareerGuidanceButton
                  label="Calculate"
                  className="calculateButton"
                  type="primary"
                  htmlType="button"
                  disabled={subjectsLevelsAll2.length < 1}
                  onClick={calCulateData}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaoCalculator;
