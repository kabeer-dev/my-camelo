import React from "react";

export default function AuthFooter() {
  return (
    <>
      <footer className="">
        <div className="">
          <div className="my-5 lg:my-2">
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-background_steel_blue hover:underline me-4 md:me-6"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-service"
                  className="text-background_steel_blue hover:underline me-4 md:me-6"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <button
                  onClick={() => console.log("Cookies Settings clicked")}
                  className="text-background_steel_blue hover:underline me-4 md:me-6 bg-transparent border-none cursor-pointer"
                >
                  Cookies Settings
                </button>
              </li>
            </ul>
          </div>
          <span className="block text-sm text-gray-500 text-center dark:text-gray-400">
            Copyrights © 2024{" "}
            <a href="https://amk.com/" className="hover:underline mr-1">
              AMK
            </a>
            or its affiliates
          </span>
        </div>
      </footer>
    </>
  );
}
