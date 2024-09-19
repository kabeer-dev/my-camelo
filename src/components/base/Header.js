import React, { useState, useEffect } from "react";
import { Link, Events, scrollSpy } from "react-scroll";
import HeroSection from "../hero/HeroSection";
import ServiceSection from "../services/ServiceSection";
import VehicleSection from "../vehicleType/VehicleSection";
import { CiGlobe } from "react-icons/ci";
import Button from "../base/Button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, message, Space } from "antd";
import { signOutRequest } from "../../redux/actions/authActions";
// import Loader from "./components/loader/Loader";
import { useTranslation } from "react-i18next";
import { languageChange } from "../../redux/actions/authActions";
import { emailChange } from "../../redux/actions/authActions";
import { useMedia } from "use-media";
import { Icon } from "@iconify/react";

export default function Header() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const username = useSelector((state) => state.auth.username);
  const language = useSelector((state) => state.auth.language);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const [t, i18n] = useTranslation("global");

  const isSmall = useMedia({ maxWidth: "768px" }); // Mobile view
  const isMedium = useMedia({ minWidth: "769px", maxWidth: "1024px" }); // Tablet view
  const isLarge = useMedia({ minWidth: "1025px" }); // Desktop view

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Define array of menu items with corresponding component IDs
  const menuItems = [
    { id: "home", text: t("header.menu.home_text"), component: HeroSection },
    {
      id: "services",
      text: t("header.menu.services_text"),
      component: ServiceSection,
    },
    {
      id: "vehicleType",
      text: t("header.menu.vehicle_text"),
      component: VehicleSection,
    },
    // Add more menu items as needed
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

  useEffect(() => {
    if (
      location.pathname === "/join-agent" ||
      location.pathname === "/request-submit" ||
      location.pathname === "/request-failed"
    ) {
      setActiveSection("");
    }
  }, []);

  const handleSetActive = (to) => {
    setActiveSection(to);
  };

  const onClick = ({ key }) => {
    switch (key) {
      case "1":
        navigate("/mashrouk-new-ui/my-profile");
        break;
      case "2":
        navigate("/mashrouk-new-ui/my-bookings");
        break;
      case "3":
        message.success(`Logged out`);
        dispatch(emailChange(null));
        dispatch(signOutRequest());
        navigate("/mashrouk-new-ui/");
        break;
      default:
        break;
    }
  };

  const items = [
    {
      label: t("header.user_dropdown.my_profile"),
      key: "1",
    },
    {
      label: t("header.user_dropdown.my_booking"),
      key: "2",
    },
    {
      label: t("header.user_dropdown.logout"),
      key: "3",
    },
  ];

  return (
    <>
      {isSmall && (
        <>
          <>
            {!isSidebarOpen && (
              <div className="bg-background_steel_blue flex px-5">
                <div className="flex items-center">
                  <button
                    onClick={toggleSidebar}
                    className="text-text_white"
                    type="button"
                  >
                    <Icon
                      icon="fluent:line-horizontal-3-20-filled"
                      width="25px"
                      height="25px"
                    ></Icon>
                  </button>
                </div>

                <div className="flex items-center ml-5">
                  <button onClick={() => navigate("/mashrouk-new-ui/")}>
                    <img
                      src="./assets/header/logo.png"
                      className="w-14 h-14 sm:h-14 my-2"
                      alt="Camelo Logo"
                    />
                  </button>
                </div>

                <div className="flex items-center ml-auto">
                  {!isLoggedIn ? (
                    <>
                      <div>
                        <button>
                          <Icon
                            icon="ph:user-thin"
                            width="1.2rem"
                            height="1.2rem"
                            style={{ color: "#ffffff", marginTop: "5px" }}
                          />
                        </button>
                      </div>
                      <div className="ml-3">
                        <button
                          onClick={() => navigate("/mashrouk-new-ui/sign-in")}
                          className="text-text_white"
                        >
                          {t("header.sign_in_text")}
                        </button>
                      </div>
                    </>
                  ) : (
                    <Dropdown
                      menu={{
                        items,
                        onClick,
                        dir: language === "ar" ? "rtl" : "ltr",
                      }}
                    >
                      <div
                        className="cursor-pointer text-text_steel_blue bg-background_white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Space>
                          {username || "User"}
                          <DownOutlined />
                        </Space>
                      </div>
                    </Dropdown>
                  )}
                </div>
              </div>
            )}

            <div
              id="drawer-navigation"
              className={`fixed top-0 left-0 z-40 w-64 h-screen px-4 overflow-hidden transition-transform ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } bg-background_white dark:bg-gray-800`}
              tabIndex="-1"
              aria-labelledby="drawer-navigation-label"
            >
              <button
                type="button"
                onClick={toggleSidebar}
                aria-controls="drawer-navigation"
                className="text-gray-400 bg-background_steel_blue hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center"
              >
                <Icon
                  icon="charm:cross"
                  width="1.2rem"
                  height="1.2rem"
                  style={{ color: "#ffffff" }}
                />
                <span className="sr-only">Close menu</span>
              </button>
              <div className="py-4 overflow-hidden">
                <ul className="space-y-2 font-medium flex flex-col items-start justify-start">
                  {location.pathname.includes("/join-agent") ? (
                    <>
                      <NavLink
                        to="/mashrouk-new-ui/"
                        className="text-text_black cursor-pointer block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                      >
                        {t("header.menu.home_text")}
                      </NavLink>
                      <NavLink
                        to="/mashrouk-new-ui/join-agent"
                        className="text-text_black cursor-pointer block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                      >
                        {t("join_agent_text")}
                        {/* <div>
                          <img
                            src="./assets/header/navigator_icon.png"
                            alt="navigator_icon"
                            className="absolute top-[60px] w-[40px] h-[20px] hidden md:block lg:block"
                          />
                        </div> */}
                      </NavLink>
                    </>
                  ) : (
                    <>
                      {menuItems.map((item, index) => (
                        <li key={item.id}>
                          <Link
                            to={item.id}
                            spy={true}
                            smooth={true}
                            onSetActive={handleSetActive}
                            className={`${
                              item.id === activeSection
                                ? "text-text_steel_blue"
                                : "text-text_black"
                            } cursor-pointer block ${
                              index !== 0 ? "pt-5" : ""
                            } text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white`}
                          >
                            {item.text}
                            {item.id === activeSection ? (
                              <>
                                {/* <div>
                                  <img
                                    src="./assets/header/navigator_icon.png"
                                    alt="navigator_icon"
                                    className="absolute top-[60px] w-[40px] h-[20px] hidden md:block lg:block"
                                  />
                                </div> */}
                              </>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                      <NavLink
                        to="/mashrouk-new-ui/join-agent"
                        className={`text-text_black pt-5 cursor-pointer block text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white`}
                      >
                        {t("join_agent_text")}
                      </NavLink>
                    </>
                  )}
                  <li className="w-full">
                    <div className="mt-10 w-full">
                      <Button
                        className="bg-background_darkgrey w-full font-medium text-md mr-2 py-1"
                        onClick={() => {
                          dispatch(
                            languageChange(language === "eng" ? "ar" : "eng")
                          );
                          i18n
                            .changeLanguage(language === "eng" ? "ar" : "eng")
                            .then(window.location.reload());
                        }}
                        label={
                          <>
                            <div className="w-full flex flex-row justify-center items-baseline">
                              <div className="text-md px-2">
                                {language === "eng" ? "AR" : "EN"}
                              </div>
                            </div>
                          </>
                        }
                        type="button"
                      />
                    </div>
                  </li>

                  {!isLoggedIn ? (
                    <>
                      <div className="w-full flex flex-col justify-center items-center">
                        <div>
                          <div className="w-full flex justify-center mt-[40vh]">
                            <Button
                              className="w-full mt-2 bg-transparent text-text_black font-medium text-md px-2.5 cursor-pointer"
                              onClick={() =>
                                navigate("/mashrouk-new-ui/sign-in")
                              } // Use navigate here
                              label={t("header.sign_in_text")}
                              type="button"
                            />
                          </div>
                          <div className="w-full">
                            <Button
                              className="w-full mt-2 cursor-pointer text-text_white bg-background_steel_blue border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                              onClick={() =>
                                navigate("/mashrouk-new-ui/create-new-account")
                              }
                              label={t("header.create_text")}
                              type="button"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <Dropdown
                          menu={{
                            items,
                            onClick,
                            dir: language === "ar" ? "rtl" : "ltr",
                          }}
                        >
                          <div
                            className="mt-[50vh] cursor-pointer text-text_steel_blue bg-background_white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Space>
                              {username || "User"}
                              <DownOutlined />
                            </Space>
                          </div>
                        </Dropdown>
                      </div>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </>
        </>
      )}

      {isMedium && (
        <>
          <>
            {!isSidebarOpen && (
              <div className="bg-background_steel_blue flex px-5">
                <div className="flex items-center">
                  <button
                    onClick={toggleSidebar}
                    className="text-text_white"
                    type="button"
                  >
                    <Icon
                      icon="fluent:line-horizontal-3-20-filled"
                      width="25px"
                      height="25px"
                    ></Icon>
                  </button>
                </div>

                <div className="flex items-center ml-5">
                  <button onClick={() => navigate("/mashrouk-new-ui/")}>
                    <img
                      src="./assets/header/logo.png"
                      className="w-14 h-14 sm:h-14 my-2"
                      alt="Camelo Logo"
                    />
                  </button>
                </div>

                <div className="flex items-center ml-auto">
                  {!isLoggedIn ? (
                    <>
                      <div>
                        <button>
                          <Icon
                            icon="ph:user-thin"
                            width="1.2rem"
                            height="1.2rem"
                            style={{ color: "#ffffff", marginTop: "5px" }}
                          />
                        </button>
                      </div>
                      <div className="ml-3">
                        <button
                          onClick={() => navigate("/mashrouk-new-ui/sign-in")}
                          className="text-text_white"
                        >
                          {t("header.sign_in_text")}
                        </button>
                      </div>
                    </>
                  ) : (
                    <Dropdown
                      menu={{
                        items,
                        onClick,
                        dir: language === "ar" ? "rtl" : "ltr",
                      }}
                    >
                      <div
                        className="cursor-pointer text-text_steel_blue bg-background_white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Space>
                          {username || "User"}
                          <DownOutlined />
                        </Space>
                      </div>
                    </Dropdown>
                  )}
                </div>
              </div>
            )}

            <div
              id="drawer-navigation"
              className={`fixed top-0 left-0 z-40 w-64 h-screen px-4 overflow-hidden transition-transform ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } bg-background_white dark:bg-gray-800`}
              tabIndex="-1"
              aria-labelledby="drawer-navigation-label"
            >
              <button
                type="button"
                onClick={toggleSidebar}
                aria-controls="drawer-navigation"
                className="text-gray-400 bg-background_steel_blue hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center"
              >
                <Icon
                  icon="charm:cross"
                  width="1.2rem"
                  height="1.2rem"
                  style={{ color: "#ffffff" }}
                />
                <span className="sr-only">Close menu</span>
              </button>
              <div className="py-4 overflow-hidden">
                <ul className="space-y-2 font-medium flex flex-col items-start justify-start">
                  {location.pathname.includes("/join-agent") ? (
                    <>
                      <NavLink
                        to="/mashrouk-new-ui/"
                        className="text-text_black cursor-pointer block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                      >
                        {t("header.menu.home_text")}
                      </NavLink>
                      <NavLink
                        to="/mashrouk-new-ui/join-agent"
                        className="text-text_black cursor-pointer block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                      >
                        {t("join_agent_text")}
                        {/* <div>
                          <img
                            src="./assets/header/navigator_icon.png"
                            alt="navigator_icon"
                            className="absolute top-[60px] w-[40px] h-[20px] hidden md:block lg:block"
                          />
                        </div> */}
                      </NavLink>
                    </>
                  ) : (
                    <>
                      {menuItems.map((item, index) => (
                        <li key={item.id}>
                          <Link
                            to={item.id}
                            spy={true}
                            smooth={true}
                            onSetActive={handleSetActive}
                            className={`${
                              item.id === activeSection
                                ? "text-text_steel_blue"
                                : "text-text_black"
                            } cursor-pointer block ${
                              index !== 0 ? "pt-5" : ""
                            } text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white`}
                          >
                            {item.text}
                            {item.id === activeSection ? (
                              <>
                                {/* <div>
                                  <img
                                    src="./assets/header/navigator_icon.png"
                                    alt="navigator_icon"
                                    className="absolute top-[60px] w-[40px] h-[20px] hidden md:block lg:block"
                                  />
                                </div> */}
                              </>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                      <NavLink
                        to="/mashrouk-new-ui/join-agent"
                        className={`text-text_black pt-5 cursor-pointer block text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white`}
                      >
                        {t("join_agent_text")}
                      </NavLink>
                    </>
                  )}
                  <li className="w-full">
                    <div className="mt-10 w-full">
                      <Button
                        className="bg-background_darkgrey w-full font-medium text-md mr-2 py-1"
                        onClick={() => {
                          dispatch(
                            languageChange(language === "eng" ? "ar" : "eng")
                          );
                          i18n
                            .changeLanguage(language === "eng" ? "ar" : "eng")
                            .then(window.location.reload());
                        }}
                        label={
                          <>
                            <div className="w-full flex flex-row justify-center items-baseline">
                              <div className="text-md px-2">
                                {language === "eng" ? "AR" : "EN"}
                              </div>
                            </div>
                          </>
                        }
                        type="button"
                      />
                    </div>
                  </li>

                  {!isLoggedIn ? (
                    <>
                      <div className="w-full flex flex-col justify-center items-center">
                        <div>
                          <div className="w-full flex justify-center mt-[40vh]">
                            <Button
                              className="w-full mt-2 bg-transparent text-text_black font-medium text-md px-2.5 cursor-pointer"
                              onClick={() =>
                                navigate("/mashrouk-new-ui/sign-in")
                              } // Use navigate here
                              label={t("header.sign_in_text")}
                              type="button"
                            />
                          </div>
                          <div className="w-full">
                            <Button
                              className="w-full mt-2 cursor-pointer text-text_white bg-background_steel_blue border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                              onClick={() =>
                                navigate("/mashrouk-new-ui/create-new-account")
                              }
                              label={t("header.create_text")}
                              type="button"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <Dropdown
                          menu={{
                            items,
                            onClick,
                            dir: language === "ar" ? "rtl" : "ltr",
                          }}
                        >
                          <div
                            className="mt-[50vh] cursor-pointer text-text_steel_blue bg-background_white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Space>
                              {username || "User"}
                              <DownOutlined />
                            </Space>
                          </div>
                        </Dropdown>
                      </div>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </>
        </>
      )}

      {isLarge && (
        <>
          <div className="container mx-auto">
            <header
              className="fixed top-0 left-0 w-full z-50"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              {" "}
              <nav className="bg-background_steel_blue md:h-20 lg:h-20 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl md:h-full lg:h-full">
                  <button
                    onClick={() => navigate("/mashrouk-new-ui/")}
                    className="flex items-center ml-1"
                  >
                    <img
                      src="./assets/header/logo.png"
                      className="w-14 h-14 sm:h-14 my-2"
                      alt="Camelo Logo"
                    />
                  </button>
                  <div className="flex flex-row justify-center items-baseline lg:order-2">
                    <div>
                      <Button
                        className="text-text_white font-medium text-md mr-2"
                        onClick={() => {
                          dispatch(
                            languageChange(language === "eng" ? "ar" : "eng")
                          );
                          i18n
                            .changeLanguage(language === "eng" ? "ar" : "eng")
                            .then(window.location.reload());
                        }}
                        label={
                          <>
                            <div className="flex flex-row justify-center items-baseline">
                              <div>
                                <CiGlobe
                                  fontSize={25}
                                  style={{ marginBottom: "-7px" }}
                                />
                              </div>
                              <div className="text-md px-2">
                                {language === "eng"
                                  ? t("header.languages.arabic")
                                  : t("header.languages.english")}
                              </div>
                            </div>
                          </>
                        }
                        type="button"
                      />
                    </div>

                    {!isLoggedIn ? (
                      <>
                        <div>
                          <Button
                            className="bg-transparent text-text_white font-medium text-md px-2.5 cursor-pointer"
                            onClick={() => navigate("/mashrouk-new-ui/sign-in")} // Use navigate here
                            label={t("header.sign_in_text")}
                            type="button"
                          />
                        </div>
                        <div>
                          <Button
                            className="cursor-pointer text-text_steel_blue bg-background_white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                            onClick={() =>
                              navigate("/mashrouk-new-ui/create-new-account")
                            }
                            label={t("header.create_text")}
                            type="button"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <Dropdown
                            menu={{
                              items,
                              onClick,
                              dir: language === "ar" ? "rtl" : "ltr",
                            }}
                          >
                            <div
                              className="cursor-pointer text-text_steel_blue bg-background_white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                              onClick={(e) => e.preventDefault()}
                            >
                              <Space>
                                {username || "User"}
                                <DownOutlined />
                              </Space>
                            </div>
                          </Dropdown>
                        </div>
                      </>
                    )}
                  </div>

                  <div
                    className={`${
                      isMenuOpen ? "block" : "hidden"
                    } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
                    id="mobile-menu-2"
                  >
                    <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 rtl:lg:space-x-reverse lg:mt-0">
                      {location.pathname.includes("/join-agent") ? (
                        <>
                          <NavLink
                            to="/mashrouk-new-ui/"
                            className="text-text_white cursor-pointer block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                          >
                            {t("header.menu.home_text")}
                          </NavLink>
                          <NavLink
                            to="/mashrouk-new-ui/join-agent"
                            className="text-text_white cursor-pointer block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                          >
                            {t("join_agent_text")}
                            <div>
                              <img
                                src="./assets/header/navigator_icon.png"
                                alt="navigator_icon"
                                className="absolute top-[60px] w-[40px] h-[20px] hidden md:block lg:block"
                              />
                            </div>
                          </NavLink>
                        </>
                      ) : (
                        <>
                          {menuItems.map((item) => (
                            <li key={item.id}>
                              <Link
                                to={item.id}
                                spy={true}
                                smooth={true}
                                onSetActive={handleSetActive}
                                onClick={toggleMenu} // Close menu on link click
                                className="text-text_white cursor-pointer block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                              >
                                {item.text}
                                {item.id === activeSection ? (
                                  <>
                                    <div>
                                      <img
                                        src="./assets/header/navigator_icon.png"
                                        alt="navigator_icon"
                                        className="absolute top-[60px] w-[40px] h-[20px] hidden md:block lg:block"
                                      />
                                    </div>
                                  </>
                                ) : null}
                              </Link>
                            </li>
                          ))}
                          <NavLink
                            to="/mashrouk-new-ui/join-agent"
                            className="text-text_white cursor-pointer block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                          >
                            {t("join_agent_text")}
                          </NavLink>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </nav>
            </header>
          </div>
        </>
      )}
    </>
  );
}
