// components/skeleton/SkeletonStoreCard.tsx
const SkeletonStoreCard = () => {
  return (
    <div className="flex p-4 w-full border border-grayscale-300 bg-white shadow-blue-shadow rounded-xl flex-col gap-3 animate-pulse">
      <div className="flex flex-col gap-1 w-full">
        <div className="h-3 w-1/4 bg-gray-200 rounded" /> {/* storeType */}
        <div className="h-5 w-1/2 bg-gray-300 rounded" /> {/* storeName */}
      </div>

      <div className="flex gap-2 w-full">
        <div className="w-12 h-4 bg-gray-200 rounded" />
        <div className="flex-1 h-4 bg-gray-100 rounded" /> {/* 주소 */}
      </div>

      <div className="flex gap-2 w-full">
        <div className="w-12 h-4 bg-gray-200 rounded" />
        <div className="flex-1 h-4 bg-gray-100 rounded" /> {/* 초대코드 */}
      </div>
    </div>
  );
};

export default SkeletonStoreCard;
