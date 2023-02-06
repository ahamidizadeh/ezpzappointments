import React, { Component, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import "./reservationModal.css";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

function ReservationModal(props) {
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const ReservationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "too short")
      .max(20, "too long")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phone: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .notRequired(),
    info: Yup.string().min(3).max(75),
  });

  const handleCancel = () => {
    // change it to true later cause it doesnt make sense lol
    props.hide(false);
    props.setBooking(null);
    console.log(props.booking);
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    const startTime = Number(props.hourPicked.substring(0, 2));
    const endTime = Number(props.hourPicked.slice(7).trim().substring(0, 2));

    const startOfEvent = new Date(props.day);
    const endOfEvent = new Date(props.day);
    endOfEvent.setHours(endTime, 0, 0);
    startOfEvent.setHours(startTime, 0, 0);

    props.hide(false);
    setSubmitting(false);
    const appointment = {
      data: values,
      start: startOfEvent,
      end: endOfEvent,
    };

    const res = await axios
      .post("http://localhost:1234/events", appointment)
      .then((res) => {
        props.setBooking(props.booking + 1);
        alert(res.data);
      })
      .catch((error) => alert(error));
    return res;
  };
  return (
    <>
      <div className="titleForm">
        <CancelIcon className="cancel" onClick={handleCancel} />
        <h1>BOOKING</h1>
        <h3 className="date">{props.day.toDateString()}</h3>
        <h3 className="date">{props.hourPicked}</h3>
        <h3 className="desc">{props.when}</h3>
        {/* <h3 className="time">{props.hour}</h3> */}
        <Formik
          initialValues={{ name: "", email: "", phone: "", info: "" }}
          validationSchema={ReservationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleSubmit, isSubmitting }) => (
            <Form className="reservationForm" onSubmit={handleSubmit}>
              <label>name</label>
              <Field name="name" className="name" placeholder="name" />
              {errors.name && touched.name ? (
                <div className="error">{errors.name}</div>
              ) : null}
              <label>email</label>
              <Field name="email" className="email" placeholder="email" />
              {errors.email && touched.email ? (
                <div className="error">{errors.email}</div>
              ) : null}
              <label>phone</label>
              <Field name="phone" className="phone" placeholder="phone" />
              {errors.phone && touched.phone ? (
                <div className="error">{errors.phone}</div>
              ) : null}
              <label>info</label>
              <Field name="info" className="info" placeholder="info" />
              {errors.info && touched.info ? (
                <div className="error">{errors.info}</div>
              ) : null}
              <button
                className="bookingButton"
                type="submit"
                disabled={isSubmitting}
              >
                BOOK
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default ReservationModal;
