import { useEffect, useState } from "react";
import ErrorIcon from "../../../components/icons/ErrorIcon.tsx";
import DeleteIcon from "../../../components/icons/DeleteIcon.tsx";
import { toast } from "react-toastify";
import {
  StaffAccountInfo,
  StaffPayrollBriefInfo,
} from "../../../types/payroll.ts";
import NHBankIcon from "../../../assets/NHBankIcon.png";
import { useNavigate } from "react-router-dom";
import { showConfirm } from "../../../libs/showConfirm.ts";
import {
  deleteStaffAccountInfo,
  getStaffAccount,
  getStaffPayrollInfo,
} from "../../../api/staff/payroll.ts";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";

const StaffPayrollSettingContainer = () => {
  const { selectedStore } = useStaffStoreStore();
  const [loading, setLoading] = useState(true);
  const [payrollInfo, setPayrollInfo] = useState<StaffPayrollBriefInfo | null>(
    null,
  );
  const [account, setAccount] = useState<StaffAccountInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedStore) return;
    setLoading(true);
    Promise.all([fetchAccountInfo(), fetchPayrollInfo()]).finally(() => {
      setLoading(false);
    });
  }, [selectedStore]);

  const fetchAccountInfo = async () => {
    if (!selectedStore) return;
    try {
      const accountRes = await getStaffAccount(selectedStore.storeId);
      setAccount(accountRes);
      console.log(accountRes);
    } catch (err) {
      console.error("계좌 정보 오류:", err);
    }
  };

  const fetchPayrollInfo = async () => {
    if (!selectedStore) return;
    try {
      const payrollRes = await getStaffPayrollInfo(selectedStore.storeId);
      setPayrollInfo(payrollRes);
    } catch (err) {
      console.error("급여 정보 오류:", err);
    }
  };

  const handleDeleteAccount = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (!selectedStore) return;

    const confirmed = await showConfirm({
      title: "계좌를 삭제하시겠습니까?",
      text: "계좌 정보는 삭제 후 재등록할 수 있습니다.",
      confirmText: "삭제",
      cancelText: "취소",
      icon: "warning",
    });

    if (!confirmed) return;

    try {
      await deleteStaffAccountInfo(selectedStore.storeId);
      toast.success("계좌 정보가 삭제되었습니다.");
      await fetchAccountInfo();
    } catch (err) {
      toast.error("계좌 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const redirectRegisterAccount = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/staff/store/account-register");
  };

  return (
    <div className="flex flex-col w-full">
      {/* 계좌 영역 */}
      <section className="flex flex-col gap-3 mb-4">
        <label className="title-1 text-grayscale-900">내 급여 정보</label>
        {loading ? (
          <div className="space-y-2">
            <div className="w-1/2 h-4 animate-pulse bg-grayscale-200 rounded" />
            <div className="w-3/4 h-4 animate-pulse bg-grayscale-200 rounded" />
          </div>
        ) : payrollInfo ? (
          <div className="flex justify-between items-center w-full rounded-lg border border-grayscale-300 px-4 py-3">
            <div className="title-3 text-grayscale-800 space-y-1">
              <p>시급: {payrollInfo.hourlyWage.toLocaleString()}원</p>
              <p>
                세액공제:{" "}
                {
                  {
                    INCOME_TAX: "원천징수 3.3%",
                    SOCIAL_INSURANCE: "4대보험 9.4%",
                    NONE: "보험적용안함",
                  }[payrollInfo.withholdingType]
                }
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-grayscale-500">
            급여 정보가 등록되지 않았습니다.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <label className="title-1 text-grayscale-900">계좌설정</label>

        {loading ? (
          <div className="w-full border border-grayscale-300 rounded-lg p-4 space-y-3">
            <div className="w-1/4 h-4 bg-grayscale-200 animate-pulse rounded" />
            <div className="w-1/2 h-4 bg-grayscale-200 animate-pulse rounded" />
          </div>
        ) : account && account.bankName ? (
          <div className="flex justify-between items-center w-full rounded-lg border border-grayscale-300 bg-grayscale-100 px-4 py-3">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <img src={NHBankIcon} alt="농협은행" className="h-4 w-[13px]" />
                <span className="title-2 text-grayscale-800">
                  {account.bankName}
                </span>
              </div>
              <p className="body-3 text-grayscale-500">
                {account.accountNumber}
              </p>
            </div>
            <button onClick={handleDeleteAccount}>
              <DeleteIcon className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 border border-grayscale-300 rounded-xl p-4">
            <ErrorIcon className="w-9 h-9" />
            <p className="body-2 text-grayscale-700">등록된 계좌가 없습니다.</p>
            <button
              className="body-3 text-primary hover:underline"
              onClick={redirectRegisterAccount}
            >
              + 계좌 추가하기
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default StaffPayrollSettingContainer;
