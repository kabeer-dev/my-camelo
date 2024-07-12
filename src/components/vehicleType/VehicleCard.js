import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Heading from "../base/Heading";

export default function VehicleCard({
  carName,
  carImage,
  carType,
  availableSeats,
  luggage,
  driver,
  securityCamera,
  trackingSystem,
  wifiSystem,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`h-[330px] md:mx-2 rounded-lg px-3 md:px-6 py-5 md:py-10 transition-all duration-300 ${
        isHovered ? "bg-background_steel_blue" : "bg-background_grey"
      }`}
    >
      <div
        className={`border-b ${
          isHovered ? "border-text_white" : "border-black"
        }`}
      >
        <div>
          <Heading
            title={carName}
            className={`text-lg transition-all duration-300 ${
              isHovered ? "text-text_white" : "text-black"
            }`}
          />
        </div>
        <div
          className={`text-gray-200 text-sm ${
            isHovered ? "text-text_white" : "text-black"
          }`}
        >
          {carType}
        </div>
        <div className="w-full flex flex-row justify-center items-center">
          <img
            src={carImage}
            alt={carName}
            style={{ width: "210px", height: "107px" }}
          />
        </div>
      </div>

      <div
        className={`mt-3 mb-3 flex flex-row justify-between items-center ${
          isHovered ? "text-text_white" : "text-black"
        }`}
      >
        <div className="flex flex-row justify-between items-center">
          <div>
            <Icon
              icon="mdi:user"
              width="1.2em"
              height="1.2em"
              className={isHovered ? "text-text_white" : "text-text_steel_blue"}
            />
          </div>
          <div className="ml-2">Available Seats {availableSeats}</div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div>
            <Icon
              icon="iconamoon:shopping-bag-thin"
              width="1.2em"
              height="1.2em"
              className={isHovered ? "text-text_white" : "text-text_steel_blue"}
            />
          </div>
          <div className="ml-2">Luggage x {luggage}</div>
        </div>
      </div>

      <div
        className={`mt-3 mb-3 flex flex-row justify-between items-center ${
          isHovered ? "text-text_white" : "text-black"
        }`}
      >
        <div className="flex flex-row justify-between items-center">
          <div>
            <Icon
              icon="healthicons:truck-driver"
              width="1.2em"
              height="1.2em"
              className={isHovered ? "text-text_white" : "text-text_steel_blue"}
            />
          </div>
          <div className="ml-2">{driver ? "Driver" : "No-Driver"}</div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div>
            <Icon
              icon="ph:security-camera-thin"
              width="1.2em"
              height="1.2em"
              className={isHovered ? "text-text_white" : "text-text_steel_blue"}
            />
          </div>
          <div className="ml-2">
            {securityCamera ? "Security cameras" : "No Security cameras"}
          </div>
        </div>
      </div>

      <div
        className={`mt-3 mb-3 flex flex-row justify-between items-center ${
          isHovered ? "text-text_white" : "text-black"
        }`}
      >
        <div className="flex flex-row justify-between items-center">
          <div>
            <Icon
              icon="streamline:navigation-arrow-on"
              width="1.2em"
              height="1.2em"
              className={isHovered ? "text-text_white" : "text-text_steel_blue"}
            />
          </div>
          <div className="ml-2">
            {trackingSystem
              ? "Vehicle tracking system"
              : "No Vehicle tracking system"}
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div>
            <Icon
              icon="material-symbols:wifi-sharp"
              width="1.2em"
              height="1.2em"
              className={isHovered ? "text-text_white" : "text-text_steel_blue"}
            />
          </div>
          <div className="ml-2">{wifiSystem ? "wifi" : "No wifi"}</div>
        </div>
      </div>
    </div>
  );
}
