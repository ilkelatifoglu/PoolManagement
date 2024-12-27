import "./button.css";

const Button = ({
  children,
  type = "button",
  isLoading = false,
  fullWidth = false,
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`custom-button ${fullWidth ? "full-width" : ""}`}
      onClick={onClick}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <span className="loading-spinner"></span> : children}
    </button>
  );
};

export default Button;
