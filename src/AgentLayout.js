import React, { useEffect } from "react";
import { Element, Events, scrollSpy } from "react-scroll";
import HeroSection from "./components/agent/hero/HeroSection";
import ServiceSection from "./components/agent/services/ServiceSection";
import VehicleSection from "./components/agent/vehicleType/VehicleSection";
import Loader from "./components/agent/loader/Loader";
import Header from "./components/agent/base/Header";
import Footer from "./components/agent/base/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { agentChange } from "./redux/actions/authActions";
import axios from "axios";
import { setLoading } from "./redux/actions/loaderAction";

export default function AgentLayout() {
  // Define array of menu items with corresponding component IDs
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const agent = useSelector((state) => state.auth.agent);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const email = useSelector((state) => state.auth.email);
  // const email = location.state?.email;
  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;
  // if(agentValue){
  //   dispatch(agentChange('true'))
  // }
  // console.log('ss', agent, email, isLoggedIn);

  useEffect(() => {
    dispatch(setLoading(true))
    if (email && isLoggedIn) {
      const checkAgent = async () => {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/method/airport_transport.api.user.detect_email?email=${email}`);
          if (response && response.status === 200) {
            console.log('ss', response.data.msg)
            if(response.data.msg !== 'Agent User'){
              console.log('yes')
              navigate('/')
            }
          }
        } catch (error) {
          console.log('Error', error)
        }
      }
      checkAgent()
    }else if(!agent || !isLoggedIn){
      navigate('/')
    }

    dispatch(setLoading(false))

  }, [])

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
      {isLoggedIn && (
        <>
          <Loader />
          <div>
            <Header />

            <div className="lg:pt-20">
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
      )}

    </>
  );
}
