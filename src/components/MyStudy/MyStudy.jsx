import React, { useEffect, useState } from "react";
import { Spin, message, Radio, TimePicker, Modal } from "antd";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
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
import dayjs from "dayjs";
import { API_URL } from "../../utils/constants";
import "./Mystudy.css";
const MyStudy = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataTime, setDatatime] = useState([]);
  const [calenderData, setCalenderData] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [weekDay, setWeekDay] = useState("");
  const [title, setTitle] = useState("");
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);
  const handleOpenBooking = () => setOpenBooking(true);
  const handleCloseBooking = () => setOpenBooking(false);
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
    if (response.data.status === 200) {
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
    setSelectedTime(dayjs(selectInfo.start));
    setSelectedEndTime(dayjs(selectInfo.end));
    handleOpenBooking();
  };
  const createNewEvent = async () => {
    setLoadingBooking(true);
    console.log(selectedTime.$d, dayjs(selectedTime.$d).format("HH:mm:ss"));
    let startTime = dayjs(selectedTime.$d).format("HH:mm:ss");
    let endTime = dayjs(selectedEndTime.$d).format("HH:mm:ss");
    const response = await postApiWithAuth(API_URL.ADDSLOTTABLE, {
      timeslot: startTime,
      endslot: endTime,
      day: weekDay,
      title: title,
    });
    if (response.data.status === 201) {
      message.success("Booking Added");
      getCalanderData();
      setOpenBooking(false);
      setLoadingBooking(false);
    } else {
      setLoadingBooking(false);
      message.error(response.data.message[0]);
    }
  };
  return (
    <>
      <div className="educationalGuidanceMainDiv">
        <div className="welcomeHaddingText pb-4">Schedule Management</div>
        {loading ? (
          <Spin className="spinStyle" />
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "",
              center: "",
              right: "",
            }}
            initialView="timeGridWeek"
            events={calenderData}
            eventContent={renderEventContent} // this function print data
            // eventClick={handleEventClick} //when we select data this function called
            select={handleDateSelect}
            selectable={true}
            allDaySlot={false}
            height="100vh"
            dayMaxEventRows={5}
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
            <TimePicker
              onChange={(e) => setSelectedTime(e)}
              value={selectedTime}
              use12Hours={true}
              minuteStep={15}
              format="HH:mm"
              style={{ width: 200 }}
              className="inputFieldStyle"
            />
            <TimePicker
              onChange={(e) => setSelectedEndTime(e)}
              value={selectedEndTime}
              use12Hours={true}
              minuteStep={15}
              format="HH:mm"
              className="inputFieldStyle"
              style={{ width: 200 }}
            />
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
              label={"cancel"}
              className="viewResultButton me-3"
              type="button"
              htmlType="button"
              onClick={handleCloseBooking}
            />
            <MyCareerGuidanceButton
              label={"Okay"}
              className="takebutton"
              type="button"
              htmlType="button"
              onClick={createNewEvent}
              loading={loadingBooking}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MyStudy;
