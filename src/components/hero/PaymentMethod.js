import { Icon } from "@iconify/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from 'axios';
import { setLoading } from "../../redux/actions/loaderAction";

export default function PaymentMethod({ formValues, price}) {
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
console.log('sss', price)
  // useEffect(() => {
  //   const hasRefreshed = localStorage.getItem('hasRefreshed');
  //   if (hasRefreshed) {
  //     localStorage.removeItem('hasRefreshed');
  //     window.location.reload();
  //   }
  // }, []);

  useEffect(() => {
    if (!isLoggedIn) {
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
    if (paymentMethodName === 'mada' || paymentMethodName === 'Credit Card') {
      let entryId;
      if (paymentMethodName === 'mada') {
        entryId = '8ac7a4ca8c31c0ef018c3463d225039d'
      } else if (paymentMethodName === 'Credit Card') {
        entryId = '8ac7a4ca8c31c0ef018c34634bf30399'
      }
      const url = 'https://eu-test.oppwa.com/v1/checkouts';
      const data = new URLSearchParams({
        'entityId': entryId,
        'amount': '92.00',
        'currency': 'SAR',
        'paymentType': 'DB',
        // 'PaymentMethods': 'VISA, MASTER',
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
        navigate('/payment-confirmation', { state: { checkoutId: checkoutId, paymentMethodName: paymentMethodName, formValues: formValues } })
        dispatch(setLoading(false));
      } catch (error) {
        console.log("Error", error);
        dispatch(setLoading(false));
      }

    } else {
      const path = '/paybylink/v1';
      const url = `https://eu-test.oppwa.com${path}`;
      const data = new URLSearchParams({
        'entityId': '8ac7a4c8893f263a0189403d3d72019b',
        'amount': '2',
        'currency': 'USD',
        'paymentType': 'DB',
        'merchant.name': 'Camelo',
        'merchantTransactionId': 'A-123456',
        'shopperResultUrl': 'https://wordpresshyperpay.docs.oppwa.com/integrations/paybylink',
        'customer.givenName': 'John',
        'customer.surname': 'Doe',
        'customer.mobile': '+491111122222',
        'customer.email': 'john.doe@email.com',
        'layout.logo': 'https://wordpresshyperpay.docs.oppwa.com/sites/all/themes/devportal_theme/images/more-than-sportswear/logo.png',
        'layout.logoWidth': '317px',
        'layout.logoHeight': '117px',
        'layout.backgroundImage': 'https://wordpresshyperpay.docs.oppwa.com/sites/all/themes/devportal_theme/images/more-than-sportswear/header.jpg',
        'layout.merchantNameColor': '#ffffff',
        'layout.amountColor': '#ffffff',
        'layout.payButtonColor': '#0dcaf0',
        'layout.payButtonTextColor': '#ffffff',
        'validUntil': '1',
        'validUntilUnit': 'DAY',
        'termsAndConditionsUrl': 'https://mtsTandCs.com',
        'privacyPolicyUrl': 'https://mtsPrivacyPolicy.com',
        'collectBilling': 'street1,houseNumber1,postcode,city,country',
        'mandatoryBilling': 'street1,houseNumber1,postcode,city,country',
        'billing.street1': 'Some Road',
        'billing.houseNumber1': '1234',
        'billing.postcode': '54321',
        'billing.city': 'New York',
        'billing.country': 'US',
        'createQRCode': 'true',
        'cart.items[0].currency': 'USD',
        'cart.items[0].description': 'Premium Soccer Shoes',
        'cart.items[0].merchantItemId': '1',
        'cart.items[0].name': 'Premium Soccer Shoes',
        'cart.items[0].price': '2',
        'cart.items[0].quantity': '1',
        'cart.items[0].totalAmount': '2',
        'cart.items[1].currency': 'USD',
        'cart.items[1].description': 'Blue-White Fan Trikot',
        'cart.items[1].merchantItemId': '2',
        'cart.items[1].name': 'Blue-White Fan Trikot',
        'cart.items[1].price': '72.99',
        'cart.items[1].quantity': '2',
        'cart.items[1].totalAmount': '145.98',
        'cart.items[2].currency': 'USD',
        'cart.items[2].description': 'Champion Soccer Ball',
        'cart.items[2].merchantItemId': '3',
        'cart.items[2].name': 'Champion Soccer Ball',
        'cart.items[2].price': '49.99',
        'cart.items[2].quantity': '1',
        'cart.items[2].totalAmount': '49.99'
      });

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer OGFjN2E0Y2E4YzMxYzBlZjAxOGMzNDYyY2E3NTAzOTV8cVliNUd0eUgyellGajI1bg=='
        }
      };

      try {
        const response = await axios.post(url, data.toString(), config);
        console.log(response)
      } catch (error) {
        console.error('Error:', error);
      }

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
        <div className="mx-2 font-bold text-background_steel_blue">{price} SAR</div>
      </div>

      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className="flex flex-row justify-between items-center py-3 border-b border-border_color cursor-pointer"
          onClick={() => handlePaymentMethodClick(method.name)} // Add onClick event handler
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
