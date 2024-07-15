import { Icon } from "@iconify/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from 'axios';
import { setLoading } from "../../redux/actions/loaderAction";

export default function PaymentMethod() {
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  useEffect(() =>{
    if(!isLoggedIn){
      window.location.href = '/';
    }
  }, [isLoggedIn])
  const paymentMethods = [
    { id: 1, image: "/assets/paymentmethod/madapay.png", name: "mada" },
    // { id: 2, image: "/assets/paymentmethod/paypal.png", name: "PayPal" },
    // { id: 3, image: "/assets/paymentmethod/applepay.png", name: "Apple Pay" },
    {
      id: 4,
      image: "/assets/paymentmethod/creditcardpay.png",
      name: "Credit Card",
    },
    { id: 5, image: "/assets/paymentmethod/bankpay.png", name: "Pay By Link" },
  ];

  const handlePaymentMethodClick = async (paymentMethodName) => {
    dispatch(setLoading(true));
    const url = 'https://eu-test.oppwa.com/v1/checkouts';
    const data = new URLSearchParams({
      'entityId': '8ac7a4ca8c31c0ef018c3463d225039d',
      'amount': '92.00',
      'currency': 'SAR',
      'paymentType': 'DB',
      // 'PaymentMethods': 'MADA',
      'testMode': 'EXTERNAL',
    });
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer OGFjN2E0Y2E4YzMxYzBlZjAxOGMzNDYyY2E3NTAzOTV8cVliNUd0eUgyellGajI1bg=='
      }
    };

    try {
      const response = await axios.post(url, data, options);
      // console.log(response.data);
      const checkoutId = response.data.id
      navigate('/payment-confirmation', {state: { checkoutId: checkoutId }})
      dispatch(setLoading(false));
    } catch (error) {
      console.log("Error", error);
      dispatch(setLoading(false));
    }
    dispatch(setLoading(false));
    // navigate("/payment-confirmation", {state: { paymentMethodName: paymentMethodName }}); // Navigate to payment-confirmation
  };

  return (
    // <>
    //   {isLoggedIn && (
        <>
          <div className="flex flex-row justify-center items-center text-3xl pb-8 border-b border-border_color">
            <div className="mx-2">Your Ride Cost</div>
            <div className="mx-2 font-bold text-background_steel_blue">57 SAR</div>
          </div>

          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex flex-row justify-between items-center py-3 border-b border-border_color cursor-pointer"
              onClick={()=> handlePaymentMethodClick(method.name)} // Add onClick event handler
            >
              <div className="flex flex-row justify-between items-center">
                <div className="mx-2">
                  <img src={method.image} alt={method.name} />
                </div>
                <div className="mx-2">{method.name !== 'mada' ? method.name : ''}</div>
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

        {/* </>
      )} */}
    </>
  );
}
