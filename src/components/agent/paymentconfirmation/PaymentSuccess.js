import React, { useState, useEffect } from "react";
import { Events, scrollSpy } from "react-scroll";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import axios from "axios";
import { setLoading } from "../../../redux/actions/loaderAction";
import { useTranslation } from "react-i18next";
import Header from "../base/Header";
import Footer from "../base/Footer";

export default function PaymentSuccess() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/";
    }
  }, [isLoggedIn]);

  // const formValues = location.state?.formValues;
  const language = useSelector((state) => state.auth.language);
  const [t, i18n] = useTranslation("global");

  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

  const paymentMethodName = localStorage.getItem("paymentMethodName");
  const saveData = localStorage.getItem("saveData");
  var bookingValues = localStorage.getItem("bookingValues");
  var josnbookingValues = JSON.parse(bookingValues);
  // console.log('ggg', josnbookingValues)
  const newBookingData = {
    airport: josnbookingValues.airport,
    rider: josnbookingValues.rider,
    location: josnbookingValues.location,
    city: josnbookingValues.city,
    terminal: josnbookingValues?.terminal ? josnbookingValues.terminal : "",
    arrival_date: josnbookingValues.arrival_date,
    arrival_time: josnbookingValues.arrival_time,
    vehicle_type: josnbookingValues.vehicle_type,
    shared_discount: josnbookingValues.ride_discount,
    price: josnbookingValues.price,
    ride_proposal: josnbookingValues.ride_proposal,
    zone: josnbookingValues?.city
      ? josnbookingValues.city === "الدمام" ||
        josnbookingValues.city === "Dammam"
        ? "Dammam"
        : "Riyadh"
      : "",
    pick_up: josnbookingValues.pick_up,
    language: language,
    destination: josnbookingValues.destination_name,
    service_type: josnbookingValues.service_type,
    payment_method: paymentMethodName,
    booking_hours:
      josnbookingValues.service_type === "Book Vehicle In Hours"
        ? josnbookingValues.booking_hours
        : "",
    user: josnbookingValues?.user ? josnbookingValues.user : ''
  };

  const currentUrl = window.location.href;
  const urlObject = new URL(currentUrl);
  const searchParams = urlObject.searchParams;
  const id = searchParams.get("id");
  // const extractedId = id.split(".")[0];
  const resourcePath = searchParams.get("resourcePath");
  newBookingData.hyperpay_id = id;

  useEffect(() => {
    Events.scrollEvent.register("begin", function (to, element) { });
    Events.scrollEvent.register("end", function (to, element) { });

    scrollSpy.update();
    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);

  useEffect(() => {
    console.log("booking data is here:", newBookingData);
    dispatch(setLoading(true));
    if (saveData === "false" && newBookingData) {
      if (paymentMethodName === "Mada" || paymentMethodName === "Credit Card") {
        // console.log('t', newBookingData)

        const createMadaBooking = async () => {
          // if (saveData === "false") {
          try {
            const response = await axios.post(
              `${API_BASE_URL}/api/method/airport_transport.api.bookings.user_booking`,
              newBookingData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response && response.status === 200) {
              // console.log('jjj', response.data);
              message.success(response.data.msg);
              localStorage.setItem("saveData", true);
            }
          } catch (error) {
            console.error("Error:", error);
          }
          // }
        };
        createMadaBooking();
      }
      // else {
      //   const currentUrl = window.location.href;
      //   const urlObject = new URL(currentUrl);
      //   const searchParams = urlObject.searchParams;
      //   const id = searchParams.get("id");
      //   const checkoutId = searchParams.get("checkoutId");
      //   // const extractedId = checkoutId.split(".")[0];
      //   // console.log(id, extractedId);
      //   newBookingData.hyperpay_id = id;

      //   const createPayByLinkBooking = async () => {
      //     // if (saveData === "false") {
      //     try {
      //       const response = await axios.post(
      //         `${API_BASE_URL}/api/method/airport_transport.api.bookings.user_booking?language=${language ? language : 'eng'}`,
      //         newBookingData,
      //         {
      //           headers: {
      //             Authorization: `Bearer ${token}`,
      //           },
      //         }
      //       );
      //       if (response && response.status === 200) {
      //         console.log('jjj', response.data);
      //         message.success(response.data.msg);
      //         localStorage.setItem("saveData", true);
      //       }
      //     } catch (error) {
      //       console.error("Error:", error);
      //     }
      //     // }
      //   };
      //   createPayByLinkBooking();
      // }
    }
    dispatch(setLoading(false));
  }, []);

  return (
    <>
      {isLoggedIn && (
        <div>
          <Header />

          <main className="mt-20" dir={language === "ar" ? "rtl" : "ltr"}>
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="mx-auto">
                  <img
                    src="/assets/paymentconditions/paymentsuccess.png"
                    alt="payment success"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="mx-auto">
                  <p className="font-extrabold mt-6 font-roboto">
                    {t("payment_successful_text")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="mx-auto">
                  <p className="mt-2 font-roboto text-text_lightdark_grey">
                    {t("thank_you_big_text")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mt-5">
                <div className="col-start-2">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="bg-white w-full text-black border border-black hover:bg-gray-100 font-medium text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    {t("back_home_text")}
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    {t("done_text")}
                  </button>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      )}
    </>
  );
}
