export const compressImageIfNeeded = async (
  file: File,
  maxSizeMB: number = 5,
): Promise<File> => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size <= maxBytes) return file;

  const image = new Image();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("canvas context null");

        const scale = Math.sqrt(maxBytes / file.size); // 크기 비례 스케일
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("압축 실패");
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          0.8,
        );
      };

      image.onerror = reject;
      image.src = reader.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
