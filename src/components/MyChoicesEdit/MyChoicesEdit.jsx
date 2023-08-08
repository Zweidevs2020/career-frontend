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
import { CheckOutlined, DeleteOutlined, EditOutlined, LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { v4 as uuid4 } from 'uuid';
import {
  MyCareerGuidanceButton,
  MyCareerGuidanceInputField,
} from "../../components/commonComponents";
import {
  getApiWithAuth,
  postApiWithAuth,
  patchApiWithAuth,
  deleteApiWithAuth,
} from "../../utils/api";
import './myChoicesEdit.css';

const { Column, ColumnGroup } = Table;
const optionsItem = [
  {
    key: "1",
    label: "Edit",
  },
  {
    key: "2",
    label: "Delete",
  },
];
const MyChoicesEdit = () => {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [selectedRowId, setSelectedRowId] = useState(null);
  const location = useLocation();
  const { dataa } = location.state || {};
  const [loadingFirst, setLoadingFirst] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columns, setColums] = useState([]);
  const [showRows, setShowRows] = useState(null);
  const [data, setData] = useState([]);
  const [oldData, setOldData] = useState(null);
  const [editDataRow, setEditDataRow] = useState({});
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [addDataRow, setAddDataRow] = useState({});
  const [showRowsData, setShowRowsData] = useState(null);
  const dataRef = useRef(null);
  const rowRef = useRef(null);

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
      setLoadingFirst(false);
    }
  }

  const getTableRecord = async () => {
    
    const response = await getApiWithAuth(`choices/${dataa.id}/`);
   
    if (response.data.status === 200) {
      setOldData(response.data.data);
      setLoadingFirst(false);
    } else {
      setLoadingFirst(false);
    }
  };
  useEffect(() => {
    
  }, [data]);

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
            }))
          );
        } else {
          setData(
            showRowsData.map((item, index) => ({
              ...item,
              rowNo: index,
              editable: false,
            }))
          );
        }
      }
    }

  }, [showRowsData, oldData]);

  useEffect(() => {
    
    if (showRows !== null) {
      const newData = Array.from({ length: showRows }, () => {
        const rowData = { id: uuid4()};
        columns.forEach((column) => {
          rowData[column] = null;
        });
        return rowData;
      });

      setShowRowsData(newData);
    }
  }, [showRows]);
  const showModalAdd = () => {
    setIsModalAddOpen(true);
  };
  const handleCancelAdd = () => {
    form.resetFields();
    setAddDataRow({});
    setIsModalAddOpen(false);
  };
  const showModal = (record) => {
    setEditDataRow(record);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditDataRow({ ...editDataRow, [name]: value });
  };
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setAddDataRow({ ...addDataRow, [name]: value });
  };

  const handleChangeTable = (e, rowData) => {
    
    const { name, value } = e.target;
    

    
    let updatedData = data.map((item) => {
      if (item.rowNo === rowData.rowNo) {
        rowRef.current = { ...rowRef.current, id: item.id, [name]: value }
        return  rowRef.current ;
      } else {
        return item;
      }
    });
  
  
    dataRef.current = {...updatedData};
  
   
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
          

    const checkNullValue = (record, key) => {
     
      if (record[key] === null || record[key] === "") {
        return key;
      }
      return null;
    };

    const nullKeys = columns
      .map((column) => checkNullValue(record, column))
      .filter(Boolean);

  
    if (nullKeys.length > 0) {
      message.error(`Please enter the ${nullKeys[0]} of the Row`);
    } else {

      const row = dataRef.current.filter( (item) => item.id === record.id );

      const respose = await patchApiWithAuth(
        `choices/update-${dataa.id}/${record.rowNo}/`,
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
    const checkNullValue = (record, key) => {
   
      if (record[key] === null || record[key] === "") {
        return key;
      }
      return null;
    };

    const nullKeys = columns
      .map((column) => checkNullValue(record, column))
      .filter(Boolean);
   
    if (nullKeys.length > 0) {

      message.error(`Please enter the ${nullKeys[0]} of the Row`);
    } else {

      const respose = await postApiWithAuth(`choices/${dataa.id}/`, record);

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
    return <tr {...props} ref={setNodeRef} style={style} {...attributes}  {...listeners} />;
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );
  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setData((prev) => {
        const activeIndex = prev.findIndex((i) => i.id === active.id);
        const overIndex = prev.findIndex((i) => i.id === over?.id);

        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  return (
    <>
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
                    items={data.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Table pagination={false} dataSource={data} rowKey={"id"} components={{
                      body: {
                        row: Row,
                      }
                    }}
                    >

                      {columns.map((item) => {

                        return (
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
                              <a onClick={() => handleAddRow(record)}>Add</a>
                            ) : (
                              <a onClick={() => eidtThisRow(record)}><EditOutlined /></a>
                            )}
                            <a onClick={() => handleDelete(record)}><DeleteOutlined /></a>
                          </Space>
                        )}
                      />
                    </Table>
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </div>
        </div>
      </div >
      <Modal
        className="modalStyleClass2"
        width={800}
        bodyStyle={{
          background: "none",
          display: "flex",
          justifyContent: "center",
        }}
        open={isModalOpen}
        footer={[]}
        title={
          <div style={{ display: "flex", justifyContent: "center" }}>Edit</div>
        }
        visible={true}
        onCancel={handleCancel}
      >
        <Form layout="vertical" onFinish={handleUpdate} form={form2}>
          <Row gutter={[16, 0]} justify="center" className="mt-4">
            {Object.keys(editDataRow).map((item, index) => {
              if (item !== "id" && item !== "choice") {
                return (
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={item}
                      name={`${item} ${index}`}
                      className="eduItemLable"
                      rules={[
                        {
                          required: editDataRow[item] ? false : true,
                          message: `Please input your ${item}!`,
                        },
                      ]}
                    >
                      <MyCareerGuidanceInputField
                        placeholder={item}
                        type="input"
                        name={item}
                        onChange={(e) => handleChange(e)}
                        inputValue={editDataRow[item]}
                        isPrefix={false}
                      />
                    </Form.Item>
                  </Col>
                );
              }
            })}
          </Row>
          <div className="mt-5" style={{ display: "flex" }}>
            <MyCareerGuidanceButton
              label="Save"
              className="takebutton"
              type="primary"
              htmlType="submit"
            />
            <MyCareerGuidanceButton
              label="Cancel"
              className="viewResultButton"
              type="button"
              htmlType="button"
              onClick={handleCancel}
            />
          </div>
        </Form>
      </Modal>

      <Modal
        className="modalStyleClass2"
        width={800}
        bodyStyle={{
          background: "none",
          display: "flex",
          justifyContent: "center",
        }}
        open={isModalAddOpen}
        footer={[]}
        title={
          <div style={{ display: "flex", justifyContent: "center" }}>
            Add New
          </div>
        }
        visible={true}

        onCancel={handleCancelAdd}
      >
        <Form layout="vertical" onFinish={handleAddRow} form={form}>
          <Row gutter={[16, 0]} justify="center" className="mt-4">
            {columns.map((item, index) => {
              if (item !== "id") {
                return (
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={item}
                      name={`${item} ${index}`}
                      className="eduItemLable"
                      rules={[
                        {
                          required: true,
                          message: `Please input your ${item}!`,
                        },
                      ]}
                    >
                      <MyCareerGuidanceInputField
                        placeholder={item}
                        type="input"
                        name={item}
                        onChange={(e) => handleChange2(e)}
                        inputValue={addDataRow[item]}
                        isPrefix={false}
                      />
                    </Form.Item>
                  </Col>
                );
              }
            })}
          </Row>
          <div className="mt-5" style={{ display: "flex" }}>
            <MyCareerGuidanceButton
              label="Save"
              className="takebutton"
              type="primary"
              htmlType="submit"
            />
            <MyCareerGuidanceButton
              label="Cancel"
              className="viewResultButton"
              type="button"
              htmlType="button"
              onClick={handleCancelAdd}
            />
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default MyChoicesEdit;



