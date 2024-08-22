import React, { useState, useEffect, useRef } from "react";
import { Button, Select, Table, Space, message } from "antd";
import add from "../../assets/add.svg";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { MyCareerGuidanceButton } from "../commonComponents";
import "react-circular-progressbar/dist/styles.css";
import "./CaoCalculator.css";
import { Spin } from "antd";
import {
  deleteApiWithAuth,
  getApiWithAuth,
  postApiWithAuth,
} from "../../utils/api";
import { API_URL } from "../../utils/constants";
import {
  PlusCircleFilled,
  PlusCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  ClearOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import Column from "antd/es/table/Column";

const { Option } = Select;

const CaoCalculator = () => {
  const refDiv = useRef();
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
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [subjectErrors, setSubjectErrors] = useState({});
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [dataId, setDataId] = useState(null);
  const [dataLength, setDataLength] = useState(0);
  const [finalData, setFinalData] = useState({
    points: 0,
    bonus_points: 0,
    total_points: 0,
  });

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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
  ]);

  useEffect(() => {
    const idExistsLength = tableData.filter(
      (item) => item.id !== undefined
    ).length;
    setDataLength(idExistsLength);
  }, [tableData]);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    const encodedLevel = encodeURIComponent(tableData[index].name);
    const response = await getApiWithAuth(
      `calculator/check-level-grade/?level=${tableData[index].level}&subject=${encodedLevel}`
    );
    if (response?.data?.status === 200) {
      setLoadingThird(false);
      setCurrectState(-1);
      setGrades(response.data.data);
      if (response?.data?.data.length > 0) {
        const options = response?.data?.data?.map((e) => ({ value: e.grade }));
        setThirdDropdownOptions(options);

      }
    }
  };

  const handleFirstDropdownChange = (value, record) => {
    const isDuplicate = tableData.some((item) => item.name === value);

    if (isDuplicate) {
      const errorMessages = { ...subjectErrors };
      errorMessages[record.No] = "Subject already selected";
      setSubjectErrors(errorMessages);
      const tempData = tableData.map((item) =>
        item.No === record.No
          ? {
              ...item,
              name: "",
              level: null,
              grades: null,
            }
          : item
      );

      setTableData(tempData);

      return;
    } else if (!isDuplicate) {
      const errorMessages = { ...subjectErrors };
      delete errorMessages[record.No];
      setSubjectErrors(errorMessages);
    }
    setAvailableSubjects((prevSubjects) =>
      prevSubjects.filter((subject) => subject !== value)
    );

    const tempData = tableData.map((item) =>
      item.No === record.No
        ? {
            ...item,
            name: value,
            level: null,
            grades: null,
          }
        : item
    );

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

  const handle = (value, record) => {
    const tempData = tableData?.map((item, index) => {
      if (item?.No === record?.No) {
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

  let isDeleteButtonDisabled = dataLength < 6;
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
            style={{ cursor: "pointer" }}
            loading={loadingFirst}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {availableSubjects.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
          {subjectErrors[record?.No] && (
            <div
              style={{ color: "red", fontSize: "12px", marginBottom: "-1rem" }}
            >
              {subjectErrors[record?.No]}
            </div>
          )}
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
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {/* <RollbackOutlined
            {...console.log(
              "i am good",
              isDeleteButtonDisabled,
              tableData[record?.No]?.No,
              tableData[record?.No]?.No > 5 && isDeleteButtonDisabled
            )}
            style={{
              color:
                tableData[record?.No]?.No > 5 ||
                tableData[record?.No]?.No === undefined
                  ? "red"
                  : isDeleteButtonDisabled
                  ? "grey"
                  : "red",
            }}
            onClick={
              tableData[record?.No]?.No > 5 ||
              tableData[record?.No]?.No === undefined
                ? () => handleDelete(record.No)
                : isDeleteButtonDisabled
                ? null
                : () => handleDelete(record.No)
            }
            disabled={
              tableData[record?.No]?.No > 5 ||
              tableData[record?.No]?.No === undefined
                ? false
                : isDeleteButtonDisabled
                ? true
                : false
            }
          /> */}
          <DeleteOutlined
            style={{
              color: "red",
            }}
            onClick={() => handleDelete(record.No)}
          />
        </Space>
      ),
    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (text, record) => (
    //     <Space size="middle">

    //       <DeleteOutlined
    //      {... console.log("i am good",isDeleteButtonDisabled)}
    //         style={{ color: isDeleteButtonDisabled && tableData.length<8 ? 'grey' : 'red' }}
    //         onClick={() => handleDelete(record.No)}
    //         disabled={!isDeleteButtonDisabled && tableData.length<8 }
    //       />
    //     </Space>
    //   ),
    // },
  ];

  // const handleDelete = async (id) => {
  //   console.log(
  //     "==================table data lenght",
  //     dataLength,
  //     tableData,
  //     id
  //   );
  //   const idExistsLength = tableData.filter(
  //     (item) => item.id !== undefined
  //   ).length;
  //   console.log(
  //     'Length of tableData elements with "id" property:',
  //     idExistsLength
  //   );
  //   const filteredTable = tableData.filter((item) => item.No == id);
  //   if (
  //     filteredTable[0]?.name == null ||
  //     filteredTable[0]?.grades == null ||
  //     filteredTable[0]?.level === null
  //   ) {
  //     console.log("t==================table data lenght empty", filteredTable);

  //     const filteredTableData = tableData.filter((item) => item.No !== id);
  //     setTableData(filteredTableData);
  //   } else {
  //     if (idExistsLength >= 6) {
  //       console.log(
  //         "t==================table data lenght not empty",
  //         filteredTable.name == null,
  //         filteredTable.name == null &&
  //           filteredTable.grades == null &&
  //           filteredTable.level === null
  //       );

  //       const targetIndex = tableData.findIndex((item) => item.No === id);
  //       const deletedRowData = tableData[targetIndex];

  //       const body = {
  //         id: dataId,
  //         subjectId: deletedRowData.id,
  //       };

  //       const response = await postApiWithAuth(
  //         `calculator/remove-subject-grade/`,
  //         body
  //       );

  //       if (response?.data?.status === 200) {
  //         // setData(response.data.data);
  //         getCurrectSelectedValues();
  //         // window.location.reload();
  //       }
  //     }
  //   }
  // };

  const handleDelete = async (id) => {
    const idExistsLength = tableData.filter(
      (item) => item.id !== undefined
    ).length;

    const filteredTable = tableData.filter((item) => item.No == id);
    if (
      filteredTable[0]?.name == null &&
      filteredTable[0]?.grades == null &&
      filteredTable[0]?.level === null
    ) {
      if (tableData?.length > 6) {
        const filteredTableData = tableData.filter((item) => item.No !== id);
        const saveData = filteredTableData.map((item, index) => {
          return { ...item, No: index };
        });
        setTableData(saveData);
      }
    } else {
      const targetIndex = tableData.findIndex((item) => item.No === id);
      const deletedRowData = tableData[targetIndex];

      const body = {
        id: dataId,
        subjectId: deletedRowData.id,
      };
      if (deletedRowData.id) {
        const response = await postApiWithAuth(
          `calculator/remove-subject-grade/`,
          body
        );

        if (response?.data?.status === 200) {
          // setData(response.data.data);
          getCurrectSelectedValues();
          // window.location.reload();
        }
      } else {
        let data = tableData.map((item) => {
          if (item.No === targetIndex) {
            return { No: targetIndex, name: null, level: null, grades: null };
          } else {
            return item;
          }
        });
        setTableData(data);
        // getCurrectSelectedValues();
      }
    }
    // setFinalData({
    //   points: 0,
    //   bonus_points: 0,
    //   total_points: 0,
    // });
    getFiltersData();
  };

  const clearAllData = async () => {
    const response1 = await getApiWithAuth(`calculator/user-points/`);
    console.log("====anees", response1?.data?.data[0]);
    if (response1?.data?.data[0]) {
      console.log("===res", response1);
      const response = await deleteApiWithAuth(
        `calculator/user-points/delete/${response1?.data?.data[0]?.id}/`
      );

      if (response?.data?.status === 204) {
        setFinalData({
          points: 0,
          bonus_points: 0,
          total_points: 0,
        });
        getFiltersData();
        getCurrectSelectedValues();
        // window.location.reload();
      }
    } else {
      setFinalData({
        points: 0,
        bonus_points: 0,
        total_points: 0,
      });
      setTableData([
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
      ]);
    }
  };

  useEffect(() => {
    console.log("============cal 0", gradeId);
  }, [gradeId]);
  const calCulateData = async () => {
    if (loadingSub === false) {
      setLoading(true);

      const response = await postApiWithAuth(API_URL.CALCULATEDATA, gradeId);
      if (response.data.data.success) {
        setFinalData(response.data.data.data);
        // getCurrectSelectedValues()
        getFiltersData();
        getCurrectSelectedValues();
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      getCurrectSelectedValues();
    }
  }, [data]);

  useEffect(() => {
    getFiltersData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const subjects = data.map((item) => item.name);
      setAvailableSubjects(subjects);
    }
  }, [data]);

  const getFiltersData = async () => {
    setLoadingFirst(true);
    const response = await getApiWithAuth(API_URL.SUBJECTLIST);
    console.log("============cal 1", response);

    if (response?.data?.status === 200) {
      setData(response.data.data);
      setLoadingFirst(false);
    } else {
      setLoadingFirst(false);
    }
  };

  const getCurrectSelectedValues = async () => {
    setLoadingSub(true);
    setGradeId([]);
    let filterGrade = [];
    let newData = [];
    try {
      const response = await getApiWithAuth(`calculator/user-points/`);
      let checkLength = response.data.data[0].grades.map((obj) => ({
        grade: obj.id,
      }));
      console.log("============cal 2", checkLength, response);
      if (checkLength.length > 0) {
        const response2 = await postApiWithAuth(
          API_URL.CALCULATEDATA,
          response.data.data[0].grades.map((obj) => ({ grade: obj.id }))
        );
        console.log("============cal 3", response2);
        if (response2.data.data.success) {
          setFinalData(response2.data.data.data);
          const response = await getApiWithAuth(`calculator/user-points/`);
          setDataId(response.data.data[0].id);
          setDataLength(response.data.data.length);

          setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        setFinalData({
          points: 0,
          bonus_points: 0,
          total_points: 0,
        });
      }

      // setFinalData({
      //   points: response?.data?.data[0]?.total_points,
      //   bonus_points: response?.data?.data[0]?.total_points,
      //   total_points: response?.data?.data[0]?.total_points,
      // });
      // setDataLength(response.data.data.length);
      // setDataId(response.data.data[0].id);

      if (response.data.data.length === 0) {
        for (let i = 0; i < tableData.length; i++) {
          const ND = {
            No: i,
            name: null,
            level: null,
            grades: null,
          };
          newData.push(ND);
        }
      } else if (response.data.data.length !== 0) {
        newData = response?.data?.data[0]?.grades.map((item, index) => {
          const filterSubjects = data.filter(
            (SubItem) => SubItem.id == item?.subject
          );

          const filterLevel = filterSubjects[0].level.filter(
            (levelItem) => levelItem.level__id == item.level
          );

          const newObj = {
            id: item.id,
            No: index,
            name: filterSubjects[0].name,
            level: filterLevel[0].level__subjectlevel,
            grades: item.grade,
          };
          return newObj;
        });

        for (let i = 0; i < newData?.length; i++) {
          const response1 = await getApiWithAuth(
            `calculator/check-level-grade/?level=${newData[i].level}&subject=${newData[i].name}`
          );

          if (response1.data.status === 200) {
            filterGrade = response1?.data?.data.filter(
              (gradeItem) => gradeItem.grade == newData[i]?.grades
            );
          }

          setGradeId((prevState) => {
            const newGrade = { grade: filterGrade[0]?.pk };
            const updatedGradeId = [...prevState, newGrade];
            const uniqueGradeSet = new Set(
              updatedGradeId.map((item) => item.grade)
            );

            const uniqueGradeArray = Array.from(uniqueGradeSet).map(
              (grade) => ({ grade })
            );

            return uniqueGradeArray;
          });
        }
      }
    } catch (error) {
    } finally {
      const remainingEmptyRows = tableData.length - newData.length;
      const emptyRows = Array.from(
        { length: remainingEmptyRows },
        (_, index) => ({
          No: newData.length + index,
          name: null,
          level: null,
          grades: null,
        })
      );
      const combinedData = [...newData, ...emptyRows];

      setCountFields(combinedData.length);
      setTableData(combinedData);
      setLoadingSub(false);
    }
  };

  return (
    <div className="caoMainDiv">
      <div style={{ background: "white" }}>
        <div className="coaInnerf8fafcDiv">
          <div className="welcomeHaddingText">My CAO Points: </div>

          {screenSize.width > "748" ? (
            <div className="coaSubjectDiv p-3">
              {/* <div className="coaSubjectWidth"> */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Table
                  dataSource={tableData}
                  columns={columns}
                  // loading={true}
                  rowClassName={() => "backgroundF4F6F8"}
                  pagination={false}
                  loading={loadingFirst}
                />

                {/* <div className="addSubjectContainer">
                  <MyCareerGuidanceButton
                    label="Add Subject"
                    className="addSubjectButton"
                    htmlType="button"
                    onClick={handleAdd}
                    icon={<PlusOutlined />}
                    // loading={loadingThird}
                  />
                </div> */}
              </div>
              {/* </div> */}
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
                              <div className="caoHeadingText">
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
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="textStyle18"> Points</div>
                        <div className="">
                          <div>{finalData.points ? finalData.points : 0}</div>
                        </div>
                      </div>
                      <hr />
                      <hr />

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 10,
                        }}
                      >
                        <div className="textStyle18"> Bonus Points</div>
                        <div className="">
                          <div>
                            {finalData.bonus_points
                              ? finalData.bonus_points
                              : 0}
                          </div>
                        </div>
                      </div>

                      <hr />

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
                              <div className="caoHeadingText">
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
                <div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <MyCareerGuidanceButton
                      label="Clear All"
                      className="clearAllButton"
                      type="primary"
                      htmlType="button"
                      onClick={clearAllData}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
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
              <div className="coaSubjectWidth" style={{ paddingTop: "30px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="mobileTable">
                    {tableData.map((item, index) => (
                      <div className="mobileTableRow " key={index}>
                        <div className="mobileTableHeader mt-2">
                          Subject {index + 1}
                        </div>
                        <div
                          className="py-2"
                          style={{ background: " #F4F6F8" }}
                        >
                          <div className="mobileTableCell my-3">
                            <Select
                              placeholder="Select Subject"
                              value={item?.name}
                              onChange={(value) =>
                                handleFirstDropdownChange(value, item)
                              }
                              className="selectFieldStyle"
                              loading={loadingFirst}
                              showSearch
                              filterOption={(input, option) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {availableSubjects.map((item) => (
                                <Option key={item} value={item}>
                                  {item}
                                </Option>
                              ))}
                            </Select>
                            {subjectErrors[index] && (
                              <div
                                style={{
                                  color: "red",
                                  fontSize: "12px",
                                  marginLeft: "1rem",
                                }}
                              >
                                {subjectErrors[index]}
                              </div>
                            )}
                          </div>
                          <div className="mobileTableCell my-3">
                            <Select
                              placeholder="Select Level"
                              value={item?.level}
                              onChange={(value) =>
                                handleSecondDropdownChange(value, item)
                              }
                              className="selectFieldStyle"
                            >
                              {data
                                .find((subject) => subject?.name === item?.name)
                                ?.level?.map((level) => (
                                  <Option
                                    key={level?.level__id}
                                    value={level?.level__subjectlevel}
                                  >
                                    {level?.level__subjectlevel}
                                  </Option>
                                ))}
                            </Select>
                          </div>
                          <div className="mobileTableCell my-3">
                            <Select
                              placeholder="Select Grade"
                              value={item?.grades}
                              onChange={(value) => handle(value, item)}
                              onClick={() => handleThridDropDownApi(index)}
                              className="selectFieldStyle"
                              loading={index === currentState}
                            >
                              {thirdDropdownOptions.map((option) => (
                                <Option key={option.id} value={option.value}>
                                  {option?.label}
                                </Option>
                              ))}
                            </Select>
                          </div>
                          {/* <DeleteOutlined
                            style={{
                              color: isDeleteButtonDisabled ? "grey" : "red",
                              display: "flex",
                              justifyContent: "center",
                            }}
                            onClick={() => handleDelete(item.No)}
                            disabled={!isDeleteButtonDisabled}
                            className={isDeleteButtonDisabled ? "disabled" : ""}
                          /> */}
                          <DeleteOutlined
                            style={{
                              color: "red",
                              display: "flex",
                              justifyContent: "center",
                            }}
                            onClick={() => handleDelete(item.No)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div style={{ display: "flex", justifyContent: "center" }}>
                  <MyCareerGuidanceButton
                    label="Add Subject"
                    className="addSubjectButton mt-2"
                    htmlType="button"
                    onClick={handleAdd}
                    icon={<PlusOutlined />}
                    // loading={loadingThird}
                  />
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaoCalculator;
