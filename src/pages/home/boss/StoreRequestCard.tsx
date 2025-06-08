import { useEffect, useState } from "react";
import { getStoreRequestSummary } from "../../../api/boss/store.ts";
import ArrowIcon from "../../../components/icons/ArrowIcon.tsx";
import { useNavigate } from "react-router-dom";

interface StoreRequestCardProps {
  storeId: number;
}

const StoreRequestCard = ({ storeId }: StoreRequestCardProps) => {
  const [requestedCount, setRequestedCount] = useState(0);
  const [profileImageUrls, setProfileImageUrls] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const redirectRequestPage = () => {
    navigate("/boss/alarm?type=request");
  };
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getStoreRequestSummary(storeId);
        setRequestedCount(data.requestedCount);
        setProfileImageUrls(data.profileImageUrls);
      } catch (err) {
        console.error("매장 요청 조회 실패", err);
      } finally {
        setLoaded(true);
      }
    };

    fetch();
  }, [storeId]);

  if (!loaded || requestedCount === 0) return null;

  return (
    <div className="flex justify-between items-center p-4 border border-grayscale-300 bg-white shadow-basic rounded-xl w-full">
      <div className="flex gap-2 items-center">
        <span className="title-2">변경요청</span>
        <span className="text-white title-4 bg-warning rounded-full text-center px-1.5 py-0.5">
          {requestedCount}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex items-center gap-0.5 relative">
          {profileImageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt="프로필"
              className="w-6 h-6 rounded-full border-2 border-white"
              style={{ marginLeft: index === 0 ? 0 : -10 }}
            />
          ))}
        </div>
        <button onClick={redirectRequestPage}>
          <ArrowIcon direction="right" />
        </button>
      </div>
    </div>
  );
};

export default StoreRequestCard;
