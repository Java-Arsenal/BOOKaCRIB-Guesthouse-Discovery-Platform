import { useState, useEffect } from 'react';
import { Trash2, Star, MapPin, Edit, X } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import '../styling/GuesthouseListing.css';

interface Guesthouse {
  id: string;
  name: string;
  city: string;
  price_per_night_bwp: number;
  average_rating: number;
  description: string;
}

export default function GuesthouseListing() {
  const [listings, setListings] = useState<Guesthouse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editing, setEditing] = useState<Guesthouse | null>(null);
  const [editName, setEditName] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchListings = async () => {
    try {
      const snap = await getDocs(collection(db, 'guesthouses'));
      const data: Guesthouse[] = snap.docs.map(d => {
        const item = d.data();
        return {
          id: d.id,
          name: item.name || 'Unnamed',
          city: item.city || 'Botswana',
          price_per_night_bwp: item.price_per_night_bwp || 0,
          average_rating: item.average_rating || 0,
          description: item.description || '',
        };
      });
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this listing permanently?")) return;
    try {
      await deleteDoc(doc(db, 'guesthouses', id));
      setListings(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      alert("Failed to delete listing");
    }
  };

  const openEditModal = (listing: Guesthouse) => {
    setEditing(listing);
    setEditName(listing.name);
    setEditCity(listing.city);
    setEditPrice(listing.price_per_night_bwp.toString());
    setEditDesc(listing.description);
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not logged in");

      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      
      // Call the Backend REST API instead of Firestore directly
      const res = await fetch(`${API_URL}/guesthouses/${editing.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName,
          city: editCity,
          price_per_night_bwp: Number(editPrice),
          description: editDesc
        })
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error?.message || "Failed to update listing on backend");
      }

      // Update local UI
      setListings(prev => prev.map(l => l.id === editing.id ? { ...l, name: editName, city: editCity, price_per_night_bwp: Number(editPrice), description: editDesc } : l));
      setEditing(null);
      alert("Listing updated successfully via Backend API!");
    } catch (err: any) {
      alert(err.message || "Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  const filtered = listings.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div style={{ padding: '2rem' }}>Loading inventory...</div>;

  return (
    <div className="listings-wrapper">
      <div className="listings-header">
        <div>
          <h2 className="listings-title">Guesthouse Inventory</h2>
          <p className="listings-subtitle">Manage and edit live listings</p>
        </div>
        <div className="listings-controls">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="listings-search"
          />
        </div>
      </div>

      <div className="listings-table-container">
        <table className="listings-table">
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Location</th>
              <th>Nightly Rate</th>
              <th>Rating</th>
              <th className="table-actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{textAlign: 'center', padding: '2rem'}}>No listings found.</td></tr>
            ) : (
              filtered.map(item => (
                <tr key={item.id}>
                  <td className="table-cell-bold">{item.name}</td>
                  <td><MapPin size={12} style={{ display: 'inline', marginRight: 4 }}/> {item.city}</td>
                  <td className="table-cell-bold">P{item.price_per_night_bwp} / night</td>
                  <td><Star size={12} style={{ display: 'inline', marginRight: 4 }}/> {item.average_rating}</td>
                  <td className="table-actions-cell" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => openEditModal(item)} className="action-btn-secondary" style={{ background: '#f1f5f9', border: '1px solid #ccc', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      <Edit size={12} style={{ display: 'inline', marginRight: 2 }}/> Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="action-btn-danger">
                      <Trash2 size={12} style={{ display: 'inline', marginRight: 2 }}/> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Edit Listing</h3>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Name</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '6px' }} />

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>City</label>
            <input type="text" value={editCity} onChange={e => setEditCity(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '6px' }} />

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Price (BWP)</label>
            <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '6px' }} />

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Description</label>
            <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={4} style={{ width: '100%', padding: '8px', marginBottom: '24px', border: '1px solid #ccc', borderRadius: '6px' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setEditing(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveEdit} disabled={saving} style={{ padding: '8px 16px', background: '#FF5A3C', color: '#fff', border: 'none', borderRadius: '6px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}