import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import HourPicker from "./components/hourPicker";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import ReservationModal from "./components/reservationModal";

function App() {
  useEffect(() => {});
  // authenticate users with gmail
  // add events
  // const handleClickDay = async (value) => {
  //   const data = JSON.stringify(value);
  //   console.log(data);
  //   await axios
  //     .post("http://localhost:1234/dateInfo", { date: data })
  //     .then((res) => console.log(res))
  //     .catch((error) => console.log(error));
  // };
  const [value, onChange] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [hour, setHour] = useState("");
  const [when, setWhen] = useState("");

  return (
    <div className="app">
      <div className="calendarHour">
        <Calendar
          className="calendar"
          onChange={onChange}
          value={value}

          // onClickDay={handleClickDay}
        />
        <HourPicker
          className="hourpicker"
          setWhen={setWhen}
          events={events}
          day={value}
          openModal={setShowModal}
          setHour={setHour}
        />
      </div>
      {showModal ? (
        <ReservationModal
          className="reservationForm"
          day={value}
          events={events}
          when={when}
          setEvents={setEvents}
          hour={hour}
          hide={setShowModal}
        />
      ) : null}
    </div>
  );
}

export default App;
