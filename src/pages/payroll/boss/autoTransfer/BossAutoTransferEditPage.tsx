import { useEffect, useState } from "react";
import { useLayout } from "../../../../hooks/useLayout.ts";
import useStoreStore from "../../../../stores/storeStore.ts";
import Button from "../../../../components/common/Button.tsx";
import { toast } from "react-toastify";
import BossAutoTransferCheckCard from "./BossAutoTransferCheckCard.tsx";
import {
  confirmPayrollTargets,
  fetchEstimatedPayrolls,
  fetchPayrollSettings,
} from "../../../../api/boss/payroll.ts";
import {
  EstimatedPayrollItem,
  BossPayrollSettingsResponse,
} from "../../../../types/payroll.ts";

const BossAutoTransferEditPage = () => {
  useLayout({
    title: "송금정보 갱신",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => history.back(),
    rightIcon: null,
  });

  const { selectedStore } = useStoreStore();
  const [estimatedPayrolls, setEstimatedPayrolls] = useState<
    EstimatedPayrollItem[]
  >([]);
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());
  const [settings, setSettings] = useState<BossPayrollSettingsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedStore) return;

      try {
        const [estimatedPayrollResult, settingsResult] = await Promise.all([
          fetchEstimatedPayrolls(selectedStore.storeId),
          fetchPayrollSettings(selectedStore.storeId),
        ]);

        setEstimatedPayrolls(estimatedPayrollResult);
        setSettings(settingsResult);
        setCheckedKeys(
          new Set(
            estimatedPayrollResult
              .map((p) => p.payroll.key)
              .filter((key): key is string => key !== null),
          ),
        );
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedStore]);

  const handleToggle = (key: string) => {
    setCheckedKeys((prev) => {
      const newSet = new Set(prev);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!selectedStore) return;
    const keys = Array.from(checkedKeys);

    try {
      await confirmPayrollTargets(selectedStore.storeId, { payrollKeys: keys });
      toast.success("송금 인원을 성공적으로 확정했습니다.");
      history.back();
    } catch (err: any) {
      console.error("송금 확정 실패:", err);
    }
  };

  return (
    <div className="w-full flex flex-col p-5 gap-9">
      {/* 안내문 */}
      {settings && (
        <section className="w-full flex flex-col gap-2">
          <p className="heading-1">
            급여확정 이전에
            <br />
            급여 현황을 확인하세요.
          </p>
          <p className="body-2 text-grayscale-500">
            근무자의 계좌, 공제항목, 금액을 기반한
            <br />
            예상급여를 사전에 체크합니다.
          </p>
        </section>
      )}

      {/* 목록 */}
      <section>
        {loading ? (
          <div className="text-center py-10 text-grayscale-500">
            불러오는 중...
          </div>
        ) : estimatedPayrolls.length === 0 ? (
          <div className="text-center py-10 text-grayscale-500">
            급여 정보가 없습니다.
          </div>
        ) : (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            <ul className="space-y-4">
              {estimatedPayrolls.map((item) => (
                <BossAutoTransferCheckCard
                  key={item.staff.staffId}
                  item={item}
                  checked={checkedKeys.has(item.payroll.key!)}
                  onToggle={handleToggle}
                />
              ))}
            </ul>
          </div>
        )}
      </section>
      <Button theme="primary" className="w-full" onClick={handleSave}>
        저장
      </Button>
    </div>
  );
};

export default BossAutoTransferEditPage;
