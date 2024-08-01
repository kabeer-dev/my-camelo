import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../base/Button";
import axios from "axios";
import { setLoading } from "../../redux/actions/loaderAction";
import { message } from "antd";
import OtpInput from "react-otp-input";
import PaymentMethod from "./PaymentMethod";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Recaptcha from "../base/Recaptcha";
import { signInSuccess } from "../../redux/actions/authActions";
import { useTranslation } from "react-i18next";

export default function HomePhoneSignUp({
  formValues,
  email,
  showPaymentMethod,
  setShowPaymentMethod,
  hidePhoneCreateAccountButton,
  setHidePhoneCreateAccountButton,
  showPhoneOTPScreen,
  setShowPhoneOTPScreen,
  phoneOtp,
  setPhoneOtp,
  setHideCreateAccountButton,
  setShowOTPScreen,
  setShowPhone,
  setOtp,
  recaptchaRef,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(30); // Timer state
  const [showResend, setShowResend] = useState(false); // State to show resend button
  const [phoneNumber, setPhoneNumber] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [t, i18n] = useTranslation("global");

  const validationSchema = Yup.object().shape({
    phone: Yup.string()
      .required(t("errors.phone_error"))
      .min(11, "Phone number must be at least 11 characters"),
  });

  const initialValues = {
    phone: "",
  };

  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

  const onPhoneSubmit = async (values, { setSubmitting }) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/method/airport_transport.api.user.send_mobile_otp?phone=${values.phone}`
      );
      if (response?.status === 200) {
        setPhoneNumber(values.phone);
        setShowPhoneOTPScreen(true);
        setHidePhoneCreateAccountButton(true);
        setTimer(30)
        // recaptchaRef.current.reset();
        dispatch(setLoading(false));
      }
    } catch (error) {
      if (error?.response?.data?.msg === "SMS OTP not allowed for country") {
        setPhoneVerified(true);
        if (phoneVerified) {
          try {
            const data = {
              email: email,
              phone: phoneNumber,
            };
            const response = await axios.post(
              `${API_BASE_URL}/api/method/airport_transport.api.user.register`,
              data,
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  recaptchaToken: recaptchaToken,
                },
              }
            );
            if (response && response.status === 200) {
              // console.log('jjj', response.data);
              const token = response.data.data.token;
              const username = response.data.data.name;
              dispatch(signInSuccess(token, username));
              setShowPaymentMethod(true);
            }
          } catch (error) {
            if (error?.response?.data?.msg === "Mobile Number must be unique") {
              message.error("Mobile number already register other Account");
            }
            console.error("Error:", error);
            recaptchaRef.current.reset();
            // Handle error
          }
        } else {
          setPhoneVerified(true);
          dispatch(setLoading(false));
        }
      } else {
        message.error(`${error?.response?.data?.msg}`);
        recaptchaRef.current.reset();
      }
    }
    setSubmitting(false);
    dispatch(setLoading(false));
  };

  const handleVerify = async () => {
    dispatch(setLoading(true));
    if (!phoneVerified) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/method/airport_transport.api.user.confirm_phone?phone=${phoneNumber}&otp=${phoneOtp}`
        );
        if (response?.status === 200) {
          setPhoneVerified(true);
          dispatch(setLoading(false));
        }
      } catch (error) {
        message.error(`${error?.response?.data?.msg}`);
      }
      dispatch(setLoading(false));
    } else {
      if (!recaptchaToken) {
        message.error("Recaptcha is Required");
      } else {
        const data = {
          email: email,
          phone: phoneNumber,
        };
        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/method/airport_transport.api.user.register`,
            data,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                recaptchaToken: recaptchaToken,
              },
            }
          );
          if (response && response.status === 200) {
            // console.log('jjj', response.data);
            const token = response.data.data.token;
            const username = response.data.data.name;
            dispatch(signInSuccess(token, username));
            setShowPaymentMethod(true);
          }
        } catch (error) {
          if (error?.response?.data?.msg === "Mobile Number must be unique") {
            message.error("Mobile number already register other Account");
          }
          console.error("Error:", error);
          recaptchaRef.current.reset();
          // Handle error
        }
      }
    }
    dispatch(setLoading(false));
  };

  const handleChange = async (value) => {
    setPhoneOtp(value);
    setError("");
  };

  // useEffect(() => {
  //   if (phoneOtp.length === 6) {
  //     handleVerify();
  //   }
  // }, [phoneOtp, handleVerify]);

  const onlyCountries = ["pk", "in", "sa"];

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setShowResend(true); // Show resend button when timer completes
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    // Handle resend OTP logic
    dispatch(setLoading(true))
    try {
      const otpResponse = await axios.get(
        `${API_BASE_URL}/api/method/airport_transport.api.user.send_confirmation_email?email=${email}`,
      );
      // Redirect to OTP verification screen
      if (otpResponse?.status === 200) {
        setTimer(30); // Reset timer
        setShowResend(false); // Hide resend button
        message.success(`${otpResponse?.data?.msg}`);
      }
    } catch (error) {
      message.error(`${error?.response?.data?.msg}`);
    }
    dispatch(setLoading(false))
    // Implement OTP resend API call here
  };

  return (
    <>
      {!showPaymentMethod && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onPhoneSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              
                <label htmlFor="phoneNumber">{t("hero.enter_phone_text")}</label>
                <div dir="ltr">
                <PhoneInput
                  label={t("hero.enter_phone_text")}
                  country="sa"
                  onlyCountries={onlyCountries}
                  value={phoneNumber}
                  onChange={(phone) => {
                    setFieldValue("phone", phone);
                  }}
                  inputProps={{
                    name: "phone",
                    required: true,
                    autoFocus: true,
                    style: { width: "100%" },
                  }}
                />
              </div>
              {/* {!hidePhoneCreateAccountButton && (
                <div>
                  <Recaptcha
                    recaptchaRef={recaptchaRef}
                    sitekey="6Lc5Ox0qAAAAADw4xHdp5KwG05uh3vtqyc27c0ox"
                    onChange={(value) => {
                      setRecaptchaToken(value);
                    }}
                  />
                </div>
              )} */}
              {phoneVerified && (
                <div>
                  <Recaptcha
                    recaptchaRef={recaptchaRef}
                    sitekey="6Lc5Ox0qAAAAADw4xHdp5KwG05uh3vtqyc27c0ox"
                    onChange={(value) => {
                      setRecaptchaToken(value);
                    }}
                  />
                </div>
              )}

              {!hidePhoneCreateAccountButton && (
                <div className="text-center mt-6 flex flex-col md:flex-row justify-between items-center">
                  <Button
                    className="bg-bg_btn_back w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                    onClick={() => {
                      setShowPhone(false);
                      setHideCreateAccountButton(false);
                      setOtp("");
                      setShowOTPScreen(false);
                    }}
                    label={t("previous_text")}
                    type="button"
                  />
                  <Button
                    className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 me-2 mb-2"
                    label={t("next_text")}
                    type="submit"
                  />
                </div>
              )}

              {showPhoneOTPScreen && (
                <>
                  <div className="mt-3 flex flex-col justify-center">
                    <div dir="ltrs">
                      <label
                        htmlFor={phoneOtp}
                        className="block mb-2 mt-2 lg:mt-1  text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {t("hero.enter_otp_text")}
                      </label>

                      <OtpInput
                        inputStyle="otp-input"
                        value={phoneOtp}
                        onChange={handleChange}
                        numInputs={6}
                        renderInput={(props, i) => <input {...props} key={i} />}
                      />
                    </div>

                    {error && (
                      <div className="text-base text-text_warning font-semibold my-2">
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex flex-row justify-start items-center">
                    <div className="mr-1">
                      {showResend ? (
                        <Button
                          className="bg-background_steel_blue w-20 text-center text-text_white hover:bg-gray-100 font-medium rounded text-sm px-1 py-2 me-2 mb-2"
                          label={t("resend_text")}
                          type="button"
                          onClick={handleResend}
                        />
                      ) : (
                        `${t("hero.resend_otp_text")} - ${Math.floor(timer / 60)
                          .toString()
                          .padStart(2, "0")}:${(timer % 60)
                            .toString()
                            .padStart(2, "0")}`
                      )}
                    </div>
                  </div>

                  {phoneVerified && (
                    <div>
                      <Recaptcha
                        recaptchaRef={recaptchaRef}
                        sitekey="6Lc5Ox0qAAAAADw4xHdp5KwG05uh3vtqyc27c0ox"
                        onChange={(value) => {
                          setRecaptchaToken(value);
                        }}
                      />
                    </div>
                  )}

                  <div className="my-3 flex flex-col md:flex-row justify-between items-center">
                    <Button
                      className="bg-bg_btn_back w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                      onClick={() => {
                        setShowPhoneOTPScreen(false);
                        setHidePhoneCreateAccountButton(false);
                        setOtp("");
                        setPhoneOtp("");
                      }}
                      label={t("previous_text")}
                      type="button"
                    />
                    <Button
                      className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 me-2 mb-2"
                      label={t("verify_text")}
                      type="button"
                      onClick={handleVerify}
                    />
                  </div>
                </>
              )}
            </Form>
          )}
        </Formik>
      )}

      {showPaymentMethod && (
        <>
          <PaymentMethod formValues={formValues} />
        </>
      )}
    </>
  );
}
