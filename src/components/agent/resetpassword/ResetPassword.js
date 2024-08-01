import React, { useState } from "react";
import Heading from "../base/Heading";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputFieldFormik from "../base/InputFieldFormik";
import Button from "../base/Button";
import { useLocation, useNavigate } from "react-router-dom";
import AuthFooter from "../base/AuthFooter";
import { Icon } from "@iconify/react/dist/iconify.js";
import { setLoading } from "../../../redux/actions/loaderAction";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import Recaptcha from "../base/Recaptcha";
import { signInRequest } from "../../../redux/actions/authActions";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const otp = location.state?.otp;
  const email = location.state?.email;
  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = React.createRef();
  const [t, i18n] = useTranslation("global");
  const language = useSelector((state) => state.auth.language);

  const [validationStatus, setValidationStatus] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    symbol: false,
  });

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required(t("errors.password_error"))
      .min(8, t("errors.password_min_error"))
      .max(20, t("errors.password_max_error"))
      .matches(/[A-Z]/, t("errors.password_uppercase_error"))
      .matches(/[a-z]/, t("errors.password_lowercase_error"))
      .matches(/[@$!%*?&#]/, t("errors.password_symbol_error")),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("errors.confirm_password_error2"))
      .required(t("errors.confirm_password_error")),
  });

  const initialValues = {
    newPassword: "",
    confirmNewPassword: "",
  };

  const onSubmit = async (values, { setSubmitting }) => {
    if (recaptchaToken === null) {
      message.error('Recaptcha Token is Required');
    } else {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/method/airport_transport.api.user.update_password?otp=${otp}&new_password=${values.newPassword}`
        );
        if (response?.status === 200) {
          console.log(response.data)
          dispatch(signInRequest(email, values.newPassword, recaptchaToken, navigate));
          recaptchaRef.current.reset();
        }
      } catch (error) {
        message.error(`${error?.response?.data?.msg}`);
        console.log('Error', error);
        recaptchaRef.current.reset();
      }
      dispatch(setLoading(false));
    }

    setSubmitting(false);

  };

  const handlePasswordChange = (password) => {
    const length = password.length >= 8 && password.length <= 20;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const symbol = /[@$!%*?&#]/.test(password);

    setValidationStatus({
      length,
      uppercase,
      lowercase,
      symbol,
    });
  };

  return (
    <div className="h-screen w-screen position relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="position absolute left-0 top-0">
        <img
          src="/assets/signin/left_vector.png"
          alt="left_vector"
          className="w-20 h-20 md:w-48 md:h-48"
        />
      </div>
      <div className="position absolute right-0 bottom-0">
        <img
          src="/assets/signin/right_vector.png"
          alt="right_vector"
          className="w-16 md:w-48 h-12 md:h-36"
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
          <div className="block w-72 md:w-auto p-5 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div>
              <div className="w-auto md:w-[400px] text-left">
                <Heading
                  title={t("reset_password_text")}
                  className={"text-2xl text-[#0E0E11] text-center md:text-left"}
                />
              </div>
              <div className="text-sm text-text_lightdark_grey text-center md:text-left">
                {t("enter_new_password_text")}
              </div>
            </div>

            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ handleChange, handleBlur, values }) => (
                  <Form>
                    <div>
                      <InputFieldFormik
                        label={t("new_password_text")}
                        name="newPassword"
                        type="password"
                        required
                        onChange={(e) => {
                          handleChange(e);
                          handlePasswordChange(e.target.value);
                        }}
                        onBlur={handleBlur}
                        value={values.newPassword}
                      />
                    </div>

                    <div className="my-2">
                      <InputFieldFormik
                        label={t("confirm_new_password")}
                        name="confirmNewPassword"
                        type="password"
                        required
                      />
                    </div>

                    <div className="my-3">
                      <div
                        className={`my-2 flex flex-row justify-start items-center ${validationStatus.length
                          ? "text-text_steel_blue"
                          : "text-red-500"
                          }`}
                      >
                        <Icon
                          icon="teenyicons:tick-outline"
                          width="24px"
                          height="24px"
                        />
                        <div className="text-sm ml-2">
                          {t("my_profile.password_8_20_text")}
                        </div>
                      </div>

                      <div
                        className={`my-2 flex flex-row justify-start items-center ${validationStatus.uppercase
                          ? "text-text_steel_blue"
                          : "text-red-500"
                          }`}
                      >
                        <Icon
                          icon="teenyicons:tick-outline"
                          width="24px"
                          height="24px"
                        />
                        <div className="text-sm ml-2">
                          {t("my_profile.password_uppercase_text")}
                        </div>
                      </div>

                      <div
                        className={`my-2 flex flex-row justify-start items-center ${validationStatus.lowercase
                          ? "text-text_steel_blue"
                          : "text-red-500"
                          }`}
                      >
                        <Icon
                          icon="teenyicons:tick-outline"
                          width="24px"
                          height="24px"
                        />
                        <div className="text-sm ml-2">
                          {t("my_profile.password_lowercase_text")}
                        </div>
                      </div>

                      <div
                        className={`my-2 flex flex-row justify-start items-center ${validationStatus.symbol
                          ? "text-text_steel_blue"
                          : "text-red-500"
                          }`}
                      >
                        <Icon
                          icon="teenyicons:tick-outline"
                          width="24px"
                          height="24px"
                        />
                        <div className="text-sm ml-2">
                          {t("my_profile.password_symbol_text")}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Recaptcha
                        recaptchaRef={recaptchaRef}
                        sitekey="6Lc5Ox0qAAAAADw4xHdp5KwG05uh3vtqyc27c0ox"
                        onChange={(value) => {
                          setRecaptchaToken(value);
                        }}
                      />
                    </div>

                    <div className="text-center mt-3 md:mt-6">
                      <Button
                        className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 mb-2"
                        label={t("save_text")}
                        type="submit"
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          <div className="my-2">
            <AuthFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
