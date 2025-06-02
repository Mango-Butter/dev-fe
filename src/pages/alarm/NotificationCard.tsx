// src/pages/alarm/components/NotificationCard.tsx
import dayjs from "dayjs";
import { NotificationItem } from "../../types/notification.ts";

interface Props {
  notification: NotificationItem;
}

const NotificationCard = ({ notification }: Props) => {
  const formattedDate = dayjs(notification.createdAt).format(
    "YYYY년 MM월 DD일 HH:mm",
  );

  const handleClick = () => {
    if (notification.clickUrl) {
      window.location.href = notification.clickUrl;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-xl bg-white px-4 py-3 shadow hover:bg-gray-50 transition-all"
    >
      <div className="font-semibold text-sm text-black mb-1">
        {notification.title}
      </div>
      <div className="text-sm text-grayscale-700">{notification.content}</div>
      <div className="text-xs text-grayscale-400 mt-1">{formattedDate}</div>
    </div>
  );
};

export default NotificationCard;
