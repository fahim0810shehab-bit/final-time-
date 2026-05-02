import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { SeliseIAM } from '../lib/selise';
import { useToast } from '../components/shared/Toast';

export default function OidcCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { showToast } = useToast();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      showToast('Invalid authentication code', 'error');
      navigate('/login');
      return;
    }

    SeliseIAM.exchangeCode(code)
      .then(data => {
        setUser(data);
        showToast('Logged in successfully', 'success');
        navigate('/dashboard');
      })
      .catch((err: any) => {
        console.error(err);
        showToast(err.message || 'Authentication failed', 'error');
        navigate('/login');
      });
  }, [searchParams, navigate, setUser, showToast]);

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-zinc-400 font-medium">Completing authentication...</p>
      </div>
    </div>
  );
}
