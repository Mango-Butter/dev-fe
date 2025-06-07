const SkeletonStaffCard = () => {
  return (
    <div className="flex w-full items-center gap-4 p-4 bg-white rounded-2xl shadow-basic animate-pulse">
      {/* 프로필 이미지 자리 */}
      <div className="w-14 h-14 rounded-full bg-gray-200" />

      {/* 텍스트 영역 */}
      <div className="flex flex-col flex-1 justify-center gap-2">
        <div className="h-4 w-1/3 bg-gray-200 rounded" /> {/* 이름 */}
        <div className="h-3 w-2/3 bg-gray-100 rounded" /> {/* 고정 근무 요일 */}
        {/* 출근/지각/결근 뱃지 자리 */}
        <div className="flex gap-2 mt-2">
          <div className="h-6 w-20 rounded-full bg-gray-200" />
          <div className="h-6 w-20 rounded-full bg-gray-200" />
          <div className="h-6 w-20 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonStaffCard;
