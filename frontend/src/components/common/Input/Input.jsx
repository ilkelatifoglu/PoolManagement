const Input = ({ label, placeholder, type = "text", error, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
        {...props}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default Input;
