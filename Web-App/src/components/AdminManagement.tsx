import { useState } from 'react';
import { Users, Shield, UserPlus, Trash2 } from 'lucide-react';
import '../styling/AdminManagement.css';

interface AdminMember {
  id: number;
  name: string;
  email: string;
  role: 'Super Admin' | 'Content Moderator';
  lastActive: string;
}

const INITIAL_ADMINS: AdminMember[] = [
  { id: 1, name: 'Kagiso Sechaba', email: 'kagiso@bookacrib.bw', role: 'Super Admin', lastActive: 'Today, 2:15 PM' },
  { id: 2, name: 'Onalenna Kereng', email: 'onalenna@bookacrib.bw', role: 'Content Moderator', lastActive: 'Yesterday' }
];

export default function AdminManagement() {
  const [admins, setAdmins] = useState<AdminMember[]>(INITIAL_ADMINS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    const newMember: AdminMember = {
      id: Date.now(),
      name: newName,
      email: newEmail,
      role: 'Content Moderator',
      lastActive: 'Just now'
    };
    setAdmins([...admins, newMember]);
    setNewName('');
    setNewEmail('');
    setShowAddModal(false);
  };

  const handleRemove = (id: number) => {
    setAdmins(admins.filter(a => a.id !== id));
  };

  return (
    <div className="admin-mgmt-container">
      <div className="admin-mgmt-header-flex">
        <div>
          <h2 className="admin-mgmt-title">Admin Team & Access Management</h2>
          <p className="admin-mgmt-subtitle">Control portal permissions and view administrative staff credentials</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="primary-action-btn">
          <UserPlus style={{ width: '0.875rem', height: '0.875rem' }} /> Add Admin Staff
        </button>
      </div>

      {showAddModal && (
        <form onSubmit={handleAddAdmin} className="add-admin-form">
          <div className="form-field-group">
            <label className="form-label">Staff Full Name</label>
            <input 
              type="text" 
              placeholder="e.g., Mompati Dintwe" 
              value={newName} 
              onChange={e => setNewName(e.target.value)} 
              className="form-input" 
              required 
            />
          </div>
          <div className="form-field-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              placeholder="staff@bookacrib.bw" 
              value={newEmail} 
              onChange={e => setNewEmail(e.target.value)} 
              className="form-input" 
              required 
            />
          </div>
          <button type="submit" className="form-submit-btn">Save Staff</button>
          <button type="button" onClick={() => setShowAddModal(false)} className="form-cancel-btn">Cancel</button>
        </form>
      )}

      <table className="staff-table">
        <thead>
          <tr>
            <th>Staff Member</th>
            <th>Role Permission</th>
            <th>Last Active</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id}>
              <td>
                <div className="staff-info-cell">
                  <Users style={{ width: '1rem', height: '1.125rem', color: 'rgba(0,0,0,0.5)' }} />
                  <div>
                    <div className="staff-name">{admin.name}</div>
                    <div className="staff-email">{admin.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className="role-badge">
                  <Shield style={{ width: '0.625rem', height: '0.625rem' }} />
                  {admin.role}
                </span>
              </td>
              <td style={{ color: 'rgba(0,0,0,0.6)' }}>{admin.lastActive}</td>
              <td style={{ textAlign: 'right' }}>
                {admins.length > 1 && (
                  <button onClick={() => handleRemove(admin.id)} className="revoke-btn">
                    <Trash2 style={{ width: '0.75rem', height: '0.75rem', display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} /> Revoke
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}