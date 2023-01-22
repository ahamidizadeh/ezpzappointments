import React, { useState } from "react";
import Calendar from "react-calendar";
import HourPicker from "./components/hourPicker";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import axios from "axios";

function App() {
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

  return (
    <div className="app">
      {/* <header className="App-header">welcome to appointments</header> */}

      <Calendar
        className="calendar"
        onChange={onChange}
        value={value}
        defaultView={"year"}
        // onClickDay={handleClickDay}
      />
      {console.log("this value: ", value)}
      <HourPicker className="hourpicker" day={value} />
      {console.log("hello")}
    </div>
  );
}

export default App;
