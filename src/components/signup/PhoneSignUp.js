import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form } from "formik";
import Heading from "../base/Heading";
import * as Yup from "yup";
import Button from "../base/Button";
// import axios from "axios";
import { setLoading } from "../../redux/actions/loaderAction";
import { message } from "antd";
import OtpInput from "react-otp-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axiosInstance from '../../Api';

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AuthFooter from "../base/AuthFooter";
import { useTranslation } from "react-i18next";

export default function PhoneSignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const email = location.state?.email;
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timer, setTimer] = useState(60); // Timer state
  const [showResend, setShowResend] = useState(false); // State to show resend button

  const [t, i18n] = useTranslation("global");
  const language = useSelector((state) => state.auth.language);

  const [hidePhoneCreateAccountButton, setHidePhoneCreateAccountButton] =
    useState(false);
  const [showPhoneOTPScreen, setShowPhoneOTPScreen] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState(false);

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
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/method/airport_transport.api.user.send_mobile_otp?phone=${values.phone}`
      );
      if (response?.status === 200) {
        setPhoneNumber(values.phone);
        setShowPhoneOTPScreen(true);
        setHidePhoneCreateAccountButton(true);
        setTimer(30)
      }
    } catch (error) {
      if (error?.response?.data?.msg === "SMS OTP not allowed for country") {
        navigate("/user-registration", {
          state: { email: email, phone: values.phone },
        });
      } else {
        message.error(`${error?.response?.data?.msg}`);
      }
    }
    dispatch(setLoading(false));
    setSubmitting(false);
  };

  const handleVerify = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/method/airport_transport.api.user.confirm_phone?phone=${phoneNumber}&otp=${phoneOtp}`
      );
      if (response?.status === 200) {
        navigate("/user-registration", {
          state: { email: email, phone: phoneNumber },
        });
      }
    } catch (error) {
      message.error(`${error?.response?.data?.msg}`);
    }
    dispatch(setLoading(false));
  }, [phoneOtp]);

  const handleChange = (value) => {
    setPhoneOtp(value);
    setError(""); // Clear error message when user types
  };

  useEffect(() => {
    if (phoneOtp.length === 6) {
      handleVerify();
    }
  }, [phoneOtp, handleVerify]);

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
      const otpResponse = await axiosInstance.get(
        `${API_BASE_URL}/api/method/airport_transport.api.user.send_confirmation_email?email=${email}`,
      );
      // Redirect to OTP verification screen
      if (otpResponse?.status === 200) {
        message.success(`${otpResponse?.data?.msg}`);
        setShowPhoneOTPScreen(true);
        setHidePhoneCreateAccountButton(true);
        setTimer(60); // Reset timer
        setShowResend(false);
      }
    } catch (error) {
      message.error(`${error?.response?.data?.msg}`);
    }
    // Hide resend button
    dispatch(setLoading(false))
    // Implement OTP resend API call here
  };

  return (
    <>
      <div className="h-screen w-screen position relative">
        <div className="position absolute left-0 top-0" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <img
            src="/assets/signin/left_vector.png"
            alt="left_vector"
            className="w-24 h-24 md:w-48 md:h-48"
          />
        </div>
        <div className="position absolute right-0 bottom-0" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <img
            src="/assets/signin/right_vector.png"
            alt="right_vector"
            className="w-24 md:w-48 h-18 md:h-36"
          />
        </div>

        <div className="z-20 w-screen h-screen flex flex-row justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <div className="mb-4 cursor-pointer" onClick={() => navigate("/")} dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <img
                src="/assets/signin/logo.png"
                alt="Moshrouk Trips"
                className="w-16 h-13"
              />
            </div>
            <div className="mt-4 block w-72 md:w-auto p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className="w-auto md:w-96 text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}> 
                <Heading
                  title={t("create_a_text")}
                  className={"text-2xl text-[#0E0E11]"}
                />
              </div>

              <div>
                <div className="p-2 md:p-4" dir={language === 'ar' ? 'rtl' : 'ltr'} >
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onPhoneSubmit}
                  >
                    {({ values, setFieldValue }) => (
                      <Form>
                        <label htmlFor="phoneNumber">
                          {t("hero.enter_phone_text")}
                        </label>
                        <div dir="ltr">
                        <PhoneInput
                          label={t("hero.enter_phone_text")}
                          country="sa" // Default country
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

                        {!hidePhoneCreateAccountButton && (
                          <div className="text-center mt-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                            <Button
                              className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 me-2 mb-2"
                              label={t("next_text")}
                              type="submit"
                            />
                          </div>
                        )}

                        {showPhoneOTPScreen && (
                          <>
                            <div className="mt-3 flex flex-col justify-center" >
                              <label
                                htmlFor={phoneOtp}
                                className="block mb-2 mt-2 lg:mt-1  text-sm font-medium text-gray-900 dark:text-white"
                              >
                                {t("hero.enter_otp_text")}
                              </label>
                              <div dir="ltr">
                              <OtpInput
                                inputStyle="otp-input"
                                value={phoneOtp}
                                onChange={handleChange}
                                numInputs={6}
                                renderInput={(props, i) => (
                                  <input {...props} key={i} />
                                )}
                              />
                              </div>

                              {error && (
                                <div className="text-base text-text_warning font-semibold my-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                  {error}
                                </div>
                              )}
                            </div>

                            <div className="mt-2 flex flex-row justify-start items-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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

                            <div className="my-3" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
                </div>
              </div>
            </div>
            <div className="my-2">
              <AuthFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
