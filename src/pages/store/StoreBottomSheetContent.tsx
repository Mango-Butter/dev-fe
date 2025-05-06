import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button.tsx";
import useBottomSheetStore from "../../stores/useBottomSheetStore.ts";
import { getStoreList, StoreSummary } from "../../api/store.ts";
import { useEffect, useState } from "react";
import ErrorIcon from "../../components/icons/ErrorIcon.tsx";
import useStoreStore from "../../stores/storeStore.ts";

const StoreBottomSheetContent = () => {
  const navigate = useNavigate();
  const { setBottomSheetOpen } = useBottomSheetStore();
  const { selectedStore, setSelectedStore } = useStoreStore();
  const [tempSelectedStore, setTempSelectedStore] =
    useState<StoreSummary | null>(selectedStore); // ✅ 임시 상태
  const [storeList, setStoreList] = useState<StoreSummary[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStoreRegister = () => {
    setBottomSheetOpen(false);
    navigate("/store/register");
  };

  const handleSelectStore = (store: StoreSummary) => {
    setTempSelectedStore(store); // ✅ 전역 상태 아님
  };

  const handleConfirm = () => {
    if (tempSelectedStore) {
      setSelectedStore(tempSelectedStore); // ✅ 여기서만 전역 store 업데이트
    }
    setBottomSheetOpen(false); // 바텀시트 닫기
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const stores = await getStoreList();
        setStoreList(stores);
      } catch (error) {
        console.error("매장 조회 실패", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  if (loading) return <div className="text-center py-8">불러오는 중...</div>;

  return (
    <div className="flex flex-col h-full">
      {/* 상단: 매장 추가 버튼 */}
      <div
        onClick={handleStoreRegister}
        className="flex justify-end w-full flex-1  bg-white mb-4"
      >
        <span className="body-2text-grayscale-900 cursor-pointer">
          + 매장 추가하기
        </span>
      </div>

      {/* 매장 리스트 */}
      <div className="flex flex-col h-[50dvh] relative">
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32">
          {!storeList || storeList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="flex p-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-center gap-2.5 self-stretch">
                <ErrorIcon className="w-9 h-9" />
                <div className="body-2 text-center text-grayscale-700">
                  현재 등록된 매장이 없습니다!
                  <br />
                  매장을 추가해 주세요.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {storeList.map((store) => {
                const isSelected = tempSelectedStore?.storeId === store.storeId;
                return (
                  <div
                    key={store.storeId}
                    onClick={() => handleSelectStore(store)}
                    className={`flex p-4 border border-grayscale-300 bg-white rounded-xl flex-col justify-center items-start gap-2 cursor-pointer transition-shadow duration-150 ${
                      isSelected ? "shadow-blue-shadow" : "shadow-basic"
                    }`}
                  >
                    <span className="body-3 text-grayscale-500">
                      {store.storeType}
                    </span>
                    <span className="heading-2">{store.storeName}</span>
                    <div className="flex gap-2">
                      <span className="body-2 text-grayscale-900">주소</span>
                      <span className="body-2 text-grayscale-600">
                        {store.address}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="body-2 text-grayscale-900">
                        초대코드
                      </span>
                      <span className="body-2 text-grayscale-600">
                        {store.inviteCode}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 하단 완료 버튼 */}
      <Button
        size="lg"
        theme="ghost2"
        state="default"
        className="w-full flex-1"
        onClick={handleConfirm} // ✅ 완료 시 전역 store 반영
      >
        완료
      </Button>
    </div>
  );
};

export default StoreBottomSheetContent;
