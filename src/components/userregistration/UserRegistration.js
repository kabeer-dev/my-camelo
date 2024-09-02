import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Stepper from "../base/Stepper";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputFieldFormik from "../base/InputFieldFormik";
import Button from "../base/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import AuthFooter from "../base/AuthFooter";
import { useDispatch, useSelector } from "react-redux";
import { signUpRequest } from "../../redux/actions/authActions";
import { setLoading } from "../../redux/actions/loaderAction";
// import axios from "axios";
import { message } from "antd";
import Recaptcha from "../base/Recaptcha";
import moment from "moment";
import { useTranslation } from "react-i18next";
import axiosInstance from '../../Api';

export default function UserRegistration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const email = location.state?.email;
  const phone = location.state?.phone;
  const language = useSelector((state) => state.auth.language);
  const recaptchaRef = React.createRef();

  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;
  const [activeStepId, setActiveStepId] = useState(1);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [validationStatus, setValidationStatus] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    symbol: false,
  });

  const [t, i18n] = useTranslation("global");

  const steps = useMemo(
    () => [
      { id: 1, text: t("my_profile.contato_text") },
      { id: 2, text: t("my_profile.contato_text") },
      { id: 3, text: t("my_profile.contato_text") },
    ],
    []
  );

  // vlidation function to check user is greather then 16 years
  const dobValidation = function (value) {
    const birthDate = new Date(value); // value should be in 'YYYY-MM-DD' format
    // console.log("aaa", birthDate);
    const today = new Date();
    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    // Check if age is less than 16
    if (age < 16) {
      return false; // Validation fails
    }
    return true; // Validation passes
  };

  const validationSchema = Yup.object().shape({
    rider_name: Yup.string().required(t("errors.rider_name_error")),
    lastName: Yup.string().required(t("errors.last_name_error")),
    gender: Yup.string().required(t("errors.gender_error")),
    nationality: Yup.string().required(t("errors.nationality_errr")),
    dob: Yup.string().required(t("errors.dob_error")),
    phone: Yup.string()
      .matches(/^[0-9]+$/, t("errors.phone_digit_error"))
      .required(t("errors.phone_error")),
    city: Yup.string().required(t("errors.city_error")),
    state: Yup.string().required(t("errors.state_error")),
    postcode: Yup.string()
      .matches(/^[0-9]+$/, t("errors.postal_must_error"))
      .required(t("errors.postal_error")),
    street: Yup.string().required(t("errors.street_error")),
    password: Yup.string()
      .required(t("errors.password_error"))
      .min(8, t("errors.password_min_error"))
      .max(20, t("errors.password_max_error"))
      .matches(/[A-Z]/, t("errors.password_uppercase_error"))
      .matches(/[a-z]/, t("errors.password_lowercase_error"))
      .matches(/[@$!%*?&#]/, t("errors.password_symbol_error")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t("errors.confirm_password_error2"))
      .required(t("errors.confirm_password_error")),
  });

  // State for options fetched from APIs
  const [genderOptions, setGenderOptions] = useState([]);
  const [countriesOptions, setCountriesOptions] = useState([]);

  // Fetch genderOptions and countriesOptions from APIs
  useEffect(() => {
    // Fetch gender options
    axiosInstance
      .get(`${API_BASE_URL}/api/method/airport_transport.api.user.get_gender?language=${language ? language : 'eng'}`)
      .then((response) => {
        const genderData = response.data.data; // Extract the gender data
        const genderOptions = genderData.map((gender) => ({
          value: gender,
          label: gender,
        }));
        setGenderOptions(genderOptions);
      })
      .catch((error) => {
        message.error(
          error?.response?.data?.msg || "Error fetching gender options"
        );
        console.log('Error', error)
      });

    // Fetch country options
    axiosInstance
      .get(
        `${API_BASE_URL}/api/method/airport_transport.api.user.get_nationality?language=${language ? language : 'eng'}`
      )
      .then((response) => {
        const countryData = response.data.data; // Extract the country data
        const countryOptions = countryData.map((country) => ({
          value: country,
          label: country,
        }));
        setCountriesOptions(countryOptions);
      })
      .catch((error) => {
        message.error(
          error?.response?.data?.msg || "Error fetching country options"
        );
      });
  }, [API_BASE_URL]);

  const validatePassword = (password) => {
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

  const onSubmit = (values, { setSubmitting }) => {
    values.dob = moment(values.dob).format("YYYY-MM-DD");
    values.email = email;
    values.phone = phone;
    dispatch(signUpRequest(values, recaptchaToken, navigate));
    setLoading(true);
    setSubmitting(false);
    recaptchaRef.current.reset();
  };

  return (
    <>
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
            <div className="mb-2 cursor-pointer" onClick={() => navigate("/")}>
              <img
                src="/assets/signin/logo.png"
                alt="Moshrouk Trips"
                className="w-16 h-13"
              />
            </div>
            <div className="block w-72 md:w-auto p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className="w-auto text-left p-1">
                <div>
                  <Stepper
                    steps={steps}
                    activeStepId={activeStepId}
                    className={
                      "flex items-center w-full text-sm font-medium text-center py-2 border-b text-gray-500 sm:text-base justify-between"
                    }
                  />
                </div>


                <Formik
                  initialValues={{
                    rider_name: "",
                    lastName: "",
                    gender: "",
                    nationality: "",
                    dob: "",
                    phone: "",
                    city: "",
                    state: "",
                    postcode: "",
                    street: "",
                    password: "",
                    confirmPassword: "",
                    language: language === 'ar' ? language : "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, errors, setFieldValue, validateForm }) => {
                    const isStep1Valid =
                      values.rider_name &&
                      values.lastName &&
                      values.gender &&
                      values.nationality &&
                      values.dob;
                    // values.phone;
                    const isStep2Valid =
                      values.city &&
                      values.state &&
                      values.postcode &&
                      values.street;

                    return (
                      <Form className="mx-auto w-full">
                        {activeStepId === 1 && (
                          <>
                            <div className="flex flex-row justify-between items-center">
                              <div className="w-1/2 mr-1">
                                <InputFieldFormik
                                  label={t("my_profile.first_name_text")}
                                  name="rider_name"
                                  type="text"
                                  onChange={(valueObj) => {
                                    const { fieldName, selectedValue } =
                                      valueObj;
                                    setFieldValue(fieldName, selectedValue);
                                  }}
                                  required
                                />
                              </div>
                              <div className="w-1/2 ml-1">
                                <InputFieldFormik
                                  label={t("my_profile.last_name_text")}
                                  name="lastName"
                                  type="text"
                                  onChange={(valueObj) => {
                                    const { fieldName, selectedValue } =
                                      valueObj;
                                    setFieldValue(fieldName, selectedValue);
                                  }}
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <InputFieldFormik
                                label={t("my_profile.gender_text")}
                                name="gender"
                                type="select"
                                options={genderOptions}
                                onChange={(valueObj) => {
                                  const { fieldName, selectedValue } = valueObj;
                                  setFieldValue(fieldName, selectedValue);
                                }}
                                required
                              />
                            </div>

                            <div>
                              <InputFieldFormik
                                label={t("my_profile.nationality_text")}
                                name="nationality"
                                type="select"
                                options={countriesOptions}
                                onChange={(valueObj) => {
                                  const { fieldName, selectedValue } = valueObj;
                                  setFieldValue(fieldName, selectedValue);
                                }}
                                required
                              />
                            </div>

                            <div>
                              <InputFieldFormik
                                label={t("my_profile.date_birth_text")}
                                name="dob"
                                type="dob"
                                value={values.dob ? values.dob : null}
                                onChange={(date, dateString) => {
                                  // const { fieldName, selectedValue } = valueObj;
                                  setFieldValue("dob", dateString);
                                }}
                                required
                              />
                            </div>

                            <div dir="ltr">
                              <InputFieldFormik
                                label={t("my_profile.email_text")}
                                name="email"
                                type="readOnly"
                                value={email}
                                readOnly={true}
                              // onChange={(valueObj) => {
                              //   const { fieldName, selectedValue } = valueObj;
                              //   setFieldValue(fieldName, selectedValue);
                              // }}
                              // required
                              />
                            </div>
                            <div dir="ltr">
                              <InputFieldFormik
                                label={t("my_profile.phone_number_text")}
                                name="phone"
                                type="readOnly"
                                value={phone}
                                readOnly={true}
                              // onChange={(valueObj) => {
                              //   const { fieldName, selectedValue } = valueObj;
                              //   setFieldValue(fieldName, selectedValue);
                              // }}
                              // required
                              />
                            </div>

                            {/* <div>
                              <InputFieldFormik
                                label="Phone Number"
                                name="phone"
                                type="text"
                                onChange={(valueObj) => {
                                  const { fieldName, selectedValue } = valueObj;
                                  setFieldValue(fieldName, selectedValue);
                                }}
                                required
                              />
                            </div> */}

                            <div className="w-full mt-3">
                              <Button
                                className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                onClick={() => {
                                  validateForm().then(() => {
                                    if (isStep1Valid) {
                                      const isSixteenYears = dobValidation(
                                        values.dob
                                      );
                                      if (isSixteenYears) {
                                        values.phone = phone;
                                        setActiveStepId(2);
                                      } else {
                                        message.error(
                                          t("errors.age_16_error")
                                        );
                                      }
                                    }
                                  });
                                }}
                                label={t("next_text")}
                                type="button"
                                disabled={!isStep1Valid}
                              />
                            </div>
                          </>
                        )}

                        {activeStepId === 2 && (
                          <>
                            <div className="flex flex-row justify-between items-center">
                              <div className="w-1/2 mr-1">
                                <InputFieldFormik
                                  label={t("my_profile.city_text")}
                                  name="city"
                                  type="text"
                                  onChange={(valueObj) => {
                                    const { fieldName, selectedValue } =
                                      valueObj;
                                    setFieldValue(fieldName, selectedValue);
                                  }}
                                  required
                                />
                              </div>
                              <div className="w-1/2 ml-1">
                                <InputFieldFormik
                                  label={t("my_profile.state_text")}
                                  name="state"
                                  type="text"
                                  onChange={(valueObj) => {
                                    const { fieldName, selectedValue } =
                                      valueObj;
                                    setFieldValue(fieldName, selectedValue);
                                  }}
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <InputFieldFormik
                                label={t("my_profile.postal_text")}
                                name="postcode"
                                type="text"
                                onChange={(valueObj) => {
                                  const { fieldName, selectedValue } = valueObj;
                                  setFieldValue(fieldName, selectedValue);
                                }}
                                required
                              />
                            </div>

                            <div>
                              <InputFieldFormik
                                label={t("my_profile.street_address_text")}
                                name="street"
                                type="text"
                                onChange={(valueObj) => {
                                  const { fieldName, selectedValue } = valueObj;
                                  setFieldValue(fieldName, selectedValue);
                                }}
                                required
                              />
                            </div>

                            <div className="w-full mt-3 flex flex-row justify-between items-center">
                              <Button
                                className="bg-bg_btn_back w-1/2 text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                onClick={() => {
                                  setActiveStepId(1);
                                }}
                                label={t("previous_text")}
                                type="button"
                              />
                              <Button
                                className="bg-background_steel_blue w-1/2 text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                onClick={() => {
                                  validateForm().then(() => {
                                    if (isStep2Valid) {
                                      setActiveStepId(3);
                                    }
                                  });
                                }}
                                label={t("next_text")}
                                type="button"
                                disabled={!isStep2Valid}
                              />
                            </div>
                          </>
                        )}

                        {activeStepId === 3 && (
                          <>
                            <div dir="ltr">
                              <InputFieldFormik
                                label={t("my_profile.password_text")}
                                name="password"
                                type="password"
                                onChange={(valueObj) => {
                                  const { fieldName, selectedValue } = valueObj;
                                  setFieldValue(fieldName, selectedValue);
                                  validatePassword(selectedValue);
                                }}
                                required
                              />
                            </div>

                            <div dir="ltr">
                              <InputFieldFormik
                                label={t("my_profile.confirm_password")}
                                name="confirmPassword"
                                type="password"
                                onChange={(valueObj) => {
                                  const { fieldName, selectedValue } = valueObj;
                                  setFieldValue(fieldName, selectedValue);
                                }}
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
                                sitekey="6LfE3FEpAAAAAGkeBjkpPeNSqPNWtLPCma7EHVsr"
                                onChange={(value) => {
                                  setRecaptchaToken(value);
                                }}
                              />
                            </div>

                            <div className="w-full mt-3 flex flex-row justify-between items-center">
                              <Button
                                className="bg-bg_btn_back w-1/2 text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                onClick={() => {
                                  setActiveStepId(2);
                                }}
                                label={t("previous_text")}
                                type="button"
                              />
                              <Button
                                className="bg-background_steel_blue w-1/2 text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                label={t("submit_text")}
                                type="submit"
                              />
                            </div>
                          </>
                        )}
                      </Form>
                    );
                  }}
                </Formik>

              </div>
            </div>
            <div className="">
              <AuthFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
