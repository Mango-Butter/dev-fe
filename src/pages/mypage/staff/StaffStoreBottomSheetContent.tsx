import Button from "../../../components/common/Button.tsx";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import { useEffect, useState } from "react";
import ErrorIcon from "../../../components/icons/ErrorIcon.tsx";
import { StaffStore } from "../../../types/store.ts";
import { fetchStaffStores } from "../../../api/staff/store.ts";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import { useNavigate } from "react-router-dom";
import FullScreenLoading from "../../../components/common/FullScreenLoading.tsx";

const StaffStoreBottomSheetContent = () => {
  const { setBottomSheetOpen } = useBottomSheetStore();
  const { selectedStore, setSelectedStore } = useStaffStoreStore();
  const [tempSelectedStore, setTempSelectedStore] = useState<StaffStore | null>(
    selectedStore,
  );
  const [storeList, setStoreList] = useState<StaffStore[] | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSelectStore = (store: StaffStore) => {
    setTempSelectedStore(store);
  };

  const handleConfirm = () => {
    if (tempSelectedStore) {
      setSelectedStore(tempSelectedStore);
    }
    setBottomSheetOpen(false);
  };

  const handleStoreRegister = () => {
    navigate("/staff/store/register");
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const stores = await fetchStaffStores();
        setStoreList(stores);
      } catch (error) {
        console.error("매장 조회 실패", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  if (loading) return <FullScreenLoading />;

  return (
    <div className="flex flex-col h-full">
      {/* 매장 리스트 */}
      <div className="flex flex-col h-[50dvh] relative">
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32">
          {!storeList || storeList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="flex p-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-center gap-2.5 self-stretch">
                <ErrorIcon className="w-9 h-9" />
                <div className="body-2 text-center text-grayscale-700">
                  현재 속한 매장이 없습니다!
                  <br />
                  초대코드를 통해 매장에 합류해 주세요.
                </div>
                <button
                  onClick={handleStoreRegister}
                  className="body-3 text-grayscale-900 hover:underline"
                >
                  + 매장 추가하기
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <button
                  onClick={handleStoreRegister}
                  className="body-3 text-grayscale-900 hover:underline"
                >
                  + 매장 추가하기
                </button>
              </div>
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
                    <span className="body-4 text-grayscale-500">
                      {store.storeType}
                    </span>
                    <span className="title-1">{store.storeName}</span>
                    <div className="flex gap-2">
                      <span className="body-3 text-grayscale-900">주소</span>
                      <span className="body-3 text-grayscale-600">
                        {store.address}
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
        onClick={handleConfirm}
      >
        완료
      </Button>
    </div>
  );
};

export default StaffStoreBottomSheetContent;
