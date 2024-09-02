import React, { useState, useEffect } from "react";
import { Link, Events, scrollSpy } from "react-scroll";
import HeroSection from "../hero/HeroSection";
import ServiceSection from "../services/ServiceSection";
import VehicleSection from "../vehicleType/VehicleSection";
import { CiGlobe } from "react-icons/ci";
import Button from "../base/Button";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, message, Space } from "antd";
import { signOutRequest } from "../../../redux/actions/authActions";
// import Loader from "./components/loader/Loader";
import { useTranslation } from "react-i18next";
import { languageChange } from "../../../redux/actions/authActions";
import secureLocalStorage from "react-secure-storage";
import { emailChange } from "../../../redux/actions/authActions";
import { Icon } from "@iconify/react";
import { useMedia } from "use-media";

export default function Header() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const username = useSelector((state) => state.auth.username);
  const language = useSelector((state) => state.auth.language);
  const agentPhoto = useSelector((state) => state.auth.agentPhoto);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const [t, i18n] = useTranslation("global");

  // Function to toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isSmall = useMedia({ maxWidth: "768px" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

  const handleSetActive = (to) => {
    setActiveSection(to);
  };

  const onClick = ({ key }) => {
    switch (key) {
      // case "1":
      //   navigate("/agent/my-profile");
      //   break;
      case "1":
        navigate("/agent/my-bookings");
        break;
      case "2":
        message.success(`Logged out`);
        secureLocalStorage.removeItem("agent");
        secureLocalStorage.removeItem("email");
        dispatch(emailChange(null));
        dispatch(signOutRequest());
        navigate("/");
        break;
      default:
        break;
    }
  };

  const items = [
    // {
    //   label: t("header.user_dropdown.my_profile"),
    //   key: "1",
    // },
    {
      label: t("header.user_dropdown.agent_booking"),
      key: "1",
    },
    {
      label: t("header.user_dropdown.logout"),
      key: "2",
    },
  ];

  return (
    <>
      {isSmall === true ? (
        <>
          {!isSidebarOpen && (
            <div className="bg-background_steel_blue flex px-5 xs:px-2">
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
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center"
                >
                  <img
                    src="/assets/header/cameloLogo.png"
                    className="w-18 h-14 sm:h-14 my-2"
                    alt="Camelo Logo"
                  />
                  <img
                    src="/assets/header/xLogo.png"
                    className="w-18 h-3 my-2 ml-2"
                    alt="X Logo"
                  />
                  <img
                    // src="/assets/header/agentLogo.png"
                    src={
                      agentPhoto ? agentPhoto : "/assets/header/NoAgentLogo.png"
                    }
                    className="w-10 h-12 sm:h-14 my-2 ml-3"
                    alt="Agent Logo"
                  />
                </button>
              </div>

              <div className="flex items-center ml-auto">
                {!isLoggedIn ? (
                  <>
                    <div>
                      <button
                      // onClick={() => navigate("/")}
                      >
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
                        onClick={() => navigate("/sign-in")}
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
            className={`fixed top-0 left-0 z-40 w-64 h-screen px-4 overflow-y-auto transition-transform ${
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
            <div className="py-4 overflow-y-auto">
              <ul className="space-y-2 font-medium">
                {menuItems.map((item, index) => (
                  <li key={item.id}>
                    <Link
                      to={item.id}
                      spy={true}
                      smooth={true}
                      onSetActive={handleSetActive}
                      // onClick={toggleMenu} // Close menu on link click
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
                          <div>
                            <img
                              src="/assets/header/navigator_icon.png"
                              alt="navigator_icon"
                              className="absolute top-[60px] w-[40px] h-[20px] hidden md:block lg:block"
                            />
                          </div>
                        </>
                      ) : null}
                    </Link>
                  </li>
                ))}
                <li>
                  <div className="mt-10">
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
                          <div className="flex flex-row justify-center items-baseline">
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
                    <div className="flex justify-center items-end">
                      <div>
                        <div className="flex justify-center mt-[50vh]">
                          <Button
                            className="mt-2 bg-transparent text-text_black font-medium text-md px-2.5 cursor-pointer"
                            onClick={() => navigate("/sign-in")} // Use navigate here
                            label={t("header.sign_in_text")}
                            type="button"
                          />
                        </div>
                        <div>
                          <Button
                            className="mt-2 cursor-pointer text-text_white bg-background_steel_blue border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                            onClick={() => navigate("/create-new-account")}
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
                      {/* <div
                      className="cursor-pointer hidden md:flex text-text_steel_blue bg-background_white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"                      
                    >
                    {username || "User"} <svg className="mt-1 ms-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M8.037 11.166L14.5 22.36c.825 1.43 2.175 1.43 3 0l6.463-11.195c.826-1.43.15-2.598-1.5-2.598H9.537c-1.65 0-2.326 1.17-1.5 2.6z"></path></svg>
                    </div> */}
                    </div>
                  </>
                )}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div>
          <header
            className="fixed top-0 left-0 w-full z-50"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            {" "}
            {/* Make header fixed */}
            <nav className="bg-background_steel_blue md:h-20 lg:h-20 py-2.5 dark:bg-gray-800">
              <div className="px-10 flex flex-col md:flex-col lg:flex-row justify-between items-center">
                <button
                  onClick={() => navigate("/agent")}
                  className="flex items-center ml-1"
                >
                  <img
                    src="/assets/header/cameloLogo.png"
                    className="w-18 h-14 sm:h-14 my-2"
                    alt="Camelo Logo"
                  />
                  <img
                    src="/assets/header/xLogo.png"
                    className="w-18 h-10 sm:h-4 my-2 ml-2"
                    alt="X Logo"
                  />
                  <img
                    // src="/assets/header/agentLogo.png"
                    src={
                      agentPhoto ? agentPhoto : "/assets/header/NoAgentLogo.png"
                    }
                    className="w-18 h-14 sm:h-14 my-2 ml-3"
                    alt="Agent Logo"
                  />
                </button>
                <div className="flex flex-row justify-center items-baseline lg:order-2">
                  <div>
                    <Button
                      className="text-text_white font-medium text-md mr-2 hidden md:flex"
                      onClick={() => {
                        // (window.location.href = "http://localhost:3000/#")
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
                            <CiGlobe className="text-xl" />
                            <div className="text-md px-2">
                              {language === "eng"
                                ? t("header.languages.arabic")
                                : t("header.languages.english")}
                            </div>
                          </div>
                        </>
                      }
                      // disabled={true}
                      type="button"
                    />
                  </div>

                  {!isLoggedIn ? (
                    <>
                      <div>
                        <Button
                          className="hidden md:flex bg-transparent text-text_white font-medium text-md px-2.5 cursor-pointer"
                          onClick={() => navigate("/sign-in")} // Use navigate here
                          label={t("header.sign_in_text")}
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
                            className="cursor-pointer hidden md:flex text-text_steel_blue bg-background_white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Space>
                              {username || "User"}
                              <DownOutlined />
                            </Space>
                          </div>
                        </Dropdown>
                        {/* <div
                      className="cursor-pointer hidden md:flex text-text_steel_blue bg-background_white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"                      
                    >
                    {username || "User"} <svg className="mt-1 ms-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M8.037 11.166L14.5 22.36c.825 1.43 2.175 1.43 3 0l6.463-11.195c.826-1.43.15-2.598-1.5-2.598H9.537c-1.65 0-2.326 1.17-1.5 2.6z"></path></svg>
                    </div> */}
                      </div>
                      <div>
                        <Button
                          className="cursor-pointer hidden md:flex text-text_steel_blue bg-background_white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                          onClick={() => navigate("/agent/create-new-account")}
                          label={t("header.create_text")}
                          type="button"
                        />
                      </div>
                    </>
                  )}

                  <button
                    onClick={toggleMenu} // Toggle menu on button click
                    type="button"
                    className="inline-flex items-center p-2 ml-1 text-sm rounded-lg lg:hidden text-text_white"
                    aria-expanded={isMenuOpen ? "true" : "false"} // Set aria-expanded based on menu state
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg
                      className={isMenuOpen ? "hidden w-6 h-6" : "w-6 h-6"} // Hide/show first svg icon based on menu state
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <svg
                      className={isMenuOpen ? "w-6 h-6" : "hidden w-6 h-6"} // Hide/show second svg icon based on menu state
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div
                  className={`${
                    isMenuOpen ? "block" : "hidden"
                  } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
                  id="mobile-menu-2"
                >
                  <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 rtl:lg:space-x-reverse lg:mt-0">
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
                                  src="/assets/header/navigator_icon.png"
                                  alt="navigator_icon"
                                  className="absolute top-[60px] w-[40px] h-[20px] hidden md:block lg:block"
                                />
                              </div>
                            </>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>
          </header>
        </div>
      )}
    </>
  );
}
