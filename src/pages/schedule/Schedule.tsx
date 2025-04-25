// pages/Schedule.tsx
import useBottomSheetStore from "../../stores/useBottomSheetStore.ts";
import ScheduleAddForm from "./ScheduleAddForm.tsx";

const Schedule = () => {
  const { setBottomSheetContent } = useBottomSheetStore();

  const openAddScheduleSheet = () => {
    setBottomSheetContent(<ScheduleAddForm />, {
      title: "스케줄 추가",
      closeOnClickOutside: true,
      onClose: () => console.log("스케줄 추가 시트 닫힘"),
    });
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-semibold text-center">스케줄 관리</h1>
      <div className="mt-10 text-center">
        <button
          onClick={openAddScheduleSheet}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow"
        >
          스케줄 추가
        </button>
      </div>
    </div>
  );
};

export default Schedule;
