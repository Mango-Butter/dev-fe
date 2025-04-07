const ContractForm = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return (
    <div className="p-6 max-w-5xl mx-auto text-sm leading-relaxed">
      <h1 className="text-xl font-bold mb-4 text-center">표준근로계약서</h1>

      <p className="mb-4">
        <input
          type="text"
          placeholder="사업주 이름"
          className="border-b border-black outline-none px-1 w-40"
        />
        (이하 “사업주”라 함)과(와)
        <input
          type="text"
          placeholder="근로자 이름"
          className="border-b border-black outline-none px-1 w-40 ml-2"
        />
        (이하 “근로자”라 함)은 다음과 같이 근로계약을 체결한다.
      </p>

      <p className="mb-2">
        <strong>1. 근로계약기간:</strong>
        <input type="date" className="border px-2 py-1 ml-2" /> ~
        <input type="date" className="border px-2 py-1 ml-2" />
      </p>

      <p className="mb-2">
        <strong>2. 근무장소:</strong>
        <input
          type="text"
          className="border-b border-black outline-none px-2 w-1/2 ml-2"
        />
      </p>

      <p className="mb-2">
        <strong>3. 업무의 내용:</strong>
        <input
          type="text"
          className="border-b border-black outline-none px-2 w-1/2 ml-2"
        />
      </p>

      <p className="mb-2">
        <strong>4. 소정근로시간:</strong>
        <input type="time" className="border px-2 py-1 ml-2" /> ~
        <input type="time" className="border px-2 py-1 ml-2" />
        (휴게시간: <input type="time" className="border px-2 py-1 ml-2" /> ~
        <input type="time" className="border px-2 py-1 ml-2" />)
      </p>

      <p className="mb-2">
        <strong>5. 근무일/휴일:</strong> 매주
        <input
          type="text"
          placeholder="근무 요일"
          className="border-b border-black outline-none px-2 w-32 mx-1"
        />{" "}
        근무, 주휴일 매주
        <input
          type="text"
          placeholder="요일"
          className="border-b border-black outline-none px-2 w-20 ml-1"
        />
      </p>

      <p className="mb-2">
        <strong>6. 임금:</strong>
        월/일/시간급:
        <input
          type="number"
          className="border px-2 py-1 ml-2 w-32"
          placeholder="원"
        />
        <br />
        상여금: 있음 (
        <input
          type="text"
          className="border-b border-black outline-none px-1 w-20"
          placeholder="금액"
        />{" "}
        원), 없음 (<input type="checkbox" />)
        <br />
        기타급여(제수당 등): 있음 (<input type="checkbox" />
        ), 없음 (<input type="checkbox" />)
        <br />·
        <input
          type="text"
          className="border-b border-black outline-none px-1 w-32"
          placeholder="항목"
        />
        ,
        <input
          type="number"
          className="border px-2 py-1 ml-2 w-32"
          placeholder="원"
        />
        <br />
        임금지급일: 매월(매주 또는 매일)
        <input
          type="number"
          className="border px-2 py-1 ml-2 w-20"
          placeholder="일"
        />
        일 (휴일의 경우는 전일 지급)
        <br />
        지급방법: 근로자에게 직접지급(
        <input type="checkbox" />
        ), 예금통장에 입금(
        <input type="checkbox" />)
      </p>

      <p className="mb-2">
        <strong>7. 연차유급휴가:</strong> 근로기준법에서 정하는 바에 따라 부여함
      </p>

      <p className="mb-2">
        <strong>8. 사회보험 적용여부:</strong>
        <br />
        <input type="checkbox" /> 고용보험 <input type="checkbox" /> 산재보험{" "}
        <input type="checkbox" /> 국민연금 <input type="checkbox" /> 건강보험
      </p>

      <p className="mb-2">
        <strong>9. 근로계약서 교부:</strong>
        <br />
        계약 체결과 동시에 본 계약서를 사본하여 근로자에게 교부함 (근로기준법
        제17조)
      </p>

      <p className="mb-2">
        <strong>10. 기타:</strong>
        <br />이 계약에 정함이 없는 사항은 근로기준법령에 의함
      </p>

      <div className="mt-6">
        <div className="text-center">
          <p className="mb-2">
            <input
              type="number"
              value={year}
              readOnly
              className="text-center border-b border-black outline-none px-2 w-20"
            />{" "}
            년
            <input
              type="number"
              value={month}
              readOnly
              className="text-center border-b border-black outline-none px-2 w-20"
            />{" "}
            월
            <input
              type="number"
              value={day}
              readOnly
              className="text-center border-b border-black outline-none px-2 w-20"
            />{" "}
            일
          </p>
        </div>

        <div className="flex flex-wrap w-full space-x-0">
          <p className="mb-2 flex-1">
            (사업주) 사업체명:
            <input
              type="text"
              className="border-b border-black outline-none px-2 w-1/3 ml-2"
            />{" "}
            (전화:
            <input
              type="text"
              className="border-b border-black outline-none px-2 w-32"
            />{" "}
            )
            <br />
            주소:
            <input
              type="text"
              className="border-b border-black outline-none px-2 w-2/3 ml-2"
            />
            <br />
            대표자:
            <input
              type="text"
              className="border-b border-black outline-none px-2 w-1/3 ml-2"
            />{" "}
          </p>
          <div className="flex items-center justify-center w-[300px] h-[100px]">
            <p>(서명)</p>
          </div>
        </div>
        <div className="flex flex-wrap w-full space-x-0">
          <p className="mb-2 flex-1">
            (근로자) 주소:
            <input
              type="text"
              className="border-b border-black outline-none px-2 w-2/3 ml-2"
            />
            <br />
            연락처:
            <input
              type="text"
              className="border-b border-black outline-none px-2 w-1/3 ml-2"
            />
            <br />
            성명:
            <input
              type="text"
              className="border-b border-black outline-none px-2 w-1/3 ml-2"
            />{" "}
          </p>
          <div className="flex items-center justify-center w-[300px] h-[100px]">
            <p>(서명)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractForm;
