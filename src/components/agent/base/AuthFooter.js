import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function AuthFooter() {
  const language = useSelector((state) => state.auth.language);
  const [t, i18n] = useTranslation("global");

  return (
    <>
      <footer className="" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="">
          <div className="my-5 lg:my-2">
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a
                  href="/mashrouk-new-ui/agent/privacy-policy"
                  className="text-background_steel_blue hover:underline me-4 md:me-6"
                >
                  {t("footer.items_2.privacy_text")}
                </a>
              </li>
              <li>
                <a
                  href="/mashrouk-new-ui/agent/terms-condition"
                  className="text-background_steel_blue hover:underline me-4 md:me-6"
                >
                  {t("footer.items_2.terms_text")}
                </a>
              </li>
              {/* <li>
                <button
                  onClick={() => console.log("Cookies Settings clicked")}
                  className="text-background_steel_blue hover:underline me-4 md:me-6 bg-transparent border-none cursor-pointer"
                >
                  {t("footer.items_2.cookies_text")}
                </button>
              </li> */}
            </ul>
          </div>
          <span className="block text-sm text-gray-500 text-center dark:text-gray-400">
            {t("copy_rights_text")}{" "}
            <a href="https://amk.com/" className="hover:underline mr-1">
            {t("amk_text")}
            </a>
            {t("or_affiliates_text")}
          </span>
        </div>
      </footer>
    </>
  );
}
