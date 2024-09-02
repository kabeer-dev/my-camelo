import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Stepper from "../base/Stepper";
import Button from "../base/Button";
import Heading from "../base/Heading";
import MapModal from "../base/MapModal";
import InputFieldFormik from "../base/InputFieldFormik";
import { fetchCitiesRequest } from "../../../redux/actions/cityActions";
import { fetchAirportRequest } from "../../../redux/actions/airportActions";
import { fetchVehicleTypesRequest } from "../../../redux/actions/vehicleTypeAction";
import { getZoneRequest } from "../../../redux/actions/zoneActions";
import HomeEmailSignUp from "./HomeEmailSignUp";
import VehicleTypeModal from "../base/VehicleTypeModal";
import { setLoading } from "../../../redux/actions/loaderAction";
import PaymentMethod from "./PaymentMethod";
// import axios from "axios";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import axiosInstance from '../../../Api';

export default function AirportRide(
  {
    subTab, setSubTab,
    showSignUp, setShowSignUp,
    showAlreadyRegistered,
    setShowAlreadyRegistered,
    showOTPScreen,
    setShowOTPScreen,
    hideCreateAccountButton,
    setHideCreateAccountButton,
    showPhone,
    setShowPhone,
    hidePhoneCreateAccountButton,
    setHidePhoneCreateAccountButton,
    showPhoneOTPScreen,
    setShowPhoneOTPScreen,
    showPaymentMethod,
    setShowPaymentMethod,
    recaptchaRef,
    otp,
    setOtp,
    phoneOtp,
    setPhoneOtp,
    showPaybylinkQr,
    setShowPaybylinkQr
  }) {
  const dispatch = useDispatch();
  const { cities } = useSelector((state) => state.cities);
  const { airports } = useSelector((state) => state.airports);
  const { vehicleTypes } = useSelector((state) => state.vehicleTypes);
  const services = "Airport Trip";
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const language = useSelector((state) => state.auth.language);
  const token = useSelector((state) => state.auth.token);

  const zoneMap = useSelector((state) => state?.zone?.zone);
  const [map, setMap] = useState(null);

  const [t, i18n] = useTranslation("global");

  useEffect(() => {
    setMap(zoneMap && zoneMap.length > 0 ? zoneMap : null)
  }, [zoneMap]);

  const [location, setLocation] = useState("")
  const [destination, setDestination] = useState("")
  const [getUsers, setGetUsers] = useState([])

  // const [subTab, setSubTab] = useState(1);
  const [cityName, setCityName] = useState();
  const [terminalOptions, setTerminalOptions] = useState([]);
  const [seatNumberOptions, setSeatNumberOptions] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);
  const [arrivalDates, setArrivalDates] = useState(null);
  const rideTypeOptions = [
    { value: t("hero.pickup_value_text"), label: t("hero.pickup_text") },
    { value: t("hero.dropoff_value_text"), label: t("hero.dropoff_text") },
  ];
  const [formValues, setFormValues] = useState({
    agentUser: "",
    rideType: "",
    // t("hero.pickup_value_text"),
    arrivalCity: "",
    airportName: "",
    terminalNumber: "",
    vehicleType: "",
    seatNumber: "",
    arrivalDate: "",
    arrivalTime: "",
    sharedRide: false,
  });
  const [onChangeFormValues, setOnChangeFormValues] = useState({
    agentUser: "",
    rideType: "",
    // t("hero.pickup_value_text"),
    arrivalCity: "",
    airportName: "",
    terminalNumber: "",
    vehicleType: "",
    seatNumber: "",
    arrivalDate: "",
    arrivalTime: "",
    sharedRide: false,
  });

  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

  const [VehicleTypeWithService, setVehicleTypeWithService] = useState(null);
  const [vehicleTypeName, setVehicleTypeName] = useState("");

  useEffect(() => {
    dispatch(setLoading(true));
    const getVechileTypes = async () => {
      if (cityName) {
        try {
          const response = await axiosInstance.get(
            `${API_BASE_URL}/api/method/airport_transport.api.bookings.get_vehicle_types?language=${
              language ? language : "en"
            }&service=Airport Trip&city=${cityName}`
          );
          if (response && response.status === 200) {
            setVehicleTypeWithService(response.data);
          }
        } catch (error) {
          console.log("Error", error);
        }
      }
    };
    getVechileTypes();
    dispatch(setLoading(false));
  }, [cityName]);

  const [sharedRideValue, setSharedRideValue] = useState("");
  useEffect(() => {
    const getSharedRideValue = async () => {
      dispatch(setLoading(true))
      if (vehicleTypeName !== "") {
        try {
          const response = await axiosInstance.get(
            `${API_BASE_URL}/api/method/airport_transport.api.bookings.get_ride_discount?vehicle_type=${vehicleTypeName}&language=${language ? language : 'eng'}`
          );
          if (response && response.status === 200) {
            setSharedRideValue(response.data.data)
            dispatch(setLoading(false))
          }
        } catch (error) {
          console.log('Error', error);
          dispatch(setLoading(false))
        }
      }
      dispatch(setLoading(false))
    }
    getSharedRideValue()
  }, [vehicleTypeName]);

  useEffect(() => {
    const getUsers = async () => {
      dispatch(setLoading(true))

      try {
        const response = await axiosInstance.get(
          `${API_BASE_URL}/api/method/airport_transport.api.agent.get_transport_users`,
          {
            headers: {
              // 'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        if (response && response.status === 200) {
          // console.log(response.data.data)
          const usersArray = response.data.data
          const transformedEmails = usersArray.map(email => ({
            value: email,
            label: email
          }));
          setGetUsers(transformedEmails);
          dispatch(setLoading(false))
        }
      } catch (error) {
        console.log('Error', error);
        dispatch(setLoading(false))
      }

      dispatch(setLoading(false))
    }
    getUsers()
  }, [formValues]);


  // console.log('vehicleTypes', vehicleTypes)
  useEffect(() => {
    if (vehicleTypeName !== "") {
      const selectedVehicle = VehicleTypeWithService.data.find(
        (vehicle) => vehicle.name === vehicleTypeName
      );
      setSeatNumberOptions(
        selectedVehicle
          ? Array.from({ length: selectedVehicle.seats }, (_, i) => `${i + 1}`)
          : []
      );
      setOnChangeFormValues((prevValues) => ({
        ...prevValues,
        ["vehicleType"]: vehicleTypeName,
      }));
    }
  }, [vehicleTypeName]);

  useEffect(() => {
    dispatch(fetchCitiesRequest());
    dispatch(fetchVehicleTypesRequest());
  }, [dispatch]);

  useEffect(() => {
    if (cityName) {
      dispatch(fetchAirportRequest(cityName));
      dispatch(getZoneRequest(services, cityName));
    }
  }, [dispatch, cityName]);

  // useEffect(() => {
  //   if (cities.data?.length > 0 && !cityName) {
  //     setFormValues((prevValues) => ({
  //       ...prevValues,
  //       "arrivalCity": cities.data[0],
  //     }));
  //     setOnChangeFormValues((prevValues) => ({
  //       ...prevValues,
  //       "arrivalCity": cities.data[0],
  //     }));

  //     setCityName(cities.data[0])
  //   }
  // }, [cities])

  // useEffect(() => {
  //   if (airports.data?.length > 0) {
  //     setFormValues((prevValues) => ({
  //       ...prevValues,
  //       "airportName": airports.data[0].airport,
  //     }));
  //     setOnChangeFormValues((prevValues) => ({
  //       ...prevValues,
  //       "airportName": airports.data[0].airport,
  //     }));

  //     setFormValues((prevValues) => ({
  //       ...prevValues,
  //       "terminalNumber": airports.data[0].terminals[0].terminal,
  //     }));
  //     setOnChangeFormValues((prevValues) => ({
  //       ...prevValues,
  //       "terminalNumber": airports.data[0].terminals[0].terminal,
  //     }));
  //     const terminals = airports.data[0].terminals.map((terminal) => terminal.terminal);
  //     setTerminalOptions(terminals)
  //     setSelectedPickup(airports.data[0].terminals[0].location)
  //     setLocation(airports.data[0].terminals[0].location)

  //   }
  // }, [airports, cityName])

  const steps = useMemo(() => {
    const baseSteps = [
      { id: 1, text: t("hero.stepper_steps.ride_detail_text") },
      { id: 2, text: t("hero.stepper_steps.vehicle_detail_text") },
      { id: 3, text: t("hero.stepper_steps.additional_info_text") }
    ];

    if (!isLoggedIn) {
      baseSteps.push({ id: 4, text: t("hero.stepper_steps.account_info_text") });
    }

    return baseSteps;
  }, [isLoggedIn, t]);

  const validationSchema = Yup.object().shape({
    agentUser: Yup.string().required("Agent User is required"),
    rideType: Yup.string().required("Ride type is required"),
    arrivalCity: Yup.string().required("Arrival City is required"),
    airportName: Yup.string().required("Airport Name is required"),
    terminalNumber: Yup.string().required("Terminal Number is required"),
    vehicleType: Yup.string().required("Vehicle Type is required"),
    // seatNumber: Yup.string().required("Seat Number is required"),
    arrivalDate: Yup.string().required("Arrival Date is required"),
    arrivalTime: Yup.string().required("Arrival Time is required"),
    sharedRide: Yup.bool(),
  });

  const handleAirportChange = (value, setFieldValue) => {
    const selectedAirport = airports.data.find(
      (airport) => airport.airport === value
    );
    const terminals = selectedAirport
      ? selectedAirport.terminals.map((terminal) => terminal.terminal)
      : [];
    setTerminalOptions(terminals);
    setFieldValue("terminalNumber", ""); // Reset terminal number when airport changes
  };

  const generateOptions = (items, valueKey = "value", labelKey = "label") =>
    items?.map((item) => ({ value: item[valueKey], label: item[labelKey] })) ||
    [];


  const handleMapSubmit = (pickup, dropoff) => {
    setSelectedPickup(pickup);
    setSelectedDropoff(dropoff);
  };

  const handlePrevious = (step, values) => {
    dispatch(setLoading(true));
    setFormValues(values);
    setSubTab(step);
    dispatch(setLoading(false));
  };


  return (
    <>
      <div>
        {!showPaymentMethod && (
          <Stepper
            steps={steps}
            subTab={subTab}
            className={
              "flex items-center w-full text-sm font-medium text-center py-4 border-b text-gray-500 sm:text-base justify-between"
            }
          />
        )}

        <div className="p-2 md:p-4">
          {showPaymentMethod ? (
            <PaymentMethod
              formValues={formValues}
              selectedPickup={selectedPickup}
              selectedDropoff={selectedDropoff}
              location={location}
              destination={destination}
              sharedRideValue={sharedRideValue}
              setSubTab={setSubTab}
              setShowSignUp={setShowSignUp}
              setShowAlreadyRegistered={setShowAlreadyRegistered}
              setShowOTPScreen={setShowOTPScreen}
              setHideCreateAccountButton={setHideCreateAccountButton}
              setShowPhone={setShowPhone}
              setHidePhoneCreateAccountButton={setHidePhoneCreateAccountButton}
              setShowPhoneOTPScreen={setShowPhoneOTPScreen}
              setShowPaymentMethod={setShowPaymentMethod}
              showPaybylinkQr={showPaybylinkQr}
              setShowPaybylinkQr={setShowPaybylinkQr}
              rideName="Airport Trip"
            />

          ) : showSignUp ? (
            <HomeEmailSignUp
              formValues={formValues}
              setSubTab={setSubTab}
              setShowSignUp={setShowSignUp}
              showAlreadyRegistered={showAlreadyRegistered}
              setShowAlreadyRegistered={setShowAlreadyRegistered}
              showOTPScreen={showOTPScreen}
              setShowOTPScreen={setShowOTPScreen}
              setHideCreateAccountButton={setHideCreateAccountButton}
              hideCreateAccountButton={hideCreateAccountButton}
              showPhone={showPhone}
              setShowPhone={setShowPhone}
              hidePhoneCreateAccountButton={hidePhoneCreateAccountButton}
              setHidePhoneCreateAccountButton={setHidePhoneCreateAccountButton}
              showPhoneOTPScreen={showPhoneOTPScreen}
              setShowPhoneOTPScreen={setShowPhoneOTPScreen}
              showPaymentMethod={showPaymentMethod}
              setShowPaymentMethod={setShowPaymentMethod}
              recaptchaRef={recaptchaRef}
              otp={otp}
              setOtp={setOtp}
              phoneOtp={phoneOtp}
              setPhoneOtp={setPhoneOtp}
              showPaybylinkQr={showPaybylinkQr}
              setShowPaybylinkQr={setShowPaybylinkQr}
            />
          ) : (
            <Formik
              initialValues={formValues}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={async (values, { setSubmitting }) => {
                if (!location || !destination) {
                  message.error(t("hero.errors.map_required"));
                } else {
                  dispatch(setLoading(true));

                  if (isLoggedIn) {
                    dispatch(setLoading(false));
                    setShowPaymentMethod(true)
                  } else {
                    dispatch(setLoading(false));
                    setSubTab(4)
                    setShowSignUp(true);
                  }
                }
                dispatch(setLoading(false))
                setSubmitting(false);
              }}
            >
              {({ values, setFieldValue, validateForm }) => {
                const isStep1Valid = [
                  "agentUser",
                  "rideType",
                  "arrivalCity",
                  "airportName",
                  "terminalNumber",
                ].every((field) => values[field]);
                const isStep2Valid = [
                  // "vehicleType",
                  // "seatNumber",
                  // formValues.sharedRide ? "seatNumber" : '',
                  "arrivalDate",
                  "arrivalTime",
                ].every((field) => values[field]);

                const handleNext = (step, isValid, values) => {
                  dispatch(setLoading(true));
                  validateForm().then(() => {
                    if (isValid) {
                      setSubTab(step);
                      setFormValues(values);
                    }
                    dispatch(setLoading(false));
                  });
                };

                return (
                  <Form className="mx-auto w-full">
                    {subTab === 1 && (
                      <>
                        <InputFieldFormik
                          label={t("user_text")}
                          name="agentUser"
                          type="select"
                          value={
                            formValues.agentUser || onChangeFormValues.agentUser
                          }
                          options={getUsers}
                          onChange={({ fieldName, selectedValue }) => {
                            setFieldValue(fieldName, selectedValue);
                            setFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                            setOnChangeFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                          }}
                          required
                        />

                        <InputFieldFormik
                          label={t("hero.ride_type_text")}
                          name="rideType"
                          type="select"
                          value={
                            formValues.rideType || onChangeFormValues.rideType
                          }
                          options={rideTypeOptions}
                          onChange={({ fieldName, selectedValue }) => {
                            setFieldValue(fieldName, selectedValue);
                            setFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                            setOnChangeFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                          }}
                          required
                        />
                        <InputFieldFormik
                          label={t("hero.arrival_city_text")}
                          name="arrivalCity"
                          type="select"
                          value={
                            formValues.arrivalCity ||
                            onChangeFormValues.arrivalCity
                          }
                          options={
                            cities &&
                            cities.data &&
                            cities.data.map((city) => ({
                              value: city,
                              label: city,
                            }))
                          }
                          onChange={({ fieldName, selectedValue }) => {
                            setFieldValue(fieldName, selectedValue);
                            setCityName(selectedValue);
                            setFieldValue("airportName", "");
                            setFieldValue("terminalNumber", "");
                            setTerminalOptions([]);
                            setFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                            setOnChangeFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                          }}
                          required
                        />
                        <InputFieldFormik
                          label={t("hero.airport_name_text")}
                          name="airportName"
                          type="select"
                          value={
                            formValues.airportName ||
                            onChangeFormValues.airportName
                          }
                          options={generateOptions(
                            airports.data,
                            "airport",
                            "airport"
                          )}
                          onChange={({ fieldName, selectedValue }) => {
                            setFieldValue(fieldName, selectedValue);
                            handleAirportChange(selectedValue, setFieldValue);
                            setFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                            setOnChangeFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                          }}
                          required
                        />
                        <InputFieldFormik
                          label={t("hero.terminal_number_text")}
                          name="terminalNumber"
                          type="select"
                          value={
                            formValues.terminalNumber ||
                            onChangeFormValues.terminalNumber
                          }
                          options={terminalOptions.map((terminal) => ({
                            value: terminal,
                            label: terminal,
                          }))}
                          onChange={({ fieldName, selectedValue }) => {
                            setFieldValue(fieldName, selectedValue);
                            setFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                            setOnChangeFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                          }}
                          required
                        />

                        <Button
                          className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-3"
                          onClick={() => { handleNext(2, isStep1Valid, values) }}
                          label={t("next_text")}
                          type="button"
                          disabled={!isStep1Valid}
                        />
                      </>
                    )}
                    {subTab === 2 && (
                      <>
                        <div>
                          <VehicleTypeModal
                            VehicleTypeWithService={VehicleTypeWithService}
                            vehicleTypeName={vehicleTypeName}
                            setVehicleTypeName={setVehicleTypeName}
                          />
                        </div>

                        <div className="border border-bg_light_gray p-2 mt-3">
                          <p className="text-lg text-text_grey font-bold">{t("hero.shared_ride_text")}!!</p>
                          <InputFieldFormik
                            label={t("hero.shared_ride_text")}
                            name="sharedRide"
                            type="checkbox"
                            percentageValue={sharedRideValue}
                            onChange={({ fieldName, selectedValue }) => {

                              setFieldValue(fieldName, selectedValue);
                              setFormValues((prevValues) => ({
                                ...prevValues,
                                [fieldName]: selectedValue,
                              }));
                              setOnChangeFormValues((prevValues) => ({
                                ...prevValues,
                                [fieldName]: selectedValue,
                              }));
                            }

                            }
                            required
                          />
                        </div>

                        {formValues.sharedRide && (
                          <InputFieldFormik
                            label={t("hero.seat_number_text")}
                            name="seatNumber"
                            type="select"
                            value={
                              formValues.seatNumber ||
                              onChangeFormValues.seatNumber
                            }
                            options={seatNumberOptions.map((seatNumber) => ({
                              value: seatNumber,
                              label: seatNumber,
                            }))}
                            onChange={({ fieldName, selectedValue }) => {
                              setFieldValue(fieldName, selectedValue);
                              setOnChangeFormValues((prevValues) => ({
                                ...prevValues,
                                [fieldName]: selectedValue,
                              }));
                            }}
                            required
                          />
                        )}

                        <InputFieldFormik
                          label={t("hero.arrival_date_text")}
                          name="arrivalDate"
                          type="arrivalDate"
                          value={values.arrivalDate || ""}
                          arrivalDates={arrivalDates}
                          setArrivalDates={setArrivalDates}
                          // onChange={({ fieldName, selectedValue }) => {
                          //   setFieldValue(fieldName, selectedValue);
                          //   setOnChangeFormValues((prevValues) => ({
                          //     ...prevValues,
                          //     [fieldName]: selectedValue,
                          //   }));
                          // }}
                          onChange={({ date, dateString }) => {
                            setOnChangeFormValues((prevValues) => ({
                              ...prevValues,
                              ['arrivalDate']: dateString,
                            }));
                            setFieldValue('arrivalDate', dateString);
                          }}
                          required
                        />
                        <InputFieldFormik
                          label={t("hero.arrival_time_text")}
                          name="arrivalTime"
                          type="arrivalTime"
                          value={values.arrivalTime || ""}
                          arrivalDates={arrivalDates}
                          onChange={({ fieldName, selectedValue }) => {
                            setFieldValue(fieldName, selectedValue);
                            setOnChangeFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                          }}
                          required
                        />
                        <div className="mt-3 flex flex-row justify-between items-center">
                          <Button
                            className="bg-bg_btn_back w-1/2 text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                            onClick={() => handlePrevious(1, values)}
                            label={t("previous_text")}
                            type="button"
                          />
                          <Button
                            className="bg-background_steel_blue w-1/2 text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                            onClick={() => {
                              // console.log('aaaa', values)
                              values.vehicleType = vehicleTypeName;
                              handleNext(3, isStep2Valid, values);
                            }}
                            label={t("next_text")}
                            type="button"
                            disabled={!isStep2Valid}
                          />
                        </div>
                      </>
                    )}
                    {subTab === 3 && (
                      <>
                        {/* <InputFieldFormik
                          label={t("hero.shared_ride_text")}
                          name="sharedRide"
                          type="checkbox"
                          percentageValue={sharedRideValue}
                          onChange={({ fieldName, selectedValue }) =>
                            setFieldValue(fieldName, selectedValue)
                          }
                          required
                        /> */}
                        <div className="my-4 flex flex-col md:flex-row justify-between items-start">
                          <div className="w-full md:w-1/2">
                            <Heading
                              title={t("hero.set_destination_text")}
                              className="text-xl text-text_black"
                            />
                          </div>
                          <div className="w-full md:w-1/2">
                            <MapModal
                              rideName="airportRide"
                              formValues={formValues}
                              onSubmitDestination={handleMapSubmit}
                              zoneCoords={map}
                              cityName={values.arrivalCity}
                              setLocation={setLocation}
                              setDestination={setDestination}
                            />
                          </div>
                        </div>
                        <div className="mt-3 flex flex-row justify-between items-center">
                          <Button
                            className="bg-bg_btn_back w-1/2 text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                            onClick={() => handlePrevious(2, values)}
                            label={t("previous_text")}
                            type="button"
                          />
                          <Button
                            className="bg-background_steel_blue w-1/2 text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
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
          )}
        </div>
      </div>
    </>
  );
}
