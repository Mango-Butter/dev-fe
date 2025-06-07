import { useEffect, useState } from "react";
import { BossStatisticsItem } from "../../../types/admin.ts";
import { fetchBossStatistics } from "../../../api/admin/admin.ts";

const HomeAdmin = () => {
  const [data, setData] = useState<BossStatisticsItem[]>([]);

  useEffect(() => {
    fetchBossStatistics()
      .then(setData)
      .catch(() => console.error("사장 통계 조회 실패"));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">사장별 매장·알바생 통계</h2>
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">사장 이름</th>
            <th className="border p-2">매장 수</th>
            <th className="border p-2">알바생 수</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td className="border p-2">{item.bossName}</td>
              <td className="border p-2 text-center">{item.storeCount}</td>
              <td className="border p-2 text-center">{item.staffCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default HomeAdmin;
