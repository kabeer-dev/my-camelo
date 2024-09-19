import React, { useState, useEffect } from "react";
import { Link, Events, scrollSpy } from "react-scroll";
import HeroSection from "../hero/HeroSection";
import ServiceSection from "../services/ServiceSection";
import VehicleSection from "../vehicleType/VehicleSection";
import Button from "../base/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function Footer() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Function to toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const language = useSelector((state) => state.auth.language);
  const [t, i18n] = useTranslation("global");

  const footerItems = [
    { id: "home", text: t("footer.items.home_text"), component: HeroSection },
    {
      id: "services",
      text: t("footer.items.services_text"),
      component: ServiceSection,
    },
    {
      id: "vehicleType",
      text: t("footer.items.vehicle_text"),
      component: VehicleSection,
    },
  ];

  const footerItemsTwo = [
    { text: t("footer.items_2.privacy_text"), href: "#" },
    {
      text: t("footer.items_2.terms_text"),
      href: "/mashrouk-new-ui/terms-condition",
    },
    // { text: t("footer.items_2.cookies_text"), href: "#" },
  ];

  useEffect(() => {
    Events.scrollEvent.register("begin", function (to, element) {});
    Events.scrollEvent.register("end", function (to, element) {});

    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);

  return (
    <>
      <div>
        {/* footer code is here */}
        <footer
          className="w-full py-3 md:py-6 px-10 md:px-20 flex flex-col items-center justify-center bg-background_steel_blue text-text_white"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          <div className="mb-4">
            <img
              src="./assets/footer/logo.png"
              alt="Mashrook Trips"
              className="w-16 md:w-32 h-16 md:h-32"
            />
          </div>
          <div className="my-2 md:my-4">
            <ul className="flex flex-col items-center mt-2 md:mt-4 font-normal md:font-medium md:flex-row md:items-baseline lg:space-x-8 lg:mt-0">
              {footerItems.map((item) => (
                <li
                  key={item.id}
                  className="w-[70px] flex flex-row justify-center items-center"
                >
                  <Link
                    to={item.id}
                    spy={true}
                    smooth={true}
                    onClick={toggleMenu} // Close menu on link click
                    className="text-text_white block cursor-pointer py-1 md:py-2 pr-2 md:pr-4 pl-2 md:pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
              {!isLoggedIn && (
                <li
                  onClick={() => navigate("/mashrouk-new-ui/sign-in")}
                  className="text-text_white block cursor-pointer py-1 md:py-2 pr-2 md:pr-4 pl-2 md:pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                >
                  {t("footer.sign_in_text")}
                </li>
              )}
              {!isLoggedIn && (
                <li>
                  <Button
                    className="hidden md:flex cursor-pointer text-text_steel_blue bg-background_white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    onClick={() =>
                      navigate("/mashrouk-new-ui/agent/create-new-account")
                    }
                    label={t("footer.create_text")}
                    type="button"
                  />
                </li>
              )}
            </ul>
          </div>
          <div className="mt-4 border-t w-full pt-2 flex flex-col-reverse md:flex-row justify-between items-center">
            <div className="mt-3 md:0">{t("footer.copyright_text")}</div>
            <div className="flex flex-row justify-end items-center">
              <ul className="flex flex-col md:flex-row items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                {footerItemsTwo.map((item, index) => (
                  <li key={index} className="mt-3 md:0">
                    <a
                      href={item.href}
                      className="hover:underline me-4 md:me-6"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </footer>
        {/* footer code is here */}
      </div>
    </>
  );
}
