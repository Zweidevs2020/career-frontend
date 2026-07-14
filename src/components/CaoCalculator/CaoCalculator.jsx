"use client"

import { useState, useEffect, useRef } from "react"
import { Select, Table, Space } from "antd"
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar"
import { MyCareerGuidanceButton } from "../commonComponents"
import "react-circular-progressbar/dist/styles.css"
import "./CaoCalculator.css"
import { Spin } from "antd"
import { deleteApiWithAuth, getApiWithAuth, postApiWithAuth } from "../../utils/api"
import { API_URL } from "../../utils/constants"
import { PlusOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons"

const { Option } = Select

const CAOCalculator = ({ closePopup }) => {
  const refDiv = useRef()
  const [countFields, setCountFields] = useState(0)
  const [firstDropdownValue, setFirstDropdownValue] = useState("")
  const [secondDropdownValue, setSecondDropdownValue] = useState("")
  const [thirdDropdownValue, setThirdDropdownValue] = useState("")
  const [loadingFirst, setLoadingFirst] = useState(false)
  const [loadingThird, setLoadingThird] = useState(false)
  const [loadingSub, setLoadingSub] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [gradeId, setGradeId] = useState([])
  const [gradeIdApi, setGradeIdApi] = useState([])
  const [gradeId1, setGradeId1] = useState([{}, {}])
  const [grades, setGrades] = useState([])
  const [subjects, setSubjects] = useState("")
  const [level, setLevel] = useState("")
  const [grade, setGrade] = useState("")
  const [thirdDropdownOptions, setThirdDropdownOptions] = useState([])
  const [tableKey, setTableKey] = useState(0)
  const [btnDisabled, setBtnDisabled] = useState(true)
  const [currentState, setCurrectState] = useState(-1)
  const [selectedSubjects, setSelectedSubjects] = useState({})
  const [subjectErrors, setSubjectErrors] = useState({})
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [dataId, setDataId] = useState(null)
  const [dataLength, setDataLength] = useState(0)
  const [finalData, setFinalData] = useState({
    points: 0,
    bonus_points: 0,
    total_points: 0,
  })

  const getResponseBody = (response) => response?.data?.data ?? response?.data

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

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
  ])

  const [deletingRowNo, setDeletingRowNo] = useState(null)

  useEffect(() => {
    const idExistsLength = tableData.filter((item) => item.id !== undefined).length
    setDataLength(idExistsLength)
  }, [tableData])

  const gradeIdRef = useRef([])
  useEffect(() => {
    gradeIdRef.current = gradeId
  }, [gradeId])

  useEffect(() => {
    return () => {
      const finalGrades = gradeIdRef.current.filter((item) => item && item.grade)
      if (finalGrades.length > 0) {
        postApiWithAuth(API_URL.CALCULATEDATA, finalGrades)
      }
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleAdd = () => {
    setLoadingSub(false)
    setCountFields(countFields + 1)
    const newData = {
      No: tableData?.length,
      name: null,
      level: null,
      grades: null,
    }

    setTableData([...tableData, newData])
  }

  useEffect(() => {
    if (firstDropdownValue !== "" && secondDropdownValue !== "") {
    }
  }, [firstDropdownValue, secondDropdownValue])

  const handleThridDropDownApi = async (index) => {
    setLoadingThird(true)
    setCurrectState(index)
    setThirdDropdownOptions([])
    const encodedLevel = encodeURIComponent(tableData[index].name)
    const response = await getApiWithAuth(
      `calculator/check-level-grade/?level=${tableData[index].level}&subject=${encodedLevel}`,
    )
    if (response?.data?.status === 200) {
      setLoadingThird(false)
      setCurrectState(-1)
      setGrades(response.data.data)
      if (response?.data?.data.length > 0) {
        const options = response?.data?.data?.map((e) => ({ value: e.grade }))
        setThirdDropdownOptions(options)
      }
    }
  }

  const handleFirstDropdownChange = (value, record) => {
    const isDuplicate = tableData.some((item) => item.name === value)

    if (isDuplicate) {
      const errorMessages = { ...subjectErrors }
      errorMessages[record.No] = "Subject already selected"
      setSubjectErrors(errorMessages)
      const tempData = tableData.map((item) =>
        item.No === record.No
          ? {
              ...item,
              name: "",
              level: null,
              grades: null,
            }
          : item,
      )

      setTableData(tempData)

      return
    } else if (!isDuplicate) {
      const errorMessages = { ...subjectErrors }
      delete errorMessages[record.No]
      setSubjectErrors(errorMessages)
    }
    setAvailableSubjects((prevSubjects) => prevSubjects.filter((subject) => subject !== value))

    const tempData = tableData.map((item) =>
      item.No === record.No
        ? {
            ...item,
            name: value,
            level: null,
            grades: null,
          }
        : item,
    )

    setTableData(tempData)
    setGradeId((prevState) => {
      const newArray = [...prevState]
      newArray[record.No] = null
      return newArray
    })
  }

  const handleSecondDropdownChange = (value, record) => {
    const tempData = tableData?.map((item, index) => {
      if (item?.No == record?.No) {
        return {
          ...item,
          level: value,
          grades: null,
        }
      } else {
        return item
      }
    })
    setTableData(tempData)
    setGradeId((prevState) => {
      const newArray = [...prevState]
      newArray[record.No] = null
      return newArray
    })
  }

  const handle = (value, record) => {
    const tempData = tableData?.map((item, index) => {
      if (item?.No === record?.No) {
        return {
          ...item,
          grades: value,
        }
      } else {
        return item
      }
    })

    setTableData(tempData)
    const gradeid = grades?.filter((item) => item?.grade === value)
    const newGradeId = { grade: gradeid[0]?.pk }

    setGradeId((prevState) => {
      const newArray = [...prevState]

      newArray[record.No] = newGradeId

      return newArray
    })
  }

  const isDeleteButtonDisabled = dataLength < 6
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
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {availableSubjects.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
          {subjectErrors[record?.No] && (
            <div style={{ color: "red", fontSize: "12px", marginBottom: "-1rem" }}>{subjectErrors[record?.No]}</div>
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
                    <Option key={level?.level__id} value={level?.level__subjectlevel}>
                      {level?.level__subjectlevel}
                    </Option>
                  ))}
            </Select>
          </>
        )
      },
    },
    {
      title: "Expected Grades",
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
          {deletingRowNo === record.No ? (
            <LoadingOutlined style={{ color: "red" }} spin />
          ) : (
            <DeleteOutlined
              style={{
                color: deletingRowNo !== null ? "#ccc" : "red",
                cursor: deletingRowNo !== null ? "not-allowed" : "pointer",
              }}
              onClick={() => {
                if (deletingRowNo === null) {
                  handleDelete(record.No)
                }
              }}
            />
          )}
        </Space>
      ),
    },
  ]

  const handleDelete = async (id) => {
    const rowToDelete = tableData.find((item) => item.No === id)

    if (!rowToDelete) return

    // Set the deleting state to show loader
    setDeletingRowNo(id)

    // Case 1: Row is completely empty - just remove it if we have more than 6 rows
    if (rowToDelete.name == null && rowToDelete.grades == null && rowToDelete.level === null) {
      if (tableData.length > 6) {
        const filteredTableData = tableData.filter((item) => item.No !== id)
        const saveData = filteredTableData.map((item, index) => ({
          ...item,
          No: index,
        }))
        setTableData(saveData)

        // Also update gradeId array to match new indices
        const newGradeId = []
        saveData.forEach((item, index) => {
          if (gradeId[item.No]?.grade) {
            newGradeId[index] = gradeId[item.No]
          }
        })
        setGradeId(newGradeId)
      }
      setDeletingRowNo(null)
      return
    }

    // Case 2: Row has data and is saved to server (has id) - delete from API
    if (rowToDelete.id && dataId) {
      try {
        const body = {
          id: dataId,
          subjectId: rowToDelete.id,
        }

        const response = await postApiWithAuth(`calculator/remove-subject-grade/`, body)

        if (response?.data?.status === 200) {
          await getCurrectSelectedValues()
          await getFiltersData()
        }
      } catch (error) {
        console.error("Error deleting from server:", error)
      } finally {
        setDeletingRowNo(null)
      }
    } else {
      // Case 3: Row has data but NOT saved to server yet - just clear locally
      const newTableData = tableData.map((item) => {
        if (item.No === id) {
          return { No: item.No, name: null, level: null, grades: null }
        }
        return item
      })
      setTableData(newTableData)

      // Clear the gradeId for this row
      setGradeId((prevState) => {
        const newArray = [...prevState]
        delete newArray[id]
        return newArray
      })

      await getFiltersData()
      setDeletingRowNo(null)
    }
  }

  const clearAllData = async () => {
    const response1 = await getApiWithAuth(`calculator/user-points/`)
    if (response1?.data?.data[0]) {
      const response = await deleteApiWithAuth(`calculator/user-points/delete/${response1?.data?.data[0]?.id}/`)

      if (response?.data?.status === 204) {
        setFinalData({
          points: 0,
          bonus_points: 0,
          total_points: 0,
        })
        getFiltersData()
        getCurrectSelectedValues()
      }
    } else {
      setFinalData({
        points: 0,
        bonus_points: 0,
        total_points: 0,
      })
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
      ])
    }
  }

  const calCulateData = async (updatedGrades) => {
    const dataToSend = updatedGrades && Array.isArray(updatedGrades) ? updatedGrades : gradeId
    const filteredData = dataToSend.filter((item) => item && item.grade)

    if (loadingSub === false) {
      setLoading(true)

      const response = await postApiWithAuth(API_URL.CALCULATEDATA, filteredData)
      const responseBody = getResponseBody(response)

      if (responseBody?.success) {
        setFinalData(responseBody.data)
        // getCurrectSelectedValues()
        getFiltersData()
        await getCurrectSelectedValues()
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (data.length > 0) {
      getCurrectSelectedValues()
    }
  }, [data])

  useEffect(() => {
    getFiltersData()
  }, [])

  useEffect(() => {
    if (data.length > 0) {
      const subjects = data.map((item) => item.name)
      setAvailableSubjects(subjects)
    }
  }, [data])

  const getFiltersData = async () => {
    setLoadingFirst(true)
    const response = await getApiWithAuth(API_URL.SUBJECTLIST)
    if (response?.data?.status === 200) {
      setData(response.data.data)
      setLoadingFirst(false)
    } else {
      setLoadingFirst(false)
    }
  }

  const getCurrectSelectedValues = async () => {
    setLoadingSub(true)
    setGradeId([])
    let filterGrade = []
    let newData = []
    try {
      const response = await getApiWithAuth(`calculator/user-points/`)
      const userPointsData = getResponseBody(response) || []
      const selectedPoint = userPointsData[0]
      const selectedGrades = selectedPoint?.grades || []
      const checkLength = selectedGrades.map((obj) => ({
        grade: obj.id,
      }))
      if (checkLength.length > 0) {
        const response2 = await postApiWithAuth(
          API_URL.CALCULATEDATA,
          selectedGrades.map((obj) => ({ grade: obj.id })),
        )
        const responseBody2 = getResponseBody(response2)

        if (responseBody2?.success) {
          setFinalData(responseBody2.data)
          const response = await getApiWithAuth(`calculator/user-points/`)
          const userPointsData = getResponseBody(response) || []
          setDataId(userPointsData[0]?.id)
          setDataLength(userPointsData.length)

          setLoading(false)
        } else {
          setLoading(false)
        }
      } else {
        setFinalData({
          points: 0,
          bonus_points: 0,
          total_points: 0,
        })
      }

      if (userPointsData.length === 0) {
        for (let i = 0; i < tableData.length; i++) {
          const ND = {
            No: i,
            name: null,
            level: null,
            grades: null,
          }
          newData.push(ND)
        }
      } else if (userPointsData.length !== 0) {
        newData = selectedGrades
          .map((item, index) => {
            const filterSubject = data.find((SubItem) => SubItem.id == item?.subject)
            const filterLevel = filterSubject?.level?.find((levelItem) => levelItem.level__id == item.level)

            if (!filterSubject || !filterLevel) {
              return null
            }

            const newObj = {
              id: item.id,
              No: index,
              name: filterSubject.name,
              level: filterLevel.level__subjectlevel,
              grades: item.grade,
            }
            return newObj
          })
          .filter(Boolean)

        const newGradeIds = []
        for (let i = 0; i < newData?.length; i++) {
          const response1 = await getApiWithAuth(
            `calculator/check-level-grade/?level=${newData[i].level}&subject=${newData[i].name}`,
          )

          if (response1?.data?.status === 200) {
            filterGrade = response1?.data?.data.filter((gradeItem) => gradeItem.grade == newData[i]?.grades)
            if (filterGrade.length > 0 && filterGrade[0]?.pk) {
              newGradeIds.push({ grade: filterGrade[0].pk })
            }
          }
        }
        const uniqueGradeArray = Array.from(new Set(newGradeIds.map((item) => item.grade))).map((grade) => ({ grade }))
        setGradeId(uniqueGradeArray)
      }
    } catch (error) {
    } finally {
      const remainingEmptyRows = Math.max(tableData.length - newData.length, 0)
      const emptyRows = Array.from({ length: remainingEmptyRows }, (_, index) => ({
        No: newData.length + index,
        name: null,
        level: null,
        grades: null,
      }))
      const combinedData = [...newData, ...emptyRows]

      setCountFields(combinedData.length)
      setTableData(combinedData)
      setLoadingSub(false)
    }
  }

  return (
    <div className="caoMainDiv" style={{ backgroundColor: "#91DBC6" }}>
      <div className="coaInnerf8fafcDiv bg-[#91DBC6]">
        <div className="welcomeHaddingText bg-[#91DBC6] !text-white">My CAO Points: </div>

        {screenSize.width > "748" ? (
          <div className="coaSubjectDiv p-3 bg-[#91DBC6]">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Table
                dataSource={tableData}
                columns={columns}
                rowClassName={() => "backgroundF4F6F8"}
                pagination={false}
                loading={loadingFirst}
                rowKey="No"
              />

              <div className="addSubjectContainer">
                <MyCareerGuidanceButton
                  label="Add Subject"
                  className="addSubjectButton"
                  htmlType="button"
                  onClick={handleAdd}
                  icon={<PlusOutlined />}
                />
              </div>
            </div>
            <div className="coaPointsWidth">
              <div className="coaPointsCard">
                <div className="coaPointsPanelBackground">
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
                        <div>{finalData.bonus_points ? finalData.bonus_points : 0}</div>
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
                              <div className="caoHeadingText" style={{ fontSize: "26px" }}>
                                {finalData.total_points ? finalData.total_points : 0}
                              </div>
                              <div className="cao2ndText">
                                <strong className="font-bold text-black">Points</strong>
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
          </div>
        ) : (
          <div className="coaSubjectDiv p-3">
            <div className="coaPointsWidth">
              <div className="coaPointsCard">
                <div className="coaPointsPanelBackground">
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
                          <div>{finalData.bonus_points ? finalData.bonus_points : 0}</div>
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
                              <div className="caoHeadingText" style={{ fontSize: "26px" }}>
                                {finalData.total_points ? finalData.total_points : 0}
                              </div>
                              <div className="cao2ndText">
                                <strong className="font-bold text-black">Points</strong>
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
                      <div className="mobileTableHeader mt-2">Subject {index + 1}</div>
                      <div className="py-2" style={{ background: " #F4F6F8" }}>
                        <div className="mobileTableCell my-3">
                          <Select
                            placeholder="Select Subject"
                            value={item?.name}
                            onChange={(value) => handleFirstDropdownChange(value, item)}
                            className="selectFieldStyle"
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
                            onChange={(value) => handleSecondDropdownChange(value, item)}
                            className="selectFieldStyle"
                          >
                            {data
                              .find((subject) => subject?.name === item?.name)
                              ?.level?.map((level) => (
                                <Option key={level?.level__id} value={level?.level__subjectlevel}>
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
                        <div>
                          {deletingRowNo === item.No ? (
                            <LoadingOutlined style={{ color: "red", display: "flex", justifyContent: "center" }} spin />
                          ) : (
                            <DeleteOutlined
                              style={{
                                color: deletingRowNo !== null ? "#ccc" : "red",
                                display: "flex",
                                justifyContent: "center",
                                cursor: deletingRowNo !== null ? "not-allowed" : "pointer",
                              }}
                              onClick={async () => {
                                if (deletingRowNo === null) {
                                  await handleDelete(item.No)
                                }
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <MyCareerGuidanceButton
                  label="Add Subject"
                  className="addSubjectButton mt-2"
                  htmlType="button"
                  onClick={handleAdd}
                  icon={<PlusOutlined />}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CAOCalculator
