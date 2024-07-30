import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { Events, scrollSpy } from "react-scroll";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from '../base/Header';
import Footer from '../base/Footer';
import { useTranslation } from 'react-i18next';

const PaymentMethodForm = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const username = useSelector((state) => state.auth.username);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const language = useSelector((state) => state.auth.language);

    useEffect(() => {
        if (!isLoggedIn) {
            window.location.href = '/';
        }
    }, [isLoggedIn])

    const checkoutId = location.state?.checkoutId;
    const paymentMethodName = location.state?.paymentMethodName;
    const formValues = location.state?.formValues;
    const price = location.state?.price;

    const [t, i18n] = useTranslation("global");

    const baseUrl = window.location.protocol + '//' + window.location.host
    const successUrl = `${baseUrl}/payment-success`;
    const failureUrl = baseUrl + '/payment-failed';

    useEffect(() => {
        localStorage.setItem('payment', true);
        localStorage.setItem('paymentMethodName', paymentMethodName);
        if (checkoutId) {
            // Inject the paymentWidgets.js script
            const paymentWidgetScript = document.createElement('script');
            paymentWidgetScript.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
            paymentWidgetScript.async = true;
            document.body.appendChild(paymentWidgetScript);

            // Inject the wpwlOptions script after paymentWidgets.js is loaded
            paymentWidgetScript.onload = () => {
                const wpwlOptionsScript = document.createElement('script');
                wpwlOptionsScript.type = 'text/javascript';
                wpwlOptionsScript.innerHTML = `
              var wpwlOptions = {
                paymentTarget: "_top",
                locale: '${language === 'eng' ? 'en' : 'ar'}',
                onSuccess: function() {
                  window.location.href = '${successUrl}';
                },
                onFail: function() {
                  window.location.href = '${failureUrl}';
                }
              };
            `;
                document.body.appendChild(wpwlOptionsScript);

            };

            return () => {
                document.body.removeChild(paymentWidgetScript);
            };
        }
    }, [checkoutId]);

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
                    <Header />
                    <div>
                        {/* <h1>Payment Form</h1> */}
                        {checkoutId ? (
                            <div className="flex items-center justify-center min-h-screen">
                                <div>
                                    <div className='flex justify-between' dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                        <Icon icon={language === 'ar' ? "ph:arrow-right" : "ph:arrow-left"} width="25px" height="25px" className="mb-3 cursor-pointer"
                                            onClick={() => {
                                                window.history.back();
                                                localStorage.setItem('hasRefreshed', 'true');
                                                localStorage.setItem('showPaymentMethod', 'true');
                                                localStorage.setItem('price', price);
                                                navigate('/', { state: { showPaymentMethod: true } })
                                            }
                                            }
                                        />
                                        <p className="mb-3 font-bold text-background_steel_blue"> {t("hero.price_text")}: {price} {t("hero.sar_text")}S</p>
                                    </div>
                                    <form
                                        action={successUrl}
                                        className="paymentWidgets"
                                        data-brands={paymentMethodName === 'mada' ? "MADA" : paymentMethodName === 'Credit Card' ? 'VISA MASTER' : ''}
                                    ></form>
                                </div>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>

                    <Footer />

                </>
            )} </>
    );
};

export default PaymentMethodForm;
