import React, { useEffect, useState, useRef } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ConfigProvider, Input, Modal } from "antd";
import { useLocation } from "react-router-dom";
import { Space, Table, Col, message, Select, Image } from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  // EditOutlined,
  LeftOutlined,
  MenuOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import {
  MyCareerGuidanceButton,
  MyCareerGuidanceInputField,
} from "../../components/commonComponents";
import { Spin } from "antd";
import {
  getApiWithAuth,
  postApiWithAuth,
  patchApiWithAuth,
  deleteApiWithAuth,
} from "../../utils/api";
import dropdownIcon from "../../assets/dropdownIcon.svg";
// import EditOutlined from "../../assets/nimbus_edit.svg";
import EditOutlined from "../../assets/uil_edit.svg";

import { Link } from "react-router-dom";

import "./myChoicesEdit.css";

const { Column, ColumnGroup } = Table;

const MyChoicesEdit = () => {
  const inputRef = useRef(null);
  const focusRef = useRef(null);
  const handleUpdateRef = useRef(null);
  const handleAddRowRef = useRef(null);
  const handleeidtThisRowRef = useRef(null);
  const handleDeleteRef = useRef(null);
  const navigate = useNavigate();
  const [selectedRowId, setSelectedRowId] = useState(null);
  const location = useLocation();
  const { dataa } = location.state || {};
  const [loadingFirst, setLoadingFirst] = useState(false);
  const [columns, setColums] = useState([]);
  const [showRows, setShowRows] = useState(null);
  const [data, setData] = useState([]);
  const [isDragInProgress, setIsDragInProgress] = useState(false);
  const [dragTimer, setDragTimer] = useState(null);
  const [myData, setMyData] = useState([]);
  const [oldData, setOldData] = useState(null);
  const [dropDownOptions, setDropDownOptions] = useState(null);
  const [showRowsData, setShowRowsData] = useState(null);
  const dataRef = useRef([]);
  const rowRef = useRef(null);
  const inputRefMobile = useRef();

  useEffect(() => {
    getChoiceRecord();
    getTableRecord();
  }, [dataa]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 780);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 780);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getChoiceRecord = async () => {
    setLoadingFirst(true);
    const response = await getApiWithAuth(
      `choices/column-names/?choice=${dataa.id}`
    );
    if (response.data.status === 200) {
      const columnsData = response.data.data.data;
      const columnsWithoutOrderNumber = columnsData.slice(
        0,
        columnsData.length - 1
      );

      setColums(columnsWithoutOrderNumber);
      setShowRows(response.data.data.rows);
      setLoadingFirst(false);
    } else {
      setLoadingFirst(true);
    }
  };

  const getTableRecord = async () => {
    const response = await getApiWithAuth(`choices/${dataa.id}/`);
    if (response.data.status === 200) {
      setOldData(response.data.data.user_data);
      setDropDownOptions(response.data.data.level_data);

      setLoadingFirst(false);
    } else {
      setLoadingFirst(true);
    }
  };

  useEffect(() => {
    if (showRowsData !== null) {
      if (oldData !== null) {
        if (oldData.length > 0) {
          let updateData = [...oldData, ...showRowsData.slice(oldData.length)];

          setData(
            updateData.map((item, index) => ({
              ...item,
              rowNo: index,
              editable: false,
              dataId: uuid4(),
            }))
          );
        } else {
          setData(
            showRowsData.map((item, index) => ({
              ...item,
              rowNo: index,
              editable: false,
              dataId: uuid4(),
            }))
          );
        }
      }
    }
  }, [showRowsData, oldData]);

  useEffect(() => {
    if (showRows !== null) {
      const newData = Array.from({ length: showRows }, () => {
        const rowData = { dataId: uuid4(), id: null };
        columns.forEach((column) => {
          rowData[column] = null;
        });
        return rowData;
      });
      setMyData(oldData);

      setShowRowsData(newData);
    }
  }, [showRows]);

  const handleChangeTable = (e, rowData) => {
    const { name, value, id } = e.target;

    let updatedData = data.map((item) => {
      if (item.rowNo === rowData.rowNo) {
        return {
          ...item,
          id: item.id,
          dataId: item.dataId,
          rowNo: rowData.rowNo,
          editable: true,
          [name]: value,
        };
      } else {
        return item;
      }
    });

    setData(updatedData);

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.focus();
      }
    }, 0);
  };

  const handleChangeTableMobile = (e, rowData) => {
    const { name, value, id } = e.target;

    let updatedData = data.map((item) => {
      if (item.rowNo === rowData.rowNo) {
        return {
          ...item,
          id: item.id,
          dataId: item.dataId,
          rowNo: rowData.rowNo,
          [name]: value,
        };
      } else {
        return item;
      }
    });
    setData(updatedData);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.focus();
      }
    }, 0);
  };

  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus();
      focusRef.current = null; // Reset to avoid unnecessary focusing
    }
  }, [data]);

  const eidtThisRow = (record) => {
    const updatedData = data.map((item) => {
      if (item.rowNo === record.rowNo) {
        return { ...item, editable: true };
      } else {
        return item;
      }
    });
    setData(updatedData);
  };
  // Update function for desktop
  const handleUpdate = async (record) => {
    if (record?.title) {
      const [title] = record.title.split(",");
      record.title = title;
    }
    if (record?.college) {
      const [college] = record.college.split(",");
      record.college = college;
    }

    const respose = await patchApiWithAuth(
      `choices/update-${dataa.id}/${record.id}/`,
      record
    );

    if (respose.data.status === 200) {
      message.success("Row update succesfully");
      setShowRows(null);
      getChoiceRecord();
      setSelectedRowId(record.id);
      getTableRecord();
    } else {
      message.error(respose.data.message);
    }
  };
  const handleUpdateMobile = async (record) => {
    for (const key in record) {
      if (key !== "id" && key !== "order_number" && record[key] === null) {
        // message.error(`Please enter the ${key} of the Row`);
        break;
      }
    }
    const respose = await patchApiWithAuth(
      `choices/update-${dataa.id}/${record.id}/`,
      record
    );

    if (respose.data.status === 200) {
      message.success("Row update succesfully");
      setShowRows(null);
      getChoiceRecord();
      setSelectedRowId(record.id);
      getTableRecord();
    } else {
      message.error(respose.data.message);
    }
  };
  const handleDelete = async (item) => {
    const respose = await deleteApiWithAuth(
      `choices/delete-${dataa.id}/${item.id}/`
    );

    if (respose.data.status === 204) {
      message.success("Row delete succesfully");
      getChoiceRecord();
      getTableRecord();
    } else {
      message.error(respose.data.message);
    }
  };

  const handleAddRow = async (record) => {
    if (record.code === null || record.title === null) {
      message.error("All fields are required");
    } else {
      if (record?.title) {
        const [title] = record.title.split(",");
        record.title = title;
      }
      if (record?.college) {
        const [college] = record.college.split(",");
        record.college = college;
      }
      const respose = await postApiWithAuth(`choices/${dataa.id}/`, record);
      if (respose.data.status === 200) {
        message.success("Row add succesfully");
        setShowRows(null);
        getChoiceRecord();
        getTableRecord();
        setSelectedRowId(record.id);
      } else {
        message.error(respose.data.message);
      }
    }
  };
  const handleAddRowMobile = async (record) => {
    for (const key in record) {
      if (key !== "id" && record[key] === null) {
        message.error(`Please enter the ${key} of the Row`);
        break;
      }
    }
    const respose = await postApiWithAuth(`choices/${dataa.id}/`, record);

    if (respose.data.status === 200) {
      message.success("Row add succesfully");
      setShowRows(null);
      getChoiceRecord();
      getTableRecord();
      setSelectedRowId(record.id);
    } else {
      message.error(respose.data.message);
    }
  };
  const handleTouchStart = () => {
    // Set a timer to detect long touch
    const timer = setTimeout(() => {
      setIsDragInProgress(true);
    }, 900); // Adjust the delay time (in milliseconds) as needed

    setDragTimer(timer);
  };

  const handleTouchEnd = () => {
    clearTimeout(dragTimer);
    setIsDragInProgress(false);
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const Row = ({ children, ...props }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props["data-row-key"],
    });
    const rowId = props["data-row-key"];
    const row = data.find((item) => item.dataId === rowId);
    const isIdNotNull = row && row.id !== null;
    const style = {
      ...props.style,
      position: "relative",
      transform: CSS.Transform.toString(
        transform && {
          ...transform,
          scaleY: 1,
        }
      ),

      transition,
      cursor: "move",

      ...(isDragging
        ? {
            position: "relative",
            zIndex: 9999,
          }
        : {}),
    };

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
    );
  };

  const MobileRow = (props) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props["data-row-key"],
    });

    const rowId = props["data-row-key"];
    const { row: comingRow } = props;
    const row = data.find((item) => item.dataId === rowId);
    const isIdNotNull = row && row.id !== null;
    const style = {
      ...props.style,

      transform: CSS.Transform.toString(
        transform && {
          ...transform,
          scaleY: 1,
        }
      ),

      transition,
      cursor: "move",
      ...(isDragging
        ? {
            position: "relative",
            zIndex: 9999,
          }
        : {}),
    };

    return (
      <>
        <div
          {...props}
          ref={setNodeRef}
          className={isIdNotNull ? "old-data" : "new-data"}
          style={style}
        >
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
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                {...attributes}
                {...listeners}
              />
              <div className="actionColumn">
                <Space size="middle">
                  {comingRow.editable && comingRow.id !== null ? (
                    <a onClick={() => handleUpdateMobile(comingRow)}>
                      <CheckOutlined style={{ color: "#1476b7" }} />
                    </a>
                  ) : row.editable && row.id === null ? (
                    <a onClick={() => handleAddRow(comingRow)}>
                      <PlusCircleOutlined style={{ color: "#1476b7" }} />
                    </a>
                  ) : (
                    <a onClick={() => eidtThisRow(comingRow)}>
                      <Image
                        preview={false}
                        src={EditOutlined}
                        style={{
                          color: "#1476b7",
                          cursor: "pointer",
                          width: 22,
                          height: "100%",
                        }}
                      />
                    </a>
                  )}
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
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // distance: ,
        delay: 50,
        tolerance: 2,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        // distance: ,
        distance: 10,
        delay: 50,
        tolerance: 2,
      },
    }),
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
        delay: 50,
        tolerance: 2,
      },
    })
  );

  const onDragEnd = async ({ active, over }) => {
    if (active?.id && over?.id) {
      if (active?.id !== over?.id) {
        setData((prev) => {
          const activeIndex = prev.findIndex((i) => i.dataId === active?.id);

          const overIndex = prev.findIndex((i) => i.dataId === over?.id);
          const checkArray = arrayMove(prev, activeIndex, overIndex);
          const swapArray = checkArray.filter((item) => item.id !== null);
          const check = swapArray.map(async (item, index) => {
            updateOrderMultitimes(dataa.id, item.id, {
              order_number: index + 1,
            });
          });
          Promise.all(check).then(getTableRecord(), getTableRecord());

          return arrayMove(prev, activeIndex, overIndex);
        });
      }
    }
    {
      isMobile && window.location.reload();
    }
  };

  const updateOrderMultitimes = async (id, activeIndexId, swapArrayOrder) => {
    const respose1 = await patchApiWithAuth(
      `choices/update-${id}/${activeIndexId}/`,
      swapArrayOrder
    );

    if (respose1.data.status === 200) {
    }
  };

  const updateOrder2 = async (id, overIndexId, orderUpdate2) => {
    setLoadingFirst(true);
    const respose2 = await patchApiWithAuth(
      `choices/update-${id}/${overIndexId}/`,
      orderUpdate2
    );

    if (respose2.data.status === 200) {
      getTableRecord();
    }

    setLoadingFirst(false);
  };

  const handleSelect = async (value, option, rowNum) => {
    const isCodeAvailable = data.some((item) => item.code === option.code);
    if (isCodeAvailable) {
      message.error("You already select this Course");
    } else {
      const updatedData = data.map((item) => {
        if (item.rowNo === rowNum) {
          const { id, ...rest } = option.row;
          return {
            ...item,
            ...rest,
            order_number: rowNum,
          };
        }
        return item;
      });

      setData(updatedData);
    }
  };
  return (
    <>
      {loadingFirst ? (
        <Spin className="spinStyle" />
      ) : (
        <div className="caoMainDiv">
          <div style={{ background: "white" }}>
            <div className="coaInnerf8fafcDiv">
              {isMobile ? (
                <div className="h-[40px] w-[15%] bg-[#1476B7] rounded-lg flex items-center justify-evenly mx-2">
                  <button
                    class="text-[#fff] flex items-center"
                    onClick={() => {
                      navigate("/my-choices");
                    }}
                  >
                    <span class="ml-1">Back</span>
                  </button>
                </div>
              ) : (
                <div className="h-[40px] w-[10%] bg-[#1476B7] rounded-lg flex items-center justify-evenly backDesktopButtonChoicesEdit">
                  <button
                    className="text-[#fff] flex items-center"
                    onClick={() => {
                      navigate("/my-choices");
                    }}
                  >
                    <span className="ml-1">Back</span>
                  </button>
                </div>
              )}
              <div className="myChoiceEditHeading py-3">{dataa.name}</div>
              <div className="w-100 p-3">
                {!isMobile ? (
                  <div className="w-100" style={{ overflowX: "auto" }}>
                    {/* Desktop view with drag and drop feature */}
                    <DndContext
                      sensors={sensors}
                      modifiers={[restrictToVerticalAxis]}
                      onDragEnd={onDragEnd}
                    >
                      <SortableContext
                        items={data
                          .filter((item) => item.id !== null)
                          .map((item) => item.dataId)}
                        strategy={verticalListSortingStrategy}
                      >
                        {loadingFirst ? (
                          <Spin className="spinStyle" />
                        ) : (
                          <Table
                            pagination={false}
                            dataSource={data.filter((item) => item.id !== null)}
                            className={
                              data.length > 0 && data[0]?.id !== null
                                ? "nonEmptyTable"
                                : "emptyTable"
                            }
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
                              render={(text) => (
                                <span style={{ paddingLeft: 10 }}>
                                  {text + 1}
                                </span>
                              )}
                            />
                            {columns.map((item, index) => {
                              return (
                                <>
                                  {item === "code" ||
                                  item === "title" ||
                                  item === "college" ? (
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
                                                  : `${text},${record.code}`
                                              }
                                              optionFilterProp="children"
                                              className="selectInputFieldStyle"
                                              ref={inputRef}
                                              defaultValue={
                                                item === "code"
                                                  ? text
                                                  : `${text},${record.code}`
                                              }
                                              bordered={false}
                                              popupMatchSelectWidth={false}
                                              disabled={!record.editable}
                                              onClick={() => {
                                                if (!record.editable) {
                                                  eidtThisRow(record);
                                                }
                                              }}
                                              suffixIcon={
                                                <Image
                                                  preview={false}
                                                  src={dropdownIcon}
                                                  width={15}
                                                  style={{ marginRight: 10 }}
                                                />
                                              }
                                              onSelect={(value, option) =>
                                                handleSelect(
                                                  value,
                                                  option,
                                                  rowNum
                                                )
                                              }
                                              optionLabelProp="label"
                                            >
                                              {dropDownOptions.map((option) => {
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
                                                    {`${option.title}, ${option.code}, ${option.college}`}
                                                  </Select.Option>
                                                );
                                              })}
                                            </Select>
                                          </>
                                        )}
                                      />
                                    </>
                                  ) : item === "course_information" ? (
                                    <Column
                                      title={item
                                        .split("_") // Split the string by underscores
                                        .map(
                                          (word) =>
                                            word.charAt(0).toUpperCase() +
                                            word.slice(1) // Capitalize the first letter of each word
                                        )
                                        .join(" ")}
                                      dataIndex={item}
                                      key={item}
                                      className="tableHeadingStyle"
                                      render={(text, record) => (
                                        <>
                                          <Link
                                            to={text}
                                            className="linkStyle"
                                            target={"_blank"}
                                          >
                                            {text}
                                          </Link>
                                        </>
                                      )}
                                    />
                                  ) : (
                                    <Column
                                      title={capitalizeWords(item)}
                                      dataIndex={item}
                                      key={item}
                                      disabled
                                      className="tableHeadingStyle "
                                      render={(text, record) => {
                                        let parseText = parseInt(text);
                                        parseText = isNaN(parseText)
                                          ? text
                                          : parseText;
                                        return (
                                          <div
                                            style={{
                                              position: "relative",
                                            }}
                                            onClick={() => {
                                              if (!record.editable) {
                                                eidtThisRow(record);
                                              }
                                            }}
                                          >
                                            {!record.editable && (
                                              <div
                                                style={{
                                                  position: "absolute",
                                                  height: "100%",
                                                  width: "100%",
                                                  backgroundColor:
                                                    "transparent",
                                                  zIndex: 1,
                                                }}
                                                onClick={() => {
                                                  if (!record.editable) {
                                                    eidtThisRow(record);
                                                  }
                                                }}
                                              ></div>
                                            )}
                                            <MyCareerGuidanceInputField
                                              // ref={inputRef}
                                              placeholder={item}
                                              type="input"
                                              name={item}
                                              defaultValue={parseText}
                                              onChange={(e) =>
                                                handleChangeTable(e, record)
                                              }
                                              isPrefix={false}
                                              id={`input-${item}-${record?.rowNo}`}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (!record.editable) {
                                                  eidtThisRow(record);
                                                }
                                              }}
                                              disabled={!record.editable}
                                            />
                                          </div>
                                        );
                                      }}
                                    />
                                  )}
                                </>
                              );
                            })}

                            <Column
                              title="Action"
                              key="Object"
                              className="firstTableHeadingStyle"
                              dataIndex={"Object"}
                              render={(_, record) => (
                                <Space size="middle">
                                  {record.editable && record.id !== null ? (
                                    <CheckOutlined
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleUpdate(record)}
                                    />
                                  ) : record.editable && record.id === null ? (
                                    <PlusCircleOutlined
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleAddRow(record)}
                                    />
                                  ) : null}
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
                      className={
                        data.length > 0 && data[0]?.id === null
                          ? "nonEmptyTable"
                          : "emptyTable"
                      }
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
                        render={(text) => (
                          <span style={{ paddingLeft: 10 }}>{text + 1}</span>
                        )}
                      />
                      {columns.map((item, index) => {
                        return (
                          <>
                            {item === "code" ||
                            item === "title" ||
                            item === "college" ? (
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
                                            : `${text ?? ""},${
                                                record.code ?? ""
                                              }`
                                        }
                                        optionFilterProp="children"
                                        className="inputSelectFieldStyle"
                                        ref={inputRef}
                                        defaultValue={
                                          item === "code"
                                            ? text
                                            : !text
                                            ? undefined
                                            : `${text ?? ""},${
                                                record.code ?? ""
                                              }`
                                        }
                                        bordered={false}
                                        popupMatchSelectWidth={false}
                                        onClick={() => {
                                          if (!record.editable) {
                                            eidtThisRow(record);
                                          }
                                        }}
                                        suffixIcon={
                                          <Image
                                            preview={false}
                                            src={dropdownIcon}
                                            width={15}
                                            style={{ marginRight: 10 }}
                                          />
                                        }
                                        onSelect={(value, option) =>
                                          handleSelect(
                                            value,
                                            option,
                                            rowNum +
                                              data.filter(
                                                (item) => item.id !== null
                                              ).length
                                          )
                                        }
                                        optionLabelProp="label"
                                      >
                                        {dropDownOptions.map((option) => {
                                          return (
                                            <Select.Option
                                              key={option["id"]}
                                              value={
                                                item === "code"
                                                  ? option[item]
                                                  : `${option[item]},${option.code}`
                                              }
                                              code={option.code}
                                              row={option}
                                              label={option[item]}
                                            >
                                              {`${option.title}, ${option.code}, ${option.college}`}
                                            </Select.Option>
                                          );
                                        })}
                                      </Select>
                                    </>
                                  )}
                                />
                              </>
                            ) : (
                              <Column
                                title={item
                                  .split("_") // Split the string by underscores
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1) // Capitalize the first letter of each word
                                  )
                                  .join(" ")}
                                dataIndex={item}
                                key={item}
                                className="tableHeadingStyle"
                                render={(text, record) => {
                                  let parseText = parseInt(text);
                                  parseText = isNaN(parseText)
                                    ? text
                                    : parseText;

                                  return (
                                    <div
                                      onClick={() => {
                                        if (!record.editable) {
                                          eidtThisRow(record);
                                        }
                                      }}
                                    >
                                      <MyCareerGuidanceInputField
                                        placeholder={item}
                                        type="input"
                                        name={item}
                                        defaultValue={parseText}
                                        onChange={(e) =>
                                          handleChangeTable(e, record)
                                        }
                                        onFocus={(e) =>
                                          (inputRef.current = e.target)
                                        }
                                        id={`input-${item}-${record?.rowNo}`}
                                        isPrefix={false}
                                        // disabled={!record.editable}
                                        onClick={() => {
                                          if (!record.editable) {
                                            eidtThisRow(record);
                                          }
                                        }}
                                      />
                                    </div>
                                  );
                                }}
                              />
                            )}
                          </>
                        );
                      })}

                      <Column
                        title="Action"
                        key="Object"
                        className="firstTableHeadingStyle"
                        dataIndex={"Object"}
                        render={(_, record) => (
                          <Space size="middle">
                            {record.editable && record.id !== null ? (
                              <a onClick={() => handleUpdate(record)}>
                                <CheckOutlined />
                              </a>
                            ) : record.editable && record.id === null ? (
                              <a onClick={() => handleAddRow(record)}>
                                <PlusCircleOutlined />
                              </a>
                            ) : null}
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
                      <DndContext
                        sensors={sensors}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={onDragEnd}
                      >
                        <SortableContext
                          items={data
                            .filter((item) => item.id !== null)
                            .map((item) => item.dataId)}
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
                                  handleUpdateMobile={(row) =>
                                    handleUpdateMobile(row)
                                  }
                                  handleAddRow={(row) => handleAddRow(row)}
                                  eidtThisRow={(row) => eidtThisRow(row)}
                                  handleDelete={(row) => handleDelete(row)}
                                  row={row}
                                >
                                  <div className="first-column">
                                    <div className="column"></div>
                                    <div
                                      className="column"
                                      style={{ width: "100%" }}
                                    >
                                      <span className="rowHeadingMobile">
                                        No. {row.rowNo + 1}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="remaining-columns">
                                    {columns.map((item, index) =>
                                      item === "code" ||
                                      item === "title" ||
                                      item === "college" ? (
                                        <>
                                          <div
                                            className="column"
                                            key={`${item.dataId}-${index}`}
                                          >
                                            <span className="rowHeadingMobile">
                                              {capitalizeWords(item)}
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
                                              disabled={!row.editable}
                                              suffixIcon={
                                                <Image
                                                  preview={false}
                                                  src={dropdownIcon}
                                                  width={15}
                                                  style={{ marginRight: 10 }}
                                                />
                                              }
                                              onSelect={(value, option) =>
                                                handleSelect(
                                                  value,
                                                  option,
                                                  row.rowNo
                                                )
                                              }
                                              optionLabelProp="label"
                                            >
                                              {dropDownOptions.map((option) => {
                                                return (
                                                  <Select.Option
                                                    key={option?.id}
                                                    value={option[item]}
                                                    code={option.code}
                                                    row={option}
                                                    label={option[item]}
                                                  >
                                                    {`${option.title}, ${option.code}, ${option.college}`}
                                                  </Select.Option>
                                                );
                                              })}
                                            </Select>
                                          </div>
                                        </>
                                      ) : item === "course_information" ? (
                                        <div
                                          className="column"
                                          key={`${item.dataId}-${index}`}
                                        >
                                          <span className="rowHeadingMobile">
                                            {item
                                              .split("_") // Split the string by underscores
                                              .map(
                                                (word) =>
                                                  word.charAt(0).toUpperCase() +
                                                  word.slice(1) // Capitalize the first letter of each word
                                              )
                                              .join(" ")}
                                          </span>

                                          <Link
                                            to={row[item]}
                                            className="linkStyle"
                                            target={"_blank"}
                                          >
                                            {row[item]}
                                          </Link>
                                        </div>
                                      ) : (
                                        <div
                                          className="column"
                                          key={`${item.dataId}-${index}`}
                                        >
                                          <span className="rowHeadingMobile">
                                            {capitalizeWords(item)}
                                          </span>
                                          <MyCareerGuidanceInputField
                                            placeholder={row[item]}
                                            type="input"
                                            name={item}
                                            onChange={(e) =>
                                              handleChangeTableMobile(e, row)
                                            }
                                            defaultValue={row[item]}
                                            isPrefix={false}
                                            disabled={!row.editable}
                                          />
                                        </div>
                                      )
                                    )}
                                  </div>
                                </MobileRow>
                              ) : (
                                <div
                                  className="dragDrop"
                                  key={row.dataId}
                                  data-row-key={row.dataId}
                                >
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
                                          {row.editable && row.id !== null ? (
                                            <a
                                              onClick={() =>
                                                handleUpdateMobile(row)
                                              }
                                            >
                                              <CheckOutlined
                                                style={{ color: "#1476b7" }}
                                              />
                                            </a>
                                          ) : row.editable &&
                                            row.id === null ? (
                                            <a
                                              onClick={() => handleAddRow(row)}
                                            >
                                              <PlusCircleOutlined
                                                style={{ color: "#1476b7" }}
                                              />
                                            </a>
                                          ) : (
                                            <a onClick={() => eidtThisRow(row)}>
                                              <Image
                                                preview={false}
                                                src={EditOutlined}
                                                style={{
                                                  color: "#1476b7",
                                                  cursor: "pointer",
                                                  width: 22,
                                                  height: "100%",
                                                }}
                                              />
                                            </a>
                                          )}
                                          <a onClick={() => handleDelete(row)}>
                                            <DeleteOutlined
                                              style={{ color: "red" }}
                                            />
                                          </a>
                                        </Space>
                                      </div>
                                    </div>
                                    <div className="first-column">
                                      <div className="column"></div>
                                      <div
                                        className="column"
                                        style={{ width: "100%" }}
                                      >
                                        <span className="rowHeadingMobile">
                                          No. {row.rowNo + 1}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="remaining-columns">
                                      {columns.map((item, index) => (
                                        <>
                                          {item === "code" ||
                                          item === "title" ||
                                          item === "college" ? (
                                            <>
                                              <div
                                                className="column"
                                                key={`${item.dataId}-${index}`}
                                              >
                                                <span className="rowHeadingMobile">
                                                  {capitalizeWords(item)}
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
                                                  disabled={!row.editable}
                                                  suffixIcon={
                                                    <Image
                                                      preview={false}
                                                      src={dropdownIcon}
                                                      width={15}
                                                      style={{
                                                        marginRight: 10,
                                                      }}
                                                    />
                                                  }
                                                  onSelect={(value, option) =>
                                                    handleSelect(
                                                      value,
                                                      option,
                                                      row.rowNo
                                                    )
                                                  }
                                                  // onSelect={(value, option) =>
                                                  //   handleSelect(
                                                  //     value,
                                                  //     option,
                                                  //     row.rowNo
                                                  //   )
                                                  // }
                                                  optionLabelProp="label"
                                                >
                                                  {dropDownOptions.map(
                                                    (option) => {
                                                      // console.log(
                                                      //   option,
                                                      //   "[option if 4]"
                                                      // );
                                                      return (
                                                        <Select.Option
                                                          key={option[item]}
                                                          value={option[item]}
                                                          code={option.code}
                                                          row={option}
                                                          label={option[item]}
                                                        >
                                                          {`${option.title}, ${option.code}, ${option.college}`}
                                                        </Select.Option>
                                                      );
                                                    }
                                                  )}
                                                </Select>
                                              </div>
                                            </>
                                          ) : (
                                            <div
                                              className="column"
                                              key={`${item.dataId}-${index}`}
                                            >
                                              <span className="rowHeadingMobile">
                                                {capitalizeWords(item)}
                                              </span>
                                              <MyCareerGuidanceInputField
                                                placeholder={row[item]}
                                                type="input"
                                                name={item}
                                                value={row[item]}
                                                // onChange={(e) =>
                                                //   handleChangeTableMobile(
                                                //     e,
                                                //     row
                                                //   )
                                                // }
                                                defaultValue={row[item]}
                                                isPrefix={false}
                                                disabled={!row.editable}
                                              />
                                            </div>
                                          )}
                                        </>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )
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
                                    {row.editable && row.id !== null ? (
                                      <a
                                        onClick={() => handleUpdateMobile(row)}
                                      >
                                        <CheckOutlined
                                          style={{ color: "#1476b7" }}
                                        />
                                      </a>
                                    ) : row.editable && row.id === null ? (
                                      <a
                                        onClick={() => handleAddRowMobile(row)}
                                      >
                                        <PlusCircleOutlined
                                          style={{ color: "#1476b7" }}
                                        />
                                      </a>
                                    ) : (
                                      <a onClick={() => eidtThisRow(row)}>
                                        <Image
                                          preview={false}
                                          src={EditOutlined}
                                          style={{
                                            color: "#1476b7",
                                            cursor: "pointer",
                                            width: 22,
                                            height: "100%",
                                          }}
                                        />
                                      </a>
                                    )}
                                    <a>
                                      <DeleteOutlined
                                        style={{ color: "grey" }}
                                      />
                                    </a>
                                  </Space>
                                </div>
                              </div>
                              <div className="first-column">
                                <div className="column"></div>
                                <div
                                  className="column"
                                  style={{ width: "100%" }}
                                >
                                  <span className="rowHeadingMobile">
                                    No. {row.rowNo + 1}
                                  </span>
                                </div>
                              </div>
                              <div className="remaining-columns">
                                {columns.map((item, index) => (
                                  <>
                                    {item === "code" ||
                                    item === "title" ||
                                    item === "college" ? (
                                      <>
                                        <div
                                          className="column"
                                          key={`${item.dataId}-${index}`}
                                        >
                                          <span className="rowHeadingMobile">
                                            {capitalizeWords(item)}
                                          </span>
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
                                            disabled={!row.editable}
                                            suffixIcon={
                                              <Image
                                                preview={false}
                                                src={dropdownIcon}
                                                width={15}
                                                style={{
                                                  marginRight: 10,
                                                }}
                                              />
                                            }
                                            onSelect={(value, option) =>
                                              handleSelect(
                                                value,
                                                option,
                                                row.rowNo
                                              )
                                            }
                                            // onSelect={(value, option) =>
                                            //   handleSelect(
                                            //     value,
                                            //     option,
                                            //     row.rowNo
                                            //   )
                                            // }
                                            optionLabelProp="label"
                                          >
                                            {dropDownOptions.map((option) => {
                                              // console.log(
                                              //   option,
                                              //   "[option if ]"
                                              // );
                                              return (
                                                <Select.Option
                                                  key={option[item]}
                                                  value={option[item]}
                                                  code={option.code}
                                                  row={option}
                                                  label={option[item]}
                                                >
                                                  {`${option.title}, ${option.code}, ${option.college}`}
                                                </Select.Option>
                                              );
                                            })}
                                          </Select>
                                        </div>
                                      </>
                                    ) : (
                                      <div
                                        className="column"
                                        key={`${item.dataId}-${index}`}
                                      >
                                        <span className="rowHeadingMobile">
                                          {capitalizeWords(item)}
                                        </span>
                                        <MyCareerGuidanceInputField
                                          placeholder={item}
                                          type="input"
                                          name={item}
                                          value={row[item]}
                                          // onChange={(e) =>
                                          //   handleChangeTableMobile(
                                          //     e,
                                          //     row
                                          //   )
                                          // }
                                          defaultValue={row[item]}
                                          isPrefix={false}
                                          disabled={!row.editable}
                                        />
                                      </div>
                                    )}
                                  </>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default MyChoicesEdit;
