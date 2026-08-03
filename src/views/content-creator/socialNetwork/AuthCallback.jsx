import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error');

    if (status === 'success') {
      localStorage.setItem('social_auth_result', JSON.stringify({
        type: 'AUTH_SUCCESS',
        data: { provider, connected: true },
        ts: Date.now()
      }));
    } else if (status === 'error' || error) {
      localStorage.setItem('social_auth_result', JSON.stringify({
        type: 'AUTH_ERROR',
        data: { provider },
        message: error || 'Authentication failed',
        ts: Date.now()
      }));
    }

    window.close();
  }, [searchParams]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: 16,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#fafbfc',
      margin: 0,
      padding: 0
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(94,53,177,0.3)'
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
      <div style={{
        width: 28,
        height: 28,
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #5E35B1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#64748b', fontSize: 13, margin: 0, fontWeight: 500 }}>
        Connecting your account...
      </p>
      <p style={{ color: '#94a3b8', fontSize: 11, margin: 0 }}>
        Please wait while we finalize the connection
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
