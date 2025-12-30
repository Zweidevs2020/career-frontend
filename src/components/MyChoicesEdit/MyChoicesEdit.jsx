"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import { DndContext, PointerSensor, TouchSensor, MouseSensor, useSensor, useSensors } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useLocation, useSearchParams } from "react-router-dom"
import { Space, Table, message, Select, Image } from "antd"
import { DeleteOutlined, MenuOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { v4 as uuid4 } from "uuid"
import { MyCareerGuidanceInputField } from "../../components/commonComponents"
import { Spin } from "antd"
import { getApiWithAuth, postApiWithAuth, patchApiWithAuth, deleteApiWithAuth } from "../../utils/api"
import dropdownIcon from "../../assets/dropdownIcon.svg"
import EditOutlined from "../../assets/uil_edit.svg"

import { Link } from "react-router-dom"
import { debounce } from "lodash"

import "./myChoicesEdit.css"

const { Column, ColumnGroup } = Table

const MyChoicesEdit = () => {
  const inputRef = useRef(null)
  const focusRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParam, setSearchParam] = useSearchParams({
    unsave: false,
  })
  const [selectedOptions, setSelectedOptions] = useState({})
  const [previousUrl, setPreviousUrl] = useState(null)
  const [selectedRowId, setSelectedRowId] = useState(null)
  const currentUrl = location.pathname
  const { dataa, isApprentice } = location.state || {}
  const [loadingFirst, setLoadingFirst] = useState(false)
  const [columns, setColums] = useState([])
  const [showRows, setShowRows] = useState(null)
  const [data, setData] = useState([])
  const [isDragInProgress, setIsDragInProgress] = useState(false)
  const [dragTimer, setDragTimer] = useState(null)
  const [myData, setMyData] = useState([])
  const [oldData, setOldData] = useState(null)
  const [dropDownOptions, setDropDownOptions] = useState(null)
  const [showRowsData, setShowRowsData] = useState(null)

  const [otherOptionsData, setOtherOptionsData] = useState([])
  const [loadingOtherOptions, setLoadingOtherOptions] = useState(false)
  const [savedOtherOptions, setSavedOtherOptions] = useState({})
  const isOtherSection = dataa?.id === "other"

  useEffect(() => {
    if (isOtherSection) {
      getOtherOptions()
    } else {
      getChoiceRecord()
      getTableRecord()
    }
  }, [dataa])

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 780)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 780)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const getOtherOptions = async () => {
    setLoadingOtherOptions(true)
    try {
      const response = await getApiWithAuth("choices/other/")
      if (response.data.status === 200) {
        // Extract user_data from the response
        const userData = response.data.data?.user_data || []
        setOtherOptionsData(
          userData.map((item, index) => ({
            ...item,
            dataId: uuid4(),
            rowNo: index,
            editable: false,
          })),
        )
        // Mark all existing items as saved
        const savedMap = {}
        userData.forEach((item) => {
          if (item.id) {
            savedMap[item.id] = true
          }
        })
        setSavedOtherOptions(savedMap)
      } else {
        message.error("Failed to load other options")
      }
    } catch (error) {
      message.error("Error loading other options")
    } finally {
      setLoadingOtherOptions(false)
    }
  }

  const handleSaveOtherOption = async (record, skipRefetch = false) => {
    if (!record.idea || record.idea.trim() === "") {
      message.error("Please enter an idea")
      return
    }

    try {
      const payload = {
        idea: record.idea,
        order_number: record.order_number || otherOptionsData.length,
      }

      if (record.id) {
        // Update existing record
        const response = await patchApiWithAuth(`choices/other/${record.id}/`, payload)
        if (response.data.status === 200) {
          message.success("Option updated successfully")
          setSavedOtherOptions((prev) => ({ ...prev, [record.id]: true }))
          if (!skipRefetch) {
            getOtherOptions()
          }
        } else {
          message.error(response.data.message || "Failed to update")
        }
      } else {
        // Create new record
        const response = await postApiWithAuth("choices/other/", payload)
        if (response.data.status === 200 || response.data.status === 201) {
          message.success("Option saved successfully")
          if (!skipRefetch) {
            getOtherOptions()
          }
        } else {
          message.error(response.data.message || "Failed to save")
        }
      }
    } catch (error) {
      message.error("Error saving option")
    }
  }

  const handleDeleteOtherOption = async (item) => {
    if (!item.id) {
      setOtherOptionsData((prev) => prev.filter((option) => option.dataId !== item.dataId))
      return
    }

    try {
      const response = await deleteApiWithAuth(`choices/other/${item.id}/`)
      if (response.data.status === 204 || response.data.status === 200) {
        message.success("Option deleted successfully")
        getOtherOptions()
      } else {
        message.error("Failed to delete option")
      }
    } catch (error) {
      message.error("Error deleting option")
    }
  }

  const handleOtherOptionChange = (dataId, value) => {
    setOtherOptionsData((prev) =>
      prev.map((item) => {
        if (item.dataId === dataId) {
          // Mark as unsaved when value changes
          if (item.id) {
            setSavedOtherOptions((prevSaved) => ({ ...prevSaved, [item.id]: false }))
          }
          return { ...item, idea: value, editable: true }
        }
        return item
      }),
    )
  }

  const handleAddNewOtherOption = async () => {
    // First save all unsaved rows that have data
    const unsavedRowsWithData = otherOptionsData.filter((item) => !item.id && item.idea && item.idea.trim() !== "")

    // Save each unsaved row without refetching
    for (const row of unsavedRowsWithData) {
      await handleSaveOtherOption(row, true) // skip refetch
    }

    // Refetch data once after all saves complete
    if (unsavedRowsWithData.length > 0) {
      const response = await getApiWithAuth("choices/other/")
      if (response.data.status === 200) {
        const userData = response.data.data?.user_data || []
        const savedMap = {}
        userData.forEach((item) => {
          if (item.id) {
            savedMap[item.id] = true
          }
        })
        setSavedOtherOptions(savedMap)

        // Set data with saved items + new empty row
        const savedData = userData.map((item, index) => ({
          ...item,
          dataId: uuid4(),
          rowNo: index,
          editable: false,
        }))

        // Add new empty row
        const newOption = {
          id: null,
          idea: "",
          order_number: savedData.length + 1,
          dataId: uuid4(),
          rowNo: savedData.length,
          editable: true,
        }

        setOtherOptionsData([...savedData, newOption])
      }
    } else {
      // No unsaved rows, just add new row
      const newOption = {
        id: null,
        idea: "",
        order_number: otherOptionsData.length + 1,
        dataId: uuid4(),
        rowNo: otherOptionsData.length,
        editable: true,
      }
      setOtherOptionsData((prev) => [...prev, newOption])
    }
  }

  const saveUnsavedOtherOptions = async () => {
    if (isOtherSection) {
      const unsavedRowsWithData = otherOptionsData.filter((item) => !item.id && item.idea && item.idea.trim() !== "")
      for (const row of unsavedRowsWithData) {
        await handleSaveOtherOption(row)
      }
    }
  }

  const enableEditForOtherOption = (dataId) => {
    setOtherOptionsData((prev) => prev.map((item) => (item.dataId === dataId ? { ...item, editable: true } : item)))
  }

  const getChoiceRecord = async (runLoading = true) => {
    if (runLoading) {
      setLoadingFirst(true)
    }
    const response = await getApiWithAuth(`choices/column-names/?choice=${dataa.id}`)
    if (response.data.status === 200) {
      if (isApprentice) {
        setColums(["title", "college", "level", "location", "course_information"])
      } else {
        const columnsData = response.data.data.data
        const columnsWithoutOrderNumber = columnsData.slice(0, columnsData.length - 1)
        setColums(columnsWithoutOrderNumber)
      }
      setShowRows(response.data.data.rows)
      setLoadingFirst(false)
    } else {
      setLoadingFirst(true)
    }
  }

  const getTableRecord = async () => {
    const response = await getApiWithAuth(`choices/${dataa.id}/`)
    if (response.data.status === 200) {
      setOldData(response.data.data.user_data)
      if (isApprentice) {
        const apprenticeData = response.data.data.level_data
        const transformedData = apprenticeData.map((item) => ({
          ...item,
          title: item.name,
          college: item.provider,
          code: item.id,
        }))
        setDropDownOptions(transformedData)
      } else {
        setDropDownOptions(response.data.data.level_data)
      }
      setLoadingFirst(false)
    } else {
      setLoadingFirst(true)
    }
  }

  useEffect(() => {
    if (showRowsData !== null) {
      if (oldData !== null) {
        let processedOldData = oldData
        if (isApprentice && oldData.length > 0) {
          processedOldData = oldData.map((item) => ({
            ...item,
            title: item.name,
            college: item.provider,
            code: item.id,
          }))
        }

        if (processedOldData.length > 0) {
          const updateData = [...processedOldData, ...showRowsData.slice(processedOldData.length)]

          setData(
            updateData.map((item, index) => ({
              ...item,
              rowNo: index,
              editable: false,
              dataId: uuid4(),
            })),
          )
        } else {
          setData(
            showRowsData.map((item, index) => ({
              ...item,
              rowNo: index,
              editable: false,
              dataId: uuid4(),
            })),
          )
        }
      }
    }
  }, [showRowsData, oldData])

  useEffect(() => {
    if (showRows !== null) {
      const newData = Array.from({ length: showRows }, () => {
        const rowData = { dataId: uuid4(), id: null }
        columns.forEach((column) => {
          rowData[column] = null
        })
        return rowData
      })
      setMyData(oldData)

      setShowRowsData(newData)
    }
  }, [showRows])

  const handleChangeTable = (e, rowData) => {
    const { name, value, id } = e.target

    const updatedData = data.map((item) => {
      if (item.rowNo === rowData.rowNo) {
        return {
          ...item,
          id: item.id,
          dataId: item.dataId,
          rowNo: rowData.rowNo,
          editable: true,
          [name]: value,
        }
      } else {
        return item
      }
    })

    setData(updatedData)

    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        element.focus()
      }
    }, 0)
  }

  const handleChangeTableMobile = (e, rowData) => {
    const { name, value, id } = e.target

    const updatedData = data.map((item) => {
      if (item.rowNo === rowData.rowNo) {
        return {
          ...item,
          id: item.id,
          dataId: item.dataId,
          rowNo: rowData.rowNo,
          [name]: value,
        }
      } else {
        return item
      }
    })
    setData(updatedData)
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        element.focus()
      }
    }, 0)
  }

  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus()
      focusRef.current = null
    }
  }, [data])

  const handleRouteChange = () => {
    console.log("Route change detected! Checking if row should be added...")
    if (selectedOptions?.code?.row) {
      handleAddRow(selectedOptions.code.row)
    }
  }

  const handleBeforeUnload = (event) => {
    console.log("Before unload event triggered. Checking for changes...")
    const confirmationMessage = "Are you sure you want to leave? Your changes might not be saved."

    event.preventDefault()
    event.returnValue = confirmationMessage

    return confirmationMessage
  }

  const handleReload = () => {
    const userConfirmed = window.confirm("Do you want to reload the page? Your changes might not be saved.")
    if (userConfirmed) {
      handleRouteChange()
    }
  }

  const enableEventListeners = useCallback(() => {
    sessionStorage.setItem("unsave", "true")
    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("popstate", handleRouteChange)
    window.addEventListener("unload", handleReload)
  }, [])

  const disableEventListeners = useCallback(() => {
    sessionStorage.removeItem("unsave")
    console.log("Disabling event listeners...")
    window.removeEventListener("beforeunload", handleBeforeUnload)
    window.removeEventListener("popstate", handleRouteChange)
    window.removeEventListener("unload", handleReload)
  }, [])

  const eidtThisRow = (record) => {
    const updatedData = data.map((item) => {
      if (item.rowNo === record.rowNo) {
        return { ...item, editable: true }
      } else {
        return item
      }
    })

    setData(updatedData)
    enableEventListeners()
  }

  const saveRow = () => {
    disableEventListeners()
  }

  const cancelEdit = () => {
    disableEventListeners()
  }

  const handleUpdate = async (record) => {
    if (record?.title) {
      const [title] = record.title.split(",")
      record.title = title
    }
    if (isApprentice) {
      record.name = record.title
      record.provider = record.college
    }
    const respose = await patchApiWithAuth(
      `choices/${isApprentice ? "apprentice" : `update-${dataa.id}`}/${record.id}/`,
      record,
    )

    if (respose.data.status === 200) {
      message.success("Row update succesfully")
      setShowRows(null)
      getChoiceRecord()
      setSelectedRowId(record.id)
      getTableRecord()
    } else {
      message.error(respose.data.message)
    }
  }

  const handleUpdateMobile = async (record) => {
    for (const key in record) {
      if (key !== "id" && key !== "order_number" && record[key] === null) {
        break
      }
    }
    if (isApprentice) {
      record.name = record.title
      record.provider = record.college
    }
    const respose = await patchApiWithAuth(
      `choices/${isApprentice ? "apprentice" : `update-${dataa.id}`}/${record.id}/`,
      record,
    )

    if (respose.data.status === 200) {
      message.success("Row update succesfully")
      setShowRows(null)
      getChoiceRecord()
      setSelectedRowId(record.id)
      getTableRecord()
    } else {
      message.error(respose.data.message)
    }
  }

  const handleDelete = async (item) => {
    const respose = await deleteApiWithAuth(`choices/${isApprentice ? "apprentice" : `delete-${dataa.id}`}/${item.id}/`)

    if (respose.data.status === 204 || respose.data.status === 200) {
      message.success("Row delete succesfully")
      getChoiceRecord()
      getTableRecord()
    } else {
      message.error(respose.data.message)
    }
  }

  const currentPath = location.pathname
  const handleAddRow = async (recordToAdd, isDebounceCall = false) => {
    const finalRecord = recordToAdd || selectedOptions?.code?.row

    if (!finalRecord) {
      message.error("No valid record found")
      return
    }

    if (finalRecord.code === null || finalRecord.title === null) {
      message.error("All fields are required")
    } else {
      console.log(finalRecord, "ss")
      if (finalRecord?.title) {
        const [title] = finalRecord.title.split(",")
        finalRecord.title = title
      }
      if (finalRecord?.college) {
        const [college] = finalRecord.college.split(",")
        finalRecord.college = college
      }

      if (isApprentice) {
        finalRecord.name = finalRecord.title
        finalRecord.provider = finalRecord.college
      }
      const response = await postApiWithAuth(`choices/${dataa.id}/`, finalRecord)
      disableEventListeners()
      console.log(response?.data?.status, "hello")
      if (response.data.status === 200) {
        message.success("Row added successfully")
        setShowRows(null)

        getChoiceRecord(!isDebounceCall)
        getTableRecord()
        setSelectedRowId(finalRecord.id)
        disableEventListeners()
      } else {
        message.error(response.data.message)
      }
    }
  }

  console.log("[loca]", location)

  useEffect(() => {
    const isRowEditable = data.some((row) => row.editable)
    if (isRowEditable) {
      enableEventListeners()
    } else {
      disableEventListeners()
    }

    return () => {
      disableEventListeners()
    }
  }, [data, enableEventListeners, disableEventListeners])

  const handleAddRowMobile = async (record) => {
    for (const key in record) {
      if (key !== "id" && record[key] === null) {
        message.error(`Please enter the ${key} of the Row`)
        return // Added return to stop execution if a field is null
      }
    }
    const respose = await postApiWithAuth(`choices/${dataa.id}/`, record)

    if (respose.data.status === 200) {
      message.success("Row add succesfully")
      setShowRows(null)
      getChoiceRecord()
      getTableRecord()
      setSelectedRowId(record.id)
    } else {
      message.error(respose.data.message)
    }
  }

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setIsDragInProgress(true)
    }, 900)

    setDragTimer(timer)
  }

  const handleTouchEnd = () => {
    clearTimeout(dragTimer)
    setIsDragInProgress(false)
  }

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const Row = ({ children, ...props }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: props["data-row-key"],
    })
    const rowId = props["data-row-key"]
    const row = data.find((item) => item.dataId === rowId)
    const isIdNotNull = row && row.id !== null
    const style = {
      ...props.style,
      position: "relative",
      transform: CSS.Transform.toString(
        transform && {
          ...transform,
          scaleY: 1,
        },
      ),

      transition,
      cursor: "move",

      ...(isDragging
        ? {
            position: "relative",
            zIndex: 9999,
          }
        : {}),
    }

    return (
      <>
        <tr
          {...props}
          ref={setNodeRef}
          className={isIdNotNull ? "old-data" : "new-data"}
          style={style}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {children}
          {row?.id ? (
            <MenuOutlined
              {...attributes}
              {...listeners}
              style={{
                touchAction: "none",
                cursor: "move",
                marginRight: 30,
                position: "absolute",
                top: "42%",
                left: "0px",
              }}
            />
          ) : null}
        </tr>
      </>
    )
  }

  const MobileRow = (props) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: props["data-row-key"],
    })

    const rowId = props["data-row-key"]
    const { row: comingRow } = props
    const row = data.find((item) => item.dataId === rowId)
    const isIdNotNull = row && row.id !== null
    const style = {
      ...props.style,

      transform: CSS.Transform.toString(
        transform && {
          ...transform,
          scaleY: 1,
        },
      ),

      transition,
      cursor: "move",
      ...(isDragging
        ? {
            position: "relative",
            zIndex: 9999,
          }
        : {}),
    }

    return (
      <>
        <div {...props} ref={setNodeRef} className={isIdNotNull ? "old-data" : "new-data"} style={style}>
          <div
            className={`row mobile-row`}
            style={{
              background: "rgb(244, 246, 248)",
              marginBottom: "3rem",
            }}
          >
            <div className="menuIconMobile drag-handle">
              <MenuOutlined
                style={{
                  touchAction: "none",
                  cursor: "move",
                  color: "transparent",
                }}
              />
              <div className="actionColumn">
                <Space size="middle">
                  <a onClick={() => eidtThisRow(comingRow)}>
                    <Image
                      preview={false}
                      src={EditOutlined || "/placeholder.svg"}
                      style={{
                        color: "#1476b7",
                        cursor: "pointer",
                        width: 22,
                        height: "100%",
                      }}
                    />
                  </a>
                  <a onClick={() => handleDelete(comingRow)}>
                    <DeleteOutlined style={{ color: "red" }} />
                  </a>
                </Space>
              </div>
            </div>

            {props.children}
          </div>
        </div>
      </>
    )
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 2,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10,
        delay: 50,
        tolerance: 2,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
        delay: 50,
        tolerance: 2,
      },
    }),
  )

  const onDragEnd = async ({ active, over }) => {
    if (active?.id && over?.id) {
      if (active?.id !== over?.id) {
        setData((prev) => {
          const activeIndex = prev.findIndex((i) => i.dataId === active?.id)

          const overIndex = prev.findIndex((i) => i.dataId === over?.id)
          const checkArray = arrayMove(prev, activeIndex, overIndex)
          const swapArray = checkArray.filter((item) => item.id !== null)
          const check = swapArray.map(async (item, index) => {
            updateOrderMultitimes(dataa.id, item.id, {
              order_number: index + 1,
            })
          })
          Promise.all(check).then(getTableRecord(), getTableRecord())

          return arrayMove(prev, activeIndex, overIndex)
        })
      }
    }
    isMobile && window.location.reload()
  }

  const updateOrderMultitimes = async (id, activeIndexId, swapArrayOrder) => {
    const respose1 = await patchApiWithAuth(`choices/update-${id}/${activeIndexId}/`, swapArrayOrder)

    if (respose1.data.status === 200) {
    }
  }

  const updateOrder2 = async (id, overIndexId, orderUpdate2) => {
    setLoadingFirst(true)
    const respose2 = await patchApiWithAuth(`choices/update-${id}/${overIndexId}/`, orderUpdate2)

    if (respose2.data.status === 200) {
      getTableRecord()
    }

    setLoadingFirst(false)
  }

  const handleSelect = async (value, option, rowNum) => {
    const isCodeAvailable = data.some((item) => item.code === option.code)
    if (isCodeAvailable) {
      message.error("You already select this Course")
    } else {
      const currentRow = data.find((item) => item.rowNo === rowNum)
      const existingRowId = currentRow?.id // Store the existing row's id if it exists

      const updatedData = data.map((item) => {
        if (item.rowNo === rowNum) {
          const { id, ...rest } = option.row
          const _body = {
            ...item,
            ...rest,
            id: existingRowId || id,
            order_number: rowNum,
          }
          const saveDebounce = debounce(() => {
            if (existingRowId) {
              handleUpdate(_body)
            } else {
              handleAddRow(_body, true)
            }
          }, 3000)
          saveDebounce()
          return _body
        }
        return item
      })

      setData(updatedData)
    }
  }

  const renderOtherOptionsSection = () => {
    if (loadingOtherOptions) {
      return <Spin className="spinStyle" />
    }

    return (
      <div className="w-100 p-3">
        {!isMobile ? (
          <div className="w-100" style={{ overflowX: "auto" }}>
            {/* Desktop view - Single table for all other options */}
            <Table
              pagination={false}
              dataSource={otherOptionsData}
              className={otherOptionsData.length > 0 ? "nonEmptyTable" : "emptyTable"}
              rowKey="dataId"
            >
              <Column
                title="No."
                dataIndex="rowNo"
                key="rowNo"
                className="firstTableHeadingStyle"
                render={(text) => <span style={{ paddingLeft: 10 }}>{text + 1}</span>}
              />
              <Column
                title="Idea"
                dataIndex="idea"
                key="idea"
                className="tableHeadingStyle"
                render={(text, record) => (
                  <MyCareerGuidanceInputField
                    placeholder="Enter your idea"
                    type="input"
                    name="idea"
                    defaultValue={text || ""}
                    isPrefix={false}
                    disabled={record.id && !record.editable}
                    onChange={(e) => handleOtherOptionChange(record.dataId, e.target.value)}
                    id={`input-idea-${record?.rowNo}`}
                    style={{ color: "#333333" }}
                  />
                )}
              />
              <Column
                title="Action"
                key="action"
                className="firstTableHeadingStyle"
                render={(_, record) => (
                  <Space size="middle">
                    <DeleteOutlined
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => handleDeleteOtherOption(record)}
                    />
                  </Space>
                )}
              />
            </Table>

            <div style={{ marginTop: 16, textAlign: "left" }}>
              <button
                onClick={handleAddNewOtherOption}
                style={{
                  backgroundColor: "#1476B7",
                  color: "#fff",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Add Row
              </button>
            </div>
          </div>
        ) : (
          // Mobile view for Other Options
          <div className="mobile-table">
            {otherOptionsData.map((row) => (
              <div className="dragDrop" key={row.dataId} data-row-key={row.dataId}>
                <div
                  className={`row mobile-row`}
                  style={{
                    background: "rgb(244, 246, 248)",
                    marginBottom: "3rem",
                  }}
                >
                  <div className="menuIconMobile drag-handle">
                    <MenuOutlined
                      style={{
                        touchAction: "none",
                        cursor: "move",
                        color: "transparent",
                      }}
                    />
                    <div className="actionColumn">
                      <Space size="middle">
                        <a onClick={() => handleDeleteOtherOption(row)}>
                          <DeleteOutlined style={{ color: "red" }} />
                        </a>
                      </Space>
                    </div>
                  </div>
                  <div className="first-column">
                    <div className="column"></div>
                    <div className="column" style={{ width: "100%" }}>
                      <span className="rowHeadingMobile">No. {row.rowNo + 1}</span>
                    </div>
                  </div>
                  <div className="remaining-columns">
                    <div className="column">
                      <span className="rowHeadingMobile">Idea</span>
                      <MyCareerGuidanceInputField
                        placeholder="Enter your idea"
                        type="input"
                        name="idea"
                        defaultValue={row.idea || ""}
                        isPrefix={false}
                        disabled={row.id && !row.editable}
                        onChange={(e) => handleOtherOptionChange(row.dataId, e.target.value)}
                        style={{ color: "#333333" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 16 }}>
              <button
                onClick={handleAddNewOtherOption}
                style={{
                  backgroundColor: "#1476B7",
                  color: "#fff",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Add Row
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {loadingFirst || loadingOtherOptions ? (
        <Spin className="spinStyle" />
      ) : (
        <div className="caoMainDiv">
          <div style={{ background: "white" }}>
            <div className="coaInnerf8fafcDivtest">
              {isMobile ? (
                <div className="h-[40px] w-[15%] bg-[#1476B7] rounded-lg flex items-center justify-evenly mx-2">
                  <button
                    className="text-[#fff] flex items-center"
                    onClick={async () => {
                      await saveUnsavedOtherOptions()
                      navigate("/my-choices")
                    }}
                  >
                    <span className="ml-1">Back</span>
                  </button>
                </div>
              ) : (
                <div className="h-[40px] w-[10%] bg-[#1476B7] rounded-lg flex items-center justify-evenly backDesktopButtonChoicesEdit">
                  <button
                    className="text-[#fff] flex items-center"
                    onClick={async () => {
                      await saveUnsavedOtherOptions()
                      navigate("/my-choices")
                    }}
                  >
                    <span className="ml-1">Back</span>
                  </button>
                </div>
              )}
              <div className="myChoiceEditHeading py-3">{dataa?.name}</div>

              {isOtherSection ? (
                renderOtherOptionsSection()
              ) : (
                <div className="w-100 p-3">
                  {!isMobile ? (
                    <div className="w-100" style={{ overflowX: "auto" }}>
                      {/* Desktop view with drag and drop feature */}
                      <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                        <SortableContext
                          items={data.filter((item) => item.id !== null).map((item) => item.dataId)}
                          strategy={verticalListSortingStrategy}
                        >
                          {loadingFirst ? (
                            <Spin className="spinStyle" />
                          ) : (
                            <Table
                              pagination={false}
                              dataSource={data.filter((item) => item.id !== null)}
                              className={data.length > 0 && data[0]?.id !== null ? "nonEmptyTable" : "emptyTable"}
                              rowKey={"dataId"}
                              components={{
                                body: {
                                  row: Row,
                                },
                              }}
                            >
                              <Column
                                title="No."
                                dataIndex="rowNo"
                                key="rowNo"
                                className="firstTableHeadingStyle"
                                render={(text) => <span style={{ paddingLeft: 10 }}>{text + 1}</span>}
                              />
                              {columns.map((item, index) => {
                                return (
                                  <React.Fragment key={index}>
                                    {item === "code" || item === "title" || item === "college" ? (
                                      <>
                                        <Column
                                          title={item.toLowerCase() === "point" ? "Points" : capitalizeWords(item)}
                                          dataIndex={item}
                                          key={item}
                                          className="tableHeadingStyle"
                                          render={(text, record, rowNum) => (
                                            <>
                                              <Select
                                                showSearch
                                                placeholder={`Select ${item}`}
                                                name={item}
                                                value={item === "code" ? text : `${text},${record.code}`}
                                                optionFilterProp="children"
                                                className="selectInputFieldStyle"
                                                ref={inputRef}
                                                defaultValue={item === "code" ? text : `${text},${record.code}`}
                                                bordered={false}
                                                popupMatchSelectWidth={false}
                                                onFocus={() => {
                                                  if (!record.editable) {
                                                    eidtThisRow(record)
                                                  }
                                                }}
                                                suffixIcon={
                                                  <Image
                                                    preview={false}
                                                    src={dropdownIcon || "/placeholder.svg"}
                                                    width={15}
                                                    style={{ marginRight: 10 }}
                                                  />
                                                }
                                                onSelect={(value, option) => handleSelect(value, option, rowNum)}
                                                optionLabelProp="label"
                                              >
                                                {dropDownOptions &&
                                                  dropDownOptions.map((option) => {
                                                    return (
                                                      <Select.Option
                                                        key={option?.id}
                                                        value={
                                                          item === "code"
                                                            ? option[item]
                                                            : `${option[item]},${option.code}`
                                                        }
                                                        code={option.code}
                                                        row={option}
                                                        label={option[item]}
                                                      >
                                                        {`${option.title}, ${option.code}, ${option.college} ${option?.abbreviation ? `, (${option?.abbreviation})` : ""}`}
                                                      </Select.Option>
                                                    )
                                                  })}
                                              </Select>
                                            </>
                                          )}
                                        />
                                      </>
                                    ) : item === "course_information" ? (
                                      <Column
                                        title={item
                                          .split("_")
                                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                          .join(" ")}
                                        dataIndex={item}
                                        key={item}
                                        className="tableHeadingStyle"
                                        render={(text, record) => (
                                          <>
                                            <Link to={text} className="linkStyle" target={"_blank"}>
                                              {text}
                                            </Link>
                                          </>
                                        )}
                                      />
                                    ) : (
                                      <Column
                                        title={item.toLowerCase() === "point" ? "Points" : capitalizeWords(item)}
                                        dataIndex={item}
                                        key={item}
                                        disabled
                                        className="tableHeadingStyle "
                                        onCell={(record) => ({
                                          onClick: () => {
                                            if (!record.editable) {
                                              eidtThisRow(record)
                                            }
                                          },
                                          style: { cursor: "text" },
                                          className: "choice-cell",
                                        })}
                                        render={(text, record) => {
                                          let parseText = Number.parseInt(text)
                                          parseText = isNaN(parseText) ? text : parseText
                                          return (
                                            <MyCareerGuidanceInputField
                                              placeholder={item}
                                              type="input"
                                              name={item}
                                              defaultValue={parseText}
                                              onBlur={(e) => handleChangeTable(e, record)}
                                              isPrefix={false}
                                              id={`input-${item}-${record?.rowNo}`}
                                              onClick={(e) => {
                                                e.stopPropagation()
                                              }}
                                              disabled={!record.editable}
                                            />
                                          )
                                        }}
                                      />
                                    )}
                                  </React.Fragment>
                                )
                              })}

                              <Column
                                title="Action"
                                key="Object"
                                className="firstTableHeadingStyle"
                                dataIndex={"Object"}
                                render={(_, record) => (
                                  <Space size="middle">
                                    <DeleteOutlined
                                      style={{
                                        color: "red",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleDelete(record)}
                                    />
                                  </Space>
                                )}
                              />
                            </Table>
                          )}
                        </SortableContext>
                      </DndContext>

                      {/* Desktop view for empty rows */}
                      <Table
                        pagination={false}
                        dataSource={data.filter((item) => item.id === null)}
                        className={data.length > 0 && data[0]?.id === null ? "nonEmptyTable" : "emptyTable"}
                        rowKey={"dataId"}
                        components={{
                          body: {
                            row: Row,
                          },
                        }}
                      >
                        <Column
                          title="No."
                          dataIndex="rowNo"
                          key="rowNo"
                          className="firstTableHeadingStyle"
                          render={(text) => <span style={{ paddingLeft: 10 }}>{text + 1}</span>}
                        />
                        {columns.map((item, index) => {
                          return (
                            <React.Fragment key={index}>
                              {item === "code" || item === "title" || item === "college" ? (
                                <>
                                  <Column
                                    title={capitalizeWords(item)}
                                    dataIndex={item}
                                    key={item}
                                    className="tableHeadingStyle"
                                    render={(text, record, rowNum) => (
                                      <>
                                        <Select
                                          showSearch
                                          placeholder={`Select ${item}`}
                                          name={item}
                                          value={
                                            item === "code"
                                              ? text
                                              : !text
                                                ? undefined
                                                : `${text ?? ""},${record.code ?? ""}`
                                          }
                                          optionFilterProp="children"
                                          className="inputSelectFieldStyle"
                                          ref={inputRef}
                                          defaultValue={
                                            item === "code"
                                              ? text
                                              : !text
                                                ? undefined
                                                : `${text ?? ""},${record.code ?? ""}`
                                          }
                                          bordered={false}
                                          popupMatchSelectWidth={false}
                                          suffixIcon={
                                            <Image
                                              preview={false}
                                              src={dropdownIcon || "/placeholder.svg"}
                                              width={15}
                                              style={{ marginRight: 10 }}
                                            />
                                          }
                                          onSelect={(value, option) => {
                                            console.log("Selected value:", value)
                                            console.log("Selected option:", option)
                                            setSelectedOptions((prevState) => ({
                                              ...prevState,
                                              [item]: option,
                                            }))

                                            handleSelect(value, option, data.filter((item) => item.id !== null).length)
                                          }}
                                          optionLabelProp="label"
                                        >
                                          {dropDownOptions &&
                                            dropDownOptions.map((option) => {
                                              return (
                                                <Select.Option
                                                  key={option["id"]}
                                                  value={
                                                    item === "code" ? option[item] : `${option[item]},${option.code}`
                                                  }
                                                  code={option.code}
                                                  row={option}
                                                  label={option[item]}
                                                >
                                                  {`${option.title}, ${option.code}, ${option.college} ${option?.abbreviation ? `, (${option?.abbreviation})` : ""}`}
                                                </Select.Option>
                                              )
                                            })}
                                        </Select>
                                      </>
                                    )}
                                  />
                                </>
                              ) : (
                                <Column
                                  title={item
                                    .split("_")
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")}
                                  dataIndex={item}
                                  key={item}
                                  className="tableHeadingStyle"
                                  onCell={(record) => ({
                                    onClick: () => {
                                      if (!record.editable) {
                                        eidtThisRow(record)
                                      }
                                    },
                                    style: { cursor: "text" },
                                    className: "choice-cell",
                                  })}
                                  render={(text, record) => {
                                    let parseText = Number.parseInt(text)
                                    parseText = isNaN(parseText) ? text : parseText

                                    return (
                                      <MyCareerGuidanceInputField
                                        placeholder={item}
                                        type="input"
                                        name={item}
                                        defaultValue={parseText}
                                        onBlur={(e) => handleChangeTable(e, record)}
                                        onFocus={(e) => (inputRef.current = e.target)}
                                        id={`input-${item}-${record?.rowNo}`}
                                        isPrefix={false}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                        }}
                                      />
                                    )
                                  }}
                                />
                              )}
                            </React.Fragment>
                          )
                        })}

                        <Column
                          title="Action"
                          key="Object"
                          className="firstTableHeadingStyle"
                          dataIndex={"Object"}
                          render={(_, record) => (
                            <Space size="middle">
                              <a>
                                <DeleteOutlined style={{ color: "grey" }} />
                              </a>
                            </Space>
                          )}
                        />
                      </Table>
                    </div>
                  ) : (
                    <div className="mobile-table">
                      <div className="mobile-table">
                        <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                          <SortableContext
                            items={data.filter((item) => item.id !== null).map((item) => item.dataId)}
                            strategy={verticalListSortingStrategy}
                          >
                            {data
                              .filter((item) => item.id !== null)
                              .map((row) =>
                                !row.editable ? (
                                  <MobileRow
                                    className="dragDrop"
                                    key={row.dataId}
                                    data-row-key={row.dataId}
                                    handleUpdateMobile={(row) => handleUpdateMobile(row)}
                                    handleAddRow={(row) => handleAddRow(row)}
                                    eidtThisRow={(row) => eidtThisRow(row)}
                                    handleDelete={(row) => handleDelete(row)}
                                    row={row}
                                  >
                                    <div className="first-column">
                                      <div className="column"></div>
                                      <div className="column" style={{ width: "100%" }}>
                                        <span className="rowHeadingMobile">No. {row.rowNo + 1}</span>
                                      </div>
                                    </div>
                                    <div className="remaining-columns">
                                      {columns.map((item, index) =>
                                        item === "code" || item === "title" || item === "college" ? (
                                          <React.Fragment key={`${row.dataId}-${index}`}>
                                            <div className="column">
                                              <span className="rowHeadingMobile">
                                                {item.toLowerCase() === "point" ? "Points" : capitalizeWords(item)}
                                              </span>
                                              <Select
                                                showSearch
                                                placeholder={`Select ${row[item]}`}
                                                name={item}
                                                value={row[item]}
                                                optionFilterProp="children"
                                                className="inputSelectFieldStyle"
                                                ref={inputRef}
                                                defaultValue={row[item]}
                                                bordered={false}
                                                popupMatchSelectWidth={false}
                                                onFocus={() => {
                                                  if (!row.editable) {
                                                    eidtThisRow(row)
                                                  }
                                                }}
                                                suffixIcon={
                                                  <Image
                                                    preview={false}
                                                    src={dropdownIcon || "/placeholder.svg"}
                                                    width={15}
                                                    style={{ marginRight: 10 }}
                                                  />
                                                }
                                                onSelect={(value, option) => handleSelect(value, option, row.rowNo)}
                                                optionLabelProp="label"
                                              >
                                                {dropDownOptions &&
                                                  dropDownOptions.map((option) => {
                                                    return (
                                                      <Select.Option
                                                        key={option?.id}
                                                        value={option[item]}
                                                        code={option.code}
                                                        row={option}
                                                        label={option[item]}
                                                      >
                                                        {`${option.title}, ${option.code}, ${option.college} ${option?.abbreviation ? `, (${option?.abbreviation})` : ""}`}
                                                      </Select.Option>
                                                    )
                                                  })}
                                              </Select>
                                            </div>
                                          </React.Fragment>
                                        ) : item === "course_information" ? (
                                          <div className="column" key={`${row.dataId}-${index}`}>
                                            <span className="rowHeadingMobile">
                                              {item
                                                .split("_")
                                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(" ")}
                                            </span>

                                            <Link to={row[item]} className="linkStyle" target={"_blank"}>
                                              {row[item]}
                                            </Link>
                                          </div>
                                        ) : (
                                          <div className="column" key={`${row.dataId}-${index}`}>
                                            <span className="rowHeadingMobile">{capitalizeWords(item)}</span>
                                            <MyCareerGuidanceInputField
                                              placeholder={row[item]}
                                              type="input"
                                              name={item}
                                              onBlur={(e) => handleChangeTableMobile(e, row)}
                                              defaultValue={row[item]}
                                              isPrefix={false}
                                              disabled={!row.editable}
                                            />
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </MobileRow>
                                ) : (
                                  <div className="dragDrop" key={row.dataId} data-row-key={row.dataId}>
                                    <div
                                      className={`row mobile-row`}
                                      style={{
                                        background: "rgb(244, 246, 248)",
                                        marginBottom: "3rem",
                                      }}
                                    >
                                      <div className="menuIconMobile drag-handle">
                                        <MenuOutlined
                                          style={{
                                            touchAction: "none",
                                            cursor: "move",
                                          }}
                                        />
                                        <div className="actionColumn">
                                          <Space size="middle">
                                            <a onClick={() => eidtThisRow(row)}>
                                              <Image
                                                preview={false}
                                                src={EditOutlined || "/placeholder.svg"}
                                                style={{
                                                  color: "#1476b7",
                                                  cursor: "pointer",
                                                  width: 22,
                                                  height: "100%",
                                                }}
                                              />
                                            </a>
                                            <a onClick={() => handleDelete(row)}>
                                              <DeleteOutlined style={{ color: "red" }} />
                                            </a>
                                          </Space>
                                        </div>
                                      </div>
                                      <div className="first-column">
                                        <div className="column"></div>
                                        <div className="column" style={{ width: "100%" }}>
                                          <span className="rowHeadingMobile">No. {row.rowNo + 1}</span>
                                        </div>
                                      </div>
                                      <div className="remaining-columns">
                                        {columns.map((item, index) => (
                                          <React.Fragment key={`${row.dataId}-${index}`}>
                                            {item === "code" || item === "title" || item === "college" ? (
                                              <>
                                                <div className="column">
                                                  <span className="rowHeadingMobile">
                                                    {item.toLowerCase() === "point" ? "Points" : capitalizeWords(item)}
                                                  </span>
                                                  <Select
                                                    showSearch
                                                    placeholder={`Select ${row[item]}`}
                                                    name={item}
                                                    value={row[item]}
                                                    optionFilterProp="children"
                                                    className="inputSelectFieldStyle"
                                                    ref={inputRef}
                                                    defaultValue={row[item]}
                                                    bordered={false}
                                                    popupMatchSelectWidth={false}
                                                    onFocus={() => {
                                                      if (!row.editable) {
                                                        eidtThisRow(row)
                                                      }
                                                    }}
                                                    suffixIcon={
                                                      <Image
                                                        preview={false}
                                                        src={dropdownIcon || "/placeholder.svg"}
                                                        width={15}
                                                        style={{
                                                          marginRight: 10,
                                                        }}
                                                      />
                                                    }
                                                    onSelect={(value, option) => handleSelect(value, option, row.rowNo)}
                                                    optionLabelProp="label"
                                                  >
                                                    {dropDownOptions &&
                                                      dropDownOptions.map((option) => {
                                                        return (
                                                          <Select.Option
                                                            key={option[item]}
                                                            value={option[item]}
                                                            code={option.code}
                                                            row={option}
                                                            label={option[item]}
                                                          >
                                                            {`${option.title}, ${option.code}, ${option.college} ${option?.abbreviation ? `, (${option?.abbreviation})` : ""}`}
                                                          </Select.Option>
                                                        )
                                                      })}
                                                  </Select>
                                                </div>
                                              </>
                                            ) : (
                                              <div className="column">
                                                <span className="rowHeadingMobile">{capitalizeWords(item)}</span>
                                                <MyCareerGuidanceInputField
                                                  placeholder={row[item]}
                                                  type="input"
                                                  name={item}
                                                  value={row[item]}
                                                  defaultValue={row[item]}
                                                  isPrefix={false}
                                                  disabled={!row.editable}
                                                />
                                              </div>
                                            )}
                                          </React.Fragment>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                          </SortableContext>
                        </DndContext>
                        {data
                          .filter((item) => item.id === null)
                          .map((row) => (
                            <div className="dragDrop" key={row.dataId}>
                              <div
                                className={`row mobile-row`}
                                style={{
                                  background: "rgb(244, 246, 248)",
                                  marginBottom: "3rem",
                                }}
                              >
                                <div className="menuIconMobile drag-handle">
                                  <MenuOutlined
                                    style={{
                                      touchAction: "none",
                                      cursor: "move",
                                      color: "transparent",
                                    }}
                                  />
                                  <div className="actionColumn">
                                    <Space size="middle">
                                      <a onClick={() => eidtThisRow(row)}>
                                        <Image
                                          preview={false}
                                          src={EditOutlined || "/placeholder.svg"}
                                          style={{
                                            color: "#1476b7",
                                            cursor: "pointer",
                                            width: 22,
                                            height: "100%",
                                          }}
                                        />
                                      </a>
                                      <a>
                                        <DeleteOutlined style={{ color: "grey" }} />
                                      </a>
                                    </Space>
                                  </div>
                                </div>
                                <div className="first-column">
                                  <div className="column"></div>
                                  <div className="column" style={{ width: "100%" }}>
                                    <span className="rowHeadingMobile">No. {row.rowNo + 1}</span>
                                  </div>
                                </div>
                                <div className="remaining-columns">
                                  {columns.map((item, index) => (
                                    <React.Fragment key={`${row.dataId}-${index}`}>
                                      {item === "code" || item === "title" || item === "college" ? (
                                        <>
                                          <div className="column">
                                            <span className="rowHeadingMobile">{capitalizeWords(item)}</span>
                                            <Select
                                              showSearch
                                              placeholder={`Select ${item}`}
                                              name={item}
                                              value={row[item]}
                                              optionFilterProp="children"
                                              className="inputSelectFieldStyle"
                                              ref={inputRef}
                                              defaultValue={row[item]}
                                              bordered={false}
                                              popupMatchSelectWidth={false}
                                              suffixIcon={
                                                <Image
                                                  preview={false}
                                                  src={dropdownIcon || "/placeholder.svg"}
                                                  width={15}
                                                  style={{
                                                    marginRight: 10,
                                                  }}
                                                />
                                              }
                                              onSelect={(value, option) => handleSelect(value, option, row.rowNo)}
                                              optionLabelProp="label"
                                            >
                                              {dropDownOptions &&
                                                dropDownOptions.map((option) => {
                                                  return (
                                                    <Select.Option
                                                      key={option[item]}
                                                      value={option[item]}
                                                      code={option.code}
                                                      row={option}
                                                      label={option[item]}
                                                    >
                                                      {`${option.title}, ${option.code}, ${option.college} ${option?.abbreviation ? `, (${option?.abbreviation})` : ""}`}
                                                    </Select.Option>
                                                  )
                                                })}
                                            </Select>
                                          </div>
                                        </>
                                      ) : (
                                        <div className="column">
                                          <span className="rowHeadingMobile">{capitalizeWords(item)}</span>
                                          <MyCareerGuidanceInputField
                                            placeholder={item}
                                            type="input"
                                            name={item}
                                            value={row[item]}
                                            defaultValue={row[item]}
                                            isPrefix={false}
                                            disabled={!row.editable}
                                          />
                                        </div>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default MyChoicesEdit
