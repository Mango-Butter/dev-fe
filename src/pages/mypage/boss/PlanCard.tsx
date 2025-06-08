interface PlanCardProps {
  title: string;
  price: string;
  features: string[];
}

export const PlanCard = ({ title, price, features }: PlanCardProps) => {
  return (
    <div className="border rounded-xl p-5 bg-white transition shadow-blue-shadow border-blue-500">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-primary font-semibold mb-3">{price}</p>
      <ul className="text-sm text-gray-700 space-y-1">
        {features.map((feature, idx) => (
          <li key={idx}>• {feature}</li>
        ))}
      </ul>
    </div>
  );
};
