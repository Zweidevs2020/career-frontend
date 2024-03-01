import React, { useEffect, useState, useRef } from "react";
import { Spin, message, Button, TimePicker, Modal, Select } from "antd";
import dayjs from "dayjs";
import {
  getApiWithAuth,
  postApiWithAuth,
  deleteApiWithAuth,
  putApiWithAuth,
  patchApiWithAuth,
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
import { DeleteOutlined } from "@ant-design/icons";
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
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);
  const [deleteBooking, setDeleteBooking] = useState(false);
  const [deleteHandler, setDeleteHandler] = useState(false);
  const [openViewBooking, setOpenViewBooking] = useState(false);
  const [viewData, setViewData] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [disableCreateButton, setDisableCreateButton] = useState(false);
  const [endTimeOptions, setEndTimeOptions] = useState([]);
  const handleOpenBooking = () => setOpenBooking(true);
  const handleCloseBooking = () => setOpenBooking(false);
  const handleCloseBooking2 = () => setDeleteBooking(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleOpenViewBooking = () => setOpenViewBooking(true);
  const handleCloseViewBooking = () => setOpenViewBooking(false);
  const [eventId, setEventId] = useState(0);
  const [weekId, setWeekId] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);


  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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

        event.event.setProp("start", start);
        event.event.setProp("end", end);

      } catch (error) {
        // Handle error
      }
    }
  };

  const handleEventResize = async (event) => {

    const { id, start, end } = event.event;



    if (start && end) {
      const viewData = {
        id: start.getDay(),
        title: event.event.title,
        start: start,
        end: end,
      };

      try {
        await handleEditCalender(
          event.event._def.extendedProps.selectID,
          viewData
        );

      } catch (error) { }
    }
  };

  const handleEditCalender = async (id, viewData) => {

    setUpdateLoading(true);

    const startTime = dayjs(viewData?.start).format("HH:mm:ss");
    const endTime = dayjs(viewData?.end).format("HH:mm:ss");


    try {
      const response = await putApiWithAuth(`timetable/update-timeslot/${id}`, {
        timeslot: startTime,
        endslot: endTime,
        day: viewData.id.toString(),
        title: viewData.title,
      });

      if (response.data.success === true) {
        const arr = [response.data.data];
        message.success("Updated Successfully");

        const updatedCalenderData = arr.map((item) => {

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


  const handleDeleteEvent = async (event) => {
    const eventId = event.extendedProps.selectID;

    setEventToDelete(eventId);

    const response = await deleteApiWithAuth(`timetable/delete-timeslot/${eventId}`);

    if (response.data['status'] === 204) {
      message.success("Event deleted successfully.");
      setDatatime([]);
      getCalanderData();


    } else {
      message.error(response.data.message);
    }
  }




  function renderEventContent(eventInfo) {

    return (
      <>
        <div className="showDateData">
          <div className="showDateData2">
            {eventInfo.event._def.title.length > 10 ? `${eventInfo.event._def.title.slice(0, 15)}...` : eventInfo.event._def.title}
          </div>
          <button
            onClick={() => handleDeleteEvent(eventInfo.event)}
            data-event-id={eventInfo.event._def.extendedProps.selectID}
            style={{ background: "none", border: "none", cursor: "pointer", position: "absolute", top: 0, right: 3 }}
          >
            <DeleteOutlined style={{ color: "white" }} />
          </button>
        </div>
      </>
    );
  }

  const handleDateSelect = (selectInfo, b) => {
    if (b !== undefined) {
      setIsEditing(false);
      const selectedStart = new Date(selectInfo);

      setWeekDay(selectedStart.getDay().toString());
      setSelectedTime(selectedStart.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));

      setSelectedEndTime(selectedTime);
      setTitle('')
      const selectedEnd = new Date(selectedStart.getTime() + 30 * 60 * 1000);
      setSelectedEndTime(selectedEnd.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
      handleOpenBooking();
    }
    else {

      setIsEditing(true);

      const selectedStart = new Date(selectInfo.event._def.extendedProps['start']);

      setWeekDay(selectedStart.getDay().toString());
      setTitle(selectInfo?.event?._def?.extendedProps.title)
      const startTime = selectInfo?.event?._def?.extendedProps.start;
      const originalDateStart = moment(startTime, "ddd MMM D YYYY HH:mm:ss ZZ");
      const formattedDateStart = originalDateStart.format("hh:mm A");
      setSelectedTime(formattedDateStart);
      setEventId(selectInfo?.event?._def?.extendedProps.selectID)
      setWeekId()
      const endTime = selectInfo?.event?._def?.extendedProps.end;
      const originalDateEnd = moment(endTime, "ddd MMM D YYYY HH:mm:ss ZZ");
      const formattedDateEnd = originalDateEnd.format("hh:mm A");

      setSelectedEndTime(formattedDateEnd);
      {
        !eventToDelete &&
          handleOpenBooking();
      }
    }

  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEditing) {
      handleEdit();
    }
    else {
      createNewEvent()
    }
  };

  const createNewEvent = async (e) => {
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

  const updateDataTime = (newDate) => {
    const weekStart = moment(newDate).startOf("week");
    const updatedDataTime = [];
    for (let i = 0; i <= 6; i++) {
      updatedDataTime.push(
        moment(weekStart).add(i, "days").format("ddd MMMM DD YYYY")
      );
    }
    setDatatime(updatedDataTime);
  };

  const handleEventClick = (clickInfo) => {
    const eventData = clickInfo.event._def.extendedProps;
    setSelectedEvent({
      id: eventData.selectID,
      title: eventData.title,
      start: new Date(eventData.start),
      end: new Date(eventData.end),
    });
    handleOpenViewBooking();

    handleEdit(eventData.selectID);
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


    const formattedStartTime = dayjs(selectedTime, "hh:mm A").format("HH:mm:ss");
    const formattedEndTime = dayjs(selectedEndTime, "hh:mm A").format("HH:mm:ss");


    setBtnDisabled(true);

    const response = await putApiWithAuth(`timetable/update-timeslot/${eventId}`, {
      timeslot: formattedStartTime,
      endslot: formattedEndTime,
      day: weekDay,
      title: title,
    });

    if (response.data.success === true) {
      message.success("Updated Successfully");
      setUpdateLoading(false);
      setDatatime([]);
      getCalanderData();
      setOpenViewBooking(false);
      setOpenBooking(false)

    }
    if (response.data.success === false) {
      message.error(response.data.message);
    }

  };

  const handleTimeChange = (start, end) => {
    if (start && end) {
      const startTime = dayjs(start, "hh:mm A");
      const endTime = dayjs(end, "hh:mm A");

      let isDisabled = false;
      let errorMessage = "";

      if (startTime.isAfter(endTime)) {
        isDisabled = true;
        errorMessage = "Start time cannot be greater than end time.";
      } else if (startTime.isSame(endTime)) {
        isDisabled = true;
        errorMessage = "Start & end time can't be the same.";
      }

      setDisableCreateButton(isDisabled);
      setErrorMessage(errorMessage);
    } else {
      setDisableCreateButton(false);
      setErrorMessage("");
    }
  };

  function handleChange(value) {
    setSelectedTime(value);
    handleTimeChange(value, selectedEndTime);
  }

  function handleChange2(value) {
    setSelectedEndTime(value);
    handleTimeChange(selectedTime, value);
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
          <>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={
                isMobile
                  ? {
                    left: "prev,next",
                    center: "",
                    right: "",
                  }
                  : {
                    left: "",
                    center: "",
                    right: "",
                  }
              }

              initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
              events={calenderData}
              eventContent={renderEventContent}
              eventClick={handleDateSelect}

              longPressDelay={100}
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
          </>)}

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
          <form onSubmit={handleSubmit}>
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
                width: '100%',
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Select
                placeholder="Select time"
                onChange={handleChange}
                value={selectedTime}
                bordered={false}
                className="inputFieldStyleSelect"
                style={{ flex: 1, marginRight: '10px' }}
              >
                {optionArray.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Select end Time"
                onChange={handleChange2}
                style={{ marginLeft: '10px', flex: 1 }}
                value={selectedEndTime}
                bordered={false}
                className="inputFieldStyleSelect"
              >
                {optionArray.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="errorTime" >{errorMessage}</div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {!isEditing && (<MyCareerGuidanceButton
                label={"Create"}
                className={`takebutton ${disableCreateButton ? 'disabled' : ''}`}
                // type="submit"
                htmlType="submit"
                // onClick={createNewEvent}
                loading={loadingBooking}
                disabled={disableCreateButton}
              />)}
              {isEditing && (<MyCareerGuidanceButton
                label={"Edit"}
                className={`takebutton ${disableCreateButton ? 'disabled' : ''}`}
                // type="submit"
                htmlType="submit"
                // onClick={handleEdit}
                loading={loadingBooking}
                disabled={disableCreateButton}
              />)}
            </div>
          </form>
        </div>

      </Modal>



    </>

  );
};

export default MyStudy;
