import React, { useState, useEffect, useCallback } from "react";
import Heading from "../base/Heading";
import Button from "../base/Button";
import { useNavigate, useLocation } from "react-router-dom";
import OtpInput from "react-otp-input";
import AuthFooter from "../base/AuthFooter";
import "./OTPScreen.css";
import axios from "axios";
import { setLoading } from "../../../redux/actions/loaderAction";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function OTPScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30); // Timer state
  const [showResend, setShowResend] = useState(false); // State to show resend button
  const email = location.state?.email;
  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;
  const language = useSelector((state) => state.auth.language);

  const [t, i18n] = useTranslation("global");

  const handleVerify = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/method/airport_transport.api.user.confirm_email?email=${email}&otp=${otp}`
      );
      if (response?.status === 200) {
        message.success(`${response?.data?.msg}`);
        navigate("/agent/phone-signup", { state: { email: email } });
        // navigate("/user-registration", { state: { email: email } });
        dispatch(setLoading(false));
      }
    } catch (error) {
      message.error(`${error?.response?.data?.msg}`);
      setError(`${error?.response?.data?.msg}`);
      dispatch(setLoading(false));
    }
  }, [otp, email, navigate, API_BASE_URL]);

  const handleChange = (value) => {
    setOtp(value);
    setError(""); // Clear error message when user types
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp, handleVerify]);

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
            <div className="mb-4 cursor-pointer" onClick={() => navigate("/agent")} dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <img
                src="/assets/signin/logo.png"
                alt="Moshrouk Trips"
                className="w-16 h-13"
              />
            </div>
            <div className="mt-4 block w-72 md:w-auto p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className="w-auto md:w-[400px] text-left rtl:text-right p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <Heading
                  title={t("otp_verification_text")}
                  className={"text-2xl text-[#0E0E11]"}
                />
                <div className="w-auto md:w-3/4">
                  <p className="text-sm text-[#5D5D5D]">
                    {t("enter_6_digit_text")}
                    <span className="ml-1 text-text_steel_blue">
                      {email}
                    </span>{" "}
                    <span
                      className=" text-text_steel_blue underline font-bold cursor-pointer ml-1"
                      onClick={() => navigate("/agent/create-new-account")}
                    >
                      ({t("change_text")})
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <div className="p-2 md:p-4">
                  <OtpInput
                    inputStyle="otp-input"
                    value={otp}
                    onChange={handleChange}
                    numInputs={6}
                    renderInput={(props, i) => <input {...props} key={i} />}
                  />

                  {error && (
                    <div className="text-base text-text_warning font-semibold my-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                      {error}
                    </div>
                  )}

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
                      type="submit"
                      onClick={handleVerify}
                    />
                  </div>

                  <div
                    className="text-sm text-background_steel_blue cursor-pointer"
                    onClick={() => {
                      console.log("working");
                    }}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {t("problems_text")}
                  </div>
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
