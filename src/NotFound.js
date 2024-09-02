import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export default function NotFound() {
  const [t, i18n] = useTranslation("global");
  const language = useSelector((state) => state.auth.language);

  return (
    <>
      <div className="h-screen w-screen position relative">
        <div className="position absolute left-0 top-0" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <img
            src="./assets/signin/left_vector.png"
            alt="left_vector"
            className="w-24 h-24 md:w-48 md:h-48"
          />
        </div>
        <div className="position absolute right-0 bottom-0" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <img
            src="./assets/signin/right_vector.png"
            alt="right_vector"
            className="w-16 md:w-48 h-12 md:h-36"
          />
        </div>

        <main dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {/* Form Section */}
          <div className="mx-auto p-4 h-screen flex items-center justify-center">
            <div >
              <img src="./assets/404page/404.png" alt="404 Page" />
              <h2 className="text-center text-2xl font-bold mt-3">{t("not_found_text")}</h2>
              <div className="flex justify-center w-full mt-4">
                <button
                  className="flex items-center px-4 py-2 border border-gray-400 rounded-full text-gray-700 hover:bg-gray-100"
                  onClick={() => window.location.href = '/mashrouk-new-ui'} // or use a link component if using a router
                >
                  <Icon icon="tabler:arrow-back-up" width="20px" height="20px" className={`${language === 'eng' ? 'mr-3' : 'ml-3'}`}/>
                  {t("back_home_text")}
                </button>
              </div>
            </div>

          </div>
        </main>

      </div>
    </>
  );
}
