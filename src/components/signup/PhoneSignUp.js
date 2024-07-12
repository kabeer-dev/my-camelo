import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form } from "formik";
import Heading from "../base/Heading";
import * as Yup from "yup";
import Button from "../base/Button";
import axios from "axios";
import { setLoading } from "../../redux/actions/loaderAction";
import { message } from "antd";
import OtpInput from "react-otp-input";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AuthFooter from "../base/AuthFooter";

export default function PhoneSignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const email = location.state?.email;
  const [error, setError] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("");

  const [hidePhoneCreateAccountButton, setHidePhoneCreateAccountButton] = useState(false)
  const [showPhoneOTPScreen, setShowPhoneOTPScreen] = useState(false)
  const [phoneOtp, setPhoneOtp] = useState(false)

  const validationSchema = Yup.object().shape({
    phone: Yup.string().required("Phone is required").min(11, "Phone number must be at least 11 characters"),
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
        setPhoneNumber(values.phone)
        setShowPhoneOTPScreen(true);
        setHidePhoneCreateAccountButton(true);
      }
    } catch (error) {
      if (error?.response?.data?.msg === 'SMS OTP not allowed for country') {
        navigate("/user-registration", { state: { email: email, phone: values.phone } });
      } else {
        message.error(`${error?.response?.data?.msg}`);
      }
    }
    dispatch(setLoading(false));
    setSubmitting(false)
  };

  const handleVerify = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/method/airport_transport.api.user.confirm_phone?phone=${phoneNumber}&otp=${phoneOtp}`
      );
      if (response?.status === 200) {
        navigate("/user-registration", { state: { email: email, phone: phoneNumber } })
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

  const onlyCountries = ['pk', 'in', 'sa'];

  return (
    <>
      <div className="h-screen w-screen position relative">
        <div className="position absolute left-0 top-0">
          <img
            src="/assets/signin/left_vector.png"
            alt="left_vector"
            className="w-24 h-24 md:w-48 md:h-48"
          />
        </div>
        <div className="position absolute right-0 bottom-0">
          <img
            src="/assets/signin/right_vector.png"
            alt="right_vector"
            className="w-24 md:w-48 h-18 md:h-36"
          />
        </div>

        <div className="z-20 w-screen h-screen flex flex-row justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <div className="mb-4 cursor-pointer" onClick={() => navigate("/")}>
              <img
                src="/assets/signin/logo.png"
                alt="Moshrouk Trips"
                className="w-16 h-13"
              />
            </div>
            <div className="mt-4 block w-72 md:w-auto p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className="w-auto md:w-96 text-center">
                <Heading
                  title={"Create a new account"}
                  className={"text-2xl text-[#0E0E11]"}
                />
              </div>

              <div>
                <div className="p-2 md:p-4">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onPhoneSubmit}
                  >
                    {({ values, setFieldValue }) => (
                      <Form>
                        <label htmlFor="phoneNumber">Enter Your Phone Number</label>
                        <PhoneInput
                          label="Enter Your Phone Number"
                          country="sa" // Default country
                          onlyCountries={onlyCountries}
                          value={phoneNumber}
                          onChange={(phone) => { setFieldValue('phone', phone) }}
                          inputProps={{
                            name: 'phone',
                            required: true,
                            autoFocus: true,
                            style: { width: '100%' },
                          }}

                        />

                        {!hidePhoneCreateAccountButton && (
                          <div className="text-center mt-6">
                            <Button
                              className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 me-2 mb-2"
                              label="Next"
                              type="submit"
                            />
                          </div>
                        )}

                        {showPhoneOTPScreen && (
                          <>
                            <div className="mt-3 flex flex-col justify-center">
                              <label
                                htmlFor={phoneOtp}
                                className="block mb-2 mt-2 lg:mt-1  text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Enter OTP
                              </label>
                              <OtpInput
                                inputStyle="otp-input"
                                value={phoneOtp}
                                onChange={handleChange}
                                numInputs={6}
                                renderInput={(props, i) => <input {...props} key={i} />}
                              />

                              {error && (
                                <div className="text-base text-text_warning font-semibold my-2">
                                  {error}
                                </div>
                              )}
                            </div>

                            <div className="my-3">
                              <Button
                                className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 me-2 mb-2"
                                label="Verify"
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
