// src/pages/alarm/components/BossRequestTab.tsx
import { useEffect, useState, useCallback } from "react";
import {
  fetchAttendanceEditRequests,
  fetchSubstituteRequests,
} from "../../../api/boss/alarm.ts";
import {
  AttendanceEditRequest,
  SubstituteRequest,
} from "../../../types/notification.ts";
import ScheduleRequestCard from "../ScheduleRequestCard.tsx";
import AttendanceRequestCard from "../AttendanceRequestCard.tsx";
import useStoreStore from "../../../stores/storeStore.ts";

const BossRequestTab = () => {
  const { selectedStore } = useStoreStore();
  const [substituteRequests, setSubstituteRequests] = useState<
    SubstituteRequest[]
  >([]);
  const [attendanceEditRequests, setAttendanceEditRequests] = useState<
    AttendanceEditRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!selectedStore?.storeId) return;
    setIsLoading(true);
    try {
      const [subs, edits] = await Promise.all([
        fetchSubstituteRequests(selectedStore.storeId),
        fetchAttendanceEditRequests(selectedStore.storeId),
      ]);
      setSubstituteRequests(subs);
      setAttendanceEditRequests(edits);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStore?.storeId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const merged = [
    ...substituteRequests.map((r) => ({ ...r, type: "schedule" as const })),
    ...attendanceEditRequests.map((r) => ({
      ...r,
      type: "attendance" as const,
    })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (!selectedStore) {
    return (
      <div className="flex gap-4 py-4 items-center justify-center">
        선택된 매장이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 py-4">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse p-4 bg-white shadow rounded-xl space-y-2"
          >
            <div className="h-4 bg-grayscale-200 rounded w-1/2"></div>
            <div className="h-3 bg-grayscale-200 rounded w-1/3"></div>
            <div className="h-3 bg-grayscale-200 rounded w-full"></div>
            <div className="h-8 bg-grayscale-200 rounded w-1/3 ml-auto"></div>
          </div>
        ))
      ) : merged.length === 0 ? (
        <div className="text-center text-sm text-gray-500 pt-8">
          요청 알림이 없습니다.
        </div>
      ) : (
        merged.map((item) => {
          if (item.type === "schedule") {
            return (
              <ScheduleRequestCard
                userType="boss"
                key={`s-${item.substituteRequestId}`}
                data={item}
                storeId={selectedStore.storeId}
                refetch={fetchRequests}
              />
            );
          } else {
            return (
              <AttendanceRequestCard
                userType="boss"
                key={`a-${item.attendanceEditId}`}
                data={item}
                storeId={selectedStore.storeId}
                refetch={fetchRequests}
              />
            );
          }
        })
      )}
    </div>
  );
};

export default BossRequestTab;
