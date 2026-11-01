import { useState, useEffect } from 'react';
import { Users, Shield, UserPlus, Trash2 } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import '../styling/AdminManagement.css';

interface AdminMember {
  id: string; // Firebase document ID
  name: string;
  email: string;
  role: string;
  lastActive: string;
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<AdminMember[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('admin'); // <-- Default to 'admin'
  const [loading, setLoading] = useState(true);

  // Fetch admin staff from Firebase Firestore
  const fetchAdmins = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'admins'));
      const fetched: AdminMember[] = [];
      querySnapshot.forEach((document) => {
        const data = document.data();
        fetched.push({ 
          id: document.id, 
          name: data.full_name || data.name || 'Unknown Admin',
          email: data.email || '',
          role: data.role || 'admin',
          lastActive: data.lastActive || 'Just now'
        });
      });
      setAdmins(fetched);
    } catch (err) {
      console.error("Error fetching admin team: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword || !newRole) {
      alert("Please fill in all fields including a password.");
      return;
    }

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not logged in");

      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      
      // 1. Call the backend to create the Firebase Auth user + Firestore doc
      const response = await fetch(`${API_URL}/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to create admin");
      }

      // 2. Refetch the list from Firestore to get the new list
      await fetchAdmins();

      // 3. Close modal and clear inputs
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewRole('admin');
      setShowAddModal(false);
      alert("Admin created successfully! They can now log in.");
      
    } catch (err: any) {
      console.error("Error adding admin member: ", err);
      alert(err.message || "Failed to add admin");
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm("Are you sure you want to revoke this admin's access?")) return;
    
    try {
      // Permanently delete from Firebase Firestore
      await deleteDoc(doc(db, 'admins', id));
      
      // Update local state
      setAdmins(admins.filter(a => a.id !== id));
    } catch (err) {
      console.error("Error removing admin member: ", err);
    }
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

          <div className="form-field-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              placeholder="At least 6 characters" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              className="form-input" 
              required 
              minLength={6}
            />
          </div>

          <div className="form-field-group">
            <label className="form-label">Role Permission</label>
            <select 
              value={newRole} 
              onChange={e => setNewRole(e.target.value)} 
              className="form-input"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
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
          {loading ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(0,0,0,0.5)' }}>
                Loading admin team...
              </td>
            </tr>
          ) : admins.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(0,0,0,0.5)' }}>
                No admin staff registered yet. Click "Add Admin Staff" to add team members.
              </td>
            </tr>
          ) : (
            admins.map(admin => (
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
                  <button onClick={() => handleRemove(admin.id)} className="revoke-btn">
                    <Trash2 style={{ width: '0.75rem', height: '0.75rem', display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} /> Revoke
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}