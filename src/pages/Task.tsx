// src/pages/Task.tsx
import { useState } from "react";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";

const Task = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 }), // 일요일 시작
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = Array.from({ length: 7 }).map((_, idx) =>
    addDays(currentWeekStart, idx),
  );

  const goToPrevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));
  const goToNextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));

  return (
    <div className="p-4 space-y-6">
      {/* 주간 캘린더 */}
      <div className="flex items-center justify-between">
        <button onClick={goToPrevWeek} className="text-sm px-2">
          ◀
        </button>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {weekDays.map((day) => (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`px-3 py-2 rounded-xl min-w-[80px] border text-center ${
                isSameDay(day, selectedDate)
                  ? "bg-blue-500 text-white font-semibold"
                  : "bg-gray-100"
              }`}
            >
              <div>{format(day, "EEE")}</div>
              <div>{format(day, "MM/dd")}</div>
            </button>
          ))}
        </div>

        <button onClick={goToNextWeek} className="text-sm px-2">
          ▶
        </button>
      </div>

      {/* 체크리스트 */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          {format(selectedDate, "yyyy년 MM월 dd일")} 체크리스트
        </h2>
        <ul className="space-y-3">
          {["09:00", "13:00", "18:00"].map((time) => (
            <li key={time} className="p-4 rounded-xl border">
              <p className="font-medium">{time}</p>
              <label className="flex items-center gap-2 mt-2">
                <input type="checkbox" className="form-checkbox" />
                오픈 준비
              </label>
              <label className="flex items-center gap-2 mt-1">
                <input type="checkbox" className="form-checkbox" />
                매장 청소
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Task;
