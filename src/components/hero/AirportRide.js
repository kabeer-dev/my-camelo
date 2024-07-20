import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Stepper from "../base/Stepper";
import Button from "../base/Button";
import Heading from "../base/Heading";
import MapModal from "../base/MapModal";
import InputFieldFormik from "../base/InputFieldFormik";
import { fetchCitiesRequest } from "../../redux/actions/cityActions";
import { fetchAirportRequest } from "../../redux/actions/airportActions";
import { fetchVehicleTypesRequest } from "../../redux/actions/vehicleTypeAction";
import { getZoneRequest } from "../../redux/actions/zoneActions";
import HomeEmailSignUp from "./HomeEmailSignUp";
import VehicleTypeModal from "../base/VehicleTypeModal";
import { setLoading } from "../../redux/actions/loaderAction";
import PaymentMethod from "./PaymentMethod";
import axios from "axios";
import { message } from "antd";

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
    setPhoneOtp
  }) {
  const dispatch = useDispatch();
  const { cities } = useSelector((state) => state.cities);
  const { airports } = useSelector((state) => state.airports);
  const { vehicleTypes } = useSelector((state) => state.vehicleTypes);
  const services = "Airport Trip";
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const zoneMap = useSelector((state) => state?.zone?.zone);
  const [map, setMap] = useState(null);

  useEffect(() => {
    setMap(zoneMap && zoneMap.length > 0 ? zoneMap[0].map : null)
  }, [zoneMap]);

  const [location, setLocation] = useState("")
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState("");

  // const [subTab, setSubTab] = useState(1);
  const [cityName, setCityName] = useState();
  const [terminalOptions, setTerminalOptions] = useState([]);
  const [seatNumberOptions, setSeatNumberOptions] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);
  const [arrivalDates, setArrivalDates] = useState(null);
  const [formValues, setFormValues] = useState({
    rideType: "",
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
    rideType: "",
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
  const [sharedRideValue, setSharedRideValue] = useState("");
  useEffect(() => {
    const getSharedRideValue = async () => {
      dispatch(setLoading(true))
      if (formValues.vehicleType !== "") {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/method/airport_transport.api.bookings.get_ride_discount?vehicle_type=${formValues.vehicleType}&language=${'en'}`
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
  }, [formValues]);

  const [vehicleTypeName, setVehicleTypeName] = useState("");
  // console.log('vehicleTypes', vehicleTypes)
  useEffect(() => {
    if (vehicleTypeName !== "") {
      const selectedVehicle = vehicleTypes.data.find(
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

  const steps = useMemo(
    () => [
      { id: 1, text: "Ride Details" },
      { id: 2, text: "Vehicle Details" },
      { id: 3, text: "Additional Info" },
      { id: 4, text: "Account Info" },
    ],
    []
  );

  const validationSchema = Yup.object().shape({
    rideType: Yup.string().required("Ride type is required"),
    arrivalCity: Yup.string().required("Arrival City is required"),
    airportName: Yup.string().required("Airport Name is required"),
    terminalNumber: Yup.string().required("Terminal Number is required"),
    vehicleType: Yup.string().required("Vehicle Type is required"),
    seatNumber: Yup.string().required("Seat Number is required"),
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

  const rideTypeOptions = [
    { value: "pickup", label: "Pick Up" },
    { value: "dropoff", label: "Drop Off" },
  ];

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
            <PaymentMethod formValues={formValues} price={price}/>

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
            />
          ) : (
            <Formik
              initialValues={formValues}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={async (values, { setSubmitting }) => {
                // if (!isLoggedIn) {
                dispatch(setLoading(true));
                try {
                  const formattedDate = values.arrivalDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                  const data = {
                    location: formValues.rideType === 'pickup' ? location : `${values.airportName} ${values.terminalNumber} `,
                    destination: formValues.rideType === 'dropoff' ? destination : `${values.airportName} ${values.terminalNumber}`,
                    vehicle_type: values.vehicleType,
                    rider: values.seatNumber,
                    arrival_date: formattedDate,
                    arrival_time: values.arrivalTime,
                    shared_discount: sharedRideValue,
                    language: 'eng'
                  }

                  const response = await axios.post(`${API_BASE_URL}/api/method/airport_transport.api.integrations.maps.get_price`, data);
                  if (response && response.status === 200) {
                    // console.log(response.data.data)
                    setPrice(response.data.data.price)
                    dispatch(setLoading(false));
                    setSubTab(4)
                    setShowSignUp(true);
                  }
                }
                catch (error) {
                  if(error?.response?.data?.msg === 'The booking distance is very short, please modify the reservation locations'){
                    message.error(`${error?.response?.data?.msg}`);
                  }
                  console.error('Error:', error);
                  dispatch(setLoading(false));
                };

                // } else {
                //   // const submitValues = {
                //   //   ...values,
                //   //   pickupLocation: selectedPickup,
                //   //   dropoffLocation: selectedDropoff,
                //   // };
                //   // console.log("Submitted values:", submitValues);
                //   setShowPaymentMethod(true);
                // }
                setSubmitting(false);
              }}
            >
              {({ values, setFieldValue, validateForm }) => {
                const isStep1Valid = [
                  "rideType",
                  "arrivalCity",
                  "airportName",
                  "terminalNumber",
                ].every((field) => values[field]);
                const isStep2Valid = [
                  // "vehicleType",
                  "seatNumber",
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
                          label="Ride Type"
                          name="rideType"
                          type="select"
                          value={
                            formValues.rideType || onChangeFormValues.rideType
                          }
                          options={rideTypeOptions}
                          onChange={({ fieldName, selectedValue }) => {
                            setFieldValue(fieldName, selectedValue);
                            setOnChangeFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                          }}
                          required
                        />
                        <InputFieldFormik
                          label="Arrival City"
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
                            setOnChangeFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                          }}
                          required
                        />
                        <InputFieldFormik
                          label="Airport Name"
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
                            setOnChangeFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                          }}
                          required
                        />
                        <InputFieldFormik
                          label="Terminal Number"
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
                            setOnChangeFormValues((prevValues) => ({
                              ...prevValues,
                              [fieldName]: selectedValue,
                            }));
                          }}
                          required
                        />

                        <Button
                          className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-3"
                          onClick={() => handleNext(2, isStep1Valid, values)}
                          label="Next"
                          type="button"
                          disabled={!isStep1Valid}
                        />
                      </>
                    )}
                    {subTab === 2 && (
                      <>
                        <div>
                          <VehicleTypeModal
                            vehicleTypeName={vehicleTypeName}
                            setVehicleTypeName={setVehicleTypeName}
                          />
                        </div>

                        <InputFieldFormik
                          label="Seat Number"
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
                        <InputFieldFormik
                          label="Arrival Date"
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
                          label="Arrival Time"
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
                        <div className="mt-3 flex flex-col md:flex-row justify-between items-center">
                          <Button
                            className="bg-bg_btn_back w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                            onClick={() => handlePrevious(1, values)}
                            label="Previous"
                            type="button"
                          />
                          <Button
                            className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                            onClick={() => {
                              console.log('aaaa', values)
                              values.vehicleType = vehicleTypeName;
                              handleNext(3, isStep2Valid, values);
                            }}
                            label="Next"
                            type="button"
                            disabled={!isStep2Valid}
                          />
                        </div>
                      </>
                    )}
                    {subTab === 3 && (
                      <>
                        <InputFieldFormik
                          label="Shared Ride"
                          name="sharedRide"
                          type="checkbox"
                          percentageValue={sharedRideValue}
                          onChange={({ fieldName, selectedValue }) =>
                            setFieldValue(fieldName, selectedValue)
                          }
                          required
                        />
                        <div className="my-4 flex flex-col md:flex-row justify-between items-start">
                          <div className="w-full md:w-1/2">
                            <Heading
                              title="Set Your Destination"
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
                        <div className="mt-3 flex flex-col md:flex-row justify-between items-center">
                          <Button
                            className="bg-bg_btn_back w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                            onClick={() => handlePrevious(2, values)}
                            label="Previous"
                            type="button"
                          />
                          <Button
                            className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
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
          )}
        </div>
      </div>
    </>
  );
}
