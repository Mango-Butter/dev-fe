// 🌱 App.tsx
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import { useContractStore } from "./store/contractStore";

function App() {
  const step = useContractStore((s) => s.step);
  return (
    <div className="p-6">
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
      {step === 4 && <Step4 />}
    </div>
  );
}
export default App;
