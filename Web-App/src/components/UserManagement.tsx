import { useState, useEffect } from 'react';
import { Smartphone, Trash2, Ban, CheckCircle } from 'lucide-react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styling/AdminManagement.css';

interface MobileAppUser {
  id: string; // Firebase document ID
  name: string;
  email: string;
  lastLogin: string;
  status: 'Active' | 'Suspended';
}

export default function UserManagement() {
  const [users, setUsers] = useState<MobileAppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch mobile app users from Firebase Firestore 'mobileUsers' collection on load
  useEffect(() => {
    const fetchMobileUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'mobileUsers'));
        const fetched: MobileAppUser[] = [];
        querySnapshot.forEach((document) => {
          fetched.push({ id: document.id, ...document.data() } as MobileAppUser);
        });
        setUsers(fetched);
      } catch (err) {
        console.error("Error fetching mobile app users: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMobileUsers();
  }, []);

  // Toggle user account status (Active / Suspended) in Firebase
  const handleToggleStatus = async (id: string, currentStatus: 'Active' | 'Suspended') => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      const userDocRef = doc(db, 'mobileUsers', id);
      await updateDoc(userDocRef, { status: newStatus });

      // Update local state instantly
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    } catch (err) {
      console.error("Error updating user status: ", err);
    }
  };

  // Permanently delete user record from Firestore
  const handleRemoveUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'mobileUsers', id));
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error("Error removing user record: ", err);
    }
  };

  const filteredUsers = users.filter(
    u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-mgmt-container">
      <div className="admin-mgmt-header-flex">
        <div>
          <h2 className="admin-mgmt-title">Mobile App User Records</h2>
          <p className="admin-mgmt-subtitle">Monitor customers and guests registered on the BOOKaCRIB mobile application</p>
        </div>
        <div className="user-search-wrapper">
          <input 
            type="text" 
            placeholder="Search mobile users..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <table className="staff-table">
        <thead>
          <tr>
            <th>Customer Account</th>
            <th>Last Mobile Login</th>
            <th>Account Status</th>
            <th className="table-header-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="table-empty-cell">
                Loading mobile app users...
              </td>
            </tr>
          ) : filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={4} className="table-empty-cell">
                No mobile app users found matching your search.
              </td>
            </tr>
          ) : (
            filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="staff-info-cell">
                    <Smartphone className="staff-icon-muted" />
                    <div>
                      <div className="staff-name">{user.name}</div>
                      <div className="staff-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="table-text-muted">{user.lastLogin}</td>
                <td>
                  <span className={`role-badge ${user.status === 'Active' ? 'status-active-badge' : 'status-suspended-badge'}`}>
                    {user.status === 'Active' ? <CheckCircle className="badge-icon" /> : <Ban className="badge-icon" />}
                    {user.status}
                  </span>
                </td>
                <td className="table-cell-right">
                  <button 
                    onClick={() => handleToggleStatus(user.id, user.status)} 
                    className={user.status === 'Active' ? 'revoke-btn-warning' : 'primary-action-btn-sm'}
                  >
                    {user.status === 'Active' ? 'Suspend' : 'Restore'}
                  </button>
                  <button onClick={() => handleRemoveUser(user.id)} className="revoke-btn">
                    <Trash2 className="action-icon-inline" /> Delete
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