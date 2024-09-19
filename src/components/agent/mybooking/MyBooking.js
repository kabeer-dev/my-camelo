import React, { useState, useEffect } from "react";
import { Events, scrollSpy } from "react-scroll";
import { useSelector, useDispatch } from "react-redux";
import BookingCard from "../base/BookingCard";
import { Input } from "antd";
import { setLoading } from "../../../redux/actions/loaderAction";
// import axios from "axios";
import Header from "../base/Header";
import Footer from "../base/Footer";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../Api";

export default function MyBooking() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const language = useSelector((state) => state.auth.language);
  const [t, i18n] = useTranslation("global");
  const [totalPages, setTotalPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filteredPageBookings, setFilteredPageBookings] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;
  useEffect(() => {
    dispatch(setLoading(true));
    const getUserDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_BASE_URL}/api/method/airport_transport.api.agent.get_bookings?language=${
            language ? language : "eng"
          }`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response && response.status === 200) {
          console.log("response me kiya haa agent ki", response);
          const data = response.data.data;
          // console.log('daa', data)
          const totalLength = data.length;
          const divide = totalLength / 9;
          const roundNumber = Math.ceil(divide);

          const listArray = Array.from({ length: roundNumber }, (_, index) => ({
            id: index + 1,
          }));
          // console.log(listArray)
          setTotalPages(listArray);
          setFilteredBookings(data);
          // }
          dispatch(setLoading(false));
        }
      } catch (error) {
        console.error("Error:", error);
        dispatch(setLoading(false));
      }
    };
    getUserDetails();
  }, [token]);

  useEffect(() => {
    Events.scrollEvent.register("begin", function (to, element) {});
    Events.scrollEvent.register("end", function (to, element) {});

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
        const response = await axiosInstance.get(
          `${API_BASE_URL}/api/method/airport_transport.api.agent.get_bookings?language=${
            language ? language : "eng"
          }`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response && response.status === 200) {
          const data = response.data.data;
          setFilteredBookings(data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
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

  useEffect(() => {
    dispatch(setLoading(true));
    let start_index = (currentPage - 1) * 9;
    let end_index = start_index + 9;
    const showArray = filteredBookings.slice(start_index, end_index);
    setFilteredPageBookings(showArray);
    // console.log('sss', showArray)
    dispatch(setLoading(false));
  }, [filteredBookings, currentPage]);

  return (
    <div>
      <Header />

      <div className="pt-20 lg:pt-20" dir={language === "ar" ? "rtl" : "ltr"}>
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
            {filteredPageBookings &&
              filteredPageBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
          </div>
          {filteredPageBookings.length === 0 && (
            <p className="text-text_white text-center mt-10 mb-10">
              {t("my_booking.no_booking_text")}
            </p>
          )}

          <div className="flex justify-end mt-3">
            <nav aria-label="Page navigation example">
              <ul className="flex items-center -space-x-px h-10 text-base">
                <li
                  onClick={() => {
                    currentPage > 1
                      ? setCurrentPage(currentPage - 1)
                      : setCurrentPage(currentPage);
                  }}
                >
                  <a className="flex items-center justify-center cursor-pointer px-4 h-10 ms-0 leading-tight text-text_steel_blue bg-background_white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Previous</span>
                    <svg
                      className="w-3 h-3 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 1 1 5l4 4"
                      />
                    </svg>
                  </a>
                </li>
                {totalPages.map((data, index) => (
                  <li onClick={() => setCurrentPage(data.id)}>
                    <a
                      className={`flex items-center justify-center cursor-pointer px-4 h-10 leading-tight ${
                        currentPage === data.id
                          ? "text-text_white bg-background_steel_blue"
                          : "text-text_steel_blue bg-background_white"
                      } border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                    >
                      {data.id}
                    </a>
                  </li>
                ))}

                <li
                  onClick={() => {
                    currentPage <= filteredPageBookings.length
                      ? setCurrentPage(currentPage + 1)
                      : setCurrentPage(currentPage);
                  }}
                >
                  <a className="flex items-center justify-center cursor-pointer px-4 h-10 leading-tight text-text_steel_blue bg-background_white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-3 h-3 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
