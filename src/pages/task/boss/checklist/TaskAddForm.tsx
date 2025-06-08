import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import TaskStep1 from "./TaskStep1.tsx";
import TaskStep2 from "./TaskStep2.tsx";
import { useState } from "react";
import {
  getDefaultTaskAddFormValues,
  TaskAddFormValues,
  taskAddSchema,
} from "../../../../schemas/useTaskAddSchema.ts";
import { formatDateToKSTString, getKSTDate } from "../../../../libs/date.ts";
import useStoreStore from "../../../../stores/storeStore.ts";
import { isValidStoreId } from "../../../../utils/store.ts";
import { toast } from "react-toastify";
import {
  DailyTaskRoutineRequest,
  MonthlyTaskRoutineRequest,
  SingleTaskRequest,
  WeeklyTaskRoutineRequest,
} from "../../../../types/task.ts";
import { BossTaskAPI } from "../../../../api/boss/task.ts";
import { toISOStringWithTime } from "../../../../utils/task.ts";
import { addMonths } from "date-fns";

interface TaskAddFormProps {
  defaultDate?: Date;
  onClose?: () => void;
}

const TaskAddForm = ({ defaultDate, onClose }: TaskAddFormProps) => {
  const [step, setStep] = useState(1);
  const startDate = defaultDate ?? getKSTDate();
  const endDate = addMonths(startDate, 1);

  const methods = useForm<TaskAddFormValues>({
    resolver: zodResolver(taskAddSchema),
    defaultValues: {
      ...getDefaultTaskAddFormValues(),
      startDate,
      endDate,
    },
  });

  const { getValues } = methods;
  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;

  const onSubmit = async () => {
    const values = getValues();

    if (!isValidStoreId(storeId)) {
      toast.error("매장이 선택되지 않았습니다.");
      return;
    }

    const common = {
      title: values.title,
      photoRequired: values.photoRequired,
      description: values.description,
      referenceImageUrl: values.referenceImageUrl ?? "",
    };

    try {
      if (values.taskRoutineRepeatType === "ONCE") {
        const payload: SingleTaskRequest = {
          ...common,
          taskDate: formatDateToKSTString(values.startDate),
          startTime: toISOStringWithTime(values.startDate, values.startTime),
          endTime: toISOStringWithTime(values.startDate, values.endTime),
        };
        await BossTaskAPI.createSingleTask(storeId, payload);
      }

      if (values.taskRoutineRepeatType === "DAILY") {
        const payload: DailyTaskRoutineRequest = {
          ...common,
          taskRoutineRepeatType: "DAILY",
          startDate: formatDateToKSTString(values.startDate),
          endDate: formatDateToKSTString(values.endDate),
          startTime: values.startTime,
          endTime: values.endTime,
        };
        await BossTaskAPI.createTaskRoutine(storeId, payload);
      }

      if (values.taskRoutineRepeatType === "WEEKLY") {
        const payload: WeeklyTaskRoutineRequest = {
          ...common,
          taskRoutineRepeatType: "WEEKLY",
          startDate: formatDateToKSTString(values.startDate),
          endDate: formatDateToKSTString(values.endDate),
          startTime: values.startTime,
          endTime: values.endTime,
          repeatRule: {
            repeatDays: values.repeatRule?.repeatDays ?? ["MONDAY"], // 최소 하나는 필요
          },
        };
        await BossTaskAPI.createTaskRoutine(storeId, payload);
      }

      if (values.taskRoutineRepeatType === "MONTHLY") {
        const payload: MonthlyTaskRoutineRequest = {
          ...common,
          taskRoutineRepeatType: "MONTHLY",
          startDate: formatDateToKSTString(values.startDate),
          endDate: formatDateToKSTString(values.endDate),
          startTime: values.startTime,
          endTime: values.endTime,
          repeatRule: {
            repeatDates: values.repeatRule?.repeatDates ?? [1], // 최소 하나는 필요
          },
        };
        await BossTaskAPI.createTaskRoutine(storeId, payload);
      }

      toast.success("업무가 성공적으로 생성되었습니다.");
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("업무 생성에 실패했습니다.");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="h-full flex flex-col gap-4"
      >
        {step === 1 ? (
          <TaskStep1 onNext={() => setStep(2)} />
        ) : (
          <TaskStep2 onBack={() => setStep(1)} />
        )}
      </form>
    </FormProvider>
  );
};

export default TaskAddForm;
