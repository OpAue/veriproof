import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ExamCreate from './pages/ExamCreate';
import RosterRegister from './pages/RosterRegister';
import ExamDetail from './pages/ExamDetail';
import ExamEnterCode from './pages/ExamEnterCode';
import ExamEnterStudent from './pages/ExamEnterStudent';
import ExamSession from './pages/ExamSession';
import ExamDone from './pages/ExamDone';

// 로그인된 사용자만 접근 가능한 라우트 보호
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/exam/create"
          element={
            <PrivateRoute>
              <ExamCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/exam/create/roster"
          element={
            <PrivateRoute>
              <RosterRegister />
            </PrivateRoute>
          }
        />
        <Route
          path="/exam/:id"
          element={
            <PrivateRoute>
              <ExamDetail />
            </PrivateRoute>
          }
        />

        {/* 학생 응시 플로우 (인증 불필요) */}
        <Route path="/exam" element={<ExamEnterCode />} />
        <Route path="/exam/enter" element={<ExamEnterStudent />} />
        <Route path="/exam/session" element={<ExamSession />} />
        <Route path="/exam/done" element={<ExamDone />} />
      </Routes>
    </BrowserRouter>
  );
}
