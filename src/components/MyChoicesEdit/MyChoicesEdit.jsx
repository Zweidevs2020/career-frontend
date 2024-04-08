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
import { Input, Modal } from "antd";
import { useLocation } from "react-router-dom";
import { Space, Table, Col, message, Form } from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
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
import "./myChoicesEdit.css";

const { Column, ColumnGroup } = Table;

const MyChoicesEdit = () => {
  const inputRef = useRef(null);
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
    console.log("================resgetChoiceRecord", response);
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
    console.log("================res", response);
    if (response.data.status === 200) {
      setOldData(response.data.data);
      // setData(response.data.data);
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
    const { name, value } = e.target;

    let updatedData = data.map((item) => {
      if (item.rowNo === rowData.rowNo) {
        rowRef.current = {
          ...rowRef.current,
          id: item.id,
          dataId: item.dataId,
          rowDataNo: rowData.rowNo,
          [name]: value,
        };

        return rowRef.current;
      } else {
        return item;
      }
    });

    dataRef.current = [...updatedData];
  };

  const handleChangeTableMobile = (e, rowData) => {
    const { name, value } = e.target;

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
  };

  const eidtThisRow = (record) => {
    console.log("================res eidtThisRow", data, "=====", record);
    const updatedData = data.map((item) => {
      if (item.rowNo === record.rowNo) {
        return { ...item, editable: true };
      } else {
        return item;
      }
    });
    console.log("================res eidtThisRow updatedData", updatedData);

    setData(updatedData);
  };

  const handleUpdate = async (record) => {
    console.log("================res handleUpdate in", record, "====", dataRef);
    const row = dataRef.current.filter((item) => item.id === record?.id);
    console.log("================res handleUpdate row", row);

    if (row.length != 0) {
      const checkNullValue = (row, key) => {
        if (row[0][key] === null || row[0][key] === "") {
          return key;
        }
        return null;
      };

      const nullKeys = columns
        .map((column) => checkNullValue(row, column))
        .filter(Boolean);

      if (nullKeys.length > 0) {
        message.error(`Please enter the ${nullKeys[0]} of the Row`);
      } else {
        const respose = await patchApiWithAuth(
          `choices/update-${dataa.id}/${record.id}/`,
          row[0]
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
      }
    } else {
      setShowRows(null);
      getChoiceRecord();
      getTableRecord();
    }
  };
  const handleUpdateMobile = async (record) => {
    console.log("=================check", record);
    for (const key in record) {
      if (key !== "id" && key !== "order_number" && record[key] === null) {
        message.error(`Please enter the ${key} of the Row`);
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
    const row = dataRef.current.filter((item) => item.dataId === record.dataId);

    if (row.length != 0) {
      const row1 = row[0];
      const checkNullValue = (row1, key) => {
        if (row1[key] === undefined || row1[key] === "") {
          return key;
        } else {
          return null;
        }
      };

      const nullKeys = columns
        .map((key) => checkNullValue(row1, key))
        .filter(Boolean);

      if (nullKeys.length > 0) {
        message.error(`Please enter the ${nullKeys[0]} of the Row`);
      } else {
        row1.order_number = record.rowNo + 1;
        const respose = await postApiWithAuth(`choices/${dataa.id}/`, row);

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
    } else if (!record || !record.code) {
      message.error(`Please enter Code to proceed further`);
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
    console.log("======Row", rowId, data);
    const row = data.find((item) => item.dataId === rowId);
    const shouldShowIcon = data.find((item) => item.id === rowId);
    console.log("======Row row", row);
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
          {/* <Column
            title=""
            key="menuIcon"
            dataIndex="menuIcon"
            render={(text, record) => (
              <MenuOutlined
                style={{
                  touchAction: "none",
                  cursor: "move",
                }}
              />
            )}
          /> */}
          {row?.id ? (
            <MenuOutlined
              {...attributes}
              {...listeners}
              style={{
                touchAction: "none",
                cursor: "move",
                // position: "absolute",
                //  top: "20px",
                // left: "2%",
                display:'flex',
                justifyContent:'center',
                height:100,
                alignItems:'center'
                // color: row?.id ? "red" : "transparent",
              }}
            />
          ) : null}

          {children}
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
    console.log(rowId, "row");
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
      // touchAction: "none",

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
                {/* <span className="rowHeadingMobile">Action</span> */}
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
                      <EditOutlined style={{ color: "#1476b7" }} />
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

  // const onDragEnd = async ({ active, over }) => {
  //   // if ( !isDragInProgress) {
  //   //   return;
  //   // }
  //   console.log(active, over, "active,over");
  //   if (active?.id && over?.id) {
  //     if (active?.id !== over?.id) {
  //       setData((prev) => {
  //         const activeIndex = prev.findIndex((i) => i.dataId === active?.id);

  //         const overIndex = prev.findIndex((i) => i.dataId === over?.id);

  //         const orderUpdate1 = {
  //           order_number: oldData[overIndex]?.order_number,
  //         };

  //         const orderUpdate2 = {
  //           order_number: oldData[activeIndex]?.order_number,
  //         };

  //         const updateOrder1 = async () => {
  //           setLoadingFirst(true);
  //           const respose1 = await patchApiWithAuth(
  //             `choices/update-${dataa.id}/${oldData[activeIndex].id}/`,
  //             orderUpdate1
  //           );

  //           if (respose1.data.status === 200) {
  //             getTableRecord();
  //             // setData(respose1.data.data);
  //           }
  //           setLoadingFirst(false);
  //         };

  //         const updateOrder2 = async () => {
  //           setLoadingFirst(true);
  //           const respose2 = await patchApiWithAuth(
  //             `choices/update-${dataa.id}/${oldData[overIndex].id}/`,
  //             orderUpdate2
  //           );

  //           if (respose2.data.status === 200) {
  //             getTableRecord();
  //             // setData(response.data.data);
  //           }

  //           setLoadingFirst(false);
  //         };

  //         updateOrder1();
  //         updateOrder2();

  //         return arrayMove(prev, activeIndex, overIndex);
  //       });
  //     }
  //   }
  //   {
  //     isMobile && window.location.reload();
  //   }
  // };

  const onDragEnd = async ({ active, over }) => {
    // if ( !isDragInProgress) {
    //   return;
    // }
    console.log(active, over, "active,over");
    if (active?.id && over?.id) {
      if (active?.id !== over?.id) {
        setData((prev) => {
          const activeIndex = prev.findIndex((i) => i.dataId === active?.id);

          const overIndex = prev.findIndex((i) => i.dataId === over?.id);

          const orderUpdate1 = {
            order_number: oldData[overIndex]?.order_number,
          };

          const orderUpdate2 = {
            order_number: oldData[activeIndex]?.order_number,
          };
          console.log(
            "====================orderUpdate1",
            activeIndex,
            overIndex,
            active,
            over,
            orderUpdate1,
            orderUpdate2,
            data,
            oldData
          );
          // const updateOrder1 = async () => {
          //   setLoadingFirst(true);
          //   const respose1 = await patchApiWithAuth(
          //     `choices/update-${dataa.id}/${oldData[activeIndex].id}/`,
          //     orderUpdate1
          //   );

          //   if (respose1.data.status === 200) {
          //      getTableRecord();
          //     // setData(respose1.data.data);
          //   }
          //   setLoadingFirst(false);
          // };

          // const updateOrder2 = async () => {
          //   setLoadingFirst(true);
          //   const respose2 = await patchApiWithAuth(
          //     `choices/update-${dataa.id}/${oldData[overIndex].id}/`,
          //     orderUpdate2
          //   );

          //   if (respose2.data.status === 200) {
          //     getTableRecord();
          //     // setData(response.data.data);
          //   }

          //   setLoadingFirst(false);
          // };

          updateOrder1(
            dataa.id,
            oldData[activeIndex].id,
            oldData[overIndex].id,
            orderUpdate1,
            orderUpdate2
          );

          return arrayMove(prev, activeIndex, overIndex);
        });
      }
    }
    {
      isMobile && window.location.reload();
    }
  };

  const updateOrder1 = async (
    id,
    activeIndexId,
    overIndexId,
    orderUpdate1,
    orderUpdate2
  ) => {
    setLoadingFirst(true);
    const respose1 = await patchApiWithAuth(
      `choices/update-${id}/${activeIndexId}/`,
      orderUpdate1
    );

    if (respose1.data.status === 200) {
      updateOrder2(id, overIndexId, orderUpdate2);
      // setData(respose1.data.data);
    }
    setLoadingFirst(false);
  };

  const updateOrder2 = async (id, overIndexId, orderUpdate2) => {
    setLoadingFirst(true);
    const respose2 = await patchApiWithAuth(
      `choices/update-${id}/${overIndexId}/`,
      orderUpdate2
    );

    if (respose2.data.status === 200) {
      getTableRecord();
      // setData(response.data.data);
    }

    setLoadingFirst(false);
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
                    {/* <LeftOutlined class="h-4" /> */}
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
                            {/* <Column
                              title=""
                              key="menuIcon"
                              dataIndex="menuIcon"
                              render={(text, record) => (
                                <div style={{ width: "100px" }}></div>
                              )}
                            /> */}
                            <Column
                              title="No."
                              dataIndex="rowNo"
                              key="rowNo"
                              className="tableHeadingStyle"
                              render={(text) => <span>{text + 1}</span>}
                            />
                            {columns.map((item) => {
                              return (
                                <>
                                  <Column
                                    title={capitalizeWords(item)}
                                    dataIndex={item}
                                    key={item}
                                    className="tableHeadingStyle"
                                    render={(text, record) => (
                                      <>
                                        <MyCareerGuidanceInputField
                                          ref={inputRef}
                                          placeholder={item}
                                          type="input"
                                          name={item}
                                          defaultValue={text}
                                          onChange={(e) =>
                                            handleChangeTable(e, record)
                                          }
                                          isPrefix={false}
                                          disabled={!record.editable}
                                        />
                                      </>
                                    )}
                                  />
                                </>
                              );
                            })}

                            <Column
                              title="Action"
                              key="Object"
                              className="tableHeadingStyle"
                              dataIndex={"Object"}
                              render={(_, record) => (
                                <Space size="middle">
                                  {record.editable && record.id !== null ? (
                                    <CheckOutlined
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleUpdate(record)}
                                      // ref={handleUpdateRef}
                                    />
                                  ) : record.editable && record.id === null ? (
                                    <PlusCircleOutlined
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleAddRow(record)}
                                      // ref={handleAddRowRef}
                                    />
                                  ) : (
                                    <EditOutlined
                                      style={{
                                        color: "#1476b7",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => eidtThisRow(record)}
                                      // ref={handleeidtThisRowRef}
                                    />
                                  )}
                                  <DeleteOutlined
                                    style={{
                                      color: "red",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(record)}
                                    // ref={handleDeleteRef}
                                  />
                                </Space>
                              )}
                            />
                          </Table>
                        )}
                      </SortableContext>
                    </DndContext>

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
                        className="tableHeadingStyle extraWidth"
                        render={(text) => (
                          <MenuOutlined
                            style={{
                              touchAction: "none",
                              cursor: "default",
                              // position: "absolute",
                              top: "42%",
                              left: "2%",
                              paddingLeft: "5px",
                              color: "white",
                              // color: row?.id ? "red" : "black",
                            }}
                          />
                        )}
                      />
                      <Column
                        title="No."
                        dataIndex="rowNo"
                        key="rowNo"
                        className="tableHeadingStyle extraPadding"
                        style={{ padding: "0 46px" }}
                        render={(text) => <span>{text + 1}</span>}
                      />
                      {columns.map((item) => {
                        return (
                          <>
                            <Column
                              title={capitalizeWords(item)}
                              dataIndex={item}
                              key={item}
                              className="tableHeadingStyle"
                              render={(text, record) => (
                                <>
                                  <MyCareerGuidanceInputField
                                    ref={inputRef}
                                    placeholder={item}
                                    type="input"
                                    name={item}
                                    defaultValue={text}
                                    onChange={(e) =>
                                      handleChangeTable(e, record)
                                    }
                                    isPrefix={false}
                                    disabled={!record.editable}
                                  />
                                </>
                              )}
                            />
                          </>
                        );
                      })}

                      <Column
                        title="Action"
                        key="Object"
                        className="tableHeadingStyle"
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
                            ) : (
                              <a onClick={() => eidtThisRow(record)}>
                                <EditOutlined />
                              </a>
                            )}
                            <a>
                              <DeleteOutlined style={{ color: "grey" }} />
                            </a>

                            {/* <a onClick={() => handleDelete(record)}><DeleteOutlined style={{ color: 'red' }} /></a> */}
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
                                    {columns.map((item, index) => (
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
                                    ))}
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
                                        {/* <span className="rowHeadingMobile">Action</span> */}
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
                                              <EditOutlined
                                                style={{ color: "#1476b7" }}
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
                                        <EditOutlined
                                          style={{ color: "#1476b7" }}
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
                                  <div
                                    className="column"
                                    key={`${item.dataId}-${index}`}
                                  >
                                    <span className="rowHeadingMobile">
                                      {capitalizeWords(item)}
                                    </span>
                                    <MyCareerGuidanceInputField
                                      ref={inputRef}
                                      placeholder={row[item]}
                                      type="input"
                                      // value={row[item]}
                                      name={item}
                                      onChange={(e) =>
                                        handleChangeTableMobile(e, row)
                                      }
                                      defaultValue={row[item]}
                                      isPrefix={false}
                                      disabled={!row.editable}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* <DndContext
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
                          {data.map((row) => (
                            <Row key={row.id} data-row-key={row.dataId}>
                              <div className="dragDrop" key={row.id}>
                                <div
                                  className={`row mobile-row`}
                                  style={{
                                    background: "rgb(244, 246, 248)",
                                    marginBottom: "5rem",
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
                                          <a onClick={() => handleUpdate(row)}>
                                            <CheckOutlined
                                              style={{ color: "#1476b7" }}
                                            />
                                          </a>
                                        ) : row.editable && row.id === null ? (
                                          <a onClick={() => handleAddRow(row)}>
                                            <PlusCircleOutlined
                                              style={{ color: "#1476b7" }}
                                            />
                                          </a>
                                        ) : (
                                          <a onClick={() => eidtThisRow(row)}>
                                            <EditOutlined
                                              style={{ color: "#1476b7" }}
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
                                      <div className="column" key={item.dataId}>
                                        <span className="rowHeadingMobile">
                                          {capitalizeWords(item)}
                                        </span>
                                        <MyCareerGuidanceInputField
                                          ref={inputRef}
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
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </Row>
                          ))}
                        </SortableContext>
                      </DndContext> */}
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
