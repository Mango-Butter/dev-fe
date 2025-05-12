import modalStore from "../../../stores/modalStore.ts";
import Button from "../../../components/common/Button.tsx";
import StoreModalContent from "../../store/boss/StoreModalContent.tsx";

const HomeBoss = () => {
  const { setModalOpen, setModalContent } = modalStore();

  const openModal = () => {
    setModalContent(<StoreModalContent />);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-center text-xl mb-6">홈 페이지</h1>
      <Button size="lg" theme="primary" onClick={openModal}>
        매장 추가
      </Button>
    </div>
  );
};

export default HomeBoss;
