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
      className="flex gap-3 cursor-pointer rounded-xl bg-white px-4 py-3 shadow hover:bg-gray-50 transition-all"
    >
      <div className="flex flex-1 flex-col items-start justify-center">
        <div className="title-2 text-black mb-1">{notification.title}</div>
        <div className="body-3 text-grayscale-700">{notification.content}</div>
        <div className="body-4 text-grayscale-400 mt-1">{formattedDate}</div>
      </div>
      {notification.imageUrl && (
        <img
          src={notification.imageUrl}
          alt="notification"
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
      )}
    </div>
  );
};

export default NotificationCard;
