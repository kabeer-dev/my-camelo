import React, { useEffect } from "react";
import { Element, Events, scrollSpy } from "react-scroll";
import HeroSection from "./components/hero/HeroSection";
import ServiceSection from "./components/services/ServiceSection";
import VehicleSection from "./components/vehicleType/VehicleSection";
import Loader from "./components/loader/Loader";
import Header from "./components/base/Header";
import Footer from "./components/base/Footer";

export default function Layout() {
  // Define array of menu items with corresponding component IDs
  const menuItems = [
    { id: "home", text: "Home", component: HeroSection },
    { id: "services", text: "Services", component: ServiceSection },
    { id: "vehicleType", text: "Vehicle Type", component: VehicleSection },
    // Add more menu items as needed
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

  return (
    <>
      <Loader />
      <div>
        <Header />

        <div className="pt-20 lg:pt-20">
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
