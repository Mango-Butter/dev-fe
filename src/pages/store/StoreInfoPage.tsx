import { useLayout } from "../../hooks/useLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStoreStore from "../../stores/storeStore";
import { getStoreInfo, StoreInfo } from "../../api/store";

const StoreInfoPage = () => {
  useLayout({
    title: "매장 정보",
    theme: "plain",
    bottomNavVisible: false,
  });

  const navigate = useNavigate();
  const { selectedStore } = useStoreStore();
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedStore) {
      alert("선택된 매장정보가 없습니다.");
      navigate("/store");
      return;
    }

    const fetchStoreInfo = async () => {
      try {
        const response = await getStoreInfo(selectedStore.storeId);
        setStoreInfo(response);
      } catch (error) {
        console.error("매장 정보 조회 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, [selectedStore, navigate]);

  if (loading) return <div className="p-6">불러오는 중...</div>;
  if (!storeInfo) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{storeInfo.storeName}</h2>
        <button className="text-blue-500 text-sm">매장 정보 수정</button>
      </div>

      <div className="space-y-4 text-grayscale-700">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined">주소</span>
          <span>{storeInfo.address}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">사업자 등록번호</span>
          <span>{storeInfo.businessNumber}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">업종</span>
          <span>
            {storeInfo.storeType === "CAFE"
              ? "카페"
              : storeInfo.storeType === "RESTAURANT"
                ? "식당"
                : "편의점"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">초대코드</span>
          <span>{storeInfo.inviteCode}</span>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoPage;
