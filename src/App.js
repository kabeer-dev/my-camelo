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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
