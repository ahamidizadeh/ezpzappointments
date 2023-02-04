import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import "./hourPicker.css";
function HourPicker(props) {
  const allHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  const [availableHours, setAvailableHours] = useState(allHours);

  useEffect(() => {
    if (!props.filteredEvents.length) {
      setAvailableHours(allHours);
    } else {
      const takenHours = props.filteredEvents.map((e) =>
        new Date(e.startTime).getHours()
      );
      console.log("these hours are taken", takenHours);
      setAvailableHours(findAvailableHours(takenHours));
    }
    // if (props.booking) {
    //   console.log("there is a booking");
    //   availableHours = availableHours.filter((hour) => hour !== props.booking);
    // }
    // props.setHour(availableHours);
    // } else {
    //   setEvents(availableHours);
    // }
  }, [props.filteredEvents]);
  function findAvailableHours(takenHours) {
    let i = 0;
    let j = 0;
    let result = [];

    while (i < allHours.length) {
      if (allHours[i] === takenHours[j]) {
        j++;
        i++;
      } else if (allHours[i] < takenHours[j]) {
        result.push(allHours[i]);
        i++;
      } else {
        result.push(allHours[i]);
        i++;
      }
    }
    return result;
  }
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
    props.setHourPicked(bookingTime);
    findWhen(bookingTime);
  };

  return (
    <>
      <div className="container">
        <header className="header">{props.day.toDateString()}</header>
        {availableHours.map((hour) => (
          <button
            className="hourButton"
            value="hour"
            key={hour}
            onClick={handleBookingClick}
          >
            {String(hour).length === 1 ? "0" + hour : hour}:00 -{" "}
            {String(hour + 1).length === 1
              ? "0" + String(hour + 1)
              : String(hour + 1)}
            :00
          </button>
        ))}
      </div>
    </>
  );
}

export default HourPicker;
