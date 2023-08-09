import React, { useEffect, useState } from "react";
import { Spin, message, Button, TimePicker, Modal, Select } from "antd";
import dayjs from "dayjs";

import {
  getApiWithAuth,
  postApiWithAuth,
  deleteApiWithAuth,
  putApiWithAuth,
} from "../../utils/api";
import {
  MyCareerGuidanceButton,
  MyCareerGuidanceInputField,
} from "../commonComponents";
import { useNavigate, useLocation } from "react-router-dom";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { API_URL } from "../../utils/constants";
import "./Mystudy.css";
const isMobile = window.innerWidth <= 768;
const MyStudy = () => {
  const { Option } = Select;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataTime, setDatatime] = useState([]);
  const [calenderData, setCalenderData] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [weekDay, setWeekDay] = useState("");
  const [title, setTitle] = useState("");
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);
  const [deleteBooking, setDeleteBooking] = useState(false);
  const [deleteHandler, setDeleteHandler] = useState(false);
  const [openViewBooking, setOpenViewBooking] = useState(false);
  const [viewData, setViewData] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(true);
  const handleOpenBooking = () => setOpenBooking(true);
  const handleCloseBooking = () => setOpenBooking(false);
  const handleCloseBooking2 = () => setDeleteBooking(false);

  const handleOpenViewBooking = () => setOpenViewBooking(true);
  const handleCloseViewBooking = () => setOpenViewBooking(false);

  const optionArray = [];

  const startTime = new Date("2000-01-01T06:00:00");
  const endTime = new Date("2000-01-02T00:00:00");
  const interval = 30 * 60 * 1000;
  for (
    let time = startTime;
    time < endTime;
    time.setTime(time.getTime() + interval)
  ) {
    const label = time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    const value = label;
    optionArray.push({ label, value });
  }

  useEffect(() => {
    getCalanderData();
  }, []);

  const getCurrentWeek = () => {
    var currentDate = moment();
    var weekStart = currentDate.clone().startOf("week");
    var days = [];
    for (var i = 0; i <= 6; i++) {
      days.push(moment(weekStart).add(i, "days").format("ddd MMMM DD YYYY"));
    }
    setDatatime(days);
  };

  const setShowData = (dayCount, AllArray) => {
    return AllArray[dayCount];
  };
  const handleEventDrop = async (event) => {
    const { id, start, end } = event.event;

    if (start && end) {
      const viewData = {
        id: start.getDay(),
        title: event.event.title,
        start: start.toISOString(),
        end: end.toISOString(),
      };

      try {
        await handleEditCalender(
          event.event._def.extendedProps.selectID,
          viewData
        );
        event.event.setProp("start", start); // Manually update event start
        event.event.setProp("end", end); // Manually update event end
      } catch (error) {
        // Handle error
      }
    }
  };

  const handleEventResize = async (event) => {
    const { id, start, end } = event.event;
    // setViewData(clickInfo.event._def.extendedProps);

    if (start && end) {
      const viewData = {
        id: start.getDay(),
        title: event.event.title,
        start: start.toISOString(),
        end: end.toISOString(),
      };

      await handleEditCalender(
        event.event._def.extendedProps.selectID,
        viewData
      );
    }
  };

  const handleEditCalender = async (id, viewData) => {
    setUpdateLoading(true);
    const startTime = moment(viewData.start).format("hh:mm:ss");
    const endTime = dayjs(viewData.end).format("hh:mm:ss");

    try {
      const response = await putApiWithAuth(`timetable/update-timeslot/${id}`, {
        timeslot: startTime,
        endslot: endTime,
        day: viewData.id.toString(),
        title: viewData.title,
      });

      if (response.data.success === true) {
        const arr = [response.data.data];
        message.success("Booking Updated Successfully");

        const updatedCalenderData = arr.map((item) => {
          // if (item.id === parseInt(viewData.id)) {
          return {
            ...item,
            title: viewData.title,
            start: new Date(
              `${setShowData(parseInt(viewData.id), dataTime)} ${startTime}`
            ),
            end: new Date(
              `${setShowData(parseInt(viewData.id), dataTime)} ${endTime}`
            ),
            extendedProps: {
              ...item.extendedProps,
              title: viewData.title,
              start: new Date(
                `${setShowData(parseInt(viewData.id), dataTime)} ${startTime}`
              ),
              end: new Date(
                `${setShowData(parseInt(viewData.id), dataTime)} ${endTime}`
              ),
            },
          };
          // }
          return item;
        });

        setCalenderData(updatedCalenderData);
        setUpdateLoading(false);
        setOpenViewBooking(false);
        getCalanderData();
        // getCalanderData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("An error occurred while updating the booking.");
    }
  };

  useEffect(() => {
    let check = [];
    check = data.map((item) => {
      return {
        title: item.title,
        id: item.day,
        start: new Date(`${setShowData(item.day, dataTime)} ${item.timeslot}`),
        end: new Date(`${setShowData(item.day, dataTime)} ${item.endslot}`),
        backgroundColor: "rgba(41, 204, 57, 0.05)",
        extendedProps: {
          title: item.title,
          id: item.day,
          selectID: item.id,
          start: new Date(
            `${setShowData(item.day, dataTime)} ${item.timeslot}`
          ),
          end: new Date(`${setShowData(item.day, dataTime)} ${item.endslot}`),
        },
      };
    });
    setCalenderData(check);
  }, [dataTime]);

  const getCalanderData = async () => {
    setLoading(true);
    const response = await getApiWithAuth(`timetable/list-timeslot/`);
    if (response?.data.status === 200) {
      setData(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (data.length !== 0) {
      getCurrentWeek();
    }
  }, [data]);
  function renderEventContent(eventInfo) {
    return (
      <>
        <div className="showDateData">
          <b className="showDateData2">{eventInfo.timeText}</b>
          <b className="showDateData2">{eventInfo.event._def.title}</b>
        </div>
      </>
    );
  }

  const handleDateSelect = (selectInfo) => {
    setWeekDay(dayjs(selectInfo.start).format("d"));
    // setSelectedTime(dayjs(selectInfo.start));
    setSelectedTime(dayjs(selectInfo.start).locale("en").format("hh:mm A"));
    // setSelectedEndTime(dayjs(selectInfo.end));
    setSelectedEndTime(dayjs(selectInfo.end).locale("en").format("hh:mm A"));
    console.log("========>hello", setSelectedTime);

    handleOpenBooking();
  };

  const createNewEvent = async () => {
    setLoadingBooking(true);

    let startTime = dayjs(selectedTime, "hh:mm A").format("HH:mm:ss");
    let endTime = dayjs(selectedEndTime, "hh:mm A").format("HH:mm:ss");

    const response = await postApiWithAuth(API_URL.ADDSLOTTABLE, {
      timeslot: startTime,
      endslot: endTime,
      day: weekDay,
      title: title,
    });

    if (response.data.status === 201) {
      message.success("Booking Added");
      setSelectedTime("");
      setSelectedEndTime("");
      setWeekDay("");
      setTitle("");
      setOpenBooking(false);
      setLoadingBooking(false);
      setData([]);
      setDatatime([]);
      getCalanderData();
    } else {
      setLoadingBooking(false);
      message.error(response.data.message[0]);
    }
  };
  const isMobile = window.innerWidth <= 768;


  const handleDelete = async () => {
    setDeleteHandler(true);
    const respose = await deleteApiWithAuth(`timetable/reset-timeslot/`);
    if (respose.data.data.success) {
      message.success("Reset Data succesfully");
      setSelectedTime("");
      setSelectedEndTime("");
      setWeekDay("");
      setTitle("");
      setOpenBooking(false);
      setLoadingBooking(false);
      setData([]);
      setDatatime([]);
      getCalanderData();
      setDeleteHandler(false);
    } else {
      setDeleteHandler(false);
      message.error(respose.data.message);
    }
  };

  const handleEventClick = (clickInfo) => {
    setViewData(clickInfo.event._def.extendedProps);
    handleOpenViewBooking();
  };

  const deleteCurrent = async (id) => {
    setDeleteHandler(true);
    const respose = await deleteApiWithAuth(`timetable/delete-timeslot/${id}`);
    if (respose.data.status === 204) {
      message.success("Delete Data succesfully");
      setOpenBooking(false);
      setLoadingBooking(false);
      getCalanderData();
      handleCloseViewBooking();
      setData([]);
      setDatatime([]);
      setDeleteHandler(false);
      setDeleteBooking(false);
    } else {
      setDeleteHandler(false);
      message.error(respose.data.message);
    }
  };

  const handleChangeViewData = (e) => {
    setBtnDisabled(false);
    const { name, value } = e.target;
    setViewData({ ...viewData, [name]: value });
  };

  const handleChangeStartTime = (e, d) => {
    setBtnDisabled(false);
    setViewData({ ...viewData, start: e?.$d });
  };

  const handleChangeEndTime = (e, d) => {
    setBtnDisabled(false);
    setViewData({ ...viewData, end: e?.$d });
  };

  const handleEdit = async (id) => {
    setUpdateLoading(true);
    let startTime = moment(viewData.start).format("hh:mm:ss");
    let endTime = dayjs(viewData.end).format("hh:mm:ss");
    // let dataarr = []
    // data.map((e,i)=>(
    //   dataarr.push(e.day)
    // ))
    setBtnDisabled(true);
    const response = await putApiWithAuth(`timetable/update-timeslot/${id}`, {
      timeslot: startTime,
      endslot: endTime,
      day: viewData.id,
      title: viewData.title,
    });
    if (response.data.success === true) {
      message.success("Booking Updated Successfully");
      setUpdateLoading(false);
      getCalanderData();
      setOpenViewBooking(false);
    }
    if (response.data.success === false) {
      message.error(response.data.message);
    }
  };
  function handleChange(value) {
    setSelectedTime(value);
  }

  function handleChange2(value) {
    setSelectedEndTime(value);
  }
  return (
    <>
      <div className="educationalGuidanceMainDiv">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="welcomeHaddingText pb-4">My Study Timetable</div>
          <Button
            className="takebutton"
            type="primary"
            loading={deleteHandler}
            onClick={handleDelete}
          >
            Reset all
          </Button>
        </div>
        {loading ? (
          <Spin className="spinStyle" />
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin,timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "",
              center: "",
              right: "",
            }}
            initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
            events={calenderData}
            eventContent={renderEventContent}
            eventClick={handleDateSelect}
            longPressDelay={1}
            select={(arg) => {
              handleDateSelect(arg.start, arg.end);
            }}
            selectable={true}
            editable={true}
           weekends={true}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            allDaySlot={false}
            height="100vh"
            dayMaxEventRows={isMobile ? 1 : 5}
            dayHeaderContent={(args) => {
              const date = args.date;
              const dayOfWeek = date.toLocaleString("default", {
                weekday: "long",
              });
              return `${dayOfWeek}`;
              }}
            slotMinTime="06:00:00"
          />
        )}
      </div>

      <Modal
        className="modalStyleClass"
        bodyStyle={{
          background: "none",
          width: "97%",
        }}
        open={openBooking}
        onCancel={handleCloseBooking}
        footer={[]}
      >
        <div className="mt-5 pt-5 ps-2">
          <MyCareerGuidanceInputField
            placeholder="Add Title"
            type="input"
            name="full_name"
            onChange={(e) => setTitle(e.target.value)}
            inputValue={title}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Select
              placeholder="Select time"
              onChange={handleChange}
              value={selectedTime}
              className="inputFieldStyleSelect"
            >
              {optionArray.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            {/* <TimePicker
              onChange={(e) => setSelectedTime(e)}
              value={selectedTime}
              use12Hours={true}
              minuteStep={15}
              format="h:mm a"
              style={{ width: 200 }}
              className="inputFieldStyle"
            /> */}
            {/* <TimePicker
              onChange={(e) => setSelectedEndTime(e)}
              value={selectedEndTime}
              use12Hours={true}
              minuteStep={15}
              format="h:mm a"
              className="inputFieldStyle"
              style={{ width: 200 }}
            /> */}

            <Select
              placeholder="Select end Time"
              onChange={handleChange2}
              value={selectedEndTime}
              className="inputFieldStyleSelect"
            >
              {optionArray.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <div
            className="mt-3"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <MyCareerGuidanceButton
              label={"Create"}
              className="takebutton"
              type="button"
              htmlType="button"
              onClick={createNewEvent}
              loading={loadingBooking}
            />
          </div>
        </div>
      </Modal>

      <Modal
        className="modalStyleClass"
        bodyStyle={{
          background: "none",
          width: "97%",
        }}
        open={deleteBooking}
        onCancel={handleCloseBooking2}
        footer={[]}
      >
        <div className="mt-5 pt-5 ps-2">
          <div>
            <span className="warnText">
              Are you sure you want to Delete this?
            </span>
          </div>
          <div
            className="mt-3"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <MyCareerGuidanceButton
              label={"Cancel"}
              className="viewResultButton mr-2"
              type="button"
              htmlType="button"
              onClick={() => setDeleteBooking(false)}
            />
            <MyCareerGuidanceButton
              label={deleteHandler ? <Spin size="small" /> : "Delete"}
              className="takebutton deleteBtn"
              type="button"
              htmlType="button"
              onClick={() => {
                deleteCurrent(viewData.selectID);
              }}
              loading={loadingBooking}
            />
          </div>
        </div>
      </Modal>

      <Modal
        className="modalStyleClass"
        bodyStyle={{
          background: "none",
          width: "97%",
        }}
        open={openViewBooking}
        onCancel={handleCloseViewBooking}
        footer={[]}
      >
        <div className="mt-5 pt-5 ps-2">
          <MyCareerGuidanceInputField
            placeholder="Add Title"
            type="input"
            name="title"
            inputValue={viewData.title}
            onChange={handleChangeViewData}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Select
              placeholder="Select time"
              onChange={(value) => {
                setBtnDisabled(false);
                const selectedTime = dayjs(value, "hh:mm A");
                const updatedStartDate = dayjs(viewData.start)
                  .set("hour", selectedTime.hour())
                  .set("minute", selectedTime.minute())
                  .toDate();
                setViewData({ ...viewData, start: updatedStartDate });
              }}
              value={dayjs(viewData.start).locale("en").format("hh:mm A")}
              className="inputFieldStyleSelect"
            >
              {optionArray.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Select End time"
              // onChange={(value) => {
              //   setBtnDisabled(false);
              //   setViewData({ ...viewData, end: value });
              // }}
              onChange={(value) => {
                setBtnDisabled(false);
                const selectedTime = dayjs(value, "hh:mm A");
                const updatedStartDate = dayjs(viewData.start)
                  .set("hour", selectedTime.hour())
                  .set("minute", selectedTime.minute())
                  .toDate();
                setViewData({ ...viewData, end: updatedStartDate });
              }}
              value={dayjs(viewData.end).locale("en").format("hh:mm A")}
              className="inputFieldStyleSelect"
            >
              {optionArray.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <div
            className="mt-3"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <MyCareerGuidanceButton
              label={"Delete"}
              className="takebutton deleteBtn"
              type="button"
              htmlType="button"
              onClick={() => {
                setOpenViewBooking(false);
                setDeleteBooking(true);
              }}
              loading={loadingBooking}
            />
            <MyCareerGuidanceButton
              label={updateLoading ? <Spin size="small" /> : "Edit"}
              disabled={btnDisabled}
              className={
                btnDisabled ? "disabledBtnStyle" : "viewResultButton editBtn"
              }
              type="button"
              htmlType="button"
              onClick={() => handleEdit(viewData.selectID)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MyStudy;
