/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "by_hour_bg": "url('../public/assets/hero/ride_by_bg.png')",
        "scheduled_ride_bg": "url('../public/assets/hero/scheduled_ride_bg.png')",
        "airport_ride_bg": "url('../public/assets/hero/airport_ride_bg.png')",
      },
    },
    colors: {
      background_steel_blue: "#C3A58B",
      background_white: "#ffffff",
      background_grey: "#F6F6F6",
      background_darkgrey: "#E7E7E7",
      text_white: "#ffffff",
      text_black: "#000000",
      text_lightdark_grey: "#5D5D5D",
      text_grey: "#B0B0B0",
      text_steel_blue: "#C3A58B",
      hover_steel_blue: "#C3A58B",
      bg_btn_back : "#5d5d5d",
      text_warning : "#ff0f0f",
      border_color: "#E1E1E6",
      border_black: "#000000",
      bg_light_gray: "#B0B0B0"
    },
  },
  plugins: [],
};