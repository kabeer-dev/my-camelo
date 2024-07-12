import React, { useState } from "react";
import Heading from "../base/Heading";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputFieldFormik from "../base/InputFieldFormik";
import Button from "../base/Button";
import { useNavigate } from "react-router-dom";
import AuthFooter from "../base/AuthFooter";
import axios from "axios";
import { setLoading } from "../../redux/actions/loaderAction";
import { message } from 'antd';
import Recaptcha from "../base/Recaptcha";
import { useDispatch } from "react-redux";
// import PhoneSignUp from "./PhoneSignUp";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPhone, setShowPhone] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = React.createRef();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const initialValues = {
    email: "",
  };

  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

  const onSubmit = async (values, { setSubmitting }) => {
    dispatch(setLoading(true))
    try {
      // Make API call to register user
      const headers = {
        'Content-Type': 'application/json',
        'recaptchaToken': recaptchaToken
      };
      const response = await axios.get(
        `${API_BASE_URL}/api/method/airport_transport.api.user.check_email?email=${values.email}`, { headers: headers }
      );
      // Assuming API response provides success status
      if (response?.status === 200) {
        try {
          const otpResponse = await axios.get(
            `${API_BASE_URL}/api/method/airport_transport.api.user.send_confirmation_email?email=${values.email}`,
          );
          // Redirect to OTP verification screen
          if (otpResponse?.status === 200) {
            message.success(`${otpResponse?.data?.msg}`);
            navigate("/otp", { state: { email: values.email } });
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
                    onSubmit={onSubmit}
                  >
                    <Form>
                      <div>
                        <InputFieldFormik
                          label="Enter Your Email Address"
                          name="email"
                          type="email"
                          required
                        />
                      </div>

                      <div>
                        <Recaptcha
                          recaptchaRef={recaptchaRef}
                          sitekey="6LfE3FEpAAAAAGkeBjkpPeNSqPNWtLPCma7EHVsr"
                          onChange={(value) => {
                            setRecaptchaToken(value)
                          }}
                        />
                      </div>

                      <div className="text-center mt-6">
                        <Button
                          className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 me-2 mb-2"
                          label="Create A New Account"
                          type="submit"
                          onClick={() => navigate("/create-new-account")}
                        />
                      </div>

                      <div className="mt-2 w-full text-sm flex items-center justify-center text-text_lightdark_grey cursor-pointer">
                        Already have an account{" "}
                        <span
                          className="text-sm font-semibold ml-2 text-text_steel_blue hover:underline"
                          onClick={() => navigate("/sign-in")}
                        >
                          Sign In
                        </span>
                      </div>
                      
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
