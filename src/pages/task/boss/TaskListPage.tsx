import React, { useState, useEffect } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
} from "date-fns";
import { useNavigate, useSearchParams } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "../../../styles/taskPageCalendar.css";
import { TaskStatus } from "../../../types/task";
import { BossTaskAPI } from "../../../api/boss/task";
import { useTaskFilters } from "../../../hooks/useTaskFilters";
import useBottomSheetStore from "../../../stores/useBottomSheetStore";
import useStoreStore from "../../../stores/storeStore";
import TaskList from "./TaskList";
import { useLayout } from "../../../hooks/useLayout";
import { cn } from "../../../libs";
import ArrowIcon from "../../../components/icons/ArrowIcon";
import Button from "../../../components/common/Button";
import TaskAddForm from "./TaskAddForm";
import { getKSTDate } from "../../../libs/date.ts";

const tabItems = [
  { label: "업무", value: "task" },
  { label: "보고사항", value: "report" },
];

const TaskListPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(getKSTDate());
  const [tasks, setTasks] = useState<TaskStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("type") || "task";
  const navigate = useNavigate();

  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId ?? "current-store-id"; // TODO: 실제 storeId로 교체 필요
  const { setBottomSheetContent } = useBottomSheetStore();
  const { filters } = useTaskFilters();

  useLayout({
    title: "업무 관리",
    theme: "default",
    headerVisible: true,
    bottomNavVisible: true,
    onBack: () => navigate("/boss"),
  });

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const date = format(currentDate, "yyyy-MM-dd");
      const fetchedTasks = await BossTaskAPI.getTasksByDate(
        String(storeId),
        date,
      );
      setTasks(fetchedTasks);
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
    setBottomSheetContent(<TaskAddForm defaultDate={currentDate} />, {
      closeOnClickOutside: true,
      leftButtonIcon: <ArrowIcon direction={"left"} />,
      // onLeftButtonClick: () => goBack(),
      title: "업무 추가하기",
    });
  };

  const handleRoutineTask = () => {
    navigate("/boss/task-routines"); // 이 경로는 실제 페이지 경로에 맞게 수정
  };

  const filteredTasks = tasks.filter((task) => {
    if (filters.has("all")) return true;
    return Array.from(filters).some((key) => {
      const [type, value] = key.split(":");
      if (type === "state") {
        return task.taskLog ? value === "COMPLETED" : value === "IN_PROGRESS";
      }
      if (type === "type") {
        return task.isPhotoRequired === (value === "PHOTO");
      }
      return false;
    });
  });

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });

  return (
    <div className="flex flex-col">
      {/* 탭 영역 */}
      <div className="grid grid-cols-2 border-b border-grayscale-200">
        {tabItems.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              "py-3 text-center body-2",
              currentTab === tab.value
                ? "text-grayscale-900 border-b-2 border-black font-semibold"
                : "text-grayscale-400",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 주간 달력 영역 */}
      <div className="flex justify-between items-center h-15 shadow-[2px_2px_8px_0px_rgba(0,0,0,0.04)]">
        <button onClick={handlePrevWeek} className="p-2">
          <ArrowIcon direction="left" className="w-4 h-4" />
        </button>
        <div className="calendar-grid">
          {weekDays.map((day, index) => (
            <div
              key={day.toString()}
              className={cn(
                "calendar-day",
                index === 0 && "sunday",
                index === 6 && "saturday",
              )}
              onClick={() => setCurrentDate(day)}
            >
              <span
                className={cn(
                  format(day, "yyyy-MM-dd") ===
                    format(currentDate, "yyyy-MM-dd") && "selected",
                )}
              >
                {format(day, "d")}
              </span>
            </div>
          ))}
        </div>
        <button onClick={handleNextWeek} className="p-2">
          <ArrowIcon direction="right" className="w-4 h-4" />
        </button>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="p-4">
        <div className="flex justify-end mb-4 gap-4">
          <Button size="sm" onClick={handleRoutineTask} theme="outline">
            고정 관리하기
          </Button>
          <Button size="sm" onClick={handleAddTask} theme="outline">
            업무 추가하기
          </Button>
        </div>
        {currentTab === "task" && (
          <TaskList tasks={filteredTasks} isLoading={isLoading} />
        )}
        {currentTab === "report" && (
          <div className="text-center text-gray-500 py-8">준비 중입니다.</div>
        )}
      </div>
    </div>
  );
};

export default TaskListPage;
