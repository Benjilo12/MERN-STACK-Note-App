import { useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa";

function PasswordInput({ value, onChange, placeholder }) {
  const [isShowPassword, setIsPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsPassword(!isShowPassword);
  };
  return (
    <div className="flex items-center bg-transparent border-[1.5px] rounded mb-3">
      <input
        type={isShowPassword ? "text" : "password"}
        className=" w-full text-sm bg-transparent px-3.5 py-3 rouded outline-none "
        value={value}
        onChange={onChange}
        placeholder={placeholder || "password"}
      />

      {isShowPassword ? (
        <MdOutlineRemoveRedEye
          size={22}
          className="text-blue-500 ml-5 mr-3 cursor-pointer"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-black-500 ml-5 mr-3 cursor-pointer"
          onClick={() => toggleShowPassword()}
        />
      )}
    </div>
  );
}

export default PasswordInput;
