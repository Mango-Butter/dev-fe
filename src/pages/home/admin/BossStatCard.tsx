interface BossStatCardProps {
  bossName: string;
  storeCount: number;
  staffCount: number;
}

const BossStatCard = ({
  bossName,
  storeCount,
  staffCount,
}: BossStatCardProps) => {
  return (
    <div className="p-6 min-w-60 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-grayscale-300 inline-flex flex-col justify-start items-start gap-4">
      <div className="justify-start text-grayscale-900 heading-1">
        {bossName}
      </div>
      <div className="flex flex-col justify-start items-start gap-3">
        <div className="inline-flex justify-start items-start gap-4">
          <div className="w-12 justify-start text-grayscale-700 body-1">
            매장 수
          </div>
          <div className="flex-1 justify-start text-grayscale-900 title-1">
            {storeCount}개점
          </div>
        </div>
        <div className="inline-flex justify-start items-start gap-4">
          <div className="justify-start text-grayscale-700 body-1">
            알바생 수
          </div>
          <div className="flex-1 justify-start text-grayscale-900 title-1">
            {staffCount}명
          </div>
        </div>
      </div>
    </div>
  );
};

export default BossStatCard;
