import QrScanner from "./components/QrScanner.tsx";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-500">Mango-Butter</h1>
      <QrScanner />
    </div>
  );
}
