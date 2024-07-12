import React from "react";
import Button from "./Button";

export default function BookingCard({ booking }) {
  return (
    <div className="mt-5">
      {" "}
      <div className="bg-text_white rounded-md px-5 py-7 flex flex-col justify-center items-center mb-4">
        <div className="my-1">
          <img
            src={`/assets/mybooking/${booking.status}.png`}
            alt="ride-completed"
            className="w-20 h-20"
          />
        </div>
        <div className="text-text_black font-semibold text-lg border-dashed border-b w-full text-center my-3 pb-4">
          {booking.status}
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1">
          <div className="text-text_lightdark_grey font-light">Booking ID</div>
          <div className="text-text_black font-semibold">
            {booking.bookingId}
          </div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1">
          <div className="text-text_lightdark_grey font-light">Ride Type</div>
          <div className="text-text_black font-semibold">
            {booking.rideType}
          </div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1">
          <div className="text-text_lightdark_grey font-light">Rider Email</div>
          <div className="text-text_black font-semibold">
            {booking.riderEmail}
          </div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1">
          <div className="text-text_lightdark_grey font-light">Time</div>
          <div className="text-text_black font-semibold">{booking.time}</div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1">
          <div className="text-text_lightdark_grey font-light">Date</div>
          <div className="text-text_black font-semibold">{booking.date}</div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1">
          <div className="text-text_lightdark_grey font-light">
            Riders Number
          </div>
          <div className="text-text_black font-semibold">
            {booking.ridersNumber}
          </div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1 pb-4 border-b border-dashed">
          <div className="text-text_lightdark_grey font-light">
            Vehicle Type
          </div>
          <div className="text-text_black font-semibold">
            {booking.vehicleType}
          </div>
        </div>
        <div className="w-full flex flow-row justify-between items-center my-1 pb-4 border-b border-text_lightdark_grey">
          <div className="text-text_lightdark_grey font-light">
            Booking Price
          </div>
          <div className="text-text_black font-semibold">
            {booking.bookingPrice}
          </div>
        </div>
        <div className="mt-5 w-full">
          <Button
            type="submit"
            label="Get PDF Receipt"
            className="bg-text_white w-full text-text_black hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 border border-text_black"
          />
        </div>
      </div>
    </div>
  );
}
