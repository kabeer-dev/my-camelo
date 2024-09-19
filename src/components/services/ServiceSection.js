import React, { useEffect } from "react";
import Heading from "../base/Heading";
import Paragraph from "../base/Paragraph";
import ServiceCard from "./ServiceCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchServicesListRequest } from "../../redux/actions/servicesListActions";
import { useTranslation } from "react-i18next";

export default function ServiceSection() {
  const dispatch = useDispatch();
  const { servicesList } = useSelector((state) => state.servicesList);
  const language = useSelector((state) => state.auth.language);
  const [t, i18n] = useTranslation("global")

  useEffect(() => {
    dispatch(fetchServicesListRequest());
  }, [dispatch]);
  // console.log("servicesList me kiya haa service section me?", servicesList);

  const services = [
    {
      icon: "icons8:airport",
      heading: "Airport Ride",
      paragraph:
        "Secure your peace of mind with our pre-scheduled car bookings, ensuring prompt, reliable transportation with experienced drivers at your service, tailored to your itinerary and preferences.",
    },
    {
      icon: "mdi:invoice-text-scheduled-outline",
      heading: "Scheduled Ride",
      paragraph:
        "Enjoy comfortable stays with our handpicked hotel options, providing top-notch amenities and exceptional service to make your travels memorable.",
    },
    {
      icon: "mingcute:hours-line",
      heading: "Ride By Hour",
      paragraph:
        "Savor the best culinary experiences with our restaurant reservations, offering you a diverse selection of dining options to suit your taste and preference.",
    },
  ];

  return (
    <>
      <div className="px-6 pt-10 pb-5 md:px-12 md:pt-20 md:pb-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mt-2 md:mt-3 mb-4 md:mb-7 flex flex-col md:flex-row justify-between items-start">
          <div className="w-full md:w-1/2">
            <Heading
              title={t("services.heading")}
              className={"text-2xl md:text-5xl text-text_steel_blue"}
            />
          </div>
          <div className="w-full md:w-1/2">
            <Paragraph
              title={t("services.paragraph")}
              className={"text-normal md:text-lg text-[#454545]"}
            />
          </div>
        </div>

        {/* card */}
        <div>
          <ServiceCard services={servicesList ? servicesList.data : services} />
        </div>
        {/* card */}
      </div>
    </>
  );
}
