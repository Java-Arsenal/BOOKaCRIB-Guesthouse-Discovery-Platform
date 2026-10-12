import { useState } from 'react';
import { ShieldAlert, Mail, Lock } from 'lucide-react';
import '../styling/AdminLogin.css';

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo check: admin@bookacrib.bw / admin123
    if (email === 'admin@bookacrib.bw' && password === 'admin123') {
      setError('');
      onSuccess();
    } else {
      setError('Invalid admin credentials. Use admin@bookacrib.bw / admin123');
    }
  };

  return (
    <div className="admin-auth-wrapper">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <ShieldAlert style={{ width: '2.5rem', height: '2.5rem', color: '#000000' }} />
          </div>
          <h2 className="admin-auth-title">BOOKaCRIB Admin</h2>
          <p className="admin-auth-subtitle">Restricted Executive Portal</p>
        </div>

        {error && <div className="admin-error-box">{error}</div>}

        <form onSubmit={handleLogin} className="admin-auth-form">
          <div className="admin-input-group">
            <label className="admin-input-label">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ width: '1rem', height: '1rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.4)' }} />
              <input
                type="email"
                placeholder="admin@bookacrib.bw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-auth-input"
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ width: '1rem', height: '1rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.4)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-auth-input"
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>

          <button type="submit" className="admin-auth-btn">
            Sign In to Admin Hub
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '11px', color: 'rgba(0,0,0,0.4)' }}>
          Demo credentials: <br /><b>admin@bookacrib.bw</b> / <b>admin123</b>
        </div>
      </div>
    </div>
  );
}