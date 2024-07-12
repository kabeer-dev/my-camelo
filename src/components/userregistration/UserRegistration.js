import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Stepper from "../base/Stepper";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputFieldFormik from "../base/InputFieldFormik";
import Button from "../base/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import AuthFooter from "../base/AuthFooter";
import { useDispatch } from "react-redux";
import { signUpRequest } from "../../redux/actions/authActions";
import { setLoading } from "../../redux/actions/loaderAction";
import axios from "axios";
import { message } from "antd";
import Recaptcha from "../base/Recaptcha";

export default function UserRegistration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const email = location.state?.email;
  const phone = location.state?.phone;
  console.log('aaaaa', phone)
  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;
  const [activeStepId, setActiveStepId] = useState(1);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [validationStatus, setValidationStatus] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    symbol: false,
  });

  const steps = useMemo(
    () => [
      { id: 1, text: "Contato" },
      { id: 2, text: "Contato" },
      { id: 3, text: "Contato" },
    ],
    []
  );

  // vlidation function to check user is greather then 16 years
  const dateOfBirthValidation = function(value) {
    const birthDate = new Date(value); // value should be in 'YYYY-MM-DD' format
    console.log('aaa', birthDate)
    const today = new Date();
    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    // Check if age is less than 16
    if (age < 16) {
      return false; // Validation fails
    }
    return true; // Validation passes
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    gender: Yup.string().required("Gender is required"),
    nationality: Yup.string().required("Nationality is required"),
    dateOfBirth:  Yup.string().required("Date of Birth is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "Phone Number must be only digits")
      .required("Phone Number is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    postalCode: Yup.string()
      .matches(/^[0-9]+$/, "Postal Code must be only digits")
      .required("Postal Code is required"),
    streetAddress: Yup.string().required("Street Address is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password cannot be more than 20 characters")
      .matches(/[A-Z]/, "Password must have at least 1 uppercase letter")
      .matches(/[a-z]/, "Password must have at least 1 lowercase letter")
      .matches(/[@$!%*?&#]/, "Password must have at least 1 symbol"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // State for options fetched from APIs
  const [genderOptions, setGenderOptions] = useState([]);
  const [countriesOptions, setCountriesOptions] = useState([]);

  // Fetch genderOptions and countriesOptions from APIs
  useEffect(() => {
    // Fetch gender options
    axios
      .get(`${API_BASE_URL}/api/method/airport_transport.api.user.get_gender`)
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
      });

    // Fetch country options
    axios
      .get(
        `${API_BASE_URL}/api/method/airport_transport.api.user.get_nationality`
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
    values.email = email;
    values.phoneNumber = phone;
    dispatch(signUpRequest(values, recaptchaToken, navigate));
    setLoading(true);
    setSubmitting(false);
  };

  return (
    <>
      <div className="h-screen w-screen position relative">
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
                    firstName: "",
                    lastName: "",
                    gender: "",
                    nationality: "",
                    dateOfBirth: "",
                    phoneNumber: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    streetAddress: "",
                    password: "",
                    confirmPassword: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, errors, setFieldValue, validateForm }) => {
                    const isStep1Valid =
                      values.firstName &&
                      values.lastName &&
                      values.gender &&
                      values.nationality &&
                      values.dateOfBirth 
                      // values.phoneNumber;
                    const isStep2Valid =
                      values.city &&
                      values.state &&
                      values.postalCode &&
                      values.streetAddress;

                    return (
                      <Form className="mx-auto w-full">
                        {activeStepId === 1 && (
                          <>
                            <div className="flex flex-row justify-between items-center">
                              <div className="w-1/2 mr-1">
                                <InputFieldFormik
                                  label="First Name"
                                  name="firstName"
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
                                  label="Last Name"
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
                                label="Gender"
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
                                label="Nationality"
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
                                label="Date of birth"
                                name="dateOfBirth"
                                type="dateOfBirth"
                                value={values.dateOfBirth ? values.dateOfBirth : null}
                                onChange={(date, dateString) => {
                                  // const { fieldName, selectedValue } = valueObj;
                                  setFieldValue('dateOfBirth', dateString);
                                }}
                                required
                              />
                            </div>

                            <div>
                              <InputFieldFormik
                                label="Email"
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
                            <div>
                              <InputFieldFormik
                                label="Phone"
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
                                name="phoneNumber"
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
                                      const isSixteenYears = dateOfBirthValidation(values.dateOfBirth);
                                      if(isSixteenYears){
                                        setActiveStepId(2);
                                      }else{
                                        message.error('Age should be more than 16 years');
                                      }
                                      
                                    }
                                  });
                                }}
                                label="Next"
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
                                  label="City"
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
                                  label="State"
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
                                label="Postal Code"
                                name="postalCode"
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
                                label="Street Address"
                                name="streetAddress"
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
                                label="Previous"
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
                                label="Next"
                                type="button"
                                disabled={!isStep2Valid}
                              />
                            </div>
                          </>
                        )}

                        {activeStepId === 3 && (
                          <>
                            <div>
                              <InputFieldFormik
                                label="Password"
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

                            <div>
                              <InputFieldFormik
                                label="Confirm Password"
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
                                className={`my-2 flex flex-row justify-start items-center ${
                                  validationStatus.length
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
                                  Your password must contain between 8 and 20
                                  characters
                                </div>
                              </div>

                              <div
                                className={`my-2 flex flex-row justify-start items-center ${
                                  validationStatus.uppercase
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
                                  Your password must have at least 1 uppercase
                                  letter
                                </div>
                              </div>

                              <div
                                className={`my-2 flex flex-row justify-start items-center ${
                                  validationStatus.lowercase
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
                                  Your password must have at least 1 lowercase
                                  letter
                                </div>
                              </div>

                              <div
                                className={`my-2 flex flex-row justify-start items-center ${
                                  validationStatus.symbol
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
                                  Your password must have at least 1 symbol
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
                                label="Previous"
                                type="button"
                              />
                              <Button
                                className="bg-background_steel_blue w-1/2 text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                label="Submit"
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
