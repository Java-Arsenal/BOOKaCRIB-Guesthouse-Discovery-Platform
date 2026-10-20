import { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import OtpAuth from './components/OtpAuth';
import UserDashboard from './components/UserDashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | null>(null);
  const [isUserAuth, setIsUserAuth] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  // 1. Initial Landing: Pick Role
  if (!selectedRole) {
    return <RoleSelector onSelectRole={(role) => setSelectedRole(role)} />;
  }

  // 2. User Portal Flow (Guarded by OTP)
  if (selectedRole === 'user') {
    if (!isUserAuth) {
      return (
        <div>
          {/* Back button to switch role */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
            <button 
              onClick={() => setSelectedRole(null)} 
              style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              ← Back to Portal Selection
            </button>
          </div>
          <OtpAuth onSuccess={() => setIsUserAuth(true)} />
        </div>
      );
    }
    return <UserDashboard />;
  }

  // 3. Admin Portal Flow (Guarded by Admin Login)
  if (selectedRole === 'admin') {
    if (!isAdminAuth) {
      return (
        <div>
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
            <button 
              onClick={() => setSelectedRole(null)} 
              style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              ← Back to Portal Selection
            </button>
          </div>
          <AdminLogin onSuccess={() => setIsAdminAuth(true)} />
        </div>
      );
    }
    return <AdminDashboard />;
  }

  return null;
}