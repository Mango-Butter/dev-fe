import React from "react";

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  return (
    <div className={`flex justify-center items-center ${className ?? ""}`}>
      <div className="w-5 h-5 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;
