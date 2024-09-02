import React, { useState, useEffect } from "react";
import { Events, scrollSpy } from "react-scroll";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import { setLoading } from "../../redux/actions/loaderAction";
import { useTranslation } from "react-i18next";
import Header from "../base/Header";
import Footer from "../base/Footer";

export default function RequestSubmit() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // const formValues = location.state?.formValues;
  const language = useSelector((state) => state.auth.language);
  const [t, i18n] = useTranslation("global");

  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;




  return (
    <>
      <div>
        <Header />

        <main className="mt-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="mx-auto">
                <img
                  src="./assets/paymentconditions/paymentsuccess.png"
                  alt="payment success"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="mx-auto">
                <p className="font-extrabold mt-6 font-roboto">
                Your request has been submitted and We will be contacted if your application meets the required criteria.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 mt-5">
              <div className="m-auto">
                <button
                  type="button"
                  onClick={() => navigate("/mashrouk-new-ui/")}
                  className="bg-background_steel_blue text-text_white hover:bg-gray-100 font-medium text-sm px-5 py-2.5 me-2 mb-2"
                >
                  {t("back_home_text")}
                </button>
              </div>
              
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
