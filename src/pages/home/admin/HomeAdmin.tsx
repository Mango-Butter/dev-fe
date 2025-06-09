import { useEffect, useState } from "react";
import {
  fetchBossStatistics,
  fetchStatisticsByPeriod,
  fetchIndustryStatisticsByPeriod,
} from "../../../api/admin/admin.ts";
import {
  BossStatisticsItem,
  StatisticsItem,
  IndustryStatisticsItem,
} from "../../../types/admin.ts";
import { getQuarterDateRange } from "../../../utils/quarterDate.ts";
import StatCard from "./StatCard";
import BossStatCard from "./BossStatCard";
import {
  OverviewBarChart,
  IndustryDoughnutChart,
} from "./StatisticsCharts.tsx";

const HomeAdmin = () => {
  const [bossData, setBossData] = useState<BossStatisticsItem[]>([]);
  const [overviewData, setOverviewData] = useState<StatisticsItem | null>(null);
  const [industryStats, setIndustryStats] = useState<IndustryStatisticsItem[]>(
    [],
  );

  useEffect(() => {
    fetchBossStatistics()
      .then(setBossData)
      .catch(() => console.error("사장 통계 조회 실패"));

    const today = new Date();
    const { start, end } = getQuarterDateRange(today); // 🔥 분기 범위 계산

    fetchStatisticsByPeriod(start, end)
      .then((data) => {
        console.log("overviewData 결과", data);
        setOverviewData(data);
      })
      .catch(() => console.error("통계 개요 조회 실패"));

    fetchIndustryStatisticsByPeriod(start, end)
      .then(setIndustryStats)
      .catch(() => console.error("업종 통계 조회 실패"));
  }, []);

  return (
    <div className="flex flex-col gap-8 px-12 py-12 w-full h-full rounded-3xl bg-white">
      <div className="inline-flex justify-between w-full gap-5">
        <StatCard
          label="함께하는 사장님"
          value={
            typeof overviewData?.bossCount === "number"
              ? overviewData.bossCount
              : "-"
          }
          unit="명"
        />
        <StatCard
          label="함께하는 매장 수"
          value={overviewData?.storeCount}
          unit="개점"
        />
        <StatCard
          label="망고보스 총 가입자 수"
          value={overviewData?.totalUserCount}
          unit="명"
        />
      </div>

      <div className="inline-flex flex-col justify-between w-full gap-5">
        <h1 className="text-3xl font-bold">망고버터와 함께하는 사장님</h1>
        <div className="flex overflow-x-auto gap-6">
          {bossData.map((item, index) => (
            <BossStatCard
              key={index}
              bossName={item.bossName}
              storeCount={item.storeCount}
              staffCount={item.staffCount}
            />
          ))}
        </div>
      </div>

      {/* ✔️ 통계 차트 (막대 + 도넛) */}
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">통계 차트</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">전체 수치 통계</h2>
            {overviewData && (
              <OverviewBarChart
                statistics={{
                  bossCount: overviewData.bossCount,
                  storeCount: overviewData.storeCount,
                  staffCount: overviewData.staffCount,
                  totalUserCount: overviewData.totalUserCount,
                }}
              />
            )}
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">업종별 매장 분포</h2>
            <IndustryDoughnutChart industryStats={industryStats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
