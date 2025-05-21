import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import Button from "../../../components/common/Button.tsx";
import TextField from "../../../components/common/TextField.tsx";
import { useLayout } from "../../../hooks/useLayout.ts";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import { StaffBrief } from "../../../types/staff.ts";
import { getStaffBriefList } from "../../../api/boss/staff.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import RangeDatePicker from "../../../components/common/RangeDatePicker.tsx";
import {
  dayOfWeekList,
  weekdayKorean,
  DayOfWeek,
} from "../../../types/staff.ts";
import SignaturePadSheet from "./SignaturePadSheet.tsx";
import { createContract } from "../../../api/boss/contract.ts";
import { useNavigate } from "react-router-dom";
import {
  fetchContractTemplateDetail,
  fetchContractTemplateList,
} from "../../../api/boss/contractTemplate.ts";
import SelectField from "../../../components/common/SelectField.tsx";
import useSelectedStaffStore from "../../../stores/selectedStaffStore.ts";

interface ContractFormValues {
  staffId: string | null;
  range: [Date | null, Date | null];
  duty: string;
  weekdays: DayOfWeek[];
  time: Record<DayOfWeek, { start: string; end: string }>;
  hourlyWage: number;
  bossSignatureKey: string;
}

const ContractRegisterPage = () => {
  useLayout({
    title: "기본 근로계약서",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => history.back(),
    rightIcon: null,
  });

  const [staffList, setStaffList] = useState<StaffBrief[]>([]);
  const [templateOptions, setTemplateOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { selectedStaffId, setSelectedStaffId, clearSelectedStaff } =
    useSelectedStaffStore();
  const { selectedStore } = useStoreStore();

  const {
    control,
    handleSubmit,
    setValue,
    register,
    reset,
    watch,
    formState: { isValid },
  } = useForm<ContractFormValues>({
    mode: "onChange",
    defaultValues: {
      staffId: selectedStaffId,
      range: [null, null],
      duty: "",
      weekdays: [],
      time: {} as any,
      hourlyWage: 10030,
      bossSignatureKey: "",
    },
  });

  const selectedDays = watch("weekdays");
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(
    selectedStaffId,
  );
  const { setBottomSheetContent, setBottomSheetOpen } = useBottomSheetStore();

  const toggleDay = (day: DayOfWeek) => {
    const current = watch("weekdays");
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setValue("weekdays", updated, { shouldValidate: true });
  };

  const onSubmit = async (data: ContractFormValues) => {
    if (!selectedStore) return;

    try {
      setLoading(true);

      const [contractStart, contractEnd] = data.range;
      if (!contractStart || !contractEnd) throw new Error("계약 기간 미입력");

      const workSchedules = data.weekdays.map((day) => {
        const time = data.time[day];
        return {
          dayOfWeek: day,
          startTime: time.start,
          endTime: time.end,
        };
      });

      const payload = {
        staffId: parseInt(data.staffId!),
        bossSignatureKey: data.bossSignatureKey,
        contractDataInput: {
          contractName: "기본 근로계약서",
          contractStart: contractStart.toISOString().split("T")[0],
          contractEnd: contractEnd.toISOString().split("T")[0],
          duty: data.duty,
          workSchedules,
          hourlyWage: data.hourlyWage,
        },
      };

      const res = await createContract(selectedStore.storeId, payload);
      console.log("계약서 생성 성공", res);

      clearSelectedStaff();
      navigate(`/boss/contract/${res.contractId}`); // ✅ 이동
    } catch (err) {
      console.error("계약서 제출 실패", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStaffs = async () => {
      if (!selectedStore) return;
      const storeId = selectedStore.storeId;
      const staffs = await getStaffBriefList(storeId);
      setStaffList(staffs);
    };
    fetchStaffs();
  }, []);

  useEffect(() => {
    if (localSelectedId) {
      setValue("staffId", localSelectedId);
    }
  }, [localSelectedId, setValue]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!selectedStore) return;
      const { result } = await fetchContractTemplateList(selectedStore.storeId);
      setTemplateOptions([
        { label: "-", value: "" },
        ...result.map((tpl) => ({
          label: tpl.title,
          value: tpl.templateId.toString(),
        })),
      ]);
    };
    fetchTemplates();
  }, [selectedStore]);

  useEffect(() => {
    const applyTemplate = async () => {
      if (!selectedTemplateId || !selectedStore) return;

      try {
        const data = await fetchContractTemplateDetail(
          selectedStore.storeId,
          Number(selectedTemplateId),
        );

        const weekdays =
          data.contractTemplateData.workSchedules
            ?.map((s) => s.dayOfWeek)
            .filter((d): d is DayOfWeek => d !== null && d !== undefined) ?? [];

        const time = Object.fromEntries(
          (data.contractTemplateData.workSchedules ?? []).map((s) => [
            s.dayOfWeek,
            { start: s.startTime ?? "", end: s.endTime ?? "" },
          ]),
        );

        reset({
          staffId: watch("staffId"),
          range: [
            data.contractTemplateData.contractStart
              ? new Date(data.contractTemplateData.contractStart)
              : null,
            data.contractTemplateData.contractEnd
              ? new Date(data.contractTemplateData.contractEnd)
              : null,
          ],
          duty: data.contractTemplateData.duty ?? "",
          weekdays,
          time,
          hourlyWage: data.contractTemplateData.hourlyWage ?? 10030,
          bossSignatureKey: "",
        });
      } catch (err) {
        console.error("템플릿 적용 실패", err);
      }
    };

    applyTemplate();
  }, [selectedTemplateId, selectedStore]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full h-full flex flex-col gap-6 p-6">
        <Controller
          name="staffId"
          control={control}
          rules={{ required: true }}
          render={() => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 title-1 text-black">
                근무자<span className="text-warning">*</span>
              </div>
              <div className="flex gap-3 overflow-x-auto">
                {staffList.map((staff) => (
                  <div
                    key={staff.staffId}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setLocalSelectedId(staff.staffId.toString());
                      setSelectedStaffId(staff.staffId.toString());
                      setValue("staffId", staff.staffId.toString());
                    }}
                  >
                    <img
                      src={staff.profileImageUrl}
                      alt={staff.name}
                      className={`w-14 h-14 rounded-full border-2 ${
                        localSelectedId === staff.staffId.toString()
                          ? "border-primary-900"
                          : "border-transparent"
                      }`}
                    />
                    <div
                      className={`title-2 ${
                        localSelectedId === staff.staffId.toString()
                          ? "font-semibold text-black"
                          : "font-medium text-grayscale-500"
                      }`}
                    >
                      {staff.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        />

        {templateOptions.length <= 1 ? (
          <div className="flex-col justify-start items-start gap-4 inline-flex w-full">
            <div className="flex items-center gap-2 self-stretch">
              <label className="title-1 text-grayscale-900">
                근로계약서 템플릿
              </label>
            </div>
            <div className="w-full rounded-lg bg-grayscale-100 border border-grayscale-300 text-grayscale-600 px-4 py-3.5 text-sm">
              등록된 템플릿이 없습니다.
            </div>
          </div>
        ) : (
          <SelectField
            title="근로계약서 템플릿"
            placeholder="근로계약서 템플릿을 선택해주세요"
            options={templateOptions}
            value={selectedTemplateId}
            onChange={(val) => setSelectedTemplateId(val)}
            size="md"
          />
        )}

        <Controller
          name="range"
          control={control}
          render={({ field }) => (
            <section>
              <label className="title-1 block mb-2">
                근로계약 기간 <span className="text-red-500">*</span>
              </label>
              <RangeDatePicker
                value={field.value}
                onChange={field.onChange}
                mode="future"
              />
            </section>
          )}
        />

        <Controller
          name="duty"
          control={control}
          render={({ field }) => (
            <TextField
              title="업무"
              placeholder="예) 홀 서빙"
              required
              {...field}
            />
          )}
        />

        <section>
          <label className="title-1 block mb-2">
            근무 요일 선택 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-7 gap-2">
            {dayOfWeekList.map((day) => (
              <button
                type="button"
                key={day}
                className={`rounded-lg border p-2 text-sm ${
                  selectedDays.includes(day)
                    ? "border-yellow-300 bg-yellow-100 text-black"
                    : "text-gray-600"
                }`}
                onClick={() => toggleDay(day)}
              >
                {weekdayKorean[day]}
              </button>
            ))}
          </div>
        </section>

        {selectedDays.map((day) => (
          <section key={day}>
            <label className="text-sm font-medium">
              {weekdayKorean[day]} 근무 시간{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="time"
                {...register(`time.${day}.start`)}
                className="flex-1 rounded-md border px-3 py-2 text-sm"
              />
              <span className="self-center text-gray-400">~</span>
              <input
                type="time"
                {...register(`time.${day}.end`)}
                className="flex-1 rounded-md border px-3 py-2 text-sm"
              />
            </div>
          </section>
        ))}

        <Controller
          name="hourlyWage"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value as number}
              title="시급"
              min={1}
              placeholder="10,030"
              description="현재 최저시급은 10,030원 입니다."
              type="number"
              theme="suffix"
              suffix="원"
              required
            />
          )}
        />

        <Controller
          name="bossSignatureKey"
          control={control}
          render={() => (
            <div className="flex flex-col gap-2">
              <div className="flex title-1 text-black gap-1">
                서명<span className="text-warning">*</span>
              </div>
              <div
                className="h-44 px-6 py-4 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer bg-white"
                onClick={() => {
                  setBottomSheetContent(
                    <SignaturePadSheet
                      onComplete={({ base64, signatureKey }) => {
                        setSignatureImage(base64); // ✅ 이미지 상태에 저장
                        setValue("bossSignatureKey", signatureKey); // ✅ 폼에는 key만 저장
                        setBottomSheetOpen(false);
                      }}
                    />,
                    { title: "서명 그리기" },
                  );
                }}
              >
                {signatureImage ? (
                  <img
                    src={signatureImage}
                    alt="서명 이미지"
                    className="h-full object-contain"
                  />
                ) : (
                  "근로계약서에 적용할 서명을 진행해주세요."
                )}
              </div>
            </div>
          )}
        />
        <Button
          size="lg"
          theme="primary"
          type="submit"
          disabled={!isValid || loading}
          state={loading ? "disabled" : isValid ? "default" : "disabled"}
          className="w-full my-6"
        >
          {loading ? "작성 중..." : "작성"}
        </Button>
      </div>
    </form>
  );
};

export default ContractRegisterPage;
