import { useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa";

function PasswordInput({
  value,
  onChange,
  placeholder,
  className,
  onFocus,
  onBlur,
}) {
  const [isShowPassword, setIsPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsPassword(!isShowPassword);
  };

  return (
    <div className="relative">
      <input
        type={isShowPassword ? "text" : "password"}
        className={`w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Enter your password"}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
        onClick={toggleShowPassword}
      >
        {isShowPassword ? (
          <FaRegEyeSlash size={20} />
        ) : (
          <MdOutlineRemoveRedEye size={20} />
        )}
      </button>
    </div>
  );
}

export default PasswordInput;
