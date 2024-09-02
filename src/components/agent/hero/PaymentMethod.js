import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
// import axios from "axios";
import { setLoading } from "../../../redux/actions/loaderAction";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import Button from "../base/Button";
import { SIGN_OUT_SUCCESS } from "../../../redux/actions/authActions";
import { message } from "antd";
import axiosInstance from "../../../Api";
import PayByLinkQr from "./PayByLinkQr";

export default function PaymentMethod({
  formValues,
  selectedPickup,
  selectedDropoff,
  location,
  destination,
  sharedRideValue,
  setSubTab,
  setShowSignUp,
  setShowAlreadyRegistered,
  setShowOTPScreen,
  setHideCreateAccountButton,
  setShowPhone,
  setHidePhoneCreateAccountButton,
  setShowPhoneOTPScreen,
  setShowPaymentMethod,
  showPaybylinkQr,
  setShowPaybylinkQr,
  rideName,
}) {
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const username = useSelector((state) => state.auth.username);
  const token = useSelector((state) => state.auth.token);
  const language = useSelector((state) => state.auth.language);
  const email = useSelector((state) => state.auth.email);
  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;
  const [t, i18n] = useTranslation("global");
  // const [userEmail, setUserEmail] = useState(null);
  const [getPaymentMethods, setGetPaymentMethods] = useState([]);
  const [showPriceBtn, setShowPriceBtn] = useState(false);
  const [selectedPaymentName, setSelectedPaymentName] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState("");
  const [proposal, setProposal] = useState("");
  const [qrCode, setQrCode] = useState("");
  const zoneData = useSelector((state) => state?.zone?.zone);
  const [payByLinkPaymentLink, setPayByLinkPaymentLink] = useState("");
  // let price;
  // const getPrice = localStorage.getItem('price');
  // if (correctPrice) {
  //   price = correctPrice
  // }
  // else {
  //   price = parseInt(getPrice, 10);
  // }
  // console.log('ssss', price)

  const arrivalDate = new Date(formValues.arrivalDate);
  const year = arrivalDate.getFullYear();
  const month = String(arrivalDate.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so we add 1
  const day = String(arrivalDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  useEffect(() => {
    dispatch(setLoading(true));
    const getPaymentMethods = async () => {
      const payData = {
        arrival_date: formattedDate,
        arrival_time: formValues.arrivalTime,
        langauge: language,
      };
      //  console.log('ff', payData)
      try {
        const response = await axiosInstance.post(
          `${API_BASE_URL}/api/method/airport_transport.api.bookings.get_payment_methods`,
          payData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response && response.status === 200) {
          setGetPaymentMethods(response.data.data);
        }
      } catch (error) {
        if (error.response.status === 401) {
          navigate("/sign-in");
        }
        console.log("Error", error);
      }
    };
    getPaymentMethods();

    dispatch(setLoading(false));
  }, []);

  // useEffect(() => {
  //   const getUser = async () => {
  //     dispatch(setLoading(true));
  //     try {
  //       const response = await axiosInstance.get(
  //         `${API_BASE_URL}/api/method/airport_transport.api.user.get_user_info`,
  //         {
  //           headers: {
  //             "Content-Type": "application/x-www-form-urlencoded",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       if (response && response.status === 200) {
  //         setUserEmail(response.data.data.email);
  //         dispatch(setLoading(false));
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //       dispatch(setLoading(false));
  //     }
  //   };
  //   getUser();
  // }, []);
  // useEffect(() => {
  //   const hasRefreshed = localStorage.getItem('hasRefreshed');
  //   if (hasRefreshed) {
  //     localStorage.removeItem('hasRefreshed');
  //     window.location.reload();
  //   }
  // }, []);

  const getRidePrice = async (pMethod) => {
    dispatch(setLoading(true));
    const priceData = {
      location: location,
      destination: destination,
      vehicle_type: formValues?.vehicleType ? formValues.vehicleType : "",
      rider: formValues?.seatNumber ? formValues.seatNumber : 1,
      arrival_date: formattedDate,
      arrival_time: formValues?.arrivalTime ? formValues.arrivalTime : "",
      shared_discount: sharedRideValue,
      service_type: rideName,
      payment_method: pMethod,
      // zone: formValues?.arrivalCity ? (formValues.arrivalCity === 'Dammam' || formValues.arrivalCity === 'الدمام' ? 'Dammam' : 'Riyadh') : '',
      zone: zoneData ? zoneData[0].name : "",
      language: language,
      hours:
        rideName === "Book Vehicle In Hours" ? formValues?.bookingByHours : "",
      user: formValues?.agentUser ? formValues.agentUser : "",
    };
    // console.log("fff", priceData);
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/api/method/airport_transport.api.integrations.maps.get_price`,
        priceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response && response.status === 200) {
        console.log(response.data);
        setCalculatedPrice(response.data.data.price);
        setProposal(response.data.data.proposal);
        setShowPriceBtn(false);
      }
    } catch (error) {
      if (error.response.data.msg === "No Trip Pricing Template found") {
        message.error(error.response.data.msg);
      }
      console.log("Error", error);
    }
    dispatch(setLoading(false));
  };

  const getRandomDigit = () => Math.floor(Math.random() * 10);
  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/";
    }
  }, [isLoggedIn]);
  const paymentMethods = [
    {
      id: 1,
      image: "/assets/paymentmethod/madapay.png",
      name: "mada",
      displayName: t("hero.mada_text"),
    },
    {
      id: 4,
      image: "/assets/paymentmethod/creditcardpay.png",
      name: "Credit Card",
      displayName: t("hero.credit_text"),
    },
    {
      id: 5,
      image: "/assets/paymentmethod/bankpay.png",
      name: "Pay By Link",
      displayName: t("hero.pay_link_text"),
    },
  ];

  const handlePaymentMethodClick = async (paymentMethodName) => {
    dispatch(setLoading(true));
    let randomDigits = "";
    for (let i = 0; i < 10; i++) {
      randomDigits += getRandomDigit();
    }

    const bookingData = {
      ticket: randomDigits,
      airport: formValues?.airportName ? formValues.airportName : "",
      rider: formValues?.seatNumber ? formValues.seatNumber : "",
      destination: selectedDropoff
        ? `${selectedDropoff.lat}, ${selectedDropoff.lng}`
        : destination,
      destination_name: destination,
      city: formValues?.arrivalCity ? formValues.arrivalCity : "",
      terminal: formValues?.terminalNumber,
      arrival_date: formattedDate,
      arrival_time: formValues?.arrivalTime ? formValues.arrivalTime : "",
      vehicle_type: formValues?.vehicleType ? formValues.vehicleType : "",
      ride_discount: sharedRideValue,
      price: calculatedPrice,
      language: language ? language : "eng",
      location: location,
      // zone: formValues?.airportName ? formValues.airportName : '',
      zone: zoneData ? zoneData[0].name : "",
      // hours: formValues?.bookingByHours ? formValues.bookingByHours: '',
      drop_off: selectedDropoff
        ? `${selectedDropoff.lat}, ${selectedDropoff.lng}`
        : "",
      pick_up: selectedPickup
        ? `${selectedPickup.lat}, ${selectedPickup.lng}`
        : "",
      pickup: selectedPickup
        ? `${selectedPickup.lat}, ${selectedPickup.lng}`
        : "",
      service_type: rideName,
      ride_proposal: proposal,
      booking_hours: formValues?.bookingByHours
        ? formValues.bookingByHours
        : "",
      user: formValues?.agentUser ? formValues.agentUser : "",
    };

    console.log("ttt", bookingData);

    if (paymentMethodName === "Mada" || paymentMethodName === "Credit Card") {
      let entryId;
      if (paymentMethodName === "Mada") {
        entryId = "8ac9a4cb8d3ac5a1018d5028e4d96fec";
      } else if (paymentMethodName === "Credit Card") {
        entryId = "8ac9a4cb8d3ac5a1018d50287bfa6fe7";
      }
      const url = "https://eu-prod.oppwa.com/v1/checkouts";
      const data = new URLSearchParams({
        entityId: entryId,
        amount: calculatedPrice,
        currency: "SAR",
        paymentType: "DB",
        // 'PaymentMethods': 'VISA, MASTER',
        // 'testMode': 'EXTERNAL',
      });
      const options = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Bearer OGFjOWE0Y2I4ZDNhYzVhMTAxOGQ1MDI3Zjg1ZjZmZTJ8TmJKeEZqODdiekZEQXNlZQ==",
        },
      };

      try {
        const response = await axiosInstance.post(url, data, options);
        // console.log(response.data);
        var bookingValues = JSON.stringify(bookingData);
        localStorage.setItem("bookingValues", bookingValues);
        localStorage.setItem("saveData", false);
        localStorage.setItem("paymentMethodName", paymentMethodName);
        localStorage.setItem("paymentMethodName", paymentMethodName);
        const checkoutId = response.data.id;
        navigate("/agent/payment-confirmation", {
          state: {
            checkoutId: checkoutId,
            paymentMethodName: paymentMethodName,
            formValues: formValues,
            price: calculatedPrice,
          },
        });
        dispatch(setLoading(false));
      } catch (error) {
        console.log("Error", error);
        dispatch(setLoading(false));
      }
    } else {
      const baseUrl = window.location.protocol + "//" + window.location.host;
      const successUrl = `${baseUrl}/agent/thank-you`;
      const payByLinkData = {
        "customer.email": formValues?.agentUser ? formValues.agentUser : "",
        amount: calculatedPrice,
        currency: "SAR",
        paymentType: "DB",
        shopperResultUrl: successUrl,
        createQRCode: true,
        doc: {
          ticket: randomDigits,
          airport: formValues?.airportName ? formValues.airportName : "",
          destination: selectedDropoff
            ? `${selectedDropoff.lat}, ${selectedDropoff.lng}`
            : destination,
          destination_name: destination,
          city: formValues?.arrivalCity,
          terminal: formValues?.terminalNumber ? formValues.terminalNumber : "",
          booking_hours: formValues?.bookingByHours
            ? formValues.bookingByHours
            : "",
          shared_discount: sharedRideValue,
          // "user": userEmail,
          price: calculatedPrice,
          service_type: rideName,
          // "ride_proposal": proposal,
          location: location,
          vehicle_type: formValues?.vehicleType ? formValues.vehicleType : "",
          rider: formValues?.seatNumber ? formValues.seatNumber : 1,
          arrival_date: formattedDate,
          arrival_time: formValues?.arrivalTime ? formValues.arrivalTime : "",
          shared_discount: sharedRideValue,
          service_type: rideName,
          payment_method: selectedPaymentName,
          zone: formValues?.arrivalCity
            ? formValues.arrivalCity === "Dammam" ||
              formValues.arrivalCity === "الدمام"
              ? "Dammam"
              : "Riyadh"
            : "",
          language: language,
          hours:
            rideName === "Book Vehicle In Hours"
              ? formValues?.bookingByHours
              : "",
          user: formValues?.agentUser ? formValues.agentUser : "",
        },
      };

      console.log("sss", payByLinkData);

      try {
        const response = await axiosInstance.post(
          `${API_BASE_URL}/api/method/airport_transport.api.integrations.paybylink.generate_link?language=${
            language ? language : "eng"
          }`,
          payByLinkData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response?.status === 200) {
          // console.log(response.data);
          const link = response.data.message.link;
          setPayByLinkPaymentLink(link);
          var bookingValues = JSON.stringify(bookingData);
          localStorage.setItem("bookingValues", bookingValues);
          localStorage.setItem("saveData", false);
          localStorage.setItem("paymentMethodName", paymentMethodName);
          setQrCode(response.data.message.qrCode);
        }
      } catch (error) {
        console.log("Error", error);
      }
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (qrCode && payByLinkPaymentLink) {
      setShowPaybylinkQr(true);
    }
  }, [qrCode, payByLinkPaymentLink]);

  return (
    <>
      {isLoggedIn && (
        <>
          {!showPaybylinkQr ? (
            <>
              <div className="flex flex-row justify-center items-center text-3xl pb-8 border-b border-border_color">
                <Icon
                  icon={language === "ar" ? "ph:arrow-right" : "ph:arrow-left"}
                  width="25px"
                  height="25px"
                  className="cursor-pointer"
                  onClick={() => {
                    if (
                      rideName === "Airport Trip" ||
                      rideName === "City Trip"
                    ) {
                      setSubTab(3);
                    } else {
                      setSubTab(2);
                    }
                    setShowSignUp(false);
                    setShowAlreadyRegistered(false);
                    setShowOTPScreen(false);
                    setHideCreateAccountButton(false);
                    setShowPhone(false);
                    setHidePhoneCreateAccountButton(false);
                    setShowPhoneOTPScreen(false);
                    setShowPaymentMethod(false);
                  }}
                />
                {calculatedPrice && proposal && (
                  <div>
                    <div className="mx-2">{t("hero.your_cost_text")}</div>
                    <div className="mx-2 font-bold text-background_steel_blue">
                      {calculatedPrice} {t("hero.sar_text")}
                    </div>
                  </div>
                )}
              </div>

              {getPaymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex flex-row justify-between items-center py-3 border-b border-border_color cursor-pointer"
                  // onClick={() => handlePaymentMethodClick(method.name)} // Add onClick event handler
                  onClick={() => {
                    dispatch(setLoading(true));
                    setSelectedPaymentName(method.payment_method);
                    setShowPriceBtn(true);
                    // dispatch(setLoading(false));
                    getRidePrice(method.payment_method);
                  }}
                >
                  <div className="flex flex-row justify-between items-center">
                    <div className="mx-2">
                      {/* <img src={method.image} alt={method.name} /> */}
                    </div>
                    {/* <div className="mx-2">{method.displayName !== 'mada' && method.displayName !== 'مدى' ? method.displayName : ''}</div>*/}
                    <div className="mx-2">{method.payment_method}</div>
                  </div>
                  <div>
                    <Icon
                      icon="ep:arrow-right"
                      width="1.2em"
                      height="1.2em"
                      className="text-text_black"
                    />
                  </div>
                </div>
              ))}

              {getPaymentMethods.length <= 0 && (
                <div>
                  <p className="text-center mt-5">
                    {t("payment_not_available_text")}
                  </p>
                </div>
              )}

              {/* {showPriceBtn && (
                <div>
                  <Button
                    className="mt-3 bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                    label={t("get_ride_price_text")}
                    onClick={() => getRidePrice()}
                  />
                </div>
              )} */}

              {!showPriceBtn && selectedPaymentName !== "" && (
                <div>
                  <Button
                    className="mt-3 bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                    label={t("processed_text")}
                    onClick={() =>
                      handlePaymentMethodClick(selectedPaymentName)
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <PayByLinkQr
              showPaybylinkQr={showPaybylinkQr}
              qrCode={qrCode}
              payByLinkPaymentLink={payByLinkPaymentLink}
            />
          )}
        </>
      )}
    </>
  );
}
