import { useEffect, useState } from "react";
import { BossTaskAPI } from "../../../../api/boss/task.ts";
import { TaskRoutine } from "../../../../types/task.ts";
import TaskRoutineCard from "./TaskRoutineCard.tsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStoreStore from "../../../../stores/storeStore.ts";
import { isValidStoreId } from "../../../../utils/store.ts";
import { useLayout } from "../../../../hooks/useLayout.ts";

const TaskRoutinePage = () => {
  const [taskRoutines, setTaskRoutines] = useState<TaskRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;

  useLayout({
    title: "반복 업무 관리",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: true,
    onBack: () => history.back(),
  });

  const fetchTaskRoutines = async () => {
    setLoading(true);
    setError(null);
    if (!isValidStoreId(storeId)) {
      setLoading(false);
      return;
    }

    try {
      const routines = await BossTaskAPI.getTaskRoutines(storeId);
      setTaskRoutines(routines);
    } catch (err) {
      console.error("반복 업무 조회 실패:", err);
      setError("반복 업무를 불러오는 데 실패했습니다.");
      toast.error("반복 업무를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskRoutines();
  }, [storeId]);

  if (loading) return <div>불러오는 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col p-6">
      {taskRoutines.length === 0 ? (
        <div>등록된 반복 업무가 없습니다.</div>
      ) : (
        taskRoutines.map((routine) => (
          <TaskRoutineCard
            key={routine.id}
            routine={routine}
            storeId={storeId}
            fetchTaskRoutines={fetchTaskRoutines}
          />
        ))
      )}
    </div>
  );
};

export default TaskRoutinePage;
