import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { Link, Events, scrollSpy } from "react-scroll";
import { CiGlobe } from "react-icons/ci";
import Button from "../base/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, message, Space } from "antd";
import { signOutRequest } from "../../redux/actions/authActions";

const PaymentMethodForm = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const username = useSelector((state) => state.auth.username);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const [Refresh, setRefresh] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
  
    const checkoutId = location.state?.checkoutId;
    const paymentMethodName = location.state?.paymentMethodName;
    const formValues = location.state?.formValues;

    const baseUrl = window.location.protocol + '//' + window.location.host
    const successUrl = baseUrl + '/payment-success';
    const failureUrl = baseUrl + '/payment-failed';

    // useEffect(()=>{
      
    //     window.location.reload();
        
    // },[])

    useEffect(() => {
        localStorage.setItem('payment', true);
        localStorage.setItem('paymentMethodName', paymentMethodName);
        if (checkoutId) {
            // Inject the paymentWidgets.js script
            const paymentWidgetScript = document.createElement('script');
            paymentWidgetScript.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
            paymentWidgetScript.async = true;
            document.body.appendChild(paymentWidgetScript);

            // Inject the wpwlOptions script after paymentWidgets.js is loaded
            paymentWidgetScript.onload = () => {
                const wpwlOptionsScript = document.createElement('script');
                wpwlOptionsScript.type = 'text/javascript';
                wpwlOptionsScript.innerHTML = `
              var wpwlOptions = {
                paymentTarget: "_top",
                onSuccess: function() {
                  window.location.href = '${successUrl, {state: { formValues:formValues }}}';
                },
                onFail: function() {
                  window.location.href = '${failureUrl}';
                }
              };
            `;
                document.body.appendChild(wpwlOptionsScript);

            };

            return () => {
                document.body.removeChild(paymentWidgetScript);
            };
        }
    }, [checkoutId]);

    //for header and footer
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // make 10 years list
    const getYearOptions = (numberOfYears) => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: numberOfYears }, (v, i) => {
            const year = currentYear + i;
            return { label: year, value: year };
        });
        return years;
    };
    const numberOfYears = 11; // Change this to the number of years you want to generate
    const yearOptions = getYearOptions(numberOfYears);

    const monthOptions = [
        { label: "January", value: "01" },
        { label: "February", value: "02" },
        { label: "March", value: "03" },
        { label: "April", value: "04" },
        { label: "May", value: "05" },
        { label: "June", value: "06" },
        { label: "July", value: "07" },
        { label: "August", value: "08" },
        { label: "September", value: "09" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" },
    ];

    // Define array of menu items with corresponding component IDs
    const menuItems = [
        { id: "home", text: "Home" },
        { id: "services", text: "Services" },
        { id: "vehicleType", text: "Vehicle Type" },
        // Add more menu items as needed
    ];

    const footerItems = [
        { id: "home", text: "Home" },
        { id: "services", text: "Services" },
        { id: "vehicleType", text: "Vehicle Type" },
    ];

    const footerItemsTwo = [
        { text: "Privacy Policy", href: "#" },
        { text: "Terms of Service", href: "#" },
        { text: "Cookies Settings", href: "#" },
    ];

    useEffect(() => {
        Events.scrollEvent.register("begin", function (to, element) { });
        Events.scrollEvent.register("end", function (to, element) { });

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
            case "1":
                navigate("/my-profile");
                break;
            case "2":
                navigate("/my-bookings");
                break;
            case "3":
                message.success(`Logged out`);
                dispatch(signOutRequest());
                navigate("/");
                break;
            default:
                break;
        }
    };

    const items = [
        {
            label: "My Profile",
            key: "1",
        },
        {
            label: "My Booking",
            key: "2",
        },
        {
            label: "Logout",
            key: "3",
        },
    ];

    return (
        <>

            <header className="fixed top-0 left-0 w-full z-50">
                {" "}
                {/* Make header fixed */}
                <nav className="bg-background_steel_blue md:h-20 lg:h-20 px-4 lg:px-20 py-2.5 dark:bg-gray-800">
                    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl md:h-full lg:h-full">
                        <button onClick={() => navigate("/")} className="flex items-center">
                            <img
                                src="/assets/header/logo.png"
                                className="w-14 h-14 sm:h-14 my-2"
                                alt="Camelo Logo"
                            />
                        </button>
                        <div className="flex flex-row justify-center items-baseline lg:order-2">
                            <div>
                                <Button
                                    className="text-text_white font-medium text-md mr-2 hidden md:flex"
                                    onClick={() =>
                                        (window.location.href = "http://localhost:3000/#")
                                    }
                                    label={
                                        <>
                                            <div className="flex flex-row justify-center items-baseline">
                                                <CiGlobe className="text-xl" />
                                                <div className="text-md px-2">Ar</div>
                                            </div>
                                        </>
                                    }
                                    disabled={true}
                                    type="button"
                                />
                            </div>

                            {!isLoggedIn ? (
                                <>
                                    <div>
                                        <Button
                                            className="hidden md:flex bg-transparent text-text_white font-medium text-md px-2.5 cursor-pointer"
                                            onClick={() => navigate("/sign-in")} // Use navigate here
                                            label="Sign in"
                                            type="button"
                                        />
                                    </div>
                                    <div>
                                        <Button
                                            className="cursor-pointer hidden md:flex text-text_steel_blue bg-background_white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                            onClick={() => navigate("/create-new-account")}
                                            label="Create new account"
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
                                    </div>
                                </>
                            )}

                            <button
                                onClick={toggleMenu}
                                data-collapse-toggle="mega-menu-full"
                                type="button"
                                className="inline-flex justify-center items-center p-2 ml-1 w-10 h-10 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                aria-controls="mega-menu-full"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                        <div
                            id="mega-menu-full"
                            className={`${isMenuOpen ? "block" : "hidden"
                                } justify-between items-center w-full text-md md:flex md:w-auto md:order-1`}
                        >
                            <ul className="flex flex-col mt-4 font-medium md:flex-row md:space-x-8 md:mt-0 text-text_white text-md">
                                {menuItems.map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            activeClass="active"
                                            to={item.id}
                                            spy={true}
                                            smooth={true}
                                            duration={500}
                                            onSetActive={handleSetActive}
                                            className={`block py-2 pr-4 pl-3 text-white rounded md:bg-transparent md:text-primary-700 md:p-0 dark:text-white cursor-pointer ${activeSection === item.id ? "active" : ""
                                                }`}
                                        >
                                            {item.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <div>
                {/* <h1>Payment Form</h1> */}
                {checkoutId ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <div>
                            <div className='flex justify-between'>
                            <Icon icon="ph:arrow-left" width="25px" height="25px" className="mb-3 cursor-pointer"
                                onClick={() =>
                                {
                                    window.history.back();
                                    localStorage.setItem('hasRefreshed', 'true');
                                    localStorage.setItem('showPaymentMethod', 'true');
                                    navigate('/', { state: { showPaymentMethod: true } })
                                }
                                }
                            />
                           <p className="mb-3 font-bold text-background_steel_blue"> Price: 57 SAR</p>
                            </div>
                            <form
                                action={successUrl}
                                className="paymentWidgets"
                                data-brands={paymentMethodName === 'mada' ? "MADA" : paymentMethodName === 'Credit Card' ? 'VISA MASTER' : ''}
                            ></form>
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

            {/* footer code is here */}
            <footer className="mt-10 w-full py-3 md:py-6 px-10 md:px-20 flex flex-col items-center justify-center bg-background_steel_blue text-text_white">
                <div className="mb-4">
                    <img
                        src="/assets/footer/logo.png"
                        alt="Mashrook Trips"
                        className="w-16 md:w-32 h-16 md:h-32"
                    />
                </div>
                <div className="my-2 md:my-4">
                    <ul className="flex flex-col items-center mt-2 md:mt-4 font-normal md:font-medium md:flex-row md:items-baseline lg:space-x-8 lg:mt-0">
                        {footerItems.map((item) => (
                            <li key={item.id}>
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
                        <li
                            onClick={() => navigate("/sign-in")}
                            className="text-text_white block cursor-pointer py-1 md:py-2 pr-2 md:pr-4 pl-2 md:pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                        >
                            Sign in
                        </li>
                        <li>
                            <Button
                                className="hidden md:flex cursor-pointer text-text_steel_blue bg-background_white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                onClick={() => navigate("/create-new-account")}
                                label="Create new account"
                                type="button"
                            />
                        </li>
                    </ul>
                </div>
                <div className="mt-4 border-t w-full pt-2 flex flex-col-reverse md:flex-row justify-between items-center">
                    <div className="mt-3 md:0">
                        Copyright © 2024 AMK or its affiliates
                    </div>
                    <div className="flex flex-row justify-end items-center">
                        <ul className="flex flex-col md:flex-row items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                            {footerItemsTwo.map((item, index) => (
                                <li key={index} className="mt-3 md:0">
                                    <a href={item.href} className="hover:underline me-4 md:me-6">
                                        {item.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </footer>
            {/* footer code is here */}
        </>
    );
};

export default PaymentMethodForm;
