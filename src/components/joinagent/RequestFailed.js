import React, { useState, useEffect } from "react";
import { Events, scrollSpy } from "react-scroll";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import { setLoading } from "../../redux/actions/loaderAction";
import { useTranslation } from "react-i18next";
import Header from "../base/Header";
import Footer from "../base/Footer";

export default function RequestFailed() {
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

          <main className="mt-20" dir={language === 'ar' ? 'rtl' : 'ltr' }>
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
                  Data sending failed, try again
                  </p>
                </div>
              </div>
              {/* <div className="grid grid-cols-1 gap-3">
                <div className="mx-auto">
                  <p className="mt-2 font-roboto text-text_lightdark_grey">
                    {t("thank_you_big_text")}
                  </p>
                </div>
              </div> */}
              <div className="grid grid-cols-4 gap-3 mt-5">
                <div className="col-start-2">
                  <button
                    type="button"
                    onClick={() => navigate("/mashrouk-new-ui/")}
                    className="bg-white w-full text-black border border-black hover:bg-gray-100 font-medium text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    {t("back_home_text")}
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => navigate("/mashrouk-new-ui/join-agent")}
                    className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    {t("try_again")}
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
