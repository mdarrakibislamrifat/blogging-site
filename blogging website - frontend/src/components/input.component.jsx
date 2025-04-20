export default function InputBox({ name, type, id, value, placeholder, icon }) {
  return (
    <div className="relative w-[100%] mb-4">
      <input
        name={name}
        type={type}
        id={id}
        defaultValue={value}
        placeholder={placeholder}
        className="input-box"
      />
      <i className={`fi ${icon} input-icon`}></i>
    </div>
  );
}
