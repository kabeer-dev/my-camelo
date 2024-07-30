import React, { useState, useEffect } from "react";
import { Events, scrollSpy } from "react-scroll";
import { useSelector, useDispatch } from "react-redux";
import BookingCard from "../base/BookingCard";
import { Input } from "antd";
import { setLoading } from "../../redux/actions/loaderAction";
import axios from "axios";
import Header from "../base/Header";
import Footer from "../base/Footer";
import { useTranslation } from "react-i18next";

export default function MyBooking() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const language = useSelector((state) => state.auth.language);
  const [t, i18n] = useTranslation("global");

  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;
  useEffect(() => {
    dispatch(setLoading(true));
    const getUserDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/method/airport_transport.api.bookings.my_bookings?page=1&language=${language ? language : 'eng'}`, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
          },
        });
        if (response && response.status === 200) {
          const data = response.data.data;
          // console.log('aaa', data)
          // if(data.length > 0){
          setFilteredBookings(data)
          // }

          dispatch(setLoading(false));
        }
      }
      catch (error) {
        console.error('Error:', error);
        dispatch(setLoading(false));
      };
    }
    getUserDetails();
  }, [token])

  // const testBookings = [
  //   {
  //     id: "booking1",
  //     status: "Completed",
  //     bookingId: "xyz789",
  //     rideType: "Airport Ride",
  //     riderEmail: "john.doe@example.com",
  //     time: "08:45 AM",
  //     date: "3/5/2024",
  //     ridersNumber: 4,
  //     vehicleType: "Minivan",
  //     bookingPrice: "35.00 SAR",
  //   },
  //   {
  //     id: "booking2",
  //     status: "Completed",
  //     bookingId: "abc123",
  //     rideType: "City Ride",
  //     riderEmail: "jane.smith@example.com",
  //     time: "11:30 AM",
  //     date: "3/6/2024",
  //     ridersNumber: 2,
  //     vehicleType: "Electric Scooter",
  //     bookingPrice: "12.50 SAR",
  //   },
  //   {
  //     id: "booking3",
  //     status: "Cancelled",
  //     bookingId: "def456",
  //     rideType: "Airport Ride",
  //     riderEmail: "mike.jones@example.com",
  //     time: "09:00 AM",
  //     date: "3/7/2024",
  //     ridersNumber: 3,
  //     vehicleType: "Luxury Sedan",
  //     bookingPrice: "50.75 SAR",
  //   },
  //   {
  //     id: "booking4",
  //     status: "Booked",
  //     bookingId: "ghi789",
  //     rideType: "City Ride",
  //     riderEmail: "emily.davis@example.com",
  //     time: "02:00 PM",
  //     date: "3/8/2024",
  //     ridersNumber: 1,
  //     vehicleType: "Compact Car",
  //     bookingPrice: "15.20 SAR",
  //   },
  //   {
  //     id: "booking5",
  //     status: "Completed",
  //     bookingId: "jkl012",
  //     rideType: "Airport Ride",
  //     riderEmail: "chris.white@example.com",
  //     time: "05:45 PM",
  //     date: "3/9/2024",
  //     ridersNumber: 5,
  //     vehicleType: "Van",
  //     bookingPrice: "40.00 SAR",
  //   },
  //   {
  //     id: "booking6",
  //     status: "Cancelled",
  //     bookingId: "mno345",
  //     rideType: "City Ride",
  //     riderEmail: "sarah.green@example.com",
  //     time: "10:30 AM",
  //     date: "3/10/2024",
  //     ridersNumber: 2,
  //     vehicleType: "Hybrid Car",
  //     bookingPrice: "22.50 SAR",
  //   },
  // ];

  const [filteredBookings, setFilteredBookings] = useState([]);


  useEffect(() => {
    Events.scrollEvent.register("begin", function (to, element) { });
    Events.scrollEvent.register("end", function (to, element) { });

    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);

  const handleSearch = async (e) => {
    if (e.target.value === "") {
      const value = e.target.value.toLowerCase();
      setSearchText(value);
      dispatch(setLoading(true));
      try {
        const response = await axios.get(`${API_BASE_URL}/api/method/airport_transport.api.bookings.my_bookings?page=1&language=${language ? language : 'eng'}`, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
          },
        });
        if (response && response.status === 200) {
          const data = response.data.data;
          setFilteredBookings(data)
        }
      }
      catch (error) {
        console.error('Error:', error);
      };
      dispatch(setLoading(false));
    } else {
      const value = e.target.value.toLowerCase();
      setSearchText(value);
      const filtered = filteredBookings.filter((booking) =>
        Object.values(booking).join(" ").toLowerCase().includes(value)
      );
      setFilteredBookings(filtered);
    }
  };

  return (
    <div>
      <Header />

      <div className="pt-20 lg:pt-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="px-14 py-7 border-t border-text_white bg-background_steel_blue">
          <div>
            <Input.Search
              placeholder={t("my_booking.search_bookings_text")}
              onChange={handleSearch}
              value={searchText}
              className="mb-4"
            />
          </div>
          {/* card content should be here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-0">
            {/* card of booking */}
            {filteredBookings &&
              filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
          </div>
          {filteredBookings.length === 0 && (
            <p className="text-text_white text-center mt-10 mb-10">{t("my_booking.no_booking_text")}</p>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
