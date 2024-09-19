// import React from 'react';
// import { useSelector } from 'react-redux';
// import './Loader.css';

// const Loader = () => {
//   const loading = useSelector(state => state.loader.loading);

//   if (!loading) {
//     return null;
//   }

//   return (
//     <div className="loader-container" id="global-loader">
//       <video className="loader-video" autoPlay loop muted>
//         <source src="./assets/loader/loader.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//     </div>
//   );
// };

// export default Loader;

import React from "react";
import LoaderImage from "./loaderImg.png";
import AppLogo from "./appLogo.png";
import "./Loader.css";
import { useSelector } from "react-redux";

export default function Loader() {
  const loading = useSelector((state) => state.loader.loading);

  if (!loading) {
    return null;
  }

  return (
    <div className="loader-container" id="global-loader">
      <div className="loader-image-container">
        <img src={LoaderImage} alt="loader" className="loader-img-setting" />
        <img src={AppLogo} alt="Logo" className="AppLogo-setting" />
      </div>
    </div>
  );
}
