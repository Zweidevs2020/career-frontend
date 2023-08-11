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

    const row = dataRef.current.filter((item) => item.id === record.id);

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
    } else {
      message.error(`Please enter Code to proceed further`);
    }

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
      <><tr {...props} ref={setNodeRef} className={isIdNotNull ? 'old-data' : 'new-data'} style={style} {...attributes} {...listeners} >
      </tr></>
    );

  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  const onDragEnd = async ({ active, over }) => {
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
            }

            setLoadingFirst(false);
          }

          updateOrder1()
          updateOrder2()

          return arrayMove(prev, activeIndex, overIndex);
        });
      }
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
              <div class="h-[40px] w-[10%] bg-[#1476B7] rounded-lg flex items-center justify-evenly">
                <button class="text-[#fff] flex items-center" onClick={() => { navigate("/my-choices") }}>
                  <LeftOutlined class="h-4" />
                  <span class="ml-1">Back</span>
                </button>
              </div>
              <div className="welcomeHaddingText py-3">{dataa.name}</div>
              <div className="w-100 p-3">
                <div className="w-100">
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
                              <a onClick={() => handleDelete(record)}><DeleteOutlined /></a>
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
                          <a onClick={() => handleDelete(record)}><DeleteOutlined /></a>
                        </Space>
                      )}
                    />
                  </Table>

                </div>
              </div>
            </div>
          </div>
        </div >

      )}

    </>
  );
};

export default MyChoicesEdit;






