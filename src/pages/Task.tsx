// src/pages/Task.tsx
import { format } from "date-fns";
import { getKoreaISOString } from "../utils/date.ts";

const Task = () => {
  const selectedDate = getKoreaISOString();

  return (
    <div className="flex w-full h-full p-4">
      {/* 주간 캘린더 */}

      {/* 체크리스트 */}
      <div className="w-full flex flex-col gap-4">
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
