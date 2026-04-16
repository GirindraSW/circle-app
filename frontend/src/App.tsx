import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FollowsPage from "./pages/FollowsPage";
import ThreadDetailPage from "./pages/ThreadDetailPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/thread/:threadId"
        element={
          <ProtectedRoute>
            <ThreadDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/follows"
        element={
          <ProtectedRoute>
            <FollowsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
