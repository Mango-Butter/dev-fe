// Step4.tsx
import { useContractStore } from "../store/contractStore";

export default function Step4() {
  const { formData, signatureDataURL } = useContractStore();

  const handleDownload = () => {
    const link = document.createElement("a");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = 794; // A4 기준 (210mm * 3.78 = 약 794px)
    canvas.height = 1123; // A4 기준 (297mm * 3.78 = 약 1123px)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "16px sans-serif";

    const wrapText = (
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number,
    ) => {
      const words = text.split(" ");
      let line = "";
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
      return y + lineHeight;
    };

    const rawLines = (formData.fullText || "").split("\n");
    let y = 50;
    const lineHeight = 24;
    const margin = 50;
    const maxTextHeight = canvas.height - 150;

    for (const line of rawLines) {
      if (y >= maxTextHeight) break;
      y = wrapText(ctx, line, margin, y, canvas.width - margin * 2, lineHeight);
    }

    if (signatureDataURL) {
      const sigImg = new Image();
      sigImg.onload = () => {
        const sigWidth = 200;
        const sigHeight = 100;
        const x = 50;
        const y = canvas.height - sigHeight - 50;
        ctx.drawImage(sigImg, x, y, sigWidth, sigHeight);
        link.href = canvas.toDataURL("image/png");
        link.download = "contract.png";
        link.click();
      };
      sigImg.src = signatureDataURL;
    } else {
      link.href = canvas.toDataURL("image/png");
      link.download = "contract.png";
      link.click();
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">계약서 다운로드</h2>
      <button className="btn" onClick={handleDownload}>
        이미지 다운로드
      </button>
    </div>
  );
}
