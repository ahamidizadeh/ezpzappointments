import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import "./hourPicker.css";
function HourPicker(props) {
  const [events, setEvents] = useState([]);
  const [hours, setHours] = useState([]); // const [bookedHours, setBookedHours] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1234/events?date=${props.day}`
        );
        setEvents(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, [props.day]);

  useEffect(() => {
    const allHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    const availableHours = allHours.filter(
      (hour) => !events.find((e) => new Date(e.startTime).getHours() === hour)
    );

    setHours(availableHours);
  }, [events]);

  function filterEventsByDate(events, selectedDate) {
    return events.filter((event) => {
      const eventStart = new Date(event.start.dateTime);
      const eventEnd = new Date(event.end.dateTime);
      return (
        eventStart.getDate() === selectedDate.getDate() &&
        eventStart.getMonth() === selectedDate.getMonth() &&
        eventStart.getFullYear() === selectedDate.getFullYear()
      );
    });
  }

  const handleBookingClick = async (e) => {
    const findWhen = (t) => {
      const startTime = Number(t.substr(0, 2));
      switch (true) {
        case startTime >= 8 && startTime <= 10:
          props.setWhen("morning");
          break;
        case startTime > 10 && startTime <= 14:
          props.setWhen("around noon");
          break;
        case startTime > 14 && startTime <= 17:
          props.setWhen("afternoon");
          break;

        default:
          console.log("resrving hahaha!");
      }
    };

    props.openModal(true);
    const bookingTime = e.target.innerHTML;
    props.setHour(bookingTime);
    findWhen(bookingTime);
  };

  return (
    <>
      <div className="container">
        <header className="header">{props.day.toDateString()}</header>
        {hours.map((hour) => (
          <button
            className="hourButton"
            value="hour"
            key={hour}
            onClick={handleBookingClick}
          >
            {String(hour).length === 1 ? `0${hour}` : hour}:00 -{" "}
            {String(hour + 1).length === 1 ? `0${hour + 1}` : hour + 1}:00
          </button>
        ))}
      </div>
    </>
  );
}

export default HourPicker;
