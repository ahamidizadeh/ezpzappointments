import React, { Component } from "react";
import axios from "axios";
import "./hourPicker.css";
class HourPicker extends React.Component {
  render() {
    const handleBookingClick = async (e) => {
      const bookingTime = e.target.innerHTML;
      const day = this.props.day;
      const res = await axios
        .post("http://localhost:1234/eventInfo", {
          hour: bookingTime,
          day: day,
        })
        .then(() => {
          console.log("sent the booking time to server...");
        })
        .catch((err) => {
          console.log(err);
        });
      console.log("this is the response from API:", res);
    };
    const hours = Array(9)
      .fill()
      .map((_, i) => i + 8);
    return (
      <>
        <div className="container">
          <header className="header">
            {"Please book your appointment, thank you."}
          </header>
          {/* {"this is the day picked :" + this.props.day} */}
          {hours.map((hour, i) => (
            <button
              className="hourButton"
              key={hour}
              onClick={handleBookingClick}
            >
              {String(hour).length === 1 ? "0" + hour : hour}:00 -{" "}
              {i === hours.length - 1 ? "17" : hours[i + 1]}:00
            </button>
          ))}
        </div>
      </>
    );
  }
}

export default HourPicker;
