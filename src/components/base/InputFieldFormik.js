import React, { useState } from "react";
import { Field, ErrorMessage, useField } from "formik";
import PropTypes from "prop-types";
import { Select, TimePicker, Input } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "../base/InputFieldSetting.css";
import moment from "moment/moment";
import { Icon } from "@iconify/react";
import creditCardType from "credit-card-type";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";
import axios from "axios";

dayjs.extend(customParseFormat);

const InputFieldFormik = ({
  type,
  name,
  label,
  options = [],
  value,
  onChange = () => {},
  arrivalDates = null,
  setArrivalDates = () => {},
  percentageValue,
  placeholder,
}) => {
  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;
  const [timeError, setTimeError] = useState("");
  const [, , helpers] = useField(name);

  const [t, i18n] = useTranslation("global");
  const language = useSelector((state) => state.auth.language);

  const currentDate = new Date().toLocaleDateString("en-CA");

  const handleSelectChange = (value) => {
    onChange?.({ fieldName: name, selectedValue: value });
    helpers.setValue(value);
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    onChange?.({ fieldName: name, selectedValue: checked });
    helpers.setValue(checked);
  };

  const handleKeyPress = (event) => {
    if (
      (name === "phone" || name === "mobile_number" || name === "postcode") &&
      !/[0-9]/.test(event.key)
    ) {
      event.preventDefault();
    }
  };

  const [hours, setHours] = useState(0);
  useEffect(() => {
    const geRestrictedtHours = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/method/airport_transport.api.bookings.get_settings`
        );
        setHours(Math.ceil(response.data.data.booking_allowed_time / 60));
      } catch (error) {
        console.error("Error fetching service status", error);
      }
    };
    geRestrictedtHours();
  }, [API_BASE_URL]);

  const handleTimeChange = (time, timeString) => {
    if (arrivalDates) {
      if (arrivalDates === currentDate) {
        const currentTime = dayjs();
        const selectedTime = dayjs(timeString, "HH:mm");

        if (selectedTime.isBefore(currentTime.add(hours, "hour"))) {
          setTimeError(
            `${t("errors.hour_2_error")} ${hours} ${
              language === "ar" ? "ساعات" : "hours"
            }`
          );
          helpers.setValue("");
          return;
        }
      }

      setTimeError("");
      onChange?.({ fieldName: name, selectedValue: timeString });
      helpers.setValue(timeString);
    } else {
      setTimeError(t("errors.date_first_error"));
    }
  };

  const renderErrorMessage = (msg) => (
    <div className="mt-2 text-sm text-text_warning dark:text-red-500">
      {msg}
    </div>
  );

  const pastDateSelect = (current) =>
    current && current >= dayjs().startOf("day");
  const futureDateSelect = (current) =>
    current && current < dayjs().startOf("day");

  const commonProps = {
    name,
    className: "text-gray-900 text-sm block w-full",
  };

  const [cardType, setCardType] = useState("");
  const [cardFormetedValue, setCardFormetedValue] = useState("");
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formattedValue = value.replace(/(.{4})/g, "$1 ").trim();
    const detectedCardType = creditCardType(value)[0]?.type;

    setCardType(detectedCardType);
    setCardFormetedValue(formattedValue);
    e.target.value = formattedValue;
    if (formattedValue < 18) {
      setCardType("");
    }
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 mt-2 lg:mt-1 text-sm font-medium text-gray-900 dark:text-white rtl:text-right"
      >
        {label}
      </label>

      {type === "select" && (
        <>
          <Select
            direction={language === "ar" ? "rtl" : "ltr"}
            size="large"
            style={{ height: "45px" }}
            showSearch
            // placeholder={`${language === "ar" ? "يختار" : "Select"} ${label}`}
            optionFilterProp="children"
            onChange={handleSelectChange}
            options={options}
            // value={value}
            value={
              value
                ? value
                : `${language === "ar" ? "يختار" : "Select"} ${label}`
            }
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            {...commonProps}
          />
        </>
      )}

      {type === "checkbox" && (
        <div className="mb-3 flex flex-row justify-between items-center">
          <div>
            <div className="text-sm text-text_grey">
              <span>{`${t("hero.select_shared_ride_text")}`} </span>
              <span className="text-text_steel_blue font-bold">
                {language === "eng" ? "discount" : "خصم"} {percentageValue}%
              </span>
            </div>
          </div>
          <div>
            <Field
              type={type}
              name={name}
              onChange={handleCheckboxChange}
              className="mr-2 text-gray-900 text-sm block transform scale-150 checkbox-custom"
            />
          </div>
          <ErrorMessage name={name} render={renderErrorMessage} />
        </div>
      )}

      {type === "dob" && (
        <>
          <DatePicker
            selected={value ? new Date(value) : null}
            onChange={(date, dateString) => helpers.setValue(date)}
            dateFormat="yyyy/MM/dd"
            maxDate={new Date()}
            className={`react-datepicker text-gray-900 text-sm block w-full bg-white text-gray-600 rounded-md p-2 border border-gray-200 h-10`}
            placeholderText={`${
              language === "ar" ? "حدد التاريخ" : "Select Date"
            } `}
            wrapperClassName="w-full"
          />
          <ErrorMessage name={name} render={renderErrorMessage} />
        </>
      )}

      {type === "arrivalDate" && (
        <>
          <DatePicker
            selected={value ? new Date(value) : null}
            onChange={(date, dateString) => {
              setArrivalDates(date.toLocaleDateString("en-CA"));
              helpers.setValue(date);
            }}
            dateFormat="yyyy/MM/dd"
            minDate={new Date()}
            className={`react-datepicker text-gray-900 text-sm block w-full bg-white text-gray-600 rounded-md p-2 border border-gray-200 h-10`}
            placeholderText={`${
              language === "ar" ? "حدد التاريخ" : "Select Date"
            } `}
            wrapperClassName="w-full"
          />
          <ErrorMessage name={name} render={renderErrorMessage} />
        </>
      )}

      {type === "password" && (
        <div className="relative">
          <Field name={name}>
            {({ field }) => (
              <Input.Password
                placeholder={placeholder}
                style={{ height: "45px" }}
                {...field}
                {...commonProps}
              />
            )}
          </Field>
        </div>
      )}

      {type === "arrivalTime" && (
        <>
          <TimePicker
            placeholder={`${language === "ar" ? "حدد الوقت" : "Select Time"} `}
            size="large"
            style={{ height: "45px" }}
            onChange={handleTimeChange}
            value={value ? moment(value, "HH:mm") : null}
            defaultOpenValue={
              value ? dayjs(value, "HH:mm") : dayjs("00:00", "HH:mm")
            }
            {...commonProps}
            format="HH:mm"
          />
          {timeError && renderErrorMessage(timeError)}
          <ErrorMessage name={name} render={renderErrorMessage} />
        </>
      )}

      {["text", "email", "number", "tel"].includes(type) && (
        <Field direction={language === "ar" ? "rtl" : "ltr"} name={name}>
          {({ field }) => (
            <Input
              placeholder={placeholder}
              size="large"
              style={{ height: "45px" }}
              {...field}
              type={type}
              onKeyPress={handleKeyPress}
              {...commonProps}
            />
          )}
        </Field>
      )}

      {["pick-up", "drop-off"].includes(type) && (
        <Field direction={language === "ar" ? "rtl" : "ltr"} name={name}>
          {({ field }) => (
            <Input
              placeholder={placeholder}
              size="large"
              style={{ height: "45px" }}
              {...field}
              type={type}
              onKeyPress={handleKeyPress}
              {...commonProps}
              value={value ? value : ""}
              onChange={(value) => helpers.setValue(value.value)}
            />
          )}
        </Field>
      )}

      {["description"].includes(type) && (
        <Field direction={language === "ar" ? "rtl" : "ltr"} name={name}>
          {({ field }) => (
            <TextArea
              placeholder={placeholder}
              size="large"
              style={{ height: "45px" }}
              {...field}
              type={type}
              onKeyPress={handleKeyPress}
              {...commonProps}
            />
          )}
        </Field>
      )}

      {["card"].includes(type) && (
        <Field name={name}>
          {({ field }) => (
            <div className="relative flex items-center">
              <Input
                placeholder={placeholder}
                size="large"
                style={{ height: "45px" }}
                {...field}
                onKeyPress={handleKeyPress}
                onChange={(e) => {
                  field.onChange(e);
                  handleCardNumberChange(e);
                }}
                {...commonProps}
                value={cardFormetedValue}
                className="w-full pr-10"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                {cardType === "visa" && <Icon icon="logos:visa" />}
                {cardType === "mastercard" && (
                  <Icon icon="logos:mastercard" className="text-2xl" />
                )}
              </div>
            </div>
          )}
        </Field>
      )}

      {["readOnly"].includes(type) && (
        <Field name={name}>
          {({ field }) => (
            <Input
              style={{ height: "45px" }}
              {...field}
              value={value}
              onKeyPress={handleKeyPress}
              {...commonProps}
              readOnly
            />
          )}
        </Field>
      )}

      <ErrorMessage name={name} render={renderErrorMessage} />
    </div>
  );
};

InputFieldFormik.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  onChange: PropTypes.func,
  arrivalDates: PropTypes.string,
  setArrivalDates: PropTypes.func,
};

export default InputFieldFormik;
