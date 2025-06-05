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
import { getTasksByDate } from "../../../api/staff/task";
import useStoreStore from "../../../stores/storeStore";
import { useLayout } from "../../../hooks/useLayout";
import { cn } from "../../../libs";
import ArrowIcon from "../../../components/icons/ArrowIcon";
import { toast } from "react-toastify";
import { getKSTDate } from "../../../libs/date.ts";
import { TaskStatus } from "../../../types/task.ts";
import StaffCheckListTab from "./checklist/StaffCheckListTab.tsx";

const tabItems = [
  { label: "업무", value: "task" },
  { label: "보고사항", value: "report" },
];

const StaffTaskListPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(getKSTDate());
  const [tasks, setTasks] = useState<TaskStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("type") || "task";
  const navigate = useNavigate();

  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;

  useLayout({
    title: "업무 목록",
    theme: "default",
    headerVisible: true,
    bottomNavVisible: true,
    onBack: () => navigate("/staff"),
  });

  const fetchTasks = async () => {
    if (!storeId) return;

    try {
      setIsLoading(true);
      const date = format(currentDate, "yyyy-MM-dd");
      const fetchedTasks = await getTasksByDate(storeId, date);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("업무 목록 조회 실패:", error);
      toast.error("업무 목록을 불러오는데 실패했습니다.");
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
        {currentTab === "task" && (
          <StaffCheckListTab tasks={tasks} isLoading={isLoading} />
        )}
        {currentTab === "report" && (
          <div className="text-center text-gray-500 py-8">준비 중입니다.</div>
        )}
      </div>
    </div>
  );
};

export default StaffTaskListPage;
