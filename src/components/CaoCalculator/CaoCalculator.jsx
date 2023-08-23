import React, { useState, useEffect, useRef } from "react";
import { Button, Select, Table } from "antd";
import add from "../../assets/add.svg";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { MyCareerGuidanceButton } from "../commonComponents";
import "react-circular-progressbar/dist/styles.css";
import "./CaoCalculator.css";
import { Spin } from "antd";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import { API_URL } from "../../utils/constants";
import { PlusCircleFilled, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const CaoCalculator = () => {
  const refDiv = useRef();
  const [finalData, setFinalData] = useState({
    points: 0,
    bonus_points: 0,
    total_points: 0,
  });
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
  const [countFields, setCountFields] = useState(0);
  const [firstDropdownValue, setFirstDropdownValue] = useState("");
  const [secondDropdownValue, setSecondDropdownValue] = useState("");
  const [thirdDropdownValue, setThirdDropdownValue] = useState("");
  const [loadingFirst, setLoadingFirst] = useState(false);
  const [loadingThird, setLoadingThird] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [gradeId, setGradeId] = useState([]);
  const [gradeIdApi, setGradeIdApi] = useState([]);
  const [gradeId1, setGradeId1] = useState([{}, {}]);

  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState("");
  const [level, setLevel] = useState("");
  const [grade, setGrade] = useState("");
  const [thirdDropdownOptions, setThirdDropdownOptions] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [currentState, setCurrectState] = useState(-1);

  const [tableData, setTableData] = useState([
    {
      No: 0,
      name: null,
      level: null,
      grades: null,
    },
    {
      No: 1,
      name: null,
      level: null,
      grades: null,
    },
    {
      No: 2,
      name: null,
      level: null,
      grades: null,
    },
    {
      No: 3,
      name: null,
      level: null,
      grades: null,
    },
    {
      No: 4,
      name: null,
      level: null,
      grades: null,
    },
    {
      No: 5,
      name: null,
      level: null,
      grades: null,
    },
    {
      No: 6,
      name: null,
      level: null,
      grades: null,
    },
  ]);



  const handleAdd = () => {
    setLoadingSub(false);
    setCountFields(countFields + 1);
    const newData = {
      No: tableData?.length,
      name: null,
      level: null,
      grades: null,
    };

    setTableData([...tableData, newData]);
  };

  useEffect(() => {
    if (firstDropdownValue !== "" && secondDropdownValue !== "") {

    }
  }, [firstDropdownValue, secondDropdownValue]);

  const handleThridDropDownApi = async (index) => {
    setLoadingThird(true);
    setCurrectState(index);
    setThirdDropdownOptions([]);
    const response = await getApiWithAuth(
      `calculator/check-level-grade/?level=${tableData[index].level}&subject=${tableData[index].name}`
    );
    if (response?.data?.status === 200) {
      setLoadingThird(false);
      setCurrectState(-1);
      setGrades(response.data.data);
      const options = response.data.data.map((e) => ({ value: e.grade }));
      setThirdDropdownOptions(options);
    }
  };

  const handleFirstDropdownChange = (value, record) => {

    const tempData = tableData?.map((item, index) => {
      if (item?.No == record?.No) {
        return {
          ...item,
          name: value,
          level: null,
          grades: null,
        };
      } else {
        return item;
      }
    });

    setTableData(tempData);

  };

  const handleSecondDropdownChange = (value, record) => {
    const tempData = tableData?.map((item, index) => {
      if (item?.No == record?.No) {
        return {
          ...item,
          level: value,
          grades: null,
        };
      } else {
        return item;
      }
    });
    setTableData(tempData);


  };

  const handleThirdDropdownChange = (value, index) => {
    if (index == 0) setGradeId(value);
    else
      setThirdDropdownValue(value);
  };

  const handle = (value, record) => {
    const tempData = tableData?.map((item, index) => {

      if (item?.No == record?.No) {
        return {
          ...item,
          grades: value,
        };
      } else {
        return item;
      }
    });
    setTableData(tempData);


    const gradeid = grades?.filter((item) => item?.grade === value);

    setGradeId((prevState) => {
      const newArray = [...prevState];

      newArray[record.No] = { grade: gradeid[0]?.pk };
      return newArray;
    });


  };

  const columns = [

    {
      title: "Subject",
      dataIndex: "name",
      align: "center",
      render: (_, record) => (
        <>

          <Select
            placeholder={loadingSub ? <Spin size="small" /> : "Select Subject"}
            value={tableData[record?.No]?.name}
            onChange={(e) => handleFirstDropdownChange(e, record)}
            className="selectFieldStyle"
            loading={loadingFirst}
            key={record}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {data?.map((item) => (
              <Option key={item.name} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </>
      ),
    },
    {
      title: "Level",
      dataIndex: "name",
      align: "center",
      render: (_, record) => {
        return (
          <>
            <Select
              placeholder={loadingSub ? <Spin size="small" /> : "Select Level"}
              value={tableData[record?.No]?.level}
              onChange={(e) => handleSecondDropdownChange(e, record)}
              className="selectFieldStyle"
              key={record}
            >
              {tableData[record?.No]?.name &&
                data
                  .find((item) => item.name == tableData[record?.No]?.name)
                  ?.level?.map((level) => (
                    <Option
                      key={level?.level__id}
                      value={level?.level__subjectlevel}
                    >
                      {level?.level__subjectlevel}
                    </Option>
                  ))}
            </Select>
          </>
        );
      },
    },
    {
      title: "Expected_Grades",
      dataIndex: "name",
      align: "center",
      render: (_, record) => (

        <Select
          key={record}
          placeholder={loadingSub ? <Spin size="small" /> : "Select Grade"}
          value={tableData[record?.No]?.grades}

          onChange={(value) => handle(value, record)}
          onClick={() => handleThridDropDownApi(record.No)}
          className="selectFieldStyle"
          loading={record?.No === currentState}
        >

          {tableData[record?.No]?.level &&
            thirdDropdownOptions.map((option) => (

              <Option key={option.id} value={option.value}>
                {option.label}
              </Option>
            ))}
        </Select>
      ),
    },
  ];

  const clearAllData = async () => {

    const completeTableData = tableData.map((item) => {
      item.name = null;
      item.grades = null;
      item.level = null;
    });
    setTableData(completeTableData);

    const response1 = await postApiWithAuth(API_URL.CALCULATEDATA, tableData)
    const response2 = await getApiWithAuth(API_URL.SUBJECTLIST);

    if (response2?.data?.status === 200) {
      setData(response2.data.data);
    }
   
  };

  const calCulateData = async () => {
    setLoading(true);
    const response = await postApiWithAuth(API_URL.CALCULATEDATA, gradeId);
    if (response.data.data.success) {
      setFinalData(response.data.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFiltersData();
  }, []);

  useEffect(() => {

    if (data.length > 0) {

      getCurrectSelectedValues();

    }

  }, [data]);


  const getFiltersData = async () => {
    setLoadingFirst(true);
    const response = await getApiWithAuth(API_URL.SUBJECTLIST);

    if (response?.data?.status === 200) {
      setData(response.data.data);
      setLoadingFirst(false);
    } else {
      setLoadingFirst(false);
    }
  };

  const getCurrectSelectedValues = async () => {
    setLoadingSub(true);
    let NewDataTable = [];
    let filterGrade = [];
    let count = 1;

    const response = await getApiWithAuth(`calculator/user-points/`);

    if (response.data.data.length === 0) {
      setLoadingSub(false);
      for (let i = 0; i <= tableData.length; i++) {
        const ND = {
          name: null,
          level: null,
          grades: null,
        };
      }
    } else if (response.data.data.length !== 0) {
      const newData = response?.data?.data[0]?.grades.map((item, index) => {
        const filterSubjects = data.filter(
          (SubItem) => SubItem.id == item?.subject
        );

        const filterLevel = filterSubjects[0].level.filter(
          (levelItem) => levelItem.level__id == item.level
        );

        const newObj = {
          No: index,
          name: filterSubjects[0].name,
          level: filterLevel[0].level__subjectlevel,
          grades: item.grade,
        };
        return newObj;
      });
      setCountFields(newData?.length + 1);
      for (let i = 0; i < newData?.length; i++) {

        const response1 = await getApiWithAuth(
          `calculator/check-level-grade/?level=${newData[i].level}&subject=${newData[i].name}`
        );


        if (response1.data.status === 200) {

          filterGrade = response1?.data?.data.filter(
            (gradeItem) => gradeItem.grade == newData[i]?.grades
          );
        }

        gradeId.push({ grade: filterGrade[0]?.pk });
      }

      for (let j = newData?.length + 1; j <= countFields; j++) {
        const ND = {
          name: null,
          level: null,
          grades: null,
        };
        newData.push(ND);
      }

      setTableData(newData)

    }

  };


  return (
    <div className="caoMainDiv">
      <div style={{ background: "white" }}>

        <div className="coaInnerf8fafcDiv">
          <div className="welcomeHaddingText">My CAO Points: </div>

          {screenSize.width > "748" ? (
            <div className="coaSubjectDiv p-3">
              <div className="coaSubjectWidth">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                ></div>

                {/* {loadingFirst ? ( */}
                {/* <Spin className="spinStyle" /> */}
                {/* ) : ( */}
                <Table
                  dataSource={tableData}
                  columns={columns}
                  // loading={true}
                  rowClassName={() => "backgroundF4F6F8"}
                  pagination={false}
                  loading={loadingFirst}
                />
                {/* )}  */}
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <MyCareerGuidanceButton
                    label="Add Subject"
                    className="addSubjectButton"
                    htmlType="button"
                    onClick={handleAdd}
                  // loading={loadingThird}
                  />
                </div>
              </div>
              <div className="coaPointsWidth coaPointsWidth">
                <div
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(25, 132, 255, 0.1) 100%)",
                  }}
                >
                  <div style={{ padding: 10 }}>

                    <div>
                      <div className="textStyle18">My CAO Points.</div>
                      <div className="coaPointTextMain">
                        <div className="coaPointTextStyle">Points</div>
                        <div>{finalData.points ? finalData.points : 0}</div>
                      </div>
                      <hr />
                      <div className="coaPointTextMain">
                        <div className="coaPointTextStyle">Bonus Points</div>
                        <div>
                          {finalData.bonus_points ? finalData.bonus_points : 0}
                        </div>
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
                              value={finalData}
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
                                {finalData.total_points
                                  ? finalData.total_points
                                  : 0}
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
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <MyCareerGuidanceButton
                    label="Clear All"
                    className="clearAllButton"
                    type="primary"
                    htmlType="button"
                    onClick={clearAllData}
                  />
                  <MyCareerGuidanceButton
                    label="Calculate"
                    className="calculateButton"
                    type="primary"
                    htmlType="button"
                    onClick={calCulateData}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="coaSubjectDiv p-3">
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
                        <div>{finalData.points ? finalData.points : 0}</div>
                      </div>
                      <hr />

                      <hr />
                      <div className="coaPointTextMain">
                        <div className="coaPointTextStyle">Final Points</div>
                        <div>
                          {finalData.total_points ? finalData.total_points : 0}
                        </div>
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
                              value={finalData}
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
                                {finalData.total_points
                                  ? finalData.total_points
                                  : 0}
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
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <MyCareerGuidanceButton
                    label="Clear All"
                    className="clearAllButton"
                    type="primary"
                    htmlType="button"
                    onClick={clearAllData}
                  />
                  <MyCareerGuidanceButton
                    label="Calculate"
                    className="calculateButton"
                    type="primary"
                    htmlType="button"
                    onClick={calCulateData}
                    loading={loading}
                  />
                </div>
              </div>
              <div className="coaSubjectWidth" style={{ paddingTop: "30px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="textStyle18">Subjects</div>
                  <div onClick={handleAdd} style={{ cursor: "pointer" }}>
                    <span>Add more row</span>
                  </div>
                </div>

                <Table
                  dataSource={tableData}
                  columns={columns}
                  rowClassName={() => "backgroundF4F6F8"}
                  pagination={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaoCalculator;
