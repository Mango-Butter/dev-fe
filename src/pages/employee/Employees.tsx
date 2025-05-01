import Button from "../../components/common/Button.tsx";
import useBottomSheetStore from "../../stores/useBottomSheetStore.ts";
import RegularScheduleAddForm from "./RegularScheduleAddForm.tsx";

const Employees = () => {
  const { setBottomSheetContent } = useBottomSheetStore();

  const openAddRegularScheduleSheet = () => {
    setBottomSheetContent(<RegularScheduleAddForm />, {
      title: "직원 1 고정 스케줄 추가",
      closeOnClickOutside: true,
    });
  };
  return (
    <div className="flex w-full h-full flex-col gap-10 items-center justify-center">
      <h1 className="text-center text-xl">직원별 고정 스케줄 추가 페이지</h1>
      <Button
        size="sm"
        onClick={openAddRegularScheduleSheet}
        theme="outline"
        state="default"
      >
        직원1 고정 스케줄 추가
      </Button>
    </div>
  );
};

export default Employees;
