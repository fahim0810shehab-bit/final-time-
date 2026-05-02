import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import OidcCallback from './pages/OidcCallback';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import PublicSite from './pages/PublicSite';
import { ToastProvider } from './components/shared/Toast';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oidc" element={<OidcCallback />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
          <Route path="/site/:username" element={<PublicSite />} />
          <Route path="/site/:username/:slug" element={<PublicSite />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<div className="flex h-screen items-center justify-center bg-zinc-950 text-white"><h1 className="text-4xl font-bold">404 - Not Found</h1></div>} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
