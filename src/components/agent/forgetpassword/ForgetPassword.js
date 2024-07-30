import React from "react";
import Heading from "../base/Heading";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputFieldFormik from "../base/InputFieldFormik";
import Button from "../base/Button";
import { useNavigate, useLocation } from "react-router-dom";
import AuthFooter from "../base/AuthFooter";
import { setLoading } from "../../../redux/actions/loaderAction";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { message } from "antd";
import { useTranslation } from "react-i18next";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { email } = location.state || {};
  const language = useSelector((state) => state.auth.language);

  const [t, i18n] = useTranslation("global");

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required(t("errors.email_error")),
  });

  const initialValues = {
    email: email || "",
  };

  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

  const onSubmit = async(values, { setSubmitting }) => {
    dispatch(setLoading(true))
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/method/airport_transport.api.user.reset_password?email=${values.email}`,
      );
      // Redirect to OTP verification screen
      if (response?.status === 200) {
        navigate("/agent/forget-password-otp", {state: {email: values.email}});
      }
    } catch (error) {
      message.error(`${error?.response?.data?.msg}`);
      // console.log('Error', error)
    }
    setSubmitting(false)
    dispatch(setLoading(false))
    
  };

  return (
    <>
      <div className="h-screen w-screen position relative" dir={language === 'ar' ? 'rtl' : "ltr"}>
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
            <div className="mb-4 cursor-pointer" onClick={() => navigate("/agent")}>
              <img
                src="/assets/signin/logo.png"
                alt="Moshrouk Trips"
                className="w-16 h-13"
              />
            </div>
            <div className="mt-4 block w-72 md:w-auto p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className="w-auto md:w-96 text-center">
                <Heading
                  title={t("forget_text")}
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
                          label={t("hero.enter_email_text")}
                          name="email"
                          type="email"
                          required
                        />
                      </div>

                      <div className="text-center mt-6">
                        <Button
                          className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 me-2 mb-2"
                          label={t("confirm_text")}
                          type="submit"
                        />
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
