import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStoreStore from "../../../stores/storeStore.ts";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import { StoreSummaryBoss } from "../../../types/store.ts";
import { getStoreList } from "../../../api/boss/store.ts";
import StoreBottomSheetContent from "./StoreBottomSheetContent.tsx";
import ErrorIcon from "../../../components/icons/ErrorIcon.tsx";
import ArrowIcon from "../../../components/icons/ArrowIcon.tsx";
import SkeletonStoreCard from "../../../components/skeleton/SkeletonStoreCard.tsx";

const BossStoreCard = () => {
  const navigate = useNavigate();
  const { selectedStore, setSelectedStore } = useStoreStore();
  const { setBottomSheetContent } = useBottomSheetStore();
  const [storeList, setStoreList] = useState<StoreSummaryBoss[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const stores = await getStoreList();
        setStoreList(stores);

        if (stores.length === 0) return;

        const firstStore = stores[0];

        if (!selectedStore) {
          setSelectedStore(firstStore);
        } else {
          const matched = stores.find(
            (s) => s.storeId === selectedStore.storeId,
          );

          if (
            matched &&
            JSON.stringify(matched) !== JSON.stringify(selectedStore)
          ) {
            setSelectedStore(matched);
          }
        }
      } catch (error) {
        console.error("매장 조회 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [selectedStore, setSelectedStore]);

  const openStoreSheet = () => {
    setBottomSheetContent(<StoreBottomSheetContent />, {
      title: "매장 전환",
      closeOnClickOutside: true,
    });
  };

  const handleStoreRegister = () => {
    navigate("/boss/store/register");
  };

  if (loading) {
    return <SkeletonStoreCard />;
  }

  if (!storeList || storeList.length === 0) {
    return (
      <div className="flex flex-1 self-stretch flex-col items-center justify-start h-full">
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

  const activeStore = selectedStore ?? storeList[0];

  return (
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
        <span className="body-3 text-grayscale-600">{activeStore.address}</span>
      </div>
      <div className="flex w-full gap-2">
        <span className="w-fit body-3 text-grayscale-900">초대코드</span>
        <span className="body-3 text-grayscale-600">
          {activeStore.inviteCode}
        </span>
      </div>
    </div>
  );
};

export default BossStoreCard;
