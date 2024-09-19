import React, { useState, useEffect } from "react";
import { Events, scrollSpy } from "react-scroll";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import axios from "axios";
import { setLoading } from "../../redux/actions/loaderAction";
import { useTranslation } from "react-i18next";
import Header from "../base/Header";
import Footer from "../base/Footer";

export default function CheckPaymentStatus() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  dispatch(setLoading(true));

  const language = useSelector((state) => state.auth.language);
  const [t, i18n] = useTranslation("global");

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/";
    }
  }, [isLoggedIn]);

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
    const getPaymentStatus = async () => {
      const cId = localStorage.getItem("checkId");
      const entityId = "8ac7a4ca8c31c0ef018c34634bf30399";
      const url = `https://eu-test.oppwa.com/v1/checkouts/${cId}/payment?entityId=${entityId}`;

      const options = {
        headers: {
          Authorization:
            "Bearer OGFjN2E0Y2E4YzMxYzBlZjAxOGMzNDYyY2E3NTAzOTV8cVliNUd0eUgyellGajI1bg==",
        },
      };
      try {
        const response = await axios.get(url, options);
        if (response.data.result.code === "000.100.112") {
          navigate("/payment-success");
        } else if (response.data.result.code === "800.100.152") {
          navigate("/payment-failed");
        } else {
          console.log("err", response);
        }
      } catch (err) {
        console.log("Status Error", err);
        if (err.response.data.result.code === "200.300.404") {
          navigate("/payment-failed");
        }
      }
    };
    getPaymentStatus();
    dispatch(setLoading(false));
  }, []);

  return (
    <>
      {isLoggedIn && (
        <div>
          <Header />
            <div className="mt-20 flex justify-center align-center">
                Loading...
            </div>
          <Footer />
        </div>
      )}
    </>
  );
}
