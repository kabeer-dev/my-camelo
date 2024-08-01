import React, { useEffect, useMemo, useState } from "react";
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
import { message } from "antd";
import { useTranslation } from "react-i18next";

export default function RideByHour({
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
  // const { vehicleTypes } = useSelector((state) => state.vehicleTypes);
  const zoneMap = useSelector((state) => state?.zone?.zone);
  const [map, setMap] = useState(null);

  const language = useSelector((state) => state.auth.language);

  useEffect(() => {
    setMap(zoneMap && zoneMap.length > 0 ? zoneMap[0].map : null)
  }, [zoneMap])
  const services = "Book Vehicle In Hours";
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [t, i18n] = useTranslation("global");

  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);
  const [arrivalDates, setArrivalDates] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [formValues, setFormValues] = useState({
    bookingByHours: "",
    arrivalCity: "",
    arrivalDate: "",
    arrivalTime: "",
    vehicleType: "",
  });
  const [onChangeFormValues, setOnChangeFormValues] = useState({
    bookingByHours: "",
    arrivalCity: "",
    arrivalDate: "",
    arrivalTime: "",
    vehicleType: "",
  });

  const [vehicleTypeName, setVehicleTypeName] = useState("");

  const [location, setLocation] = useState("")
  const [destination, setDestination] = useState("")

  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

  const [VehicleTypeWithService, setVehicleTypeWithService] = useState(null);
  useEffect(() => {
    dispatch(setLoading(true));
    const getVechileTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/method/airport_transport.api.bookings.get_vehicle_types?language=${language ? language : 'eng'}&service=Book Vehicle In Hours`);
        if (response && response.status === 200) {
          // console.log('hhh', response.data)
          setVehicleTypeWithService(response.data)
        }
      } catch (error) {
        console.log('Error', error)
      }
    }
    getVechileTypes();
    dispatch(setLoading(false));

  }, []);

  useEffect(() => {
    if (vehicleTypeName !== "") {
      // const selectedVehicle = vehicleTypes.data.find(
      //   (vehicle) => vehicle.name === vehicleTypeName
      // );
      // setSeatNumberOptions(
      //   selectedVehicle
      //     ? Array.from({ length: selectedVehicle.seats }, (_, i) => `${i + 1}`)
      //     : []
      // );
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
    const expectedCityName = cityName ? cityName : 'Dammam';
    dispatch(getZoneRequest(services, expectedCityName));
  }, [dispatch, cityName]);

  useEffect(() => {
    if (cities.data?.length > 0 && !cityName) {
      setFormValues((prevValues) => ({
        ...prevValues,
        "arrivalCity": cities.data[0],
      }));
      setOnChangeFormValues((prevValues) => ({
        ...prevValues,
        "arrivalCity": cities.data[0],
      }));
      setCityName(cities.data[0])
    }
  }, [cities])

  // const steps = [
  //   { id: 1, text: t("hero.stepper_steps.ride_detail_text") },
  //   { id: 2, text: t("hero.stepper_steps.additional_info_text") },
  //   { id: 3, text: t("hero.stepper_steps.account_info_text") },
  // ];

  const steps = useMemo(() => {
    const baseSteps = [
      { id: 1, text: t("hero.stepper_steps.ride_detail_text") },
      { id: 2, text: t("hero.stepper_steps.additional_info_text") },
    ];

    if (!isLoggedIn) {
      baseSteps.push({ id: 4, text: t("hero.stepper_steps.account_info_text") });
    }

    return baseSteps;
  }, [isLoggedIn, t]);

  const validationSchema = Yup.object().shape({
    bookingByHours: Yup.string().required(
      "Booking Vehicle By Hours is required"
    ),
    arrivalCity: Yup.string().required("Arrival City is required"),
    arrivalDate: Yup.string().required("Arrival Date is required"),
    arrivalTime: Yup.string().required("Arrival Time is required"),
    // vehicleType: Yup.string().required("vehicle Type is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    if (!location) {
      message.error(t("hero.errors.map_required"));
    }
    if (vehicleTypeName !== '') {
      values.vehicleType = vehicleTypeName;
      dispatch(setLoading(true))

      if (isLoggedIn) {
        dispatch(setLoading(false));
        setShowPaymentMethod(true)
      } else {
        dispatch(setLoading(false));
        setSubTab(4)
        setShowSignUp(true);
      }

      setSubmitting(false);
      dispatch(setLoading(false))
    }
  };

  const byHoursOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ];

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
              <PaymentMethod
                formValues={formValues}
                selectedPickup={selectedPickup}
                selectedDropoff={selectedDropoff}
                location={location}
                destination={destination}
                sharedRideValue={0}
                setSubTab={setSubTab}
                setShowSignUp={setShowSignUp}
                setShowAlreadyRegistered={setShowAlreadyRegistered}
                setShowOTPScreen={setShowOTPScreen}
                setHideCreateAccountButton={setHideCreateAccountButton}
                setShowPhone={setShowPhone}
                setHidePhoneCreateAccountButton={setHidePhoneCreateAccountButton}
                setShowPhoneOTPScreen={setShowPhoneOTPScreen}
                setShowPaymentMethod={setShowPaymentMethod}
                rideName="Book Vehicle In Hours"
              />

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

                <>
                  {" "}
                  <Formik
                    initialValues={formValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    {({ values, errors, setFieldValue, validateForm }) => {
                      const isStep1Valid =
                        values.bookingByHours &&
                        // values.arrivalCity &&
                        values.arrivalDate &&
                        values.arrivalTime;
                      // const isStep2Valid = values.vehicleType;

                      return (
                        <Form className="mx-auto w-full">
                          {subTab === 1 && (
                            <>
                              <div>
                                <InputFieldFormik
                                  label={t("hero.booking_by_hours")}
                                  name="bookingByHours"
                                  type="select"
                                  options={byHoursOptions}
                                  value={
                                    formValues.bookingByHours ||
                                    onChangeFormValues.bookingByHours
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

                              <div>
                                <InputFieldFormik
                                  label={t("hero.arrival_city_text")}
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
                              </div>

                              <div >
                                <InputFieldFormik
                                  label={t("hero.arrival_date_text")}
                                  name="arrivalDate"
                                  type="arrivalDate"
                                  value={values.arrivalDate}
                                  arrivalDates={arrivalDates}
                                  setArrivalDates={setArrivalDates}
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
                                  label={t("hero.arrival_time_text")}
                                  name="arrivalTime"
                                  type="arrivalTime"
                                  value={values.arrivalTime || ''}

                                  arrivalDates={arrivalDates}
                                  onChange={({ fieldName, selectedValue }) => {
                                    setOnChangeFormValues((prevValues) => ({
                                      ...prevValues,
                                      [fieldName]: selectedValue,
                                    }));
                                    setFieldValue(fieldName, selectedValue);
                                  }}
                                  required
                                />
                              </div>

                              <div className="w-full mt-3">
                                <Button
                                  className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                  onClick={() => {
                                    values.arrivalCity = formValues.arrivalCity
                                    validateForm().then(() => {
                                      if (isStep1Valid) {
                                        setSubTab(2);
                                        setFormValues(values);
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

                          {subTab === 2 && (
                            <>
                              {/* <div>
                             <VehicleTypeModal />
                           </div> */}
                              {/* <div className="pb-4 border-b border-gray-300">
                             <InputFieldFormik
                               label="Vehicle type"
                               name="vehicleType"
                               type="select"
                               options={
                                 vehicleTypes &&
                                 vehicleTypes.data &&
                                 vehicleTypes.data.map((vehicle) => ({
                                   value: vehicle.name,
                                   label: vehicle.name,
                                 }))
                               }
                               value={
                                 formValues.vehicleType ||
                                 onChangeFormValues.vehicleType
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
                           </div> */}
                              <div>
                                <VehicleTypeModal
                                  VehicleTypeWithService={VehicleTypeWithService}
                                  vehicleTypeName={vehicleTypeName}
                                  setVehicleTypeName={setVehicleTypeName}
                                />
                              </div>

                              <div className="my-4 flex flex-col md:flex-row justify-between items-start">
                                <div className="w-full md:w-1/2 mx-0 md:mx-1">
                                  <Heading
                                    title={t("hero.set_destination_text")}
                                    className={"text-xl text-text_black"}
                                  />
                                </div>
                                <div className="w-full md:w-1/2 mx-0 md:mx-1">
                                  <MapModal
                                    rideName="rideByHour"
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
                                <div className="w-full md:w-1/2 mx-0 md:mx-1">
                                  <Button
                                    className="bg-bg_btn_back w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                    onClick={() => handlePrevious(1, values)}
                                    label={t("previous_text")}
                                    type="button"
                                  />
                                </div>
                                <div className="w-full md:w-1/2 mx-0 md:mx-1">
                                  <Button
                                    className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                                    label={t("submit_text")}
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
                </>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
