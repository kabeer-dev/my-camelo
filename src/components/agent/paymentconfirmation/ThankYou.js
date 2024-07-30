import React, { useEffect } from "react";
import { Events, scrollSpy } from "react-scroll";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../../redux/actions/loaderAction";
import axios from "axios";
import Header from "../base/Header";
import Footer from "../base/Footer";
import Button from "../base/Button";
import { useNavigate } from "react-router-dom";

export default function ThankYou() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUrl = window.location.href;
  const urlObject = new URL(currentUrl);
  const searchParams = urlObject.searchParams;
  const id = searchParams.get("id");
  const checkoutId = searchParams.get("checkoutId");
  const extractedId = checkoutId.split(".")[0];
  const language = useSelector((state) => state.auth.language);

  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;
  useEffect(() => {
    dispatch(setLoading(true))
    if (checkoutId, extractedId) {
      const getPayByLinkBookingStatus = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/method/airport_transport.api.integrations.paybylink.get_payment_status?id=${id}&checkoutId=${checkoutId}`);
          if (response && response.status === 200) {
            console.log(response);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
      getPayByLinkBookingStatus();
    }
    dispatch(setLoading(false))

  }, [])

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
      <div>
        <Header />

        <main className="mt-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {/* Form Section */}
          <div className="container mx-auto p-4 mt-5">
            <div className="grid grid-cols-1 gap-3">
              <div className="mx-auto">
                <img
                  src="/assets/paymentconditions/paymentsuccess.png"
                  alt="payment success"
                />
              </div>
            </div>
            <p className="text-background_steel_blue text-center mt-5 text-lg">Your payment has been confirmed and your booking has been created.
              Thank You!</p>
            <div className="flex justify-center mt-5">
              <Button
                className="bg-background_steel_blue text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 mb-2 "
                label="OK"
                type="button"
                onClick={() => navigate('/agent')}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>

  );
}
