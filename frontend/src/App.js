import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ExamCreate from "./pages/ExamCreate";
import ExamDetail from "./pages/ExamDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exam/create" element={<ExamCreate />} />
        <Route path="/exam/:id" element={<ExamDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;