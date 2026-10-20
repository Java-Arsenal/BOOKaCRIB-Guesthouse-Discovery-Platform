import { useState } from 'react';
import { ShieldAlert, Mail, Lock } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../styling/AdminLogin.css';

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      onSuccess();
    } catch (err: any) {
      setError('Invalid admin credentials. Please check your email or password.');
    }
  };

  return (
    <div className="admin-auth-wrapper">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <div className="admin-auth-logo-container">
            <ShieldAlert style={{ width: '2.5rem', height: '2.5rem', color: '#000000' }} />
          </div>
          <h2 className="admin-auth-title">BOOKaCRIB Admin</h2>
          <p className="admin-auth-subtitle">Restricted Executive Portal</p>
        </div>

        {error && <div className="admin-error-box">{error}</div>}

        <form onSubmit={handleLogin} className="admin-auth-form">
          <div className="admin-input-group">
            <label className="admin-input-label">Admin Email</label>
            <div className="admin-input-icon-wrapper">
              <Mail className="admin-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-auth-input"
                required
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label">Password</label>
            <div className="admin-input-icon-wrapper">
              <Lock className="admin-input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-auth-input"
                required
              />
            </div>
          </div>

          <button type="submit" className="admin-auth-btn">
            Sign In to Admin Hub
          </button>
        </form>
      </div>
    </div>
  );
}