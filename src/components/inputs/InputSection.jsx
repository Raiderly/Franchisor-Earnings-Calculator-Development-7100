import React from "react";

const InputSection = ({ title, children }) => {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-afi-primary border-b border-gray-200 pb-2.5">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default InputSection;