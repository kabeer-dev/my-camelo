import React, { useEffect } from "react";
import { Element, Events, scrollSpy } from "react-scroll";
import HeroSection from "./components/hero/HeroSection";
import ServiceSection from "./components/services/ServiceSection";
import VehicleSection from "./components/vehicleType/VehicleSection";
import Loader from "./components/loader/Loader";
import Header from "./components/base/Header";
import Footer from "./components/base/Footer";
import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setLoading } from "./redux/actions/loaderAction";
import axiosInstance from "./Api";

export default function Layout() {
  // Define array of menu items with corresponding component IDs
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;
  const email = useSelector((state) => state.auth.email);
  const agent = useSelector((state) => state.auth.agent);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const menuItems = [
    { id: "home", text: "Home", component: HeroSection },
    { id: "services", text: "Services", component: ServiceSection },
    { id: "vehicleType", text: "Vehicle Type", component: VehicleSection },
    // Add more menu items as needed
  ];

  useEffect(() => {
    dispatch(setLoading(true));
    if (email && isLoggedIn) {
      const checkUser = async () => {
        try {
          const response = await axiosInstance.post(
            `${API_BASE_URL}/api/method/airport_transport.api.user.detect_email?email=${email}`
          );
          if (response && response.status === 200) {
            if (response.data.msg !== "Transport User") {
              navigate("/mashrouk-new-ui/agent");
            }
          }
        } catch (error) {
          console.log("Error", error);
        }
      };
      checkUser();
    }
    dispatch(setLoading(false));
  }, []);

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
      <Loader />
      <div>
        <Header />

        <div className="pt-0 md:pt-0 lg:pt-0 xl:pt-20 2xl:pt-20">
          {" "}
          {/* Add padding to offset the fixed header */}
          {/* Render corresponding component based on menu item */}
          {menuItems.map((item) => (
            <Element key={item.id} name={item.id} className="element">
              <item.component />
            </Element>
          ))}
        </div>

        <Footer />
      </div>
    </>
  );
}
