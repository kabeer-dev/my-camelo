import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Heading from "../base/Heading";
import Paragraph from "../base/Paragraph";

export default function ServiceCard({ services }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  function handleMouseEnter(index) {
    setHoveredIndex(index);
  }

  function handleMouseLeave() {
    setHoveredIndex(null);
  }

  return (
    // <div className="flex flex-col md:flex-row justify-between items-start">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services &&
        services.map((service, index) => {
          const isHovered = index === hoveredIndex;

          const cardClasses = isHovered
            ? "bg-background_steel_blue"
            : "bg-background_grey";
          const iconClasses = isHovered
            ? "bg-background_white text-text_steel_blue"
            : "bg-background_steel_blue text-text_white";
          const textClasses = isHovered ? "text-text_white" : "text-black";

          return (
            <div
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              className={`h-auto w-full md:mx-2 mt-2 rounded-lg px-6 py-10 transition-all duration-300 ${cardClasses}`}
            >
              <div className="w-full flex justify-end mb-9">
                <div
                  className={`w-[80px] h-[80px] rounded-full flex flex-row justify-center items-center transition-all duration-300 ${iconClasses}`}
                >
                  {service.id ? (
                    <>
                      <img
                        src={service.icon}
                        alt={service.id}
                        width="48px"
                        height="48px"
                      />
                    </>
                  ) : (
                    <>
                      <Icon icon={service.icon} width="48px" height="48px" />
                    </>
                  )}
                </div>
              </div>
              <div className="mt-9">
                <div className="mb-3">
                  <Heading
                    title={service.id ? service.service_name : service.heading}
                    className={`text-3xl transition-all duration-300 ${textClasses}`}
                  />
                </div>
                <div className="mb-3">
                  <Paragraph
                    title={
                      service.id ? service.service_desc : service.paragraph
                    }
                    className={`text-sm transition-all duration-300 ${textClasses}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
