import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { registerBillingKey } from "../../../api/boss/payment";

const SuccessPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const authKey = params.get("authKey");
    const customerKey = params.get("customerKey");

    if (authKey && customerKey) {
      console.log("BillingKey: " + authKey);
      console.log("customerKey: " + customerKey);
      registerBillingKey(authKey, customerKey)
        .then(() => {
          setStatus("success");
          setTimeout(() => {
            navigate("/boss");
          }, 2000);
        })
        .catch(() => {
          setStatus("error");
        });
    } else {
      setStatus("error");
    }
  }, [params, navigate]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-xl font-semibold mb-2">카드 등록 중입니다...</h1>
        <p className="text-gray-500">잠시만 기다려주세요.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          카드 등록 완료
        </h1>
        <p className="text-gray-700 mb-6">
          정기 결제를 위한 카드 등록이 성공적으로 완료되었어요.
        </p>
        <button
          onClick={() => navigate("/boss/subscribe")}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
        >
          구독 페이지로 돌아가기
        </button>
      </div>
    );
  }

  // status === "error"
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-2xl font-bold text-red-500 mb-2">등록 실패</h1>
      <p className="text-gray-600 mb-6">
        카드 등록 중 문제가 발생했어요.
        <br /> 다시 시도해주세요.
      </p>
      <button
        onClick={() => navigate("/boss/subscribe")}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        다시 시도하기
      </button>
    </div>
  );
};

export default SuccessPage;
