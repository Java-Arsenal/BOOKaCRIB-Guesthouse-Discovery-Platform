import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
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
    setError('');

    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInEmail = userCredential.user.email;

      if (!loggedInEmail) {
        await signOut(auth);
        setError('Authentication failed. No email associated with account.');
        return;
      }

      // 2. Check if the logged-in email exists in your Firestore 'admins' collection
      const adminsRef = collection(db, 'admins');
      const q = query(adminsRef, where('email', '==', loggedInEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Not an authorized admin, sign them out immediately
        await signOut(auth);
        setError('Access Denied: Your email is not authorized as an administrator.');
        return;
      }

      // 3. Authorized admin found, proceed to dashboard
      onSuccess();
    } catch (err: any) {
      console.error("Login error:", err);
      setError('Invalid admin credentials. Please check your email or password.');
    }
  };

  return (
    <div className="admin-auth-wrapper">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <div className="admin-auth-logo-container">
            <img src="/logo.svg" alt="BOOKaCRIB" width={72} height={72} />
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