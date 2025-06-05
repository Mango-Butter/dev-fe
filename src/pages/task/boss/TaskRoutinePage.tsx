import { useEffect, useState } from "react";
import { BossTaskAPI } from "../../../api/boss/task.ts";
import { TaskRoutine } from "../../../types/task.ts";
import TaskRoutineCard from "./TaskRoutineCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  storeId: string;
}

const TaskRoutinePage: React.FC<Props> = ({ storeId }) => {
  const [taskRoutines, setTaskRoutines] = useState<TaskRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskRoutines = async () => {
    setLoading(true);
    setError(null);
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

  const handleDelete = async (deleteOption: "ALL" | "PENDING") => {
    const confirmed = window.confirm(
      deleteOption === "ALL"
        ? "정말 모든 반복 업무를 삭제하시겠습니까?"
        : "보류 중인 반복 업무만 삭제하시겠습니까?",
    );
    if (!confirmed) return;

    try {
      await BossTaskAPI.deleteTaskRoutine(storeId, deleteOption);
      toast.success(
        deleteOption === "ALL"
          ? "모든 반복 업무가 삭제되었습니다."
          : "예정된 반복 업무가 삭제되었습니다.",
      );
      fetchTaskRoutines(); // 삭제 후 갱신
    } catch (err) {
      console.error("반복 업무 삭제 실패:", err);
      toast.error("삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchTaskRoutines();
  }, [storeId]);

  if (loading) return <div>불러오는 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {taskRoutines.length === 0 ? (
        <div>등록된 반복 업무가 없습니다.</div>
      ) : (
        taskRoutines.map((routine) => (
          <TaskRoutineCard key={routine.id} routine={routine} />
        ))
      )}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => handleDelete("ALL")}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          전체 삭제
        </button>
        <button
          onClick={() => handleDelete("PENDING")}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          예정된 반복 업무 삭제
        </button>
      </div>
    </div>
  );
};

export default TaskRoutinePage;
