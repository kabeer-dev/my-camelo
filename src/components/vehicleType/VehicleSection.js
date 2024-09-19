import React, { useEffect } from "react";
import Paragraph from "../base/Paragraph";
import Heading from "../base/Heading";
import VehicleCard from "./VehicleCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Vehicle.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleTypesRequest } from "../../redux/actions/vehicleTypeAction";
import { useTranslation } from "react-i18next";

export default function VehicleSection() {
  const dispatch = useDispatch();

  const { vehicleTypes } = useSelector((state) => state.vehicleTypes);
  const language = useSelector((state) => state.auth.language);
  const [t, i18n] = useTranslation("global")

  useEffect(() => {
    dispatch(fetchVehicleTypesRequest());
  }, [dispatch]);

  // const settings = {
  //   dots: false,
  //   arrow: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   responsive: [
  //     {
  //       breakpoint: 640, // Breakpoint for small devices
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1,
  //         arrow: true,
  //         infinite: true,
  //         dots: false,
  //       },
  //     },
  //   ],
  // };

  const settings = {
    dots: false,
    arrow: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 500,
        settings: {
          slidesToScroll: 1,
          dots: false,
          infinite: true,
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToScroll: 1,
          dots: false,
          infinite: true,
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToScroll: 1,
          dots: false,
          infinite: true,
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          dots: false,
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          dots: false,
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          dots: false,
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToScroll: 1,
          dots: false,
          infinite: true,
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToScroll: 1,
          dots: false,
          infinite: true,
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1700,
        settings: {
          slidesToScroll: 1,
          dots: false,
          infinite: true,
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1900,
        settings: {
          slidesToScroll: 1,
          dots: false,
          infinite: true,
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 2000,
        settings: {
          slidesToScroll: 1,
          dots: false,
          infinite: true,
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 2100,
        settings: {
          slidesToScroll: 1,
          dots: false,
          infinite: true,
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 2400,
        settings: {
          slidesToScroll: 1,
          dots: false,
          infinite: true,
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 2500,
        settings: {
          slidesToScroll: 1,
          dots: false,
          infinite: true,
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 3200,
        settings: {
          slidesToScroll: 1,
          dots: false,
          infinite: true,
          slidesToShow: 5,
        },
      },
    ],
  };

  return (
    <div className="px-6 md:px-12 pb-5 md:pb-10" >
      <div className="mt-2 md:mt-3 mb-4 md:mb-7 flex flex-col md:flex-row justify-between items-start" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="w-full md:w-1/2">
          <Heading
            title={t("vehicle_type.heading")}
            className="text-5xl text-text_steel_blue"
          />
        </div>
        <div className="w-full md:w-1/2 mt-3 md:mt-0">
          <Paragraph
           title={t("vehicle_type.paragraph")}
            className="text-lg text-[#454545]"
          />
        </div>
      </div>

      <Slider className="solutionpage-first-slider"  {...settings}>
        {vehicleTypes &&
          vehicleTypes.message &&
          vehicleTypes.message.map((vehicle, index) => (
            <VehicleCard
              key={index}
              carName={vehicle.name}
              carType={vehicle.short_name}
              carImage={vehicle.image}
              availableSeats={vehicle.seats}
              luggage={vehicle.luggage}
              driver={vehicle.driver}
              securityCamera={vehicle.security_camera}
              trackingSystem={vehicle.tracking_system}
              wifiSystem={vehicle.wifi}
            />
          ))}
      </Slider>
    </div>
  );
}
