import React, { useRef, useState, useEffect } from "react";

const OTPInput = ({ value = "", onChange, length = 6 }) => {
  // Ensure value is a string before splitting
  const [otp, setOtp] = useState((value || "").toString().split(""));
  const inputRefs = useRef([]);

  // Update internal state when value prop changes
  useEffect(() => {
    setOtp((value || "").toString().split(""));
  }, [value]);

  const handleChange = (index, e) => {
    const inputValue = e.target.value;
    if (isNaN(inputValue)) return;

    const newOtp = [...otp];
    // Take only the last digit if multiple digits are pasted
    newOtp[index] = inputValue.slice(-1);
    setOtp(newOtp);

    // Combine the OTP digits and call the onChange handler
    const otpValue = newOtp.join("");
    onChange({ target: { name: "otp", value: otpValue } });

    // Move to next input if value is entered
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedOtp = pastedData.slice(0, length).split("");

    if (pastedOtp.some((char) => isNaN(char))) return;

    const newOtp = [...otp];
    pastedOtp.forEach((digit, index) => {
      newOtp[index] = digit;
    });
    setOtp(newOtp);

    const otpValue = newOtp.join("");
    onChange({ target: { name: "otp", value: otpValue } });
  };

  return (
    <div className="flex flex-wrap justify-center w-full max-w-md mx-auto">
      <div className="flex gap-2 sm:gap-3 md:gap-1">
        {[...Array(length)].map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            value={otp[index] || ""}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-[35px] h-[35px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px]
                       text-center text-sm sm:text-base md:text-lg font-semibold
                       rounded-lg border border-gray-300
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                       transition-colors outline-none"
            inputMode="numeric"
            pattern="\d*"
            required
          />
        ))}
      </div>
    </div>
  );
};

export default OTPInput;
