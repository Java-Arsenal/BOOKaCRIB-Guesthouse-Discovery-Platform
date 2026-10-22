import { useState, useEffect } from 'react';
import { Users, Shield, UserPlus, Trash2 } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
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
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch admin staff from Firebase Firestore on load
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'admins'));
        const fetched: AdminMember[] = [];
        querySnapshot.forEach((document) => {
          fetched.push({ id: document.id, ...document.data() } as AdminMember);
        });
        setAdmins(fetched);
      } catch (err) {
        console.error("Error fetching admin team: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newRole) return;

    try {
      const newMemberData = {
        name: newName,
        email: newEmail,
        role: newRole,
        lastActive: 'Just now',
        createdAt: new Date()
      };

      // Save to Firebase Firestore 'admins' collection
      const docRef = await addDoc(collection(db, 'admins'), newMemberData);

      // Update local state instantly
      setAdmins([...admins, { id: docRef.id, ...newMemberData }]);
      setNewName('');
      setNewEmail('');
      setNewRole('');
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding admin member: ", err);
    }
  };

  const handleRemove = async (id: string) => {
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
            <label className="form-label">Custom Role Title</label>
            <input 
              type="text" 
              placeholder="e.g., Lead Operations Manager" 
              value={newRole} 
              onChange={e => setNewRole(e.target.value)} 
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