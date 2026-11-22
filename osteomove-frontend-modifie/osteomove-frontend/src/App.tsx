import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { ToastProvider } from "./components/Toast";
import HomePage from "./pages/HomePage";
import ExercisesPage from "./pages/ExercisesPage";
import VideosPage from "./pages/VideosPage";
import ProgramPage from "./pages/ProgramPage";
import ProgressPage from "./pages/ProgressPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EducationPage from "./pages/EducationPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useEffect, useState } from "react";
import { apiRequest } from "./lib/api";
import { KEYS, useLocalStorage, writeStorage } from "./hooks/useLocalStorage";
import type { UserAccount } from "./types";

function ProtectedRoute({ children, ready }: { children: JSX.Element; ready: boolean }) {
  const [user] = useLocalStorage<UserAccount | null>(KEYS.user, null);
  if (!ready) return <div className="container-page py-16" role="status">Vérification de votre session…</div>;
  return user ? children : <Navigate to="/login" replace />;
}



export default function App() {
  const [sessionReady, setSessionReady] = useState(false);
  useEffect(() => {
    if (!window.localStorage.getItem(KEYS.user)) { setSessionReady(true); return; }
    apiRequest<{ user: UserAccount }>("/auth/me")
      .then(({ user }) => writeStorage(KEYS.user, user))
      .catch(() => writeStorage(KEYS.user, null))
      .finally(() => setSessionReady(true));
  }, []);
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="exercises" element={<ExercisesPage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="program" element={<ProtectedRoute ready={sessionReady}><ProgramPage /></ProtectedRoute>} />
          <Route path="progress" element={<ProtectedRoute ready={sessionReady}><ProgressPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute ready={sessionReady}><ProfilePage /></ProtectedRoute>} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
