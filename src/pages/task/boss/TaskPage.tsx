import React, { useState, useEffect } from "react";
import { format, addWeeks, subWeeks } from "date-fns";
import { useNavigate, useSearchParams } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "../../../styles/taskPageCalendar.css";
import { TaskStatus } from "../../../types/task";
import { BossTaskAPI } from "../../../api/boss/task";
import { useTaskFilters } from "../../../hooks/useTaskFilters";
import useBottomSheetStore from "../../../stores/useBottomSheetStore";
import useStoreStore from "../../../stores/storeStore";
import TaskList from "./checklist/TaskList.tsx";
import { useLayout } from "../../../hooks/useLayout";
import Button from "../../../components/common/Button";
import TaskAddForm from "./checklist/TaskAddForm.tsx";
import { getKSTDate } from "../../../libs/date";
import { isValidStoreId } from "../../../utils/store";
import WeekCalendar from "../WeekCalendar.tsx";
import TaskFilterBar from "./checklist/TaskFilterBar.tsx";

const tabItems = [
  { label: "업무", value: "task" },
  { label: "보고사항", value: "report" },
];

const TaskPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(getKSTDate());
  const [tasks, setTasks] = useState<TaskStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("type") || "task";
  const navigate = useNavigate();

  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;
  const { setBottomSheetContent, setBottomSheetOpen } = useBottomSheetStore();
  const { filters } = useTaskFilters();

  useLayout({
    title: "업무 관리",
    theme: "default",
    headerVisible: true,
    bottomNavVisible: true,
    onBack: () => navigate("/boss"),
  });

  const fetchTasks = async () => {
    if (!isValidStoreId(storeId)) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const date = format(currentDate, "yyyy-MM-dd");
      const fetchedTasks = await BossTaskAPI.getTasksByDate(storeId, date);
      setTasks(fetchedTasks);
      console.log(fetchedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentDate, storeId]);

  useEffect(() => {
    if (!searchParams.get("type")) {
      setSearchParams({ type: "task" });
    }
  }, [searchParams, setSearchParams]);

  const handlePrevWeek = () => {
    setCurrentDate((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate((prev) => addWeeks(prev, 1));
  };

  const handleTabChange = (type: string) => {
    setSearchParams({ type });
  };

  const handleAddTask = () => {
    setBottomSheetContent(
      <TaskAddForm
        defaultDate={currentDate}
        onClose={() => setBottomSheetOpen(false)}
      />,
      {
        closeOnClickOutside: true,
        title: "업무 추가하기",
      },
    );
  };

  const handleRoutineTask = () => {
    navigate("/boss/task/routine");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filters.has("all")) return true;

    let stateOk = true;
    let typeOk = true;

    const states = Array.from(filters).filter((f) => f.startsWith("state:"));
    const types = Array.from(filters).filter((f) => f.startsWith("type:"));

    if (states.length > 0) {
      stateOk = states.some((f) => {
        const value = f.split(":")[1];
        return task.taskLog ? value === "COMPLETED" : value === "IN_PROGRESS";
      });
    }

    if (types.length > 0) {
      typeOk = types.some((f) => {
        const value = f.split(":")[1];
        if (value === "PHOTO") return task.isPhotoRequired === true;
        if (value === "CHECK") return task.isPhotoRequired === false;
        return false;
      });
    }

    return stateOk && typeOk;
  });

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* 탭 영역 */}
      <div className="w-full grid grid-cols-2 border-b border-grayscale-200">
        {tabItems.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={
              currentTab === tab.value
                ? "py-3 text-center body-2 text-grayscale-900 border-b-2 border-black font-semibold"
                : "py-3 text-center body-2 text-grayscale-400"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 주간 캘린더 영역 */}
      <WeekCalendar
        currentDate={currentDate}
        onChange={setCurrentDate}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
      />

      {/* 컨텐츠 영역 */}
      <div className="p-4">
        {currentTab === "task" && (
          <>
            <div className="flex justify-end mb-4 gap-4">
              <Button
                size="sm"
                onClick={handleRoutineTask}
                theme="outline"
                className="flex-1"
              >
                고정 업무 관리하기
              </Button>
              <Button
                size="sm"
                onClick={handleAddTask}
                theme="ghost"
                className="flex-1"
              >
                업무 추가하기
              </Button>
            </div>
            <TaskFilterBar />
            <TaskList tasks={filteredTasks} isLoading={isLoading} />
          </>
        )}
        {currentTab === "report" && (
          <div className="text-center text-gray-500 py-8">준비 중입니다.</div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
