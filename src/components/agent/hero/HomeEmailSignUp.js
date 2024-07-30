import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputFieldFormik from "../base/InputFieldFormik";
import Button from "../base/Button";
import axios from "axios";
import { setLoading } from "../../../redux/actions/loaderAction";
import { message } from "antd";
import OtpInput from "react-otp-input";
import HomePhoneSignUp from "./HomePhoneSignUp";
import Recaptcha from "../base/Recaptcha";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PaymentMethod from "./PaymentMethod";
import { signInSuccess } from "../../../redux/actions/authActions";
import { useTranslation } from "react-i18next";

export default function HomeEmailSignUp({
  formValues,
  setSubTab,
  setShowSignUp,
  showAlreadyRegistered,
  setShowAlreadyRegistered,
  showOTPScreen,
  setShowOTPScreen,
  hideCreateAccountButton,
  setHideCreateAccountButton,
  showPhone,
  setShowPhone,
  hidePhoneCreateAccountButton,
  setHidePhoneCreateAccountButton,
  showPhoneOTPScreen,
  setShowPhoneOTPScreen,
  showPaymentMethod,
  setShowPaymentMethod,
  recaptchaRef,
  otp,
  setOtp,
  phoneOtp,
  setPhoneOtp,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(30); // Timer state
  const [showResend, setShowResend] = useState(false); // State to show resend button
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [t, i18n] = useTranslation("global");

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  useEffect(() => {
    if (isLoggedIn) {
      setShowPaymentMethod(true);
    }
  }, [isLoggedIn]);

  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required(t("errors.email_error")),
  });

  const initialValues = {
    email: "",
  };

  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

  const onSubmit = async (values, { setSubmitting }) => {
    dispatch(setLoading(true));
    if (values.password && showAlreadyRegistered) {
      const headers = {
        "Content-Type": "application/json",
        recaptchaToken: recaptchaToken,
      };
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/method/airport_transport.api.user.login`,
          { usr: values.email, pwd: values.password },
          { headers: headers }
        );
        const { token, username } = response.data.data;
        dispatch(signInSuccess(token, username));
        dispatch(setLoading(false));
        setShowPhone(true);
        setShowPaymentMethod(true);
      } catch (error) {
        recaptchaRef.current.reset();
        message.error(`${error?.response?.data?.msg}`);
        dispatch(setLoading(false));
      }
    } else {
      try {
        const headers = {
          "Content-Type": "application/json",
          recaptchaToken: recaptchaToken,
        };
        const response = await axios.get(
          `${API_BASE_URL}/api/method/airport_transport.api.user.check_email?email=${values.email}`,
          { headers: headers }
        );
        if (response?.status === 200) {
          try {
            const otpResponse = await axios.get(
              `${API_BASE_URL}/api/method/airport_transport.api.user.send_confirmation_email?email=${values.email}`
            );
            if (otpResponse?.status === 200) {
              message.success(`${otpResponse?.data?.msg}`);
              setShowOTPScreen(true);
              setEmail(values.email); // Store email for later use
              setHideCreateAccountButton(true); // Hide create account button
              setTimer(30)
            }
          } catch (error) {
            message.error(`${error?.response?.data?.msg}`);
            recaptchaRef.current.reset();
          }
        }
      } catch (error) {
        if (error?.response?.data?.msg === "User already exists") {
          setEmail(values.email);
          setShowAlreadyRegistered(true);
        } else {
          message.error(`${error?.response?.data?.msg}`);
          recaptchaRef.current.reset();
        }
      }
      dispatch(setLoading(false));
      setSubmitting(false);
    }
  };

  const handleVerify = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/method/airport_transport.api.user.confirm_email?email=${email}&otp=${otp}`
      );
      if (response?.status === 200) {
        message.success(`${response?.data?.msg}`);
        // const values = { email: email }
        // dispatch(signUpRequest(values, recaptchaToken, navigate));
        setShowPhone(true);
      }
    } catch (error) {
      message.error(`${error?.response?.data?.msg}`);
      setError(`${error?.response?.data?.msg}`);
    }
    dispatch(setLoading(false));
  }, [otp, email, API_BASE_URL]);

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
      {showPaymentMethod ? (
        <PaymentMethod formValues={formValues} />
      ) : showPhone ? (
        <HomePhoneSignUp
          formValues={formValues}
          email={email}
          showPaymentMethod={showPaymentMethod}
          setShowPaymentMethod={setShowPaymentMethod}
          hidePhoneCreateAccountButton={hidePhoneCreateAccountButton}
          setHidePhoneCreateAccountButton={setHidePhoneCreateAccountButton}
          showPhoneOTPScreen={showPhoneOTPScreen}
          setShowPhoneOTPScreen={setShowPhoneOTPScreen}
          phoneOtp={phoneOtp}
          setPhoneOtp={setPhoneOtp}
          setHideCreateAccountButton={setHideCreateAccountButton}
          setShowOTPScreen={setShowOTPScreen}
          setShowPhone={setShowPhone}
          setOtp={setOtp}
          recaptchaRef={recaptchaRef}
        />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values }) => (
            <Form>
              <div dir="ltr">
                <InputFieldFormik
                  label={t("hero.enter_email_text")}
                  name="email"
                  type="email"
                  required
                />
              </div>

              {!showAlreadyRegistered && !showOTPScreen && (
                <div>
                  <Recaptcha
                    recaptchaRef={recaptchaRef}
                    sitekey="6LfE3FEpAAAAAGkeBjkpPeNSqPNWtLPCma7EHVsr"
                    onChange={(value) => {
                      setRecaptchaToken(value);
                    }}
                  />
                </div>
              )}

              {showAlreadyRegistered && (
                <>
                  <div dir="ltr">
                    <InputFieldFormik
                      label={t("hero.password_text")}
                      name="password"
                      type="password"
                      required
                    />
                  </div>

                  <div>
                    <Recaptcha
                      recaptchaRef={recaptchaRef}
                      sitekey="6LfE3FEpAAAAAGkeBjkpPeNSqPNWtLPCma7EHVsr"
                      onChange={(value) => {
                        setRecaptchaToken(value);
                      }}
                    />
                  </div>

                  <div
                    className="mt-0 md:mt-2 lg:mt-0 w-full text-sm flex justify-end text-text_steel_blue cursor-pointer"
                    onClick={() =>
                      navigate("/agent/forget-password", {
                        state: { email: values.email },
                      })
                    }
                  >
                    {t("hero.forget_password_text")}
                  </div>

                  <div className="text-center mt-6 flex flex-col md:flex-row justify-between items-center">
                    <Button
                      className="bg-bg_btn_back w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                      onClick={() => {
                        setShowAlreadyRegistered(false);
                      }}
                      label={(t("previous_text"))}
                      type="button"
                    />
                    <Button
                      className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 me-2 mb-2"
                      label={(t("login_text"))}
                      type="submit"
                    />
                  </div>
                </>
              )}

              {!hideCreateAccountButton && !showAlreadyRegistered && (
                <div className="text-center mt-6 flex flex-col md:flex-row justify-between items-center">
                  <Button
                    className="bg-bg_btn_back w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                    onClick={() => {
                      setSubTab(1);
                      setShowSignUp(false);
                    }}
                    label={(t("previous_text"))}
                    type="button"
                  />
                  <Button
                    className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 me-2 mb-2"
                    label={t("continue_text")}
                    type="submit"
                  />
                </div>
              )}

              {showOTPScreen && (
                <>
                  <div className="mt-3 flex flex-col justify-center">
                    <label
                      htmlFor={otp}
                      className="block mb-2 mt-2 lg:mt-1  text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {t("hero.enter_otp_text")}
                    </label>
                    <div dir="ltr">
                      <OtpInput
                        inputStyle="otp-input"
                        value={otp}
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

                  <div className="my-3 flex flex-col md:flex-row justify-between items-center">
                    <Button
                      className="bg-bg_btn_back w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                      onClick={() => {
                        setShowOTPScreen(false);
                        setHideCreateAccountButton(false);
                        recaptchaRef.current.reset();
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
    </>
  );
}
