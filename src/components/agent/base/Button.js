import React from "react";
// import PropTypes from "prop-types";

export default function Button({
  className = "",
  onClick = () => {},
  label,
  disabled = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      className={`${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

// Button.propTypes = {
//   className: PropTypes.string,
//   onClick: PropTypes.func,
//   label: PropTypes.string,
//   disabled: PropTypes.bool,
//   type: PropTypes.oneOf(["button", "submit", "reset"]),
// };
