import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels,
);

interface OverviewChartProps {
  statistics: {
    bossCount: number;
    storeCount: number;
    staffCount: number;
    totalUserCount: number;
  };
}

interface IndustryChartProps {
  industryStats: {
    storeType: "CAFE" | "RESTAURANT" | "CONVENIENCE_STORE";
    storeCount: number;
  }[];
}

const primaryColors = ["#1E3A8A", "#2563EB", "#60A5FA"]; // primary-900, 600, 400

export const OverviewBarChart = ({ statistics }: OverviewChartProps) => {
  const data = {
    labels: ["사장님 수", "매장 수", "알바생 수", "가입자 수"],
    datasets: [
      {
        label: "통계 수치",
        data: [
          statistics.bossCount,
          statistics.storeCount,
          statistics.staffCount,
          statistics.totalUserCount,
        ],
        backgroundColor: "#1E3A8A", // primary-900
        borderRadius: 10,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "#000",
        anchor: "end",
        align: "end",
        font: { weight: "bold", size: 14 },
        formatter: (val: number) => `${val}`,
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.parsed.y}명`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 14 } },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { stepSize: 20, font: { size: 14 } },
      },
    },
  };

  return <Bar data={data} options={options} plugins={[ChartDataLabels]} />;
};

export const IndustryDoughnutChart = ({
  industryStats,
}: IndustryChartProps) => {
  const labels = {
    CAFE: "카페",
    RESTAURANT: "레스토랑",
    CONVENIENCE_STORE: "편의점",
  };

  const data = {
    labels: industryStats.map((item) => labels[item.storeType]),
    datasets: [
      {
        data: industryStats.map((item) => item.storeCount),
        backgroundColor: primaryColors,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: { size: 14 },
        },
      },
      datalabels: {
        color: "#000",
        font: { weight: "bold", size: 14 },
        formatter: (val: number) => `${val}`,
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${ctx.parsed}개`,
        },
      },
    },
  };

  return <Doughnut data={data} options={options} plugins={[ChartDataLabels]} />;
};
