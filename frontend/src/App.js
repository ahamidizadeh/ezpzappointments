import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import HourPicker from "./components/hourPicker";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import ReservationModal from "./components/reservationModal";
import axios from "axios";
function App() {
  const [value, onChange] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [hour, setHour] = useState([]);
  const [when, setWhen] = useState("");
  const [hourPicked, setHourPicked] = useState(null);
  const [booking, setBooking] = useState(0);

  useEffect(() => {
    console.log("this is booked just now: ", booking);
    const fetchEvents = async () => {
      const res = await axios.get("http://localhost:1234/events");
      setEvents(res.data);
      if (events.length) {
        setFilteredEvents(
          events.filter(
            (e) => new Date(e.startTime).getDate() === new Date(value).getDate()
          )
        );
      }
    };
    fetchEvents();
    if (booking) {
      fetchEvents();
    }
  }, [value]);
  useEffect(() => {
    onChange(new Date());
  }, [booking]);

  return (
    <div className="app">
      <div className="calendarHour">
        <Calendar className="calendar" onChange={onChange} value={value} />
        <HourPicker
          className="hourpicker"
          setWhen={setWhen}
          booking={booking}
          day={value}
          openModal={setShowModal}
          filteredEvents={filteredEvents}
          setBooking={setBooking}
          setHour={setHour}
          setHourPicked={setHourPicked}
          hour={hour}
        />
      </div>
      {showModal ? (
        <ReservationModal
          className="reservationForm"
          booking={booking}
          setBooking={setBooking}
          day={value}
          hourPicked={hourPicked}
          when={when}
          hour={hour}
          hide={setShowModal}
        />
      ) : null}
    </div>
  );
}

export default App;
