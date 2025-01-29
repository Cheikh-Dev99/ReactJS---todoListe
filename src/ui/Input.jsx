import PropTypes from "prop-types";

export default function Input({
  type = "text",
  value,
  onChange,
  onKeyDown,
  placeholder,
  className = "",
  required = false,
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      required={required}
      className={`p-2 border rounded outline-none focus:border-blue-500 ${className}`}
    />
  );
}

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
};
