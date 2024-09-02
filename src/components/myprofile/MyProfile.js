import React, { useState, useEffect } from "react";
import { Events, scrollSpy } from "react-scroll";
import Button from "../base/Button";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputFieldFormik from "../base/InputFieldFormik";
// import axios from "axios";
import { setLoading } from "../../redux/actions/loaderAction";
import Header from "../base/Header";
import Footer from "../base/Footer";
import { SIGN_OUT_SUCCESS } from "../../redux/actions/authActions";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../Api";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;
  const token = useSelector((state) => state.auth.token);
  const language = useSelector((state) => state.auth.language);
  const dispatch = useDispatch();
  const [t, i18n] = useTranslation("global");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [formValues, setFormValues] = useState({
    rider_name: userDetails ? userDetails.name : "",
    // lastName: "",
    day: "",
    month: "",
    year: "",
    nationality: "",
    email: "",
    mobile_number: "",
    city: "",
    state: "",
    street: "",
    // password: "",
    // confirmPassword: "",
  });

  useEffect(() => {
    dispatch(setLoading(true));
    const getUserDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_BASE_URL}/api/method/airport_transport.api.user.get_user_info`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response && response.status === 200) {
          // console.log('sss', response.data.data)
          setUserDetails(response.data.data);
          const data = response.data.data;
          let day = "";
          let month = "";
          let year = "";
          if (data.dob) {
            let parts = data.dob.split("-");
            year = parseInt(parts[0]);
            month = parseInt(parts[1]);
            day = parseInt(parts[2]);
          }
          setFormValues((prevformValues) => ({
            ...prevformValues,
            rider_name: data.rider_name,
            // lastName: data?.lastName ? data.lastName : "",
            day: day,
            month: month,
            year: year,
            nationality: data.nationality,
            email: data.email,
            mobile_number: data.mobile_number,
            city: data.city,
            state: data.state,
            street: data.street,
          }));
          dispatch(setLoading(false));
        }
      } catch (error) {
        if (error.response.status === 401) {
          navigate("/sign-in");
        }
        console.error("Error:", error);
        dispatch(setLoading(false));
      }
    };
    getUserDetails();
  }, [token]);
  // Function to toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    Events.scrollEvent.register("begin", function (to, element) {});
    Events.scrollEvent.register("end", function (to, element) {});

    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);

  const validationSchema = Yup.object().shape({
    rider_name: Yup.string().required(t("errors.rider_name_error")),
    // lastName: Yup.string().required(t("errors.last_name_error")),
    day: Yup.string().required(t("errors.day_error")),
    month: Yup.string().required(t("errors.month_error")),
    year: Yup.string().required(t("errors.year_error")),
    nationality: Yup.string().required(t("errors.nationality_errr")),
    // mobile_number: Yup.string()
    //   .matches(/^[0-9]+$/, "Phone Number must be only digits")
    //   .required("Phone Number is required"),
    city: Yup.string().required(t("errors.city_error")),
    state: Yup.string().required(t("errors.state_error")),
    street: Yup.string().required(t("errors.street_error")),
    // password: Yup.string()
    //   .required(t("errors.password_error"))
    //   .min(8, t("errors.password_min_error"))
    //   .max(20, t("errors.password_max_error"))
    //   .matches(/[A-Z]/, t("errors.password_uppercase_error"))
    //   .matches(/[a-z]/, t("errors.password_lowercase_error"))
    //   .matches(/[@$!%*?&#]/, t("errors.password_symbol_error")),
    // confirmPassword: Yup.string()
    //   .oneOf([Yup.ref("password"), null], t("errors.confirm_password_error2"))
    //   .required(t("errors.confirm_password_error")),
  });

  const [countriesOptions, setCountriesOptions] = useState([]);

  // Fetch genderOptions and countriesOptions from APIs
  useEffect(() => {
    // Fetch country options
    axiosInstance
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

  const onSubmit = async (values, { setSubmitting }) => {
    // Transform the values before submitting
    const dob = `${values.year}-${values.month}-${values.day}`;
    const transformedValues = {
      ...values,
      dob, // Add the dob field in 'year-month-day' format
      country: values.nationality, // Add the country field with the nationality value
    };

    // Remove the day, month, and year fields
    delete transformedValues.day;
    delete transformedValues.month;
    delete transformedValues.year;

    console.log("Transformed values for my profile:", transformedValues); // For testing purpose
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/api/method/airport_transport.api.user.update_user_info`,
        transformedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response && response.status === 200) {
        message.success(response.data.msg);
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error("Error:", error);
      dispatch(setLoading(false));
    }
    setSubmitting(false);
  };

  return (
    <div>
      <Header />

      {userDetails && (
        <main className="mt-20" dir={language === "ar" ? "rtl" : "ltr"}>
          {/* Form Section */}
          <div className="container mx-auto p-4">
            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
              <div>
                <Formik
                  initialValues={{
                    rider_name: formValues.rider_name,
                    // lastName: formValues.lastName,
                    day: formValues.day,
                    month: formValues.month,
                    year: formValues.year,
                    nationality: formValues.nationality,
                    email: formValues.email,
                    mobile_number: formValues.mobile_number,
                    city: formValues.city,
                    state: formValues.state,
                    street: formValues.street,
                    // password: formValues.password,
                    // confirmPassword: formValues.confirmPassword,
                  }}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, isSubmitting, setFieldValue }) => (
                    <Form className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                        <div>
                          <InputFieldFormik
                            label={t("my_profile.first_name_text")}
                            name="rider_name"
                            type="text"
                            placeholder="Enter your first name"
                            value={formValues.rider_name}
                            onChange={(e) => {
                              values.rider_name = e.target.value;
                              setFormValues((prevformValues) => ({
                                ...prevformValues,
                                rider_name: e.target.value,
                              }));
                            }}
                          />
                        </div>
                        {/* <div>
                      <InputFieldFormik
                        label={t("my_profile.last_name_text")}
                        name="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={formValues.lastName}
                        onChange={(e) => {
                          values.lastName = e.target.value;
                          setFormValues((prevformValues) => ({
                            ...prevformValues,
                            lastName: e.target.value,
                          }));
                        }}
                      />
                    </div> */}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <InputFieldFormik
                            label={t("my_profile.day_text")}
                            name="day"
                            type="text"
                            placeholder="DD"
                            value={formValues.day}
                            onChange={(e) => {
                              values.day = e.target.value;
                              setFormValues((prevformValues) => ({
                                ...prevformValues,
                                day: e.target.value,
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <InputFieldFormik
                            label={t("my_profile.month_text")}
                            name="month"
                            type="text"
                            placeholder="MM"
                            value={formValues.month}
                            onChange={(e) => {
                              values.month = e.target.value;
                              setFormValues((prevformValues) => ({
                                ...prevformValues,
                                month: e.target.value,
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <InputFieldFormik
                            label={t("my_profile.year_text")}
                            name="year"
                            type="text"
                            placeholder="YYYY"
                            value={formValues.year}
                            onChange={(e) => {
                              values.year = e.target.value;
                              setFormValues((prevformValues) => ({
                                ...prevformValues,
                                year: e.target.value,
                              }));
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <InputFieldFormik
                            label={t("my_profile.nationality_text")}
                            name="nationality"
                            type="select"
                            options={countriesOptions}
                            value={formValues.nationality}
                            onChange={(valueObj) => {
                              const { fieldName, selectedValue } = valueObj;
                              setFieldValue(fieldName, selectedValue);
                              setFormValues((prevformValues) => ({
                                ...prevformValues,
                                nationality: selectedValue,
                              }));
                            }}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <InputFieldFormik
                          label={t("my_profile.email_text")}
                          name="email"
                          type="readOnly"
                          readOnly={true}
                          value={formValues.email}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <InputFieldFormik
                          label={t("my_profile.phone_number_text")}
                          name="phone"
                          type="readOnly"
                          readOnly={true}
                          value={formValues.mobile_number}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <InputFieldFormik
                            label={t("my_profile.city_text")}
                            name="city"
                            type="text"
                            placeholder="Enter your city"
                            value={formValues.city}
                            onChange={(e) => {
                              values.city = e.target.value;
                              setFormValues((prevformValues) => ({
                                ...prevformValues,
                                city: e.target.value,
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <InputFieldFormik
                            label={t("my_profile.state_text")}
                            name="state"
                            type="text"
                            placeholder="Enter your state"
                            value={formValues.state}
                            onChange={(e) => {
                              values.state = e.target.value;
                              setFormValues((prevformValues) => ({
                                ...prevformValues,
                                state: e.target.value,
                              }));
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <InputFieldFormik
                          label={t("my_profile.street_address_text")}
                          name="street"
                          type="text"
                          placeholder="Enter your street address"
                          value={formValues.street}
                          onChange={(e) => {
                            values.street = e.target.value;
                            setFormValues((prevformValues) => ({
                              ...prevformValues,
                              street: e.target.value,
                            }));
                          }}
                        />
                      </div>

                      {/* <div className="grid grid-cols-1 gap-3">
                    <InputFieldFormik
                      label={t("my_profile.password_text")}
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formValues.password}
                      onChange={(e) => {
                        values.password = e.target.value;
                        setFormValues((prevformValues) => ({
                          ...prevformValues,
                          password: e.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <InputFieldFormik
                      label={t("my_profile.confirm_password")}
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formValues.confirmPassword}
                      onChange={(e) => {
                        values.confirmPassword = e.target.value;
                        setFormValues((prevformValues) => ({
                          ...prevformValues,
                          confirmPassword: e.target.value,
                        }));
                      }}
                    />
                  </div> */}

                      <Button
                        type="submit"
                        label={t("my_profile.save_changes_text")}
                        className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                        disabled={isSubmitting}
                      />
                    </Form>
                  )}
                </Formik>
              </div>

              <div className="bg-background_steel_blue rounded-md flex items-center justify-center">
                <img
                  src="/assets/myprofile/Logo.png"
                  alt="Camelo Logo"
                  className="m-auto"
                />
              </div>
            </div>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}
