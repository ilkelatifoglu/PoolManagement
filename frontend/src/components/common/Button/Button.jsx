import React from "react";
import PropTypes from "prop-types";
import "./button.css";

const Button = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  size = "medium",
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "success"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default Button;
