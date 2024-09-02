import React from 'react';
import { useSelector } from 'react-redux';
import './Loader.css';

const Loader = () => {
  const loading = useSelector(state => state.loader.loading);

  if (!loading) {
    return null;
  }

  return (
    <div className="loader-container">
      <video className="loader-video" autoPlay loop muted>
        <source src="./assets/loader/loader.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Loader;
