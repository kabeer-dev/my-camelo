import React, { useState } from "react";
import { Field, ErrorMessage, useField } from "formik";
import PropTypes from "prop-types";
import { Select, TimePicker, Input } from "antd";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "../base/InputFieldSetting.css";
import moment from "moment/moment";
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { Icon } from "@iconify/react";
import creditCardType from 'credit-card-type';

dayjs.extend(customParseFormat);

const InputFieldFormik = ({
  type,
  name,
  label,
  options,
  value,
  onChange,
  arrivalDates,
  setArrivalDates,
  percentageValue
}) => {
  const [timeError, setTimeError] = useState("");
  const [, , helpers] = useField(name);

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
      (name === "phoneNumber" || name === "postalCode") &&
      !/[0-9]/.test(event.key)
    ) {
      event.preventDefault();
    }
  };
  // console.log("child me arrivalDates me kiya ha??", arrivalDates);
  // console.log("child me currentDate me kiya ha??", currentDate);

  const handleTimeChange = (time, timeString) => {
    // Check if the selected date is the current date
    if (arrivalDates === currentDate) {
      const currentTime = dayjs(); // Get the current time
      const selectedTime = dayjs(timeString, "HH:mm"); // Parse the selected time

      // console.log("Current Time:", currentTime.format("HH:mm"));
      // console.log("Selected Time:", selectedTime.format("HH:mm"));
      // Check if the selected time is at least 2 hours later than the current time
      if (selectedTime.isBefore(currentTime.add(2, "hour"))) {
        setTimeError(
          "You cannot select a time earlier than two hours from now."
        );
        return;
      }
    }

    // If the selected date is not the current date or the time selection is valid
    setTimeError(""); // Clear any previous error
    onChange?.({ fieldName: name, selectedValue: timeString }); // Trigger onChange callback
    helpers.setValue(timeString); // Set the value using formik helpers
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

  //for card
  const [cardType, setCardType] = useState('');
  const [cardFormetedValue, setCardFormetedValue] = useState('');
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16); // Remove non-digits and limit to 16 digits
    const formattedValue = value.replace(/(.{4})/g, '$1 ').trim(); // Add spaces after every 4 digits
    const detectedCardType = creditCardType(value)[0]?.type;

    setCardType(detectedCardType);
    setCardFormetedValue(formattedValue)
    e.target.value = formattedValue;
    if (formattedValue < 18) {
      setCardType("");
    }
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 mt-2 lg:mt-1  text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>

      {type === "select" && (
        <>
          <Select
            size="large"
            showSearch
            placeholder={`Select ${label}`}
            optionFilterProp="children"
            onChange={handleSelectChange}
            options={options}
            value={value}
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
            <div className="text-sm">{`Select Shared ride to get discount ${percentageValue}%`}</div>
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

      {type === "dateOfBirth" && (
        <>
          {/* <DatePicker
            size="large"
            onChange={(date, dateString) => helpers.setValue(dateString)}
            disabledDate={pastDateSelect}
            {...commonProps}
          /> */}
          <DatePicker
            selected={value ? new Date(value) : null}
            onChange={(date, dateString) => helpers.setValue(date)}
            dateFormat="yyyy/MM/dd"
            maxDate={new Date()}
            className={`react-datepicker text-gray-900 text-sm block w-full bg-white text-gray-600 rounded-md p-2 border border-gray-200 h-10`}
            placeholderText="Select Date"
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
            placeholderText="Select Date"
            wrapperClassName="w-full"
          />
          <ErrorMessage name={name} render={renderErrorMessage} />
        </>
        // <>
        //   <DatePicker
        //     size="large"
        //     onChange={(date, dateString) => {
        //       setArrivalDates(dateString);
        //       helpers.setValue(dateString);
        //     }}
        //     // onClick={()=> onChange(name, null)}
        //     // selected={value ? moment(value) : null}
        //     value={value ? moment(value) : null}
        //     // setValue={value}
        //     defaultOpenValue={dayjs() || value}
        //     disabledDate={futureDateSelect}
        //     {...commonProps}
        //   />
        //   <ErrorMessage name={name} render={renderErrorMessage} />
        // </>
      )}

      {type === "password" && (
        <div className="relative">
          <Field name={name}>
            {({ field }) => <Input.Password {...field} {...commonProps} />}
          </Field>
        </div>
      )}

      {type === "arrivalTime" && (
        <>
        <TimePicker
          size="large"
          onChange={handleTimeChange}
          value={value ? moment(value, "HH:mm:ss") : null}
          // setValue={value}
          defaultOpenValue={
            value ? dayjs(value, "HH:mm:ss") : dayjs("00:00:00", "HH:mm:ss")
          }
          {...commonProps}
        />
        {timeError && renderErrorMessage(timeError)}
        <ErrorMessage name={name} render={renderErrorMessage} />
      </>
      )}

      {["text", "email", "number", "tel"].includes(type) && (
        <Field name={name}>
          {({ field }) => (
            <Input
              size="large"
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
                size="large"
                {...field}
                onKeyPress={handleKeyPress}
                onChange={(e) => {
                  field.onChange(e);
                  handleCardNumberChange(e);
                }}
                {...commonProps}
                value={cardFormetedValue}
                className="w-full pr-10" // Tailwind CSS for padding right to make space for the logo
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                {cardType === 'visa' && <Icon icon="logos:visa" />}
                {cardType === 'mastercard' && <Icon icon="logos:mastercard" className="text-2xl" />}
              </div>
            </div>
          )}
        </Field>
      )}

      {["readOnly"].includes(type) && (
        <Field name={name}>
          {({ field }) => (
            <Input
              {...field}
              // type={type}
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

InputFieldFormik.defaultProps = {
  options: [],
  onChange: () => { },
  arrivalDates: null,
  setArrivalDates: () => { },
};

export default InputFieldFormik;
