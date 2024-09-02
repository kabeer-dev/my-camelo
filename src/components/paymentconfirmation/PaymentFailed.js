import React, { useState, useEffect } from "react";
import { Events, scrollSpy } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "../base/Header";
import Footer from "../base/Footer";
import { useTranslation } from "react-i18next";

export default function PaymentFailed() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [t, i18n] = useTranslation("global");
  const language = useSelector((state) => state.auth.language);

  useEffect(() => {
    Events.scrollEvent.register("begin", function (to, element) { });
    Events.scrollEvent.register("end", function (to, element) { });

    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);


  return (
    <>
      {isLoggedIn && (

        <div>
          <Header />

          <main className="mt-20" dir={language === 'ar' ? 'rtl' : 'ltr' }>
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="mx-auto">
                  <img
                    src="/assets/paymentconditions/paymentfailed.png"
                    alt="payment failed"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="mx-auto">
                  <p className="font-extrabold mt-6 font-roboto">{t("payment_failed_text")}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="mx-auto">
                  <p className="mt-2 font-roboto text-text_lightdark_grey">
                    {t("payment_failed_long_text")}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-4 grid-cols-1 gap-3 mt-5">
                <div className="md:col-start-2">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    class="bg-white w-full text-black border border-black hover:bg-gray-100 font-medium text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    {t("back_home_text")}
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => navigate("/payment-confirmation")}
                    class="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    {t("try_again")}
                  </button>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      )}
    </>
  );
}
