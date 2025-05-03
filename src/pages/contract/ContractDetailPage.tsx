import { useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import { useLayout } from "../../hooks/useLayout";

const ContractDetailPage = () => {
  useParams();

  useLayout({
    title: "망고보스 표준 근로계약서",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => history.back(),
    rightIcon: null,
  });

  return (
    <div className="flex flex-col x-full h-full gap-24 px-5 py-6 bg-white">
      <div className="w-full inline-flex flex-col justify-center items-center gap-6">
        <div className="self-stretch inline-flex justify-start items-center gap-2 flex-wrap content-center">
          <div
            data-icon="false"
            data-size="large"
            data-style="graysolid"
            className="px-3 py-1.5 bg-grayscale-100 rounded-lg flex justify-center items-center gap-1"
          >
            <div className="justify-start text-grayscale-900 title-1">
              사업주
            </div>
          </div>
          <div className="justify-center text-grayscale-700 body-1">
            (이하 “사업주”라 함)과(와)
          </div>
          <div
            data-icon="false"
            data-size="large"
            data-style="graysolid"
            className="px-3 py-1.5 bg-grayscale-100 rounded-lg flex justify-center items-center gap-1"
          >
            <div className="justify-start text-grayscale-900 title-1">
              근로자
            </div>
          </div>
          <div className="justify-center text-grayscale-700 body-1">
            (이하 “근로자”라 함)은 다음과 같이 근로계약을 체결한다.
          </div>
        </div>
        {/* 조항 리스트 */}
        <div className="flex flex-col gap-4 w-full">
          {[
            { label: "근로계약기간", value: "근로계약기간" },
            { label: "근무 장소", value: "근무 장소" },
            { label: "업무", value: "업무 내용" },
            { label: "근무 요일", value: "근무 요일" },
            { label: "근무 시간", value: "근무 시간" },
            { label: "시급", value: "시급" },
          ].map((item, index) => (
            <div
              key={item.label}
              className="inline-flex justify-start items-center gap-5"
            >
              <div className="title-1 text-grayscale-900">
                {index + 1}. {item.label}
              </div>
              <div className="px-3 py-1.5 bg-grayscale-100 rounded-lg flex items-center justify-center">
                <span className="title-1 text-grayscale-900">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="inline-flex flex-col gap-3 w-full">
          <div className="w-full justify-center text-grayscale-900 title-1">
            근로계약서 교부
          </div>
          <div className="w-full justify-center text-grayscale-500 body-1">
            사업주는 근로계약을 체결함과 동시에 본 계약서를 사본하여 근로자의
            교부요구와 관계없이 근로자에게 교부함(근로기준법 제 17조 이행)
          </div>
        </div>
        <div className="inline-flex flex-col gap-3 w-full">
          <div className="w-full justify-center text-grayscale-900 title-1">
            기타
          </div>
          <div className="w-full justify-center text-grayscale-500 body-1">
            이 계약에 정함이 없는 사항은 근로기준법령에 의함
          </div>
        </div>
      </div>

      {/* 매장 정보 */}
      <div className="inline-flex flex-col justify-center items-start gap-7 w-full">
        <div className="inline-flex flex-col justify-start items-start gap-4">
          <div className="inline-flex justify-start items-center gap-5 text-grayscale-900 title-1">
            <div>매장명</div>
            <div>스타벅스 아주대점</div>
          </div>
          <div className="inline-flex justify-start items-center gap-5 text-grayscale-900 title-1">
            <div>사업자번호</div>
            <div>123-45-67890</div>
          </div>
          <div className="inline-flex justify-start items-center gap-5 text-grayscale-900 title-1">
            <div>매장 주소</div>
            <div>경기도 수원시 영통구 월드컵로 206 아주대학교</div>
          </div>
          <div className="inline-flex justify-start items-center gap-5 text-grayscale-900 title-1">
            <div>대표자명</div>
            <div>김사장</div>
          </div>
        </div>

        <div className="inline-flex flex-col justify-start items-start gap-4">
          <div className="inline-flex justify-start items-center gap-5 text-grayscale-900 title-1">
            <div>근로자 성명</div>
            <div>이명건</div>
          </div>
          <div className="inline-flex justify-start items-center gap-5 text-grayscale-900 title-1">
            <div>연락처</div>
            <div>010-4070-2430</div>
          </div>
        </div>

        {/* 서명 영역 */}
        <div className="self-stretch inline-flex justify-start items-start gap-3">
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-3">
            <div className="justify-center text-grayscale-900 text-base title-1">
              사장님 서명
            </div>
            <div className="self-stretch h-32 px-6 py-3 bg-grayscale-100 rounded-xl border border-grayscale-400"></div>
          </div>
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-3">
            <div className="justify-center text-grayscale-900 text-base title-1">
              근로자 서명
            </div>
            <div className="self-stretch h-32 px-6 py-3 bg-grayscale-100 rounded-xl border border-grayscale-400"></div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <Button
        size="md"
        theme="primary"
        className="w-full mt-auto"
        onClick={() => {
          // TODO: 템플릿 사용 처리
          alert("템플릿 사용됨");
        }}
      >
        템플릿 사용
      </Button>
    </div>
  );
};

export default ContractDetailPage;
