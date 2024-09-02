import React from "react";
import Button from "../base/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function PayByLinkQr({
  showPaybylinkQr,
  qrCode,
  payByLinkPaymentLink,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [t, i18n] = useTranslation("global");

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const email = useSelector((state) => state.auth.email);
  const base64Data = qrCode.replace("PNG,", "");

  const handleRedirect = () => {
    window.location.href = payByLinkPaymentLink; // Replace with the actual URL you want to redirect to
  };

  return (
    <>
      {showPaybylinkQr && (
        <>
          <div>
            <div className="flex justify-center">
              <Button
                className="mt-3 bg-background_steel_blue text-text_white hover:bg-gray-100 font-medium text-lg px-10 py-2.5 me-2 mb-2"
                label={t("hero.pay_link_text")}
                onClick={() => handleRedirect()}
              />
            </div>

            <div className="flex justify-center">
              <img
                src={`data:image/png;base64,${base64Data}`}
                alt="QR Code"
                style={{ color: "red" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div>
                <button
                  type="button"
                  onClick={() => (window.location.href = "/mashrouk-new-ui/")}
                  className="bg-white w-full text-black border border-black hover:bg-gray-100 font-medium text-sm px-5 py-3 me-2 mb-2"
                >
                  {t("back_home_text")}
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => navigate("/mashrouk-new-ui/my-bookings")}
                  className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium text-sm px-5 py-3 me-2 mb-2"
                >
                  {t("header.user_dropdown.my_booking")}
                </button>
              </div>
            </div>

            <div>
              <p className="text-text-black text-center mt-2">
                Payment link has been sent to{" "}
                <span className="text-text_steel_blue">{email}</span> You can
                pay by scanning the QR code
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
