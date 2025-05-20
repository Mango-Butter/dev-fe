// src/components/document/DocumentCard.tsx
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface DocumentCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  to: string;
}

const DocumentCard = ({ icon, title, description, to }: DocumentCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white border rounded-xl p-3 flex flex-col items-center text-sm cursor-pointer"
      onClick={() => navigate(to)}
    >
      {icon}
      <p>{title}</p>
      <span className="text-center body-4 text-grayscale-500 mt-1 whitespace-pre-line">
        {description}
      </span>
    </div>
  );
};

export default DocumentCard;
