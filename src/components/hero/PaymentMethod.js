import { Icon } from "@iconify/react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function PaymentMethod() {
  const navigate = useNavigate(); // Initialize useNavigate
  const { isLoggedIn } = useSelector((state) => state.auth);
  const paymentMethods = [
    { id: 1, image: "/assets/paymentmethod/madapay.png", name: "" },
    { id: 2, image: "/assets/paymentmethod/paypal.png", name: "PayPal" },
    { id: 3, image: "/assets/paymentmethod/applepay.png", name: "Apple Pay" },
    {
      id: 4,
      image: "/assets/paymentmethod/creditcardpay.png",
      name: "Credit Card",
    },
    { id: 5, image: "/assets/paymentmethod/bankpay.png", name: "Pay By Bank" },
  ];

  const handlePaymentMethodClick = () => {
    navigate("/payment-confirmation"); // Navigate to payment-confirmation
  };

  return (
    <>
      <div className="flex flex-row justify-center items-center text-3xl pb-8 border-b border-border_color">
        <div className="mx-2">Your Ride Cost</div>
        <div className="mx-2 font-bold text-background_steel_blue">57 SAR</div>
      </div>

      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className="flex flex-row justify-between items-center py-3 border-b border-border_color cursor-pointer"
          onClick={handlePaymentMethodClick} // Add onClick event handler
        >
          <div className="flex flex-row justify-between items-center">
            <div className="mx-2">
              <img src={method.image} alt={method.name} />
            </div>
            <div className="mx-2">{method.name}</div>
          </div>
          <div>
            <Icon
              icon="ep:arrow-right"
              width="1.2em"
              height="1.2em"
              className="text-text_black"
            />
          </div>
        </div>
      ))}
    </>
  );
}
