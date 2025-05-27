import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button.tsx";
import modalStore from "../../../stores/modalStore.ts";

const StoreModalContent = () => {
  const navigate = useNavigate();
  const { setModalOpen } = modalStore();

  const handleStoreRegister = () => {
    navigate("/boss/store/register");
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 상단 인사 + 설명 */}
      <div className="text-start">
        <p className="title-1 mb-1">김사장님</p>
        <p className="body-2 text-grayscale-500">
          매장을 추가하고 망고보스를 이용해보세요.
        </p>
      </div>

      {/* 상단 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleStoreRegister}
          className="body-3 text-grayscale-900 hover:underline"
        >
          + 매장 추가하기
        </button>
      </div>

      {/* 매장 리스트 (임시 카드 예시 1개) */}
      <div className="flex flex-col gap-4">
        <div className="border rounded-lg p-4 shadow-sm">
          <p className="body-1 mb-1">매장 1 123-45-67890</p>
          <p className="body-2 text-grayscale-600">
            경기 수원시 영통구 월드컵로206번길 가상의점포 23호
          </p>
          <p className="body-2 text-grayscale-600">대표번호: 000000</p>
        </div>
        {/* 추후 storeList.map() 으로 렌더링 */}
      </div>

      {/* 하단 완료 버튼 */}
      <Button size="lg" theme="primary" className="mt-4">
        완료하기
      </Button>
    </div>
  );
};

export default StoreModalContent;
