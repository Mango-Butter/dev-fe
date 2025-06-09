interface StatCardProps {
  label: string;
  value: number | string | undefined;
  unit?: string;
}

const StatCard = ({ label, value, unit = "" }: StatCardProps) => {
  const displayValue = value !== undefined && value !== null ? value : "-";

  return (
    <div className="flex-1 p-6 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-grayscale-300 inline-flex flex-col justify-start items-start">
      <div className="w-full flex flex-col justify-start items-start gap-6">
        <div className="w-full justify-start text-grayscale-500 body-1">
          {label}
        </div>
        <div className="self-stretch justify-start text-grayscale-900 text-3xl font-bold">
          {displayValue}
          {unit}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
