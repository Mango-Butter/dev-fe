// src/pages/alarm/components/BossNotificationTab.tsx
import { useEffect, useState } from "react";
import { NotificationItem } from "../../../types/notification.ts";
import NotificationCard from "../NotificationCard.tsx";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import { fetchStaffNotifications } from "../../../api/staff/alarm.ts";

const BossNotificationTab = () => {
  const { selectedStore } = useStaffStoreStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (!selectedStore?.storeId) return;
      const result = await fetchStaffNotifications(selectedStore.storeId);
      setNotifications(result);
    };
    fetch();
  }, [selectedStore?.storeId]);

  if (!selectedStore) {
    return (
      <div className="flex justify-center items-center h-full text-sm text-gray-500">
        선택된 매장이 없습니다.
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 pt-8">
        알림이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-4">
      {notifications.map((n) => (
        <NotificationCard key={n.id} notification={n} />
      ))}
    </div>
  );
};

export default BossNotificationTab;
