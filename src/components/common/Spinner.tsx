import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-5 h-5 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;
