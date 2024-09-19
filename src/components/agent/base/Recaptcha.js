// Recaptcha.js

import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import PropTypes from "prop-types";
import "./Recaptcha.css";

const Recaptcha = ({ recaptchaRef, sitekey, onChange }) => {
  
  return (
    <div className="mt-4 custom_recaptcha">
      <ReCAPTCHA ref={recaptchaRef} sitekey={sitekey} onChange={onChange} />
    </div>
  );
};

Recaptcha.propTypes = {
  sitekey: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Recaptcha;
