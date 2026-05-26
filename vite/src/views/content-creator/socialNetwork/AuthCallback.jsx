import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error');

    if (status === 'success') {
      localStorage.setItem('social_auth_result', JSON.stringify({ type: 'AUTH_SUCCESS', data: { provider, connected: true }, ts: Date.now() }));
    } else if (status === 'error' || error) {
      console.error('Facebook Auth Callback Error:', { status, provider, error });
      localStorage.setItem('social_auth_result', JSON.stringify({ type: 'AUTH_ERROR', message: error || 'Authentication failed', ts: Date.now() }));
    }

    window.close();
  }, [searchParams]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e0e0e0', borderTop: '3px solid #5E35B1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#666', fontSize: 14, margin: 0 }}>Completing connection...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
