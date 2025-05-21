import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { cn } from "../../libs";

interface FileDropzoneProps {
  file: File | null;
  onChange: (file: File) => void;
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
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center border-2 border-dashed rounded-xl px-4 py-8 text-center cursor-pointer transition",
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50",
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
      {file ? (
        <p className="body-3 text-gray-700">{file.name}</p>
      ) : (
        <p className="body-3 text-gray-500">
          {placeholder ?? "여기에 파일을 드래그하거나 클릭해서 업로드하세요."}
        </p>
      )}
    </div>
  );
};

export default FileDropzone;
