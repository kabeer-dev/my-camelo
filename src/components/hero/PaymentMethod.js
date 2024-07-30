
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from 'axios';
import { setLoading } from "../../redux/actions/loaderAction";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export default function PaymentMethod({
  formValues,
  correctPrice,
  selectedPickup,
  selectedDropoff,
  location,
  destination,
  sharedRideValue,
  setSubTab,
  setShowSignUp,
  setShowAlreadyRegistered,
  setShowOTPScreen,
  setHideCreateAccountButton,
  setShowPhone,
  setHidePhoneCreateAccountButton,
  setShowPhoneOTPScreen,
  setShowPaymentMethod,
  rideName
}) {
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const username = useSelector((state) => state.auth.username);
  const token = useSelector((state) => state.auth.token);
  const language = useSelector((state) => state.auth.language);

  const [t, i18n] = useTranslation("global");

  const [userEmail, setUserEmail] = useState(null);

  let price;
  const getPrice = localStorage.getItem('price');
  if (correctPrice) {
    price = correctPrice
  }
  else {
    price = parseInt(getPrice, 10);
  }
  console.log('ssss', price)
  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;
  useEffect(() => {
    const geyUser = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(`${API_BASE_URL}/api/method/airport_transport.api.user.get_user_info`, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
          },
        });
        if (response && response.status === 200) {
          setUserEmail(response.data.data.email)
          dispatch(setLoading(false));
        }
      }
      catch (error) {
        console.error('Error:', error);
        dispatch(setLoading(false));
      };
    }
    geyUser()
  }, [])
  // useEffect(() => {
  //   const hasRefreshed = localStorage.getItem('hasRefreshed');
  //   if (hasRefreshed) {
  //     localStorage.removeItem('hasRefreshed');
  //     window.location.reload();
  //   }
  // }, []);
  const getRandomDigit = () => Math.floor(Math.random() * 10);
  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/';
    }
  }, [isLoggedIn])
  const paymentMethods = [
    { id: 1, image: "/assets/paymentmethod/madapay.png", name: "mada", displayName: t("hero.mada_text") },
    // { id: 2, image: "/assets/paymentmethod/paypal.png", name: "PayPal" },
    // { id: 3, image: "/assets/paymentmethod/applepay.png", name: "Apple Pay" },
    {
      id: 4,
      image: "/assets/paymentmethod/creditcardpay.png",
      name: "Credit Card",
      displayName: t("hero.credit_text")
    },
    { id: 5, image: "/assets/paymentmethod/bankpay.png", name: "Pay By Link", displayName: t("hero.pay_link_text") },
  ];

  const handlePaymentMethodClick = async (paymentMethodName) => {
    dispatch(setLoading(true));
    let randomDigits = '';
    for (let i = 0; i < 10; i++) {
      randomDigits += getRandomDigit();
    }
    const arrivalDate = new Date(formValues.arrivalDate);

    const year = arrivalDate.getFullYear();
    const month = String(arrivalDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so we add 1
    const day = String(arrivalDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const bookingData = {
      ticket: randomDigits,
      airport: formValues?.airportName ? formValues.airportName : '',
      rider: formValues?.seatNumber ? formValues.seatNumber : '',
      destination: selectedDropoff ? `${selectedDropoff.lat}, ${selectedDropoff.lng}` : destination,
      destination_name: destination,
      city: formValues?.arrivalCity ? formValues.arrivalCity : '',
      terminal: formValues?.terminalNumber,
      arrival_date: formattedDate,
      arrival_time: formValues?.arrivalTime ? formValues.arrivalTime : '',
      vehicle_type: formValues?.vehicleType ? formValues.vehicleType : '',
      ride_discount: sharedRideValue,
      price: price,
      user: userEmail,
      language: language ? language : 'eng',
      location: location,
      zone: formValues?.airportName ? formValues.airportName : '',
      // hours: formValues?.bookingByHours ? formValues.bookingByHours: '',
      drop_off: selectedDropoff ? `${selectedDropoff.lat}, ${selectedDropoff.lng}` : "",
      pick_up: selectedPickup ? `${selectedPickup.lat}, ${selectedPickup.lng}` : "",
      pickup: selectedPickup ? `${selectedPickup.lat}, ${selectedPickup.lng}` : "",
      service_type: rideName
    }


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
        'amount': price,
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
        var bookingValues = JSON.stringify(bookingData);
        localStorage.setItem('bookingValues', bookingValues);
        localStorage.setItem('saveData', false);
        localStorage.setItem('paymentMethodName', paymentMethodName);
        const checkoutId = response.data.id
        navigate('/payment-confirmation', { state: { checkoutId: checkoutId, paymentMethodName: paymentMethodName, formValues: formValues, price: price } })
        dispatch(setLoading(false));
      } catch (error) {
        console.log("Error", error);
        dispatch(setLoading(false));
      }

    } else {
      const baseUrl = window.location.protocol + '//' + window.location.host
      const successUrl = `${baseUrl}/thank-you`;
      const payByLinkData = {
        "customer.email": userEmail,
        "amount": price.toFixed(2),
        "currency": "SAR",
        "paymentType": "DB",
        "shopperResultUrl": successUrl,
        "doc": {
          "ticket": randomDigits,
          "airport": formValues?.airportName ? formValues.airportName : '',
          "rider": formValues?.seatNumber ? formValues.seatNumber : '',
          "destination": selectedDropoff ? `${selectedDropoff.lat}, ${selectedDropoff.lng}` : destination,
          "destination_name": destination,
          "location": location,
          "city": formValues?.arrivalCity,
          "terminal": formValues?.terminalNumber ? formValues.terminalNumber : '',
          "arrival_date": formattedDate,
          "arrival_time": formValues?.arrivalTime ? formValues.arrivalTime : '',
          "vehicle_type": formValues?.vehicleType ? formValues.vehicleType : '',
          "booking_hours": formValues?.bookingByHours ? formValues.bookingByHours : '',
          "shared_discount": sharedRideValue,
          "user": userEmail,
          // "hours": formValues?.bookingByHours ? formValues.bookingByHours: '',
          "price": price,
          "service_type": rideName,
          "language": language === 'ar' ? language : ""
        }
      }

      console.log('sss', payByLinkData)

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/method/airport_transport.api.integrations.paybylink.generate_link?language=${language ? language : 'eng'}`, payByLinkData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
        );
        if (response?.status === 200) {
          // console.log(response.data);
          const payByLinkPaymentLink = response.data.message.link
          // window.location.href = payByLinkPaymentLink;
          var bookingValues = JSON.stringify(bookingData);
          localStorage.setItem('bookingValues', bookingValues);
          localStorage.setItem('saveData', false);
          localStorage.setItem('paymentMethodName', paymentMethodName);
          navigate('/email-sent', { state: { paymentLink: payByLinkPaymentLink } })
        }
      } catch (error) {
        console.log('Error', error);
      }
    }

    dispatch(setLoading(false));
  };

  return (
    <>
      {isLoggedIn && (
        <>
          <div className="flex flex-row justify-center items-center text-3xl pb-8 border-b border-border_color">
            <Icon icon={language === 'ar' ? "ph:arrow-right" : "ph:arrow-left"} width="25px" height="25px" className="cursor-pointer"
              onClick={() => {
                if(rideName === 'airportRide' || rideName === 'scheduledRide'){
                  setSubTab(3);
                }else{
                  setSubTab(2);
                }
                setShowSignUp(false);
                setShowAlreadyRegistered(false);
                setShowOTPScreen(false);
                setHideCreateAccountButton(false);
                setShowPhone(false);
                setHidePhoneCreateAccountButton(false);
                setShowPhoneOTPScreen(false);
                setShowPaymentMethod(false);
              }
              }
            />
            <div className="mx-2">{t("hero.your_cost_text")}</div>
            <div className="mx-2 font-bold text-background_steel_blue">{price} {t("hero.sar_text")}</div>
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
                <div className="mx-2">{method.displayName !== 'mada' && method.displayName !== 'مدى' ? method.displayName : ''}</div>
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
      )}
    </>
  );
}
