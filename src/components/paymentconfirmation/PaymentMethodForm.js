import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentMethodForm = () => {
    const location = useLocation();
    const checkoutId = location.state?.checkoutId;
    const successUrl = 'http://localhost:3000/payment-success';
    const failureUrl = 'http://localhost:3000/payment-failed';

    useEffect(() => {
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


    return (
        <div>
            {/* <h1>Payment Form</h1> */}
            {checkoutId ? (
                <form
                    action={successUrl}
                    className="paymentWidgets"
                    data-brands="MADA VISA MASTER"
                ></form>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default PaymentMethodForm;
