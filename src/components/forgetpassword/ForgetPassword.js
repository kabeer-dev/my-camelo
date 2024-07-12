import React from "react";
import Heading from "../base/Heading";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputFieldFormik from "../base/InputFieldFormik";
import Button from "../base/Button";
import { useNavigate, useLocation } from "react-router-dom";
import AuthFooter from "../base/AuthFooter";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const initialValues = {
    email: email || "",
  };

  const onSubmit = (values, { setSubmitting }) => {
    console.log("Submitting values:", values);
    alert(`Submitting email: ${values.email}`);
    setSubmitting(false);
    navigate("/forget-password-otp");
  };

  return (
    <>
      <div className="h-screen w-screen position relative">
        <div className="position absolute left-0 top-0">
          <img
            src="/assets/signin/left_vector.png"
            alt="left_vector"
            className="w-24 h-24 md:w-48 md:h-48"
          />
        </div>
        <div className="position absolute right-0 bottom-0">
          <img
            src="/assets/signin/right_vector.png"
            alt="right_vector"
            className="w-24 md:w-48 h-18 md:h-36"
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
            <div className="mt-4 block w-72 md:w-auto p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className="w-auto md:w-96 text-center">
                <Heading
                  title={"Forget your password!"}
                  className={"text-2xl text-[#0E0E11]"}
                />
              </div>

              <div>
                <div className="p-2 md:p-4">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    <Form>
                      <div>
                        <InputFieldFormik
                          label="Enter Your Email Address"
                          name="email"
                          type="email"
                          required
                        />
                      </div>

                      <div className="text-center mt-6">
                        <Button
                          className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded text-sm px-5 py-2.5 me-2 mb-2"
                          label="Confirm"
                          type="submit"
                        />
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>

            <div className="my-2">
              <AuthFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
