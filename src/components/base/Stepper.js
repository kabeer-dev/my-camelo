import React from "react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";

const Stepper = ({ steps, subTab, className }) => {
  const activeStepIndex = steps.findIndex((step) => step.id === subTab);
  const stepWidth = `${100 / steps.length}%`;
  const language = useSelector((state) => state.auth.language);

  return (
    <ol className={className} style={{ borderColor: "lightgray" }}>
      {steps.map((step, index) => (
        <li
          key={index}
          className={`flex items-center ${
            index === activeStepIndex ? "text-blue-600" : "text-gray-500"
          } ${index === steps.length - 1 ? "justify-end" : "justify-between"}`}
          style={{ width: stepWidth }}
        >
          <div className="flex flex-col md:flex-row items-center pr-2">
            <span
              className={`flex items-center justify-center w-5 h-5 me-2 text-xs rounded-full shrink-0 ${
                index === activeStepIndex
                  ? "bg-background_steel_blue text-text_white"
                  : index < activeStepIndex
                  ? "bg-background_steel_blue text-text_white"
                  : "bg-background_grey text-gray-500"
              }`}
            >
              {index + 1}
            </span>
            <span className="font-bold mt-4 md:mt-0">{step.text}</span>
          </div>
          {index < steps.length - 1 && (
            <Icon
              icon={`${language === 'eng' ? 'iconamoon:arrow-right-2-light' : 'iconamoon:arrow-left-2-light'}`}
              width="28px"
              height="28px"
              style={{ color: "#787878" }}
            />
          )}
        </li>
      ))}
    </ol>
  );
};

export default Stepper;
