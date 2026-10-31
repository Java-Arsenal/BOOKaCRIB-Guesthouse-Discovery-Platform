import { useEffect, useState } from 'react';
import { Smartphone, Trash2, Ban, CheckCircle } from 'lucide-react';
import { listCustomers, setCustomerStatus, deleteCustomer } from '../services/api';
import '../styling/AdminManagement.css';

interface Customer {
  customer_id: string;
  full_name: string;
  email: string | null;
  status: 'active' | 'suspended';
  created_at: string | null;
}

export default function UserManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  // Fetch mobile-app customer accounts from the Backend API on load
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await listCustomers();
        setCustomers(data);
      } catch (err) {
        console.error('Error fetching customers: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Toggle an account between active and suspended via the Backend API
  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'suspended') => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setBusyId(id);
    try {
      await setCustomerStatus(id, newStatus);
      setCustomers(customers.map(c => c.customer_id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error('Error updating customer status: ', err);
    } finally {
      setBusyId(null);
    }
  };

  // Permanently delete a customer account (Firestore profile + Firebase Auth user) via the Backend API
  const handleRemoveCustomer = async (id: string) => {
    setBusyId(id);
    try {
      await deleteCustomer(id);
      setCustomers(customers.filter(c => c.customer_id !== id));
    } catch (err) {
      console.error('Error removing customer: ', err);
    } finally {
      setBusyId(null);
    }
  };

  const filteredCustomers = customers.filter(
    c =>
      c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatJoined = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

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
            <th>Joined</th>
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
          ) : filteredCustomers.length === 0 ? (
            <tr>
              <td colSpan={4} className="table-empty-cell">
                No mobile app users found matching your search.
              </td>
            </tr>
          ) : (
            filteredCustomers.map(customer => (
              <tr key={customer.customer_id}>
                <td>
                  <div className="staff-info-cell">
                    <Smartphone className="staff-icon-muted" />
                    <div>
                      <div className="staff-name">{customer.full_name}</div>
                      <div className="staff-email">{customer.email ?? '—'}</div>
                    </div>
                  </div>
                </td>
                <td className="table-text-muted">{formatJoined(customer.created_at)}</td>
                <td>
                  <span className={`role-badge ${customer.status === 'active' ? 'status-active-badge' : 'status-suspended-badge'}`}>
                    {customer.status === 'active' ? <CheckCircle className="badge-icon" /> : <Ban className="badge-icon" />}
                    {customer.status === 'active' ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="table-cell-right">
                  <button
                    onClick={() => handleToggleStatus(customer.customer_id, customer.status)}
                    disabled={busyId === customer.customer_id}
                    className={customer.status === 'active' ? 'revoke-btn-warning' : 'primary-action-btn-sm'}
                  >
                    {customer.status === 'active' ? 'Suspend' : 'Restore'}
                  </button>
                  <button
                    onClick={() => handleRemoveCustomer(customer.customer_id)}
                    disabled={busyId === customer.customer_id}
                    className="revoke-btn"
                  >
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
