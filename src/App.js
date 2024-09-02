import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./Layout";
import SignIn from "./components/signin/SignIn";
import SignUp from "./components/signup/SignUp";
import UserRegistration from "./components/userregistration/UserRegistration";
import OTPScreen from "./components/otp/OTPScreen";
import ForgetPassword from "./components/forgetpassword/ForgetPassword";
import ForgetOtpScreen from "./components/forgetotp/ForgetOtpScreen";
import ResetPassword from "./components/resetpassword/ResetPassword";
import Loader from "./components/loader/Loader";
import MyBooking from "./components/mybooking/MyBooking";
import MyProfile from "./components/myprofile/MyProfile";
import { useSelector } from "react-redux";
import PaymentSuccess from "./components/paymentconfirmation/PaymentSuccess";
import PaymentFailed from "./components/paymentconfirmation/PaymentFailed";
import CheckPaymentStatus from "./components/paymentconfirmation/CheckPaymentStatus";
// import PaymentConfirmation from "./components/paymentconfirmation/PaymentConfirmation";
import PhoneSignUp from "./components/signup/PhoneSignUp";
import PaymentMethodForm from "./components/paymentconfirmation/PaymentMethodForm";
import EmailSentPage from "./components/paymentconfirmation/EmailSentPage";
import ThankYou from "./components/paymentconfirmation/ThankYou";
//join agent
import JoinAgent from "./components/joinagent/JoinAgent";
import RequestSubmit from "./components/joinagent/RequestSubmit";
import RequestFailed from "./components/joinagent/RequestFailed";

//agents
import AgentLayout from "./AgentLayout";
import AgentSignUp from "./components/agent/signup/SignUp";
import AgentPhoneSignUp from "./components/agent/signup/PhoneSignUp";
import AgentUserRegistration from "./components/agent/userregistration/UserRegistration";
import AgentOTPScreen from "./components/agent/otp/OTPScreen";
import AgentMyBooking from "./components/agent/mybooking/MyBooking";
import AgentMyProfile from "./components/agent/myprofile/MyProfile";
import AgentPaymentMethodForm from "./components/agent/paymentconfirmation/PaymentMethodForm";
import AgentPaymentSuccess from "./components/agent/paymentconfirmation/PaymentSuccess";
import AgentPaymentFailed from "./components/agent/paymentconfirmation/PaymentFailed";
import AgentEmailSentPage from "./components/agent/paymentconfirmation/EmailSentPage";
import AgentThankYou from "./components/agent/paymentconfirmation/ThankYou";
import AgentCheckPaymentStatus from "./components/agent/paymentconfirmation/CheckPaymentStatus";

import NotFound from "./NotFound";
import UnderMaintenance from "./UnderMaintenance";
import TemporarilyUnavailable from "./TemporarilyUnavailable";
import Terms from "./Terms";

import TagManager from 'react-gtm-module';


function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize Google Tag Manager
    const tagManagerArgs = {
      gtmId: 'GTM-KZ2N2DTR'
    };
    TagManager.initialize(tagManagerArgs);
  }, []);

  return (
    <BrowserRouter>
      <Loader />
      <Routes>
        <Route path="/mashrouk-new-ui/" element={<Layout />} />
        <Route path="/mashrouk-new-ui/sign-in" element={<SignIn />} />
        <Route path="/mashrouk-new-ui/create-new-account" element={<SignUp />} />
        <Route path="/mashrouk-new-ui/otp" element={<OTPScreen />} />
        <Route path="/mashrouk-new-ui/phone-signup" element={<PhoneSignUp />} />
        <Route path="/mashrouk-new-ui/user-registration" element={<UserRegistration />} />
        <Route path="/mashrouk-new-ui/forget-password" element={<ForgetPassword />} />
        <Route path="/mashrouk-new-ui/forget-password-otp" element={<ForgetOtpScreen />} />
        <Route path="/mashrouk-new-ui/reset-password" element={<ResetPassword />} />
        {isLoggedIn && <Route path="/mashrouk-new-ui/my-bookings" element={<MyBooking />} />}
        {isLoggedIn && <Route path="/mashrouk-new-ui/my-profile" element={<MyProfile />} />}
        {/* <Route path="/mashrouk-new-ui/payment-confirmation" element={<PaymentConfirmation />} /> */}
        <Route path="/mashrouk-new-ui/payment-confirmation" element={<PaymentMethodForm />} />
        <Route path="/mashrouk-new-ui/payment-success" element={<PaymentSuccess />} />
        <Route path="/mashrouk-new-ui/payment-failed" element={<PaymentFailed />} />
        <Route path="/mashrouk-new-ui/payment-status" element={<CheckPaymentStatus />} />
        <Route path="/mashrouk-new-ui/email-sent" element={<EmailSentPage />} />
        <Route path="/mashrouk-new-ui/thank-you" element={<ThankYou />} />

        <Route path="/mashrouk-new-ui/join-agent" element={<JoinAgent />} />
        <Route path="/mashrouk-new-ui/request-submit" element={<RequestSubmit />} />
        <Route path="/mashrouk-new-ui/request-failed" element={<RequestFailed />} />

        {/* Agent routes */}
        <Route path="/mashrouk-new-ui/agent" element={<AgentLayout />} />
        <Route path="/mashrouk-new-ui/agent/create-new-account" element={<AgentSignUp />} />
        <Route path="/mashrouk-new-ui/agent/otp" element={<AgentOTPScreen />} />
        <Route path="/mashrouk-new-ui/agent/phone-signup" element={<AgentPhoneSignUp />} />
        <Route path="/mashrouk-new-ui/agent/user-registration" element={<AgentUserRegistration />} />
        {isLoggedIn && <Route path="/mashrouk-new-ui/agent/my-bookings" element={<AgentMyBooking />} />}
        {/* {isLoggedIn && <Route path="/mashrouk-new-ui/my-profile" element={<MyProfile />} />} */}
        {/* <Route path="/mashrouk-new-ui/payment-confirmation" element={<PaymentConfirmation />} /> */}
        <Route path="/mashrouk-new-ui/agent/payment-confirmation" element={<AgentPaymentMethodForm />} />
        <Route path="/mashrouk-new-ui/agent/payment-success" element={<AgentPaymentSuccess />} />
        <Route path="/mashrouk-new-ui/agent/payment-failed" element={<AgentPaymentFailed />} />
        <Route path="/mashrouk-new-ui/agent/payment-status" element={<AgentCheckPaymentStatus />} />
        <Route path="/mashrouk-new-ui/agent/email-sent" element={<AgentEmailSentPage />} />
        <Route path="/mashrouk-new-ui/agent/thank-you" element={<AgentThankYou />} />
        <Route path="/mashrouk-new-ui/agent/terms-condition" element={<Terms />} />

        <Route path="/mashrouk-new-ui/*" element={<NotFound />} />
        <Route path="/mashrouk-new-ui/under-maintenance" element={<UnderMaintenance />} />
        <Route path="/mashrouk-new-ui/temporarily-unavailable" element={<TemporarilyUnavailable />} />
        <Route path="/mashrouk-new-ui/terms-condition" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
