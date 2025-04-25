import { useState } from "react";
import SingleDatePicker from "../../components/common/SingleDatePicker";
import RangeDatePicker from "../../components/common/RangeDatePicker"; // 추가!

const ScheduleAddForm = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);

  return (
    <div className="flex flex-col gap-4">
      <section>
        <h2 className="font-semibold text-sm text-gray-700">근무자</h2>
        <ul className="mt-2 flex gap-3">
          {[1, 2, 3, 4, 5].map((id) => (
            <li key={id} className="flex flex-col items-center">
              <img
                src={`/dummy/avatar${id}.jpg`}
                alt={`avatar-${id}`}
                className="h-12 w-12 rounded-full object-cover"
              />
              <span className="text-xs mt-1">이름{id}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <label className="text-sm font-medium block mb-2">
          근무 일정 <span className="text-red-500">*</span>
        </label>
        <SingleDatePicker
          value={date}
          onChange={setDate}
          mode="future"
          placeholder="추가할 일정을 선택해 주세요"
        />
      </section>

      <section>
        <label className="text-sm font-medium">
          근무 시간 <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="time"
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            placeholder="예) 10:00"
          />
          <span className="self-center text-gray-400">~</span>
          <input
            type="time"
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            placeholder="예) 20:00"
          />
        </div>
      </section>

      <section>
        <label className="text-sm font-medium block mb-2">
          반복 기간 <span className="text-red-500">*</span>
        </label>
        <RangeDatePicker value={range} onChange={setRange} mode="future" />
      </section>

      <div
        data-footer
        className="sticky bottom-0 mt-4 flex justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3"
      >
        <button className="flex-1 rounded-lg border border-gray-300 py-2 text-sm">
          취소
        </button>
        <button className="flex-1 rounded-lg bg-yellow-400 py-2 text-sm font-semibold text-white">
          추가
        </button>
      </div>
    </div>
  );
};

export default ScheduleAddForm;
