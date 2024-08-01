import React from "react";
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


function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Loader />
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/create-new-account" element={<SignUp />} />
        <Route path="/otp" element={<OTPScreen />} />
        <Route path="/phone-signup" element={<PhoneSignUp />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/forget-password-otp" element={<ForgetOtpScreen />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {isLoggedIn && <Route path="/my-bookings" element={<MyBooking />} />}
        {isLoggedIn && <Route path="/my-profile" element={<MyProfile />} />}
        {/* <Route path="/payment-confirmation" element={<PaymentConfirmation />} /> */}
        <Route path="/payment-confirmation" element={<PaymentMethodForm />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/email-sent" element={<EmailSentPage />} />
        <Route path="/thank-you" element={<ThankYou />} />

        <Route path="/join-agent" element={<JoinAgent />} />
        <Route path="/request-submit" element={<RequestSubmit />} />
        <Route path="/request-failed" element={<RequestFailed />} />

        {/* Agent routes */}
        <Route path="/agent" element={<AgentLayout />} />
        <Route path="/agent/create-new-account" element={<AgentSignUp />} />
        <Route path="/agent/otp" element={<AgentOTPScreen />} />
        <Route path="/agent/phone-signup" element={<AgentPhoneSignUp />} />
        <Route path="/agent/user-registration" element={<AgentUserRegistration />} />
        {isLoggedIn && <Route path="/agent/my-bookings" element={<AgentMyBooking />} />}
        {/* {isLoggedIn && <Route path="/my-profile" element={<MyProfile />} />} */}
        {/* <Route path="/payment-confirmation" element={<PaymentConfirmation />} /> */}
        <Route path="/agent/payment-confirmation" element={<AgentPaymentMethodForm />} />
        <Route path="/agent/payment-success" element={<AgentPaymentSuccess />} />
        <Route path="/agent/payment-failed" element={<AgentPaymentFailed />} />
        <Route path="/agent/email-sent" element={<AgentEmailSentPage />} />
        <Route path="/agent/thank-you" element={<AgentThankYou />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
