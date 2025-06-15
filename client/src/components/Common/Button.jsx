import React from "react";

const Button = ({ children, onClick, primary, className }) => {
  const baseClass =
    "py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2";
  const primaryClass =
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
  const secondaryClass =
    "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500";

  const buttonClass = `${baseClass} ${
    primary ? primaryClass : secondaryClass
  } ${className}`;

  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

export default Button;