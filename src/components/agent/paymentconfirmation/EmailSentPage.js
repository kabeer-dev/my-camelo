import React, { useEffect } from "react";
import { Events, scrollSpy } from "react-scroll";
import Button from "../base/Button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../base/Header";
import Footer from "../base/Footer";
import { useTranslation } from "react-i18next";

export default function EmailSentPage() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();
  const paymentLink = location.state?.paymentLink;
  const language = useSelector((state) => state.auth.language);

  const [t, i18n] = useTranslation("global");

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/';
    }
  }, [isLoggedIn])

  useEffect(() => {
    Events.scrollEvent.register("begin", function (to, element) { });
    Events.scrollEvent.register("end", function (to, element) { });

    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);

  // const handlePaymentLinkClick = () => {
  //   window.open(paymentLink, '_blank'); // Opens link in a new tab
  //   // If you want to navigate after opening the link, use:
  //   // navigate(paymentLink);
  // };

  return (
    <>
      {isLoggedIn && (
        <div>
          <Header />

          <main className="mt-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Form Section */}
            <div className="container mx-auto p-4 text-center">
              <div className="grid grid-cols-1 gap-3">
                <div className="mx-auto">
                  <img
                    src="/assets/paymentconditions/paymentsuccess.png"
                    alt="payment success"
                  />
                </div>
              </div>

              <p className="text-background_steel_blue text-center mt-20 text-lg">{t("payment_link_long_text")}</p>
              <br />
              <NavLink to={paymentLink} className="text-background_steel_blue">
                {paymentLink}
              </NavLink>
              <div className="flex justify-center mt-5">
                <Button
                  className="bg-background_steel_blue text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 mb-20"
                  label={t("ok_text")}
                  type="button"
                  onClick={() => navigate('/agent')}
                />
              </div>
            </div>
          </main>

          <Footer />
        </div>
      )}
    </>

  );
}
