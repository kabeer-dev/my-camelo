import React from "react";
import Button from "./Button";
import { useTranslation } from "react-i18next";

export default function BookingCard({ booking }) {
  const [t, i18n] = useTranslation("global");

  return (
    <div className="mt-5">
      <div className="bg-text_white rounded-md px-5 py-7 flex flex-col justify-center items-center mb-4">
        <div className="my-1">
          <img
            src={`/assets/mybooking/${booking.status === 'Non-Payment Cancellation' ? 'Cancelled': (booking.status === 'Booked' ? 'Completed' : 'Booked')}.png`}
            alt="ride-completed"
            className="w-20 h-20"
          />
        </div>
        <div className="text-text_black font-semibold text-lg border-dashed border-b w-full text-center my-3 pb-4">
          {booking.status === "Non-Payment Cancellation" ? t("my_booking.cancelled_text") : (booking.status === 'Booked' ? t("my_booking.booked_text"): t("pending_text"))}
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1">
          <div className="text-text_lightdark_grey font-light">{t("my_booking.booking_id_text")}</div>
          <div className="text-text_black font-semibold">
            {/* {booking.bookingId} */}
            {booking.name}
          </div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1">
          <div className="text-text_lightdark_grey font-light">{t("my_booking.ride_type_text")}</div>
          <div className="text-text_black font-semibold">
            {/* {booking.rideType} */}
            {booking.type}
          </div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1">
          <div className="text-text_lightdark_grey font-light">{t("my_booking.rider_email_text")}</div>
          <div className="text-text_black font-semibold">
            {/* {booking.riderEmail} */}
            {booking.user}
          </div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1">
          <div className="text-text_lightdark_grey font-light">{t("my_booking.time_text")}</div>
          <div className="text-text_black font-semibold">
            {/* {booking.time} */}
            {booking.arrival_time}
          </div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1">
          <div className="text-text_lightdark_grey font-light">{t("my_booking.date_text")}</div>
          <div className="text-text_black font-semibold">
            {/* {booking.date} */}
            {booking.arrival_date}
          </div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1">
          <div className="text-text_lightdark_grey font-light">
            {t("my_booking.vehicle_booking_hours_text")}
          </div>
          <div className="text-text_black font-semibold">
            {/* {booking.ridersNumber} */}
            {booking.booking_hours}
          </div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1 pb-4 border-b border-dashed">
          <div className="text-text_lightdark_grey font-light">
            {t("my_booking.vehicle_type_text")}
          </div>
          <div className="text-text_black font-semibold">
            {/* {booking.vehicleType} */}
            {booking.vehicle_type}
          </div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1 pb-4 border-b border-text_lightdark_grey">
          <div className="text-text_lightdark_grey font-light">
            {t("my_booking.booking_price_text")}
          </div>
          <div className="text-text_black font-semibold">
            {/* {booking.bookingPrice} */}
            {booking.price}
          </div>
        </div>
        <div className="mt-5 w-full">
          <Button
            type="submit"
            label={t("my_booking.get_pdf_text")}
            className="bg-text_white w-full text-text_black hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 border border-text_black"
          />
        </div>
      </div>
    </div>
  );
}
