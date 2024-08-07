import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import AirportRide from "./AirportRide";
import ScheduledRide from "./ScheduledRide";
import RideByHour from "./RideByHour";
import Heading from "../base/Heading";
import Paragraph from "../base/Paragraph";
import { setLoading } from "../../../redux/actions/loaderAction";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchServicesListRequest } from "../../../redux/actions/servicesListActions";

export default function HeroSection() {
  const dispatch = useDispatch();
  const location = useLocation();
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { servicesList } = useSelector((state) => state.servicesList);
  const language = useSelector((state) => state.auth.language);
  const [t, i18n] = useTranslation("global");

  const [activeTab, setActiveTab] = useState('');
  const [subTab, setSubTab] = useState(1);

  const [showSignUp, setShowSignUp] = useState(false);
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [hideCreateAccountButton, setHideCreateAccountButton] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [hidePhoneCreateAccountButton, setHidePhoneCreateAccountButton] = useState(false);
  const [showPhoneOTPScreen, setShowPhoneOTPScreen] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const recaptchaRef = React.createRef();
  const [otp, setOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  useEffect(() => {
    dispatch(fetchServicesListRequest());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setLoading(true))
    if (servicesList && servicesList.data?.length > 0) {
      setActiveTab(servicesList.data[0].id)
    }
    dispatch(setLoading(false))
  }, [servicesList])

  useEffect(() => {
    if (location.state?.showPaymentMethod) {
      setShowPaymentMethod(true);
    }
  }, [location.state]);

  useEffect(() => {
    const showPaymentMethod = localStorage.getItem('showPaymentMethod');
    if (showPaymentMethod) {
      localStorage.removeItem('showPaymentMethod'); // Remove it after reading
    }
  }, []);

  const handleTabChange = (tabName) => {
    dispatch(setLoading(true))
    if (tabName !== activeTab) {
      setActiveTab(tabName);
      setShowSignUp(false)
      setShowAlreadyRegistered(false)
      setShowOTPScreen(false)
      setHideCreateAccountButton(false)
      setShowPhone(false)
      setHideCreateAccountButton(false)
      setOtp("")
      setShowPhoneOTPScreen(false)
      setHidePhoneCreateAccountButton(false)
      setPhoneOtp("")
      setShowPaymentMethod(false)
      setSubTab(1)
    }
    if (tabName === "Airport Trip" || tabName === "City Trip") {
      if (subTab === 4 && showSignUp && !showAlreadyRegistered && !showOTPScreen && !showPhone && !showPhoneOTPScreen && !showPaymentMethod) {
        setSubTab(1)
        setShowSignUp(false)
      } else if (subTab === 4 && showSignUp && showAlreadyRegistered && !showOTPScreen && !showPhone && !showPhoneOTPScreen && !showPaymentMethod) {
        setShowAlreadyRegistered(false)
      } else if (subTab === 4 && showSignUp && !showAlreadyRegistered && showOTPScreen && !showPhone && !showPhoneOTPScreen && !showPaymentMethod) {
        setShowOTPScreen(false)
        setHideCreateAccountButton(false)
        recaptchaRef.current.reset();
      } else if (subTab === 4 && showSignUp && showOTPScreen && showPhone && !showPhoneOTPScreen && !showPaymentMethod) {
        setShowPhone(false)
        setHideCreateAccountButton(false)
        setOtp("")
        setShowOTPScreen(false)
      } else if (subTab === 4 && showSignUp && showOTPScreen && showPhone && showPhoneOTPScreen && !showPaymentMethod) {
        setShowPhoneOTPScreen(false)
        setHidePhoneCreateAccountButton(false)
        setOtp("")
        setPhoneOtp("")
      }
    } else {
      if (subTab === 3 && showSignUp && !showAlreadyRegistered && !showOTPScreen && !showPhone && !showPhoneOTPScreen && !showPaymentMethod) {
        setSubTab(1)
        setShowSignUp(false)
      } else if (subTab === 3 && showSignUp && showAlreadyRegistered && !showOTPScreen && !showPhone && !showPhoneOTPScreen && !showPaymentMethod) {
        setShowAlreadyRegistered(false)
      } else if (subTab === 3 && showSignUp && !showAlreadyRegistered && showOTPScreen && !showPhone && !showPhoneOTPScreen && !showPaymentMethod) {
        setShowOTPScreen(false)
        setHideCreateAccountButton(false)
        recaptchaRef.current.reset();
      } else if (subTab === 3 && showSignUp && showOTPScreen && showPhone && !showPhoneOTPScreen && !showPaymentMethod) {
        setShowPhone(false)
        setHideCreateAccountButton(false)
        setOtp("")
        setShowOTPScreen(false)
      } else if (subTab === 3 && showSignUp && showOTPScreen && showPhone && showPhoneOTPScreen && !showPaymentMethod) {
        setShowPhoneOTPScreen(false)
        setHidePhoneCreateAccountButton(false)
        setOtp("")
        setPhoneOtp("")
      }
    }
    dispatch(setLoading(false))
  };

  return (
    <>
      <div
        className={`${activeTab === "Airport Trip"
          ? "bg-airport_ride_bg"
          : activeTab === "City Trip"
            ? "bg-scheduled_ride_bg"
            : "bg-by_hour_bg"
          } transition-all duration-300 mx-auto h-auto bg-cover bg-fixed bg-start bg-no-repeat`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="py-5 md:py-10 px-10 md:px-20 flex flex-col md:flex-col lg:flex-row justify-between items-center">
          <div className="md:w-[592px]">
            <div className="my-4">
              {servicesList.data && servicesList.data.map((service) => (
                <>
                  {activeTab === service.id && (
                    <>
                      <div>
                        <Heading
                          title={service.service_name}
                          className="text-2xl md:text-5xl lg:text-5xl text-text_white"
                        />
                      </div>
                      <div className="my-4 w-11/12">
                        <Paragraph
                          title={service.service_desc}
                          className="text-normal md:text-lg  lg:text-lg  text-text_white"
                        />
                      </div>
                    </>

                  )}
                </>
              ))}
            </div>
          </div>

          <div className="md:w-[592px]">
            {/* tabs code is here */}
            <div className="bg-background_white py-2 px-4 flex flex-row justify-between items-center rounded transition-all duration-300">
              {servicesList.data && servicesList.data.map((service) => (
                <>
                  <div
                    className={`py-1 px-5 md:py-2 md:px-10 flex flex-col items-center cursor-pointer rounded transition-all duration-300 ${activeTab === service.id
                      ? "bg-background_steel_blue text-text_white"
                      : ""
                      }`}
                    onClick={() => handleTabChange(service.id)}
                  >
                    <div className="py-1">
                      <img src={service.icon} alt={service.id} />
                      {/* <Icon icon="icons8:airport" width="28px" height="28px" /> */}
                    </div>
                    <div className="py-1 text-sm md:text-normal text-center">
                      {service.service_name}
                    </div>
                  </div>
                </>
              ))}

            </div>
            {/* tabs code is here */}

            {/* content is here */}
            <div className="mt-1 bg-background_white p-2 md:p-6 flex flex-row justify-between items-center rounded transition-all duration-300">
              {activeTab === "Airport Trip" && (
                <div className="w-full transition-all duration-300">
                  <AirportRide
                    subTab={subTab}
                    setSubTab={setSubTab}
                    showSignUp={showSignUp}
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
                </div>
              )}
              {activeTab === "City Trip" && (
                <div className="w-full transition-all duration-300">
                  <ScheduledRide
                    subTab={subTab}
                    setSubTab={setSubTab}
                    showSignUp={showSignUp}
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
                </div>
              )}
              {activeTab === "Book Vehicle In Hours" && (
                <div className="w-full transition-all duration-300">
                  <RideByHour
                    subTab={subTab}
                    setSubTab={setSubTab}
                    showSignUp={showSignUp}
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
                </div>
              )}
            </div>
            {/* content is here */}
          </div>
        </div>
      </div>
    </>
  );
}
