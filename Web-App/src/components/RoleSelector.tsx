import { Building2, User, ShieldAlert } from 'lucide-react';
import '../styling/RoleSelector.css';

interface RoleSelectorProps {
  onSelectRole: (role: 'user' | 'admin') => void;
}

export default function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="role-select-wrapper">
      <div className="role-select-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          <Building2 style={{ width: '2.5rem', height: '2.5rem', color: '#000000' }} />
        </div>
        <h1 className="role-select-title">BOOKaCRIB</h1>
        <p className="role-select-subtitle">Select your portal access level to continue</p>

        <div className="role-options-grid">
          <button onClick={() => onSelectRole('user')} className="role-card-btn">
            <div className="role-card-icon">
              <User style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <div>
              <h3 className="role-card-title">User Discovery Portal</h3>
              <p className="role-card-desc">Browse guesthouses, search with AI, and save favorites</p>
            </div>
          </button>

          <button onClick={() => onSelectRole('admin')} className="role-card-btn">
            <div className="role-card-icon">
              <ShieldAlert style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <div>
              <h3 className="role-card-title">Admin Management Portal</h3>
              <p className="role-card-desc">Manage inventory, review listings, and check analytics</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}