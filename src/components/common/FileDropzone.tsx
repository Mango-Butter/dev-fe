import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { cn } from "../../libs";

interface FileDropzoneProps {
  file: File | null;
  onChange: (file: File | null) => void; // 삭제를 위해 null 허용
  placeholder?: string;
}

const FileDropzone = ({ file, onChange, placeholder }: FileDropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onChange(acceptedFiles[0]);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    noClick: !!file, // 파일이 있으면 클릭 방지
    noDrag: !!file, // 파일이 있으면 드래그 방지
  });

  const isImage = file?.type.startsWith("image/");

  return (
    <div className="relative">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center border-2 border-dashed rounded-xl px-4 py-8 text-center cursor-pointer transition",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50",
          file && "cursor-default",
        )}
      >
        <input {...getInputProps()} />
        {file ? (
          isImage ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="max-h-40 object-contain"
            />
          ) : (
            <p className="body-3 text-gray-700">{file.name}</p>
          )
        ) : (
          <>
            <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
            <p className="body-3 text-gray-500">
              {placeholder ??
                "여기에 파일을 드래그하거나 클릭해서 업로드하세요."}
            </p>
          </>
        )}
      </div>

      {file && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default FileDropzone;
