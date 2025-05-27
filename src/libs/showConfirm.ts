// utils/showConfirm.ts
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface ShowConfirmOptions {
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: "warning" | "question" | "info" | "error" | "success";
}

export const showConfirm = async ({
  title,
  text = "",
  confirmText = "확인",
  cancelText = "취소",
  icon = "question",
}: ShowConfirmOptions): Promise<boolean> => {
  const result = await MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    buttonsStyling: false,
    customClass: {
      popup: "rounded-2xl shadow-lg",
      title: "text-lg font-bold text-gray-800",
      htmlContainer: "text-sm text-gray-600",
      confirmButton:
        "bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none",
      cancelButton:
        "bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 ml-2 focus:outline-none",
    },
    backdrop: `rgba(0,0,0,0.4)`,
  });

  return result.isConfirmed;
};
