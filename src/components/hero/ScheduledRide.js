import React, { useEffect, useState } from "react";
import Stepper from "../base/Stepper";
import Button from "../base/Button";
import Heading from "../base/Heading";
import MapModal from "../base/MapModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchCitiesRequest } from "../../redux/actions/cityActions";
import { fetchVehicleTypesRequest } from "../../redux/actions/vehicleTypeAction";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputFieldFormik from "../base/InputFieldFormik";
import { getZoneRequest } from "../../redux/actions/zoneActions";
import HomeEmailSignUp from "./HomeEmailSignUp";
import { setLoading } from "../../redux/actions/loaderAction";
import VehicleTypeModal from "../base/VehicleTypeModal";
import PaymentMethod from "./PaymentMethod";
import axios from "axios";

export default function ScheduledRide({
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
  const { vehicleTypes } = useSelector((state) => state.vehicleTypes);
  const zoneMap = useSelector((state) => state?.zone?.zone);
  const [map, setMap] = useState(null);

  useEffect(() => {
    setMap(zoneMap && zoneMap.length > 0 ? zoneMap[0].map : null)
  }, [zoneMap])
  const services = "City Trip";
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [seatNumberOptions, setSeatNumberOptions] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);
  const [arrivalDates, setArrivalDates] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [formValues, setFormValues] = useState({
    arrivalCity: "",
    arrivalDate: "",
    arrivalTime: "",
    vehicleType: "",
    seatNumber: "",
    sharedRide: false,
  });
  const [onChangeFormValues, setOnChangeFormValues] = useState({
    arrivalCity: "",
    arrivalDate: "",
    arrivalTime: "",
    vehicleType: "",
    seatNumber: "",
    sharedRide: false,
  });

  const [vehicleTypeName, setVehicleTypeName] = useState("");

  const [location, setLocation] = useState("")
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState("");

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

  const handlePrevious = (step, values) => {
    dispatch(setLoading(true))
    setFormValues(values);
    setSubTab(step);
    dispatch(setLoading(false))
  };
  useEffect(() => {
    dispatch(fetchCitiesRequest());
    dispatch(fetchVehicleTypesRequest());
    dispatch(getZoneRequest(services, cityName));
  }, [dispatch, cityName]);

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

  const steps = [
    { id: 1, text: "Ride Details" },
    { id: 2, text: "Vehicle Details" },
    { id: 3, text: "Additional Info" },
    { id: 4, text: "Account Info" },
  ];

  // const [subTab, setSubTab] = useState(1);

  const validationSchema = Yup.object().shape({
    arrivalCity: Yup.string().required("Arrival City is required"),
    arrivalDate: Yup.string().required("Arrival Date is required"),
    arrivalTime: Yup.string().required("Arrival Time is required"),
    vehicleType: Yup.string().required("vehicle Type is required"),
    seatNumber: Yup.string().required("Seat Number is required"),
    sharedRide: Yup.bool(),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    dispatch(setLoading(true))
    console.log('gg', values)
    // if (!isLoggedIn) {
    try {
      const formattedDate = values.arrivalDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const data = {
        location: location,
        destination: destination,
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
      console.error('Error:', error);
      dispatch(setLoading(false));
    };

    // } else {
    //   setShowPaymentMethod(true)
    //   // console.log("Submitted values:", values); // Log form values
    //   // const submitValues = {
    //   //   // Add latlong data to the form values
    //   //   ...values,
    //   //   pickupLocation: selectedPickup,
    //   //   dropoffLocation: selectedDropoff,
    //   // };
    //   // console.log("Submitted values:", submitValues);
    // }
    setSubmitting(false);
    dispatch(setLoading(false))
  };

  const handleMapSubmit = (pickup, dropoff) => {
    setSelectedPickup(pickup);
    setSelectedDropoff(dropoff);
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

        <div>
          <div className="p-2 md:p-4">
            {showPaymentMethod ? (
              <PaymentMethod formValues={formValues} price={price}/>

            ) :
              showSignUp ? (
                <>
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
                </>
              ) : (
                <Formik
                  initialValues={formValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, errors, setFieldValue, validateForm }) => {
                    const isStep1Valid =
                      values.arrivalCity &&
                      values.arrivalDate &&
                      values.arrivalTime;
                    const isStep2Valid =
                      // values.vehicleType &&
                      values.seatNumber &&
                      values.arrivalDate &&
                      values.arrivalTime;

                    return (
                      <Form className="mx-auto w-full">
                        {subTab === 1 && (
                          <>
                            <div>
                              <InputFieldFormik
                                label="Arrival City"
                                name="arrivalCity"
                                type="select"
                                options={
                                  cities &&
                                  cities.data &&
                                  cities.data.map((city) => ({
                                    value: city,
                                    label: city,
                                  }))
                                }
                                value={
                                  formValues.arrivalCity ||
                                  onChangeFormValues.arrivalCity
                                }
                                onChange={(valueObj) => {
                                  const { fieldName, selectedValue } = valueObj;
                                  setFieldValue(fieldName, selectedValue);
                                  setCityName(selectedValue);
                                  setOnChangeFormValues((prevValues) => ({
                                    ...prevValues,
                                    [fieldName]: selectedValue,
                                  }));
                                }}
                                required
                              />
                            </div>

                            <div>
                              <InputFieldFormik
                                label="Arrival Date"
                                name="arrivalDate"
                                type="arrivalDate"
                                value={values.arrivalDate || ''}
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
                            </div>

                            <div>
                              <InputFieldFormik
                                label="Arrival Time"
                                name="arrivalTime"
                                type="arrivalTime"
                                value={values.arrivalTime || ''}
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
                            </div>

                            <div className="w-full mt-3">
                              <Button
                                className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                                onClick={() => {
                                  dispatch(setLoading(true))
                                  validateForm().then(() => {
                                    if (isStep1Valid) {
                                      setSubTab(2);
                                      setFormValues(values);
                                    }
                                  });
                                  dispatch(setLoading(false))
                                }}
                                label="Next"
                                type="button"
                                disabled={!isStep1Valid}
                              />
                            </div>
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

                            <div>
                              <InputFieldFormik
                                label="Seat Number"
                                name="seatNumber"
                                type="select"
                                options={seatNumberOptions.map((number) => ({
                                  value: number,
                                  label: number,
                                }))}
                                value={
                                  formValues.seatNumber ||
                                  onChangeFormValues.seatNumber
                                }
                                onChange={(valueObj) => {
                                  const { fieldName, selectedValue } = valueObj;
                                  setFieldValue(fieldName, selectedValue);
                                  setOnChangeFormValues((prevValues) => ({
                                    ...prevValues,
                                    [fieldName]: selectedValue,
                                  }));
                                }}
                                required
                              />
                            </div>

                            <div className="mt-3 flex flex-col md:flex-row justify-between items-center">
                              <div className="w-full md:w-1/2 mx-0 md:mx-1">
                                <Button
                                  className="bg-bg_btn_back w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                  onClick={() => handlePrevious(1, values)}
                                  label="Previous"
                                  disabled={false}
                                  type="button"
                                />
                              </div>
                              <div className="w-full md:w-1/2 mx-0 md:mx-1">
                                <Button
                                  className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                  onClick={() => {
                                    dispatch(setLoading(true))
                                    values.vehicleType = vehicleTypeName;
                                    validateForm().then(() => {
                                      if (isStep2Valid) {
                                        setSubTab(3);
                                        setFormValues(values);
                                      }
                                    });
                                    dispatch(setLoading(false))
                                  }}
                                  label="Next"
                                  type="button"
                                  disabled={!isStep2Valid}
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {subTab === 3 && (
                          <>
                            <div className="border-b border-gray-300">
                              <InputFieldFormik
                                label="Shared Ride"
                                name="sharedRide"
                                type="checkbox"
                                percentageValue={sharedRideValue}
                                onChange={(valueObj) => {
                                  // Destructure fieldName and selectedValue from the object
                                  const { fieldName, selectedValue } = valueObj;
                                  // Handle the selected value accordingly
                                  setFieldValue(fieldName, selectedValue);
                                }}
                                required
                              />
                            </div>

                            <div className="my-4 flex flex-col md:flex-row justify-between items-start">
                              <div className="w-full md:w-1/2 mx-0 md:mx-1">
                                <Heading
                                  title={"Set Your Destination"}
                                  className={"text-xl text-text_black"}
                                />
                              </div>
                              <div className="w-full md:w-1/2 mx-0 md:mx-1">
                                <MapModal
                                  rideName="scheduledRide"
                                  rideType={formValues.rideType}
                                  onSubmitDestination={handleMapSubmit}
                                  zoneCoords={map}
                                  cityName={values.arrivalCity}
                                  setLocation={setLocation}
                                  setDestination={setDestination}
                                />
                              </div>
                            </div>

                            <div className="mt-3 flex flex-col md:flex-row justify-between items-center">
                              <div className="w-full md:w-1/2 mx-0 md:mx-1">
                                <Button
                                  className="bg-bg_btn_back w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                  onClick={() => handlePrevious(2, values)}
                                  label="Previous"
                                  type="button"
                                />
                              </div>
                              <div className="w-full md:w-1/2 mx-0 md:mx-1">
                                <Button
                                  className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                  label="Submit"
                                  type="submit"
                                />
                              </div>
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
      </div>
    </>
  );
}
