import ArrowIcon from "../../../components/icons/ArrowIcon.tsx";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import { StoreSummaryBoss } from "../../../types/store.ts";
import { useEffect, useState } from "react";
import StoreBottomSheetContentStaff from "../../store/staff/StoreBottomSheetContentStaff.tsx";
import { getStoreList } from "../../../api/boss/store.ts";
import { useNavigate } from "react-router-dom";
import ErrorIcon from "../../../components/icons/ErrorIcon.tsx";
import { useUserStore } from "../../../stores/userStore.ts";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Label from "../../../components/common/Label.tsx";
import Button from "../../../components/common/Button.tsx";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { setBottomSheetContent } = useBottomSheetStore();
  const { selectedStore, setSelectedStore } = useStoreStore(); // ✅ store hook
  const [storeList, setStoreList] = useState<StoreSummaryBoss[] | null>([
    {
      storeId: 1,
      storeName: "스타벅스",
      businessNumber: "000000000",
      storeType: "CAFE",
      address: "청주시",
      inviteCode: "MANGO1",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), "yyyy.MM.dd EEEE", { locale: ko });

  const openStoreSheet = () => {
    setBottomSheetContent(<StoreBottomSheetContentStaff />, {
      title: "매장 전환",
      closeOnClickOutside: true,
    });
  };

  const handleStoreRegister = () => {
    navigate("/staff/store/register");
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
    return <div className="text-center mt-20">불러오는 중...</div>;
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
            className="body-3 text-grayscale-900 cursor-pointer"
          >
            + 매장 추가하기
          </div>
        </div>
      </div>
    );
  }

  const activeStore = selectedStore ?? storeList[0];

  return (
    <div className="flex flex-col h-full py-3 px-5 gap-4">
      <div className="flex flex-col justify-center items-start gap-2 self-stretch">
        <div className="w-full flex flex-col gap-1">
          <div
            className="flex w-full items-center gap-2"
            onClick={openStoreSheet}
          >
            <span className="heading-2">{activeStore.storeName}</span>
            <ArrowIcon direction="down" />
          </div>
        </div>
        <p className="title-1">{today}</p>
        <p className="body-3 text-grayscale-500">
          {user?.name}님, 오늘 근무도 힘내세요!
        </p>
      </div>
      <div className="flex p-4 bg-white shadow-basic rounded-lg flex-col justify-center items-start gap-3 self-stretch">
        <div className="w-full flex flex-col gap-1">
          <span className="title-2">{activeStore.storeName}</span>
          <div className="flex gap-2 items-center">
            <Label className="border border-positive text-positive bg-white">
              출근
            </Label>
            <span className="body-3 text-grayscale-500">10:00</span>
            <span className="body-3 text-grayscale-500">~</span>
            <span className="body-3 text-grayscale-500">10:00</span>
          </div>
        </div>
        <div className="flex w-full gap-2">
          <span className="w-fit body-3 text-grayscale-900">출근 시간</span>
          <span className="body-3 text-grayscale-600">10:07</span>
        </div>
        <div className="flex w-full gap-2">
          <span className="w-fit body-3 text-grayscale-900">
            퇴근시간까지 2시간 20분 20초 남았습니다!
          </span>
        </div>
        <Button
          className="w-full body-3"
          theme="secondary"
          size="sm"
          onClick={() => navigate("/staff/attendance")}
        >
          퇴근하기
        </Button>
      </div>
    </div>
  );
};

export default Home;
