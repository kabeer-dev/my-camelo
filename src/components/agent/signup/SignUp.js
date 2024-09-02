import React, { useEffect, useState } from "react";
import Heading from "../base/Heading";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputFieldFormik from "../base/InputFieldFormik";
import Button from "../base/Button";
import { useNavigate } from "react-router-dom";
import AuthFooter from "../base/AuthFooter";
// import axios from "axios";
import { setLoading } from "../../../redux/actions/loaderAction";
import { message } from 'antd';
import Recaptcha from "../base/Recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
// import PhoneSignUp from "./PhoneSignUp";
import axiosInstance from '../../../Api';

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPhone, setShowPhone] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = React.createRef();
  const language = useSelector((state) => state.auth.language);
  const email = useSelector((state) => state.auth.email);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [t, i18n] = useTranslation("global");
  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

  // useEffect(() => {
  //   dispatch(setLoading(true))
  //   if (email) {
  //     const checkUser = async () => {
  //       try {
  //         const response = await axiosInstance.post(`${API_BASE_URL}/api/method/airport_transport.api.user.detect_email?email=${email}`);
  //         if (response && response.status === 200) {
  //           if(response.data.msg !== 'Agent User'){
  //             navigate('/')
  //           }
  //         }
  //       } catch (error) {
  //         console.log('Error', error)
  //       }
  //     }
  //     checkUser()
  //   }
  //   dispatch(setLoading(false))
  // }, [email])

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required(t("errors.email_error")),
  });

  const initialValues = {
    email: "",
  };

  const onSubmit = async (values, { setSubmitting }) => {
    dispatch(setLoading(true))
    try {
      // Make API call to register user
      const headers = {
        'Content-Type': 'application/json',
        'recaptchaToken': recaptchaToken
      };
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/method/airport_transport.api.user.check_email?email=${values.email}`, { headers: headers }
      );
      // Assuming API response provides success status
      if (response?.status === 200) {
        try {
          const otpResponse = await axiosInstance.get(
            `${API_BASE_URL}/api/method/airport_transport.api.user.send_confirmation_email?email=${values.email}`,
          );
          // Redirect to OTP verification screen
          if (otpResponse?.status === 200) {
            message.success(`${otpResponse?.data?.msg}`);
            navigate("/mashrouk-new-ui/agent/otp", { state: { email: values.email } });
            dispatch(setLoading(false))
          }
        } catch (error) {
          message.error(`${error?.response?.data?.msg}`);
          recaptchaRef.current.reset();
          dispatch(setLoading(false))
        }
      }
    } catch (error) {
      message.error(`${error?.response?.data?.msg}`);
      recaptchaRef.current.reset();
      dispatch(setLoading(false))
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="h-screen w-screen position relative">
        <div className="position absolute left-0 top-0" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <img
            src="./assets/signin/left_vector.png"
            alt="left_vector"
            className="w-24 h-24 md:w-48 md:h-48"
          />
        </div>
        <div className="position absolute right-0 bottom-0" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <img
            src="./assets/signin/right_vector.png"
            alt="right_vector"
            className="w-24 md:w-48 h-18 md:h-36"
          />
        </div>

        <div className="z-20 w-screen h-screen flex flex-row justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <div className="mb-4 cursor-pointer" onClick={() => navigate("/mashrouk-new-ui/agent")} dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <img
                src="./assets/signin/logo.png"
                alt="Moshrouk Trips"
                className="w-16 h-13"
              />
            </div>
            <div className="mt-4 block w-72 md:w-auto p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className="w-auto md:w-96 text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <Heading
                  title={t("header.create_text")}
                  className={"text-2xl text-[#0E0E11]"}
                />
              </div>

              <div>
                <div className="p-2 md:p-4" dir={language === 'ar' ? "rtl" : 'ltr'}>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    <Form>
                      <div dir="ltr">
                        <InputFieldFormik
                          label={t("hero.enter_email_text")}
                          name="email"
                          type="email"
                          required
                        />
                      </div>

                      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <Recaptcha
                          recaptchaRef={recaptchaRef}
                          sitekey="6LfE3FEpAAAAAGkeBjkpPeNSqPNWtLPCma7EHVsr"
                          onChange={(value) => {
                            setRecaptchaToken(value)
                          }}
                        />
                      </div>

                      <div className="text-center mt-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <Button
                          className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 me-2 mb-2"
                          label={t("create_a_text")}
                          type="submit"
                          onClick={() => navigate("/mashrouk-new-ui/agent/create-new-account")}
                        />
                      </div>

                      {/* <div className="mt-2 w-full text-sm flex items-center justify-center text-text_lightdark_grey cursor-pointer">
                        {t("already_account_text")}{" "}
                        <span
                          className="text-sm font-semibold ml-2 text-text_steel_blue hover:underline"
                          onClick={() => navigate("/mashrouk-new-ui/agent/sign-in")}
                        >
                          {t("header.sign_in_text")}
                        </span>
                      </div> */}
                      
                    </Form>
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
