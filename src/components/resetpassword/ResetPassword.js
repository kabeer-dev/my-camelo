import React, { useState } from "react";
import Heading from "../base/Heading";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputFieldFormik from "../base/InputFieldFormik";
import Button from "../base/Button";
import { useNavigate } from "react-router-dom";
import AuthFooter from "../base/AuthFooter";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [validationStatus, setValidationStatus] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    symbol: false,
  });

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password cannot be more than 20 characters")
      .matches(/[A-Z]/, "Password must have at least 1 uppercase letter")
      .matches(/[a-z]/, "Password must have at least 1 lowercase letter")
      .matches(/[@$!%*?&#]/, "Password must have at least 1 symbol"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const initialValues = {
    newPassword: "",
    confirmNewPassword: "",
  };

  const onSubmit = (values, { setSubmitting }) => {
    console.log("Submitting values:", values);
    alert(`Submitting new password: ${values.newPassword}`);
    setSubmitting(false);
    navigate("/");
  };

  const handlePasswordChange = (password) => {
    const length = password.length >= 8 && password.length <= 20;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const symbol = /[@$!%*?&#]/.test(password);

    setValidationStatus({
      length,
      uppercase,
      lowercase,
      symbol,
    });
  };

  return (
    <div className="h-screen w-screen position relative">
      <div className="position absolute left-0 top-0">
        <img
          src="/assets/signin/left_vector.png"
          alt="left_vector"
          className="w-20 h-20 md:w-48 md:h-48"
        />
      </div>
      <div className="position absolute right-0 bottom-0">
        <img
          src="/assets/signin/right_vector.png"
          alt="right_vector"
          className="w-16 md:w-48 h-12 md:h-36"
        />
      </div>

      <div className="z-20 w-screen h-screen flex flex-row justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <div className="mb-4 cursor-pointer" onClick={() => navigate("/")}>
            <img
              src="/assets/signin/logo.png"
              alt="Moshrouk Trips"
              className="w-16 h-13"
            />
          </div>
          <div className="block w-72 md:w-auto p-5 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div>
              <div className="w-auto md:w-[400px] text-left">
                <Heading
                  title={"Reset Your Password"}
                  className={"text-2xl text-[#0E0E11] text-center md:text-left"}
                />
              </div>
              <div className="text-sm text-text_lightdark_grey text-center md:text-left">
                Enter Your New Password
              </div>
            </div>

            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ handleChange, handleBlur, values }) => (
                  <Form>
                    <div>
                      <InputFieldFormik
                        label="New Password"
                        name="newPassword"
                        type="password"
                        required
                        onChange={(e) => {
                          handleChange(e);
                          handlePasswordChange(e.target.value);
                        }}
                        onBlur={handleBlur}
                        value={values.newPassword}
                      />
                    </div>

                    <div className="my-2">
                      <InputFieldFormik
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        type="password"
                        required
                      />
                    </div>

                    <div className="my-3">
                      <div
                        className={`my-2 flex flex-row justify-start items-center ${
                          validationStatus.length
                            ? "text-text_steel_blue"
                            : "text-red-500"
                        }`}
                      >
                        <Icon
                          icon="teenyicons:tick-outline"
                          width="24px"
                          height="24px"
                        />
                        <div className="text-sm ml-2">
                          Your password must contain between 8 and 20 characters
                        </div>
                      </div>

                      <div
                        className={`my-2 flex flex-row justify-start items-center ${
                          validationStatus.uppercase
                            ? "text-text_steel_blue"
                            : "text-red-500"
                        }`}
                      >
                        <Icon
                          icon="teenyicons:tick-outline"
                          width="24px"
                          height="24px"
                        />
                        <div className="text-sm ml-2">
                          Your password must have at least 1 uppercase letter
                        </div>
                      </div>

                      <div
                        className={`my-2 flex flex-row justify-start items-center ${
                          validationStatus.lowercase
                            ? "text-text_steel_blue"
                            : "text-red-500"
                        }`}
                      >
                        <Icon
                          icon="teenyicons:tick-outline"
                          width="24px"
                          height="24px"
                        />
                        <div className="text-sm ml-2">
                          Your password must have at least 1 lowercase letter
                        </div>
                      </div>

                      <div
                        className={`my-2 flex flex-row justify-start items-center ${
                          validationStatus.symbol
                            ? "text-text_steel_blue"
                            : "text-red-500"
                        }`}
                      >
                        <Icon
                          icon="teenyicons:tick-outline"
                          width="24px"
                          height="24px"
                        />
                        <div className="text-sm ml-2">
                          Your password must have at least 1 symbol
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-3 md:mt-6">
                      <Button
                        className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 mb-2"
                        label="Save"
                        type="submit"
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          <div className="my-2">
            <AuthFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
