import { useEffect, useState } from "react";
import { getStoreList } from "../../../api/boss/store.ts";
import ErrorIcon from "../../../components/icons/ErrorIcon.tsx";
import { useNavigate } from "react-router-dom";
import ArrowIcon from "../../../components/icons/ArrowIcon.tsx";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import { StoreSummaryBoss } from "../../../types/store.ts";
import StoreBottomSheetContent from "../../store/boss/StoreBottomSheetContent.tsx";
import FullScreenLoading from "../../../components/common/FullScreenLoading.tsx"; // ✅ zustand store import

const Store = () => {
  const navigate = useNavigate();
  const { setBottomSheetContent } = useBottomSheetStore();
  const { selectedStore, setSelectedStore } = useStoreStore(); // ✅ store hook
  const [storeList, setStoreList] = useState<StoreSummaryBoss[] | null>(null);
  const [loading, setLoading] = useState(true);

  const openStoreSheet = () => {
    setBottomSheetContent(<StoreBottomSheetContent />, {
      title: "매장 전환",
      closeOnClickOutside: true,
    });
  };

  const handleStoreRegister = () => {
    navigate("/boss/store/register");
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const stores = await getStoreList();
        setStoreList(stores);

        // ✅ selectedStore가 없고 매장이 존재하면 첫 번째 매장으로 설정
        if (stores.length > 0 && !selectedStore) {
          setSelectedStore(stores[0]);
        }
      } catch (error) {
        console.error("매장 조회 실패", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [selectedStore, setSelectedStore]);

  if (loading) {
    return <FullScreenLoading />;
  }

  if (!storeList || storeList.length === 0) {
    return (
      <div className="flex flex-1 self-stretch p-5 flex-col items-center justify-start h-full">
        <div className="flex p-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-center gap-2.5 self-stretch">
          <ErrorIcon className="w-9 h-9" />
          <div className="body-2 text-center text-grayscale-700">
            현재 등록된 매장이 없습니다!
            <br />
            매장을 추가해 주세요.
          </div>
          <div
            onClick={handleStoreRegister}
            className="body-3 text-grayscale-900 hover:underline cursor-pointer"
          >
            + 매장 추가하기
          </div>
        </div>
      </div>
    );
  }

  // ✅ 표시할 매장: selectedStore가 있으면 사용, 없으면 null 처리
  const activeStore = selectedStore ?? storeList[0];

  return (
    <div className="flex flex-1 self-stretch p-5 flex-col items-center justify-start h-full gap-6">
      <div className="flex p-4 border border-grayscale-300 bg-white shadow-blue-shadow rounded-xl flex-col justify-center items-start gap-2 self-stretch">
        <div className="w-full flex flex-col gap-1">
          <span className="body-4 text-grayscale-500">
            {activeStore.storeType}
          </span>
          <div
            className="flex w-full items-center justify-between"
            onClick={openStoreSheet}
          >
            <span className="title-1">{activeStore.storeName}</span>
            <ArrowIcon direction="down" />
          </div>
        </div>
        <div className="flex w-full gap-2">
          <span className="w-fit body-3 text-grayscale-900">주소</span>
          <span className="body-3 text-grayscale-600">
            {activeStore.address}
          </span>
        </div>
        <div className="flex w-full gap-2">
          <span className="w-fit body-3 text-grayscale-900">초대코드</span>
          <span className="body-3 text-grayscale-600">
            {activeStore.inviteCode}
          </span>
        </div>
      </div>

      {/* 메뉴 카드들 */}
      <div className="flex flex-col items-start gap-3 self-stretch">
        <div
          onClick={() => navigate("/boss/store/info")}
          className="cursor-pointer flex py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
        >
          <span className="title-2">매장 정보</span>
          <span className="body-3 text-gray-500">
            망고보스에 등록된 매장의 정보를 확인해요
          </span>
        </div>

        <div
          onClick={() => navigate("/boss/store/attendance")}
          className="cursor-pointer flex py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
        >
          <span className="title-2">출퇴근 방식 설정</span>
          <span className="body-3 text-gray-500">
            알바생이 출퇴근하는 방식을 설정해요
          </span>
        </div>

        <div
          onClick={() => navigate("/boss/store/salary")}
          className="cursor-pointer flex py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
        >
          <span className="title-2">급여 설정</span>
          <span className="body-3 text-gray-500">
            매장에서 제공하는 급여 정보를 설정해요
          </span>
        </div>

        <div
          onClick={() => navigate("/boss/store/notification")}
          className="cursor-pointer flex py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
        >
          <span className="title-2">알림 설정</span>
          <span className="body-3 text-gray-500">
            매장에서의 알림 범위를 설정해요
          </span>
        </div>
      </div>
    </div>
  );
};

export default Store;
