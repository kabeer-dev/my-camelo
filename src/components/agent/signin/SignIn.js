import React, { useState } from "react";
import Heading from "../base/Heading";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputFieldFormik from "../base/InputFieldFormik";
import Button from "../base/Button";
import { useNavigate } from "react-router-dom";
import AuthFooter from "../base/AuthFooter";
import Recaptcha from "../base/Recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { signInRequest } from "../../../redux/actions/authActions";
import { setLoading } from "../../../redux/actions/loaderAction";
import { useTranslation } from "react-i18next";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = React.createRef();

  const [t, i18n] = useTranslation("global");
  const language = useSelector((state) => state.auth.language);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required(t("errors.email_error")),
    password: Yup.string().required(t("errors.password_error")),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = (values, { setSubmitting }) => {
    const { email, password } = values;
    dispatch(signInRequest(email, password, recaptchaToken, navigate));
    setLoading(true);
    setSubmitting(false);
    recaptchaRef.current.reset();
  };

  return (
    <>
      <div className="h-screen w-screen position relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="position absolute left-0 top-0">
          <img
            src="./assets/signin/left_vector.png"
            alt="left_vector"
            className="w-24 h-24 md:w-48 md:h-48"
          />
        </div>
        <div className="position absolute right-0 bottom-0">
          <img
            src="./assets/signin/right_vector.png"
            alt="right_vector"
            className="w-16 md:w-48 h-12 md:h-36"
          />
        </div>

        <div className="z-20 w-screen h-screen flex flex-row justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <div className="mb-4 cursor-pointer" onClick={() => navigate("/mashrouk-new-ui/agent")}>
              <img
                src="./assets/signin/logo.png"
                alt="Moshrouk Trips"
                className="w-16 h-13"
              />
            </div>
            <div className="mt-4 lg:mt-0 block w-72 md:w-auto p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className="w-auto md:w-96 text-center">
                <Heading
                  title={t("header.sign_in_text")}
                  className={"text-2xl text-[#0E0E11]"}
                />
              </div>

              <div>
                <div className="p-2 md:p-4 lg:p-2">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    {({ values }) => (
                      <Form>
                        <div>
                          <InputFieldFormik
                            label={t("hero.enter_email_text")}
                            name="email"
                            type="email"
                            required
                          />
                        </div>

                        <div>
                          <InputFieldFormik
                            label={t("hero.password_text")}
                            name="password"
                            type="password"
                            required
                          />
                        </div>

                        {/* Integrate Recaptcha component */}
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
                            navigate("/mashrouk-new-ui/agent/forget-password", {
                              state: { email: values.email },
                            })
                          }
                        >
                          {t("hero.forget_password_text")}
                        </div>

                        <div className="text-center mt-3 md:mt-6 lg:mt-2">
                          <Button
                            className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 mb-2"
                            label={t("header.sign_in_text")}
                            type="submit"
                          />
                        </div>

                        <div className="mt-2 w-full text-sm flex flex-col md:flex-row items-center justify-center text-text_lightdark_grey cursor-pointer">
                          <span>{t("no_account_text")}</span>
                          <span
                            className="text-sm font-semibold mr-2 text-text_steel_blue hover:underline ml-2"
                            onClick={() => navigate("/mashrouk-new-ui/agent/create-new-account")}
                          >
                             {t("header.create_text")}
                          </span>
                        </div>
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
