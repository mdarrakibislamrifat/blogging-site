import { useState } from "react";
export default function InputBox({ name, type, id, value, placeholder, icon }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-[100%] mb-4">
      <input
        name={name}
        type={type == "password" && passwordVisible ? "text" : type}
        id={id}
        defaultValue={value}
        placeholder={placeholder}
        className="input-box"
      />
      <i className={`fi ${icon} input-icon`}></i>
      {type === "password" ? (
        <i
          className={
            "fi fi-rr-eye" +
            (passwordVisible ? "-crossed" : "") +
            " input-icon right-4 left-auto cursor-pointer"
          }
          onClick={() => setPasswordVisible((currentVal) => !currentVal)}
        ></i>
      ) : (
        ""
      )}
    </div>
  );
}
