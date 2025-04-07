import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MobileLayout from "./layouts/MobileLayout";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Employees from "./pages/Employees";
import Task from "./pages/Task.tsx";
import Store from "./pages/Store";
import NotFound from "./pages/NotFound";

//Todo: 추후 페이지 별 Lazy Loading 적용 예정
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Home />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="employees" element={<Employees />} />
          <Route path="task" element={<Task />} />
          <Route path="store" element={<Store />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
