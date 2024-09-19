import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Heading from "../base/Heading";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

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
  const language = useSelector((state) => state.auth.language);
  const [t, i18n] = useTranslation("global")

  return (
    <div
    dir={language === 'ar' ? 'rtl' : 'ltr'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`h-[370px] md:mx-2 rounded-lg px-3 md:px-6 py-5 md:py-10 transition-all duration-300 ${
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
        className={`w-full mt-3 mb-3 flex flex-row justify-between items-center ${
          isHovered ? "text-text_white" : "text-black"
        }`}
      >
        <div className="w-1/2 flex flex-row justify-start items-center">
          <div>
            <Icon
              icon="mdi:user"
              width="1.2em"
              height="1.2em"
              className={isHovered ? "text-text_white" : "text-text_steel_blue"}
            />
          </div>
          <div className="ml-2">{t("vehicle_type.vehicle_data.available_text")} {availableSeats}</div>
        </div>
        <div className="w-1/2 flex flex-row justify-start items-center">
          <div>
            <Icon
              icon="iconamoon:shopping-bag-thin"
              width="1.2em"
              height="1.2em"
              className={isHovered ? "text-text_white" : "text-text_steel_blue"}
            />
          </div>
          <div className="ml-2">{t("vehicle_type.vehicle_data.luggage_text")} x {luggage}</div>
        </div>
      </div>

      <div
        className={`w-full mt-3 mb-3 flex flex-row justify-between items-center ${
          isHovered ? "text-text_white" : "text-black"
        }`}
      >
        <div className="w-1/2 flex flex-row justify-start items-center">
          <div>
            <Icon
              icon="healthicons:truck-driver"
              width="1.2em"
              height="1.2em"
              className={isHovered ? "text-text_white" : "text-text_steel_blue"}
            />
          </div>
          <div className="ml-2">{driver ? t("vehicle_type.vehicle_data.driver_text") : t("vehicle_type.vehicle_data.no_driver_text")}</div>
        </div>
        <div className="w-1/2 flex flex-row justify-start items-center">
          <div>
            <Icon
              icon="ph:security-camera-thin"
              width="1.2em"
              height="1.2em"
              className={isHovered ? "text-text_white" : "text-text_steel_blue"}
            />
          </div>
          <div className="ml-2">
            {securityCamera ? t("vehicle_type.vehicle_data.security_text") : t("vehicle_type.vehicle_data.no_security_text")}
          </div>
        </div>
      </div>

      <div
        className={`w-full mt-3 mb-3 flex flex-row justify-between items-center ${
          isHovered ? "text-text_white" : "text-black"
        }`}
      >
        <div className="w-1/2 flex flex-row justify-start items-center">
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
              ? t("vehicle_type.vehicle_data.tracking_text")
              : t("vehicle_type.vehicle_data.no_tracking_text")}
          </div>
        </div>
        <div className="w-1/2 flex flex-row justify-start items-center">
          <div>
            <Icon
              icon="material-symbols:wifi-sharp"
              width="1.2em"
              height="1.2em"
              className={isHovered ? "text-text_white" : "text-text_steel_blue"}
            />
          </div>
          <div className="ml-2">{wifiSystem ? t("vehicle_type.vehicle_data.wifi_text") : t("vehicle_type.vehicle_data.no_wifi_text")}</div>
        </div>
      </div>
    </div>
  );
}
