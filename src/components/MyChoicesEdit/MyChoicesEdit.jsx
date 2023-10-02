import React, { useEffect, useState, useRef } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Input, Modal } from "antd";
import { useLocation } from "react-router-dom";
import { Space, Table, Col, message, Form } from "antd";
import { CheckOutlined, DeleteOutlined, EditOutlined, LeftOutlined, MenuOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { v4 as uuid4 } from 'uuid';
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
import './myChoicesEdit.css';

const { Column, ColumnGroup } = Table;

const MyChoicesEdit = () => {
  const inputRef = useRef(null);
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
  const [loading, setLoading] = useState(false);

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
      const columnsWithoutOrderNumber = columnsData.slice(0, columnsData.length - 1);

      setColums(columnsWithoutOrderNumber);
      setShowRows(response.data.data.rows);
      setLoadingFirst(false);

    } else {
      setLoadingFirst(true);
    }
  }


  const getTableRecord = async () => {
    
    const response = await getApiWithAuth(`choices/${dataa.id}/`);
   
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
              dataId: uuid4()
            }))
          );
        } else {
          setData(
            showRowsData.map((item, index) => ({
              ...item,
              rowNo: index,
              editable: false,
              dataId: uuid4()
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
      setMyData(oldData)

      setShowRowsData(newData);
    }
  }, [showRows]);

  const handleChangeTable = (e, rowData) => {

    const { name, value } = e.target;

    let updatedData = data.map((item) => {
      if (item.rowNo === rowData.rowNo) {
        rowRef.current = { ...rowRef.current, id: item.id, dataId: item.dataId, rowDataNo: rowData.rowNo, [name]: value }

        return rowRef.current;
      } else {
        return item;
      }

    });
   
    dataRef.current = [...updatedData];

  }

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

  const handleUpdate = async (record) => {
  
    const row = dataRef.current.filter((item) => item.id === record?.id);
   
    if (row) {
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
          setShowRows(null)
          getChoiceRecord();
          setSelectedRowId(record.id);
          getTableRecord();
        } else {
          message.error(respose.data.message);
        }
      }

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
        }
        else {
          return null;
        }
      };

      const nullKeys = columns
        .map((key) => checkNullValue(row1, key))
        .filter(Boolean);

      if (nullKeys.length > 0) {
        message.error(`Please enter the ${nullKeys[0]} of the Row`);

      } else {
        row1.order_number = record.rowNo + 1
        const respose = await postApiWithAuth(`choices/${dataa.id}/`, row);

        if (respose.data.status === 200) {
          message.success("Row add succesfully");
          setShowRows(null)
          getChoiceRecord();
          getTableRecord();
          setSelectedRowId(record.id);

        } else {
          message.error(respose.data.message);
        }
      }
    }
    else if (!record || !record.code) {
      message.error(`Please enter Code to proceed further`);
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


  const Row = (props) => {

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: props['data-row-key'],
    });
    const rowId = props['data-row-key'];
    const row = data.find((item) => item.dataId === rowId);
    const isIdNotNull = row && row.id !== null;
    const style = {
      ...props.style,
      transform: CSS.Transform.toString(
        transform && {
          ...transform,
          scaleY: 1,
        },
      ),

      transition,
      cursor: 'move',

      ...(isDragging
        ? {
          position: 'relative',
          zIndex: 9999,
        }
        : {}),

    };

    return (
      <><tr {...props} ref={setNodeRef} className={isIdNotNull ? 'old-data' : 'new-data'} style={style}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd} {...attributes} {...listeners} >
      </tr></>
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),

  );

 

  const onDragEnd = async ({ active, over }) => {
    if (isMobile && !isDragInProgress) {
      return;
    }
   
    if (active?.id && over?.id) {
      if (active?.id !== over?.id) {
        setData((prev) => {
          const activeIndex = prev.findIndex((i) => i.dataId === active?.id);
         
          const overIndex = prev.findIndex((i) => i.dataId === over?.id);
        
          const orderUpdate1 = { "order_number": oldData[overIndex]?.order_number }
        
          const orderUpdate2 = { "order_number": oldData[activeIndex]?.order_number }
         
          const updateOrder1 = async () => {
            setLoadingFirst(true);
            const respose1 = await patchApiWithAuth(
              `choices/update-${dataa.id}/${oldData[activeIndex].id}/`,
              orderUpdate1
            );
          
            if (respose1.data.status === 200) {
              getTableRecord();
              // setData(respose1.data.data);
            }
            setLoadingFirst(false);
          }

          const updateOrder2 = async () => {
            setLoadingFirst(true);
            const respose2 = await patchApiWithAuth(
              `choices/update-${dataa.id}/${oldData[overIndex].id}/`,
              orderUpdate2
            );

            if (respose2.data.status === 200) {
              getTableRecord();
              // setData(response.data.data);
            }

            setLoadingFirst(false);
          }

          updateOrder1()
          updateOrder2()

          return arrayMove(prev, activeIndex, overIndex);
        });
      }

    }
    {
      isMobile &&
      window.location.reload();
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
                <div className="h-[40px] w-[15%] bg-[#1476B7] rounded-lg flex items-center justify-evenly mx-2" >
                  <button class="text-[#fff] flex items-center" onClick={() => { navigate("/my-choices") }}>
                    {/* <LeftOutlined class="h-4" /> */}
                    <span class="ml-1">Back</span>
                  </button>
                </div>
              ) : (
                <div className="h-[40px] w-[10%] bg-[#1476B7] rounded-lg flex items-center justify-evenly backDesktopButtonChoicesEdit">
                  <button className="text-[#fff] flex items-center" onClick={() => { navigate("/my-choices") }}>
                    <span className="ml-1">Back</span>
                  </button>
                </div>

              )}
              <div className="myChoiceEditHeading py-3">{dataa.name}</div>
              <div className="w-100 p-3">
                {!isMobile ? (

                  <div className="w-100" style={{ overflowX: "auto" }}>
                    <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                      <SortableContext

                        items={data
                          .filter(item => item.id !== null)
                          .map(item => item.dataId)
                        }
                        strategy={verticalListSortingStrategy}
                      >
                        {loadingFirst ? (
                          <Spin className="spinStyle" />
                        ) : (<Table pagination={false} dataSource={data.filter(item => item.id !== null)} className={data.length > 0 && data[0]?.id !== null ? "nonEmptyTable" : "emptyTable"} rowKey={"dataId"} components={{
                          body: {
                            row: Row,
                          }
                        }}
                        >

                          <Column
                            title=""
                            key="menuIcon"
                            dataIndex="menuIcon"
                            render={(text, record) => (

                              <MenuOutlined
                                style={{
                                  touchAction: 'none',
                                  cursor: 'move',

                                }}

                              />
                            )}
                          />
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
                                        onChange={(e) => handleChangeTable(e, record)}
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
                                  <a onClick={() => handleUpdate(record)}><CheckOutlined /></a>
                                ) : record.editable && record.id === null ? (
                                  <a onClick={() => handleAddRow(record)}><PlusCircleOutlined /></a>
                                ) : (
                                  <a onClick={() => eidtThisRow(record)}><EditOutlined /></a>
                                )}
                                <a onClick={() => handleDelete(record)}><DeleteOutlined style={{ color: 'red' }} /></a>
                              </Space>
                            )}
                          />
                        </Table>
                        )}

                      </SortableContext>
                    </DndContext>

                    <Table pagination={false} dataSource={data.filter(item => item.id === null)} className={data.length > 0 && data[0]?.id === null ? "nonEmptyTable" : "emptyTable"} rowKey={"dataId"} components={{
                      body: {
                        row: Row,
                      }
                    }}
                    >
                      <Column
                        render={() => (
                          <MenuOutlined
                            style={{
                              touchAction: 'none',
                              cursor: 'move',
                              color: 'white'
                            }}
                          />
                        )}
                      />
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
                                    onChange={(e) => handleChangeTable(e, record)}
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
                              <a onClick={() => handleUpdate(record)}><CheckOutlined /></a>
                            ) : record.editable && record.id === null ? (
                              <a onClick={() => handleAddRow(record)}><PlusCircleOutlined /></a>
                            ) : (
                              <a onClick={() => eidtThisRow(record)}><EditOutlined /></a>
                            )}
                            <a onClick={() => handleDelete(record)}><DeleteOutlined style={{ color: 'red' }} /></a>
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
                          items={data
                            .filter(item => item.id !== null)
                            .map(item => item.dataId)
                          }
                          strategy={verticalListSortingStrategy}>

                          {data.map((row) => (
                            <Row key={row.id} data-row-key={row.dataId}>
                              <div className="dragDrop" key={row.id}>
                                <div className={`row mobile-row`} style={{ background: 'rgb(244, 246, 248)', marginBottom: '5rem' }}>
                                  <div className="menuIconMobile drag-handle" >
                                    <MenuOutlined
                                      style={{
                                        touchAction: 'none',
                                        cursor: 'move',
                                      }}
                                    />
                                    <div className="actionColumn">
                                      {/* <span className="rowHeadingMobile">Action</span> */}
                                      <Space size="middle">
                                        {row.editable && row.id !== null ? (
                                          <a onClick={() => handleUpdate(row)}><CheckOutlined style={{ color: '#1476b7' }} /></a>
                                        ) : row.editable && row.id === null ? (
                                          <a onClick={() => handleAddRow(row)}><PlusCircleOutlined style={{ color: '#1476b7' }} /></a>
                                        ) : (
                                          <a onClick={() => eidtThisRow(row)}><EditOutlined style={{ color: '#1476b7' }} /></a>
                                        )}
                                        <a onClick={() => handleDelete(row)}><DeleteOutlined style={{ color: 'red' }} /></a>
                                      </Space>
                                    </div>
                                  </div>
                                  <div className="first-column">
                                    <div className="column"></div>
                                    <div className="column" style={{ width: '100%' }}>
                                      <span className="rowHeadingMobile">No.{' '}{row.rowNo}</span>
                                    </div>
                                  </div>
                                  <div className="remaining-columns">
                                    {columns.map((item, index) => (
                                      <div className="column" key={index}>
                                        <span className="rowHeadingMobile">{capitalizeWords(item)}</span>
                                        <MyCareerGuidanceInputField
                                          ref={inputRef}
                                          placeholder={row[item]}
                                          type="input"
                                          name={item}
                                          onChange={(e) => handleChangeTable(e, row)}
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
                      </DndContext>
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
}
export default MyChoicesEdit;






