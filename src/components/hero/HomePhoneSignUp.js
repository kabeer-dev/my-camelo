import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../base/Button";
import axios from "axios";
import { setLoading } from "../../redux/actions/loaderAction";
import { message } from "antd";
import OtpInput from "react-otp-input";
import PaymentMethod from "./PaymentMethod";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Recaptcha from "../base/Recaptcha";
import { signInSuccess } from "../../redux/actions/authActions";

export default function HomePhoneSignUp(
  {
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
    recaptchaRef

  }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);

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
        const data = {
          email: email,
          phone: phoneNumber,
        }
        try {
          const response = await axios.post('https://test-erp.amk.sa/api/method/airport_transport.api.user.register', data, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              recaptchaToken: recaptchaToken,
            },
          });
          if (response && response.status === 200) {
            // console.log('jjj', response.data);
            const token = response.data.data.token;
            const username = response.data.data.name;
            dispatch(signInSuccess(token, username));
            setShowPaymentMethod(true)
          }
        }
        catch (error) {
          console.error('Error:', error);
          recaptchaRef.current.reset();
          // Handle error
        };
      } else {
        message.error(`${error?.response?.data?.msg}`);
        recaptchaRef.current.reset();
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
        const data = {
          email: email,
          phone: phoneNumber,
        }
        try {
          const response = await axios.post('https://test-erp.amk.sa/api/method/airport_transport.api.user.register', data, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              recaptchaToken: recaptchaToken,
            },
          });
          if (response && response.status === 200) {
            // console.log('jjj', response.data);
            const token = response.data.data.token;
            const username = response.data.data.name;
            dispatch(signInSuccess(token, username));
            setShowPaymentMethod(true)
          }
        }
        catch (error) {
          console.error('Error:', error);
          recaptchaRef.current.reset();
          // Handle error
        };
      }
    } catch (error) {
      message.error(`${error?.response?.data?.msg}`);
    }
    dispatch(setLoading(false));

  }, [phoneOtp, email]);

  const handleChange = (value) => {
    setPhoneOtp(value);
    setError(""); // Clear error message when user types
  };

  // useEffect(() => {
  //   if (phoneOtp.length === 6 && recaptchaToken) {
  //     handleVerify();
  //   }
  // }, [phoneOtp, handleVerify]);

  const onlyCountries = ['pk', 'in', 'sa'];

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
              <label htmlFor="phoneNumber">Enter Your Phone Number</label>
              <PhoneInput
                label="Enter Your Phone Number"
                country="sa"
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

              {!hidePhoneCreateAccountButton && (
                <div className="text-center mt-6 flex flex-col md:flex-row justify-between items-center">
                  <Button
                    className="bg-bg_btn_back w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                    onClick={() => {
                      setShowPhone(false)
                      setHideCreateAccountButton(false)
                      setOtp("")
                      setShowOTPScreen(false)
                    }}
                    label="Previous"
                    type="button"
                  />
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

                  <div>
                    <Recaptcha
                      recaptchaRef={recaptchaRef}
                      sitekey="6LfE3FEpAAAAAGkeBjkpPeNSqPNWtLPCma7EHVsr"
                      onChange={(value) => {
                        setRecaptchaToken(value);
                      }}
                    />
                  </div>

                  <div className="my-3 flex flex-col md:flex-row justify-between items-center">
                    <Button
                      className="bg-bg_btn_back w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                      onClick={() => {
                        setShowPhoneOTPScreen(false)
                        setHidePhoneCreateAccountButton(false)
                        setOtp("")
                        setPhoneOtp("")
                      }}
                      label="Previous"
                      type="button"
                    />
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
      )}

      {showPaymentMethod && (
        <>
          <PaymentMethod formValues={formValues} />
        </>
      )}
    </>
  );
}
