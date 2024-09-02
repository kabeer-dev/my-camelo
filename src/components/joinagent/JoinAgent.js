import React, { useState, useEffect, useRef } from "react";
import { Events, scrollSpy } from "react-scroll";
import { useSelector, useDispatch } from "react-redux";
import BookingCard from "../base/BookingCard";
import { Input } from "antd";
import { setLoading } from "../../redux/actions/loaderAction";
// import axios from "axios";
import Header from "../base/Header";
import Footer from "../base/Footer";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import InputFieldFormik from "../base/InputFieldFormik";
import Button from "../base/Button";
import Recaptcha from "../base/Recaptcha";
import * as Yup from "yup";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../Api';

export default function JoinAgent() {
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const language = useSelector((state) => state.auth.language);
    const [t, i18n] = useTranslation("global");
    const recaptchaRef = React.createRef();

    const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

    const [dragging, setDragging] = useState(false);
    const [showFile, setShowFile] = useState("")
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [formValues, setFormValues] = useState({
        company_name: "",
        email: "",
        mobile: "",
        company_sector: "",
        city: "",
        country: "",
        description: "",
        attachments: "",
    });

    const validationSchema = Yup.object().shape({
        company_name: Yup.string().required("Company Name is Required"),
        email: Yup.string().required("Email is Required"),
        mobile: Yup.string().required("Mobile Number is Required"),
        company_sector: Yup.string().required("Compnay Sector is Required"),
        city: Yup.string().required("City is Required"),
        country: Yup.string().required("Country is Required"),
        description: Yup.string().required("Description is Required"),
        // attachments: Yup.string().required("Attachments is Required"),
    });


    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = async (event) => {
        dispatch(setLoading(true));
        const file = event.target.files[0];
        // console.log(file)
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await axiosInstance.post(`${API_BASE_URL}/api/method/airport_transport.api.user.upload_file`, formData);
                if (response && response.status === 200) {
                    setFormValues((prevformValues) => ({
                        ...prevformValues,
                        attachments: response.data.data,
                    }));
                    message.success("Image uploaded Successfully");
                    setShowFile(file)
                }
            }
            catch (error) {
                message.error(error.response.data.msg)
                console.log('Error', error)
            }

        } else {
            console.log('No file selected.');
        }
        dispatch(setLoading(false));
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        setDragging(false);
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            const formData = new FormData();
            formData.append('file', droppedFile);
            try {
                const response = await axiosInstance.post(`${API_BASE_URL}/api/method/airport_transport.api.user.upload_file`, formData);
                if (response && response.status === 200) {
                    setFormValues((prevformValues) => ({
                        ...prevformValues,
                        attachments: response.data.data,
                    }));
                    message.success("Image uploaded Successfully")
                    setShowFile(droppedFile)
                }
            }
            catch (error) {
                message.error(error.response.data.msg)
                console.log('Error', error)
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const featuresData = [
        { id: '1', img: "/assets/joinagent/featureLogo.png", name: t("feature_text"), description: t("feature_details_text") },
        { id: '2', img: "/assets/joinagent/featureLogo.png", name: t("feature_text"), description: t("feature_details_text") },
        { id: '3', img: "/assets/joinagent/featureLogo.png", name: t("feature_text"), description: t("feature_details_text") },
        { id: '4', img: "/assets/joinagent/featureLogo.png", name: t("feature_text"), description: t("feature_details_text") },
        { id: '5', img: "/assets/joinagent/featureLogo.png", name: t("feature_text"), description: t("feature_details_text") },
        { id: '6', img: "/assets/joinagent/featureLogo.png", name: t("feature_text"), description: t("feature_details_text") },
        { id: '7', img: "/assets/joinagent/featureLogo.png", name: t("feature_text"), description: t("feature_details_text") },
        { id: '8', img: "/assets/joinagent/featureLogo.png", name: t("feature_text"), description: t("feature_details_text") },
        { id: '9', img: "/assets/joinagent/featureLogo.png", name: t("feature_text"), description: t("feature_details_text") },
        { id: '10', img: "/assets/joinagent/featureLogo.png", name: t("feature_text"), description: t("feature_details_text") },
        { id: '11', img: "/assets/joinagent/featureLogo.png", name: t("feature_text"), description: t("feature_details_text") },
        { id: '12', img: "/assets/joinagent/featureLogo.png", name: t("feature_text"), description: t("feature_details_text") },
    ]

    let featurePairs = [];
    // useEffect(() => {
    function groupInPairs(arr) {
        for (let i = 0; i < featuresData.length; i += 2) {
            let pair = featuresData.slice(i, i + 2); // Get the next pair of items
            featurePairs.push(pair);
        }
        featurePairs = featurePairs;
    }
    groupInPairs()
    // }, []);

    const onSubmit = async (values, { setSubmitting }) => {
        dispatch(setLoading(true));
        if (recaptchaToken === null) {
            message.error("recaptcha Token Token is Required")
        } else if (formValues.attachments === '') {
            message.error("Image is Required")
        } else {
            values.attachments = formValues.attachments
            try {
                const headers = {
                    "Content-Type": "application/json",
                    recaptchaToken: recaptchaToken,
                };
                const response = await axiosInstance.post(`${API_BASE_URL}/api/method/airport_transport.api.agent.application`,
                    values,
                    { headers: headers }
                );
                if (response && response.status === 200) {
                    // console.log(response)
                    message.success(response.data.msg);
                    navigate('/mashrouk-new-ui/request-submit')
                }
            }
            catch (error) {
                message.error(error.response?.data?.msg)
                console.log('Error', error)
            }
        }
        dispatch(setLoading(false));
        setSubmitting(false);
    }


    return (
        <div>
            <Header />

            <div className="py-5 md:py-10 px-10 md:px-20 flex flex-col md:flex-col lg:flex-row mt-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="md:w-[592px]">
                    <div className="container mx-auto p-4">
                        <Formik
                            initialValues={{
                                company_name: formValues.company_name,
                                email: formValues.email,
                                mobile: formValues.mobile,
                                company_sector: formValues.company_sector,
                                city: formValues.city,
                                country: formValues.country,
                                description: formValues.description,
                                attachments: formValues.attachments,
                            }}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {({ values, isSubmitting, setFieldValue }) => (
                                <Form className="space-y-3">

                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                                        <div>
                                            <InputFieldFormik
                                                label={t("company_name_text")}
                                                name="company_name"
                                                type="text"
                                                placeholder="Enter Company Name"
                                                value={formValues.company_name}
                                                onChange={(valueObj) => {
                                                    const { fieldName, selectedValue } =
                                                        valueObj;
                                                    setFieldValue(fieldName, selectedValue);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                                        <div dir="ltr">
                                            <InputFieldFormik
                                                label={t("company_email")}
                                                name="email"
                                                type="text"
                                                placeholder="Enter Company Email"
                                                value={formValues.email}
                                                onChange={(e) => {
                                                    values.email = e.target.value;
                                                    setFormValues((prevformValues) => ({
                                                        ...prevformValues,
                                                        email: e.target.value,
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                                        <div>
                                            <InputFieldFormik
                                                label={t("mobile_number")}
                                                name="mobile"
                                                type="text"
                                                placeholder="Enter Company Mobile Number"
                                                value={formValues.mobile}
                                                onChange={(e) => {
                                                    values.mobile = e.target.value;
                                                    setFormValues((prevformValues) => ({
                                                        ...prevformValues,
                                                        mobile: e.target.value,
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                                        <div>
                                            <InputFieldFormik
                                                label={t("company_sector")}
                                                name="company_sector"
                                                type="text"
                                                placeholder="Enter Company Sector"
                                                value={formValues.company_sector}
                                                onChange={(e) => {
                                                    values.company_sector = e.target.value;
                                                    setFormValues((prevformValues) => ({
                                                        ...prevformValues,
                                                        company_sector: e.target.value,
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <InputFieldFormik
                                                label={t("my_profile.city_text")}
                                                name="city"
                                                type="text"
                                                placeholder="Enter city"
                                                value={formValues.city}
                                                onChange={(e) => {
                                                    values.city = e.target.value;
                                                    setFormValues((prevformValues) => ({
                                                        ...prevformValues,
                                                        city: e.target.value,
                                                    }));
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <InputFieldFormik
                                                label={t("country_text")}
                                                name="country"
                                                type="text"
                                                placeholder="Enter Country"
                                                value={formValues.country}
                                                onChange={(e) => {
                                                    values.country = e.target.value;
                                                    setFormValues((prevformValues) => ({
                                                        ...prevformValues,
                                                        country: e.target.value,
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <InputFieldFormik
                                            label={t("description_text")}
                                            name="description"
                                            type="description"
                                            placeholder="Enter Description"
                                            value={formValues.description}
                                            onChange={(e) => {
                                                values.description = e.target.value;
                                                setFormValues((prevformValues) => ({
                                                    ...prevformValues,
                                                    description: e.target.value,
                                                }));
                                            }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <label className="text-text_black font-medium text-sm">{t("compnay_profile")}</label>
                                        <div className="bg-background_grey flex items-center justify-center"
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                        >
                                            <div className="bg-background_grey p-6 ">
                                                <img src="./assets/joinagent/upload_Icon.png" alt="Upload Icon" className="m-auto" />
                                                <p
                                                    onClick={handleClick}
                                                    className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 m-auto"
                                                >
                                                    {/* <FontAwesomeIcon icon={faUpload} className="mr-2" /> */}
                                                    <span className="text-md font-bold mr-2">{t("darg_text")}r</span>
                                                    <button className="font-bold text-text_steel_blue underline">{t("browse_text")}</button>
                                                </p>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />

                                                <p className="text-sm mt-5 text-text_lightdark_grey">{t("support_text")}</p>
                                            </div>
                                        </div>

                                    </div>

                                    {/* <div>
                                        {formValues.attachments && showFile && (
                                            <img src={URL.createObjectURL(showFile)} alt="img"  className="w-64 h-64 object-cover" />
                                        )}
                                    </div> */}

                                    <div>
                                        <Recaptcha
                                            recaptchaRef={recaptchaRef}
                                            sitekey="6LfE3FEpAAAAAGkeBjkpPeNSqPNWtLPCma7EHVsr"
                                            onChange={(value) => {
                                                setRecaptchaToken(value);
                                            }}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        label={t("submit_your_text")}
                                        className="bg-background_steel_blue w-full text-text_white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                        disabled={isSubmitting}
                                    />
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                <div className="md:w-[552px]">
                    <div className="container mx-auto p-4 bg-background_steel_blue rounded-md ml-10 rtl:mr-10">
                        <p className="text-text_white text-center text-lg">
                            {t("advantagies_text")}
                        </p>
                        <img src="./assets/joinagent/logo.png" alt="logo" className="mt-3 m-auto" />
                        <div>
                            {featurePairs.map((feature) => (
                                <div key={feature.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-10">
                                    <div className="flex">
                                        <img src="./assets/joinagent/featureLogo.png" />
                                        <div className="ml-3">
                                            <p className="text-text_white">{feature[0].name}</p>
                                            <p className="text-text_white">{feature[0].description}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <img src="./assets/joinagent/featureLogo.png" />
                                            <div className="ml-3">
                                                <p className="text-text_white">{feature[1].name}</p>
                                                <p className="text-text_white">{feature[1].description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
