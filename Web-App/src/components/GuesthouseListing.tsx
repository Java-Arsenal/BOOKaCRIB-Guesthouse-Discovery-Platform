import { useState, useEffect } from 'react';
import { Building2, Search, Trash2, Star, MapPin } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styling/GuesthouseListing.css';

interface Guesthouse {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
}

export default function GuesthouseListing() {
  const [listings, setListings] = useState<Guesthouse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const querySnapshot = await getDocs(collection(db, 'guesthouses'));
        const items: Guesthouse[] = querySnapshot.docs.map(document => ({
          id: document.id,
          ...document.data()
        })) as Guesthouse[];
        setListings(items);
      } catch (error) {
        console.error("Error fetching guesthouses: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'guesthouses', id));
      setListings(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting guesthouse: ", error);
    }
  };

  const filteredListings = listings.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'All' || item.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return (
      <div className="listings-wrapper">
        <p style={{ textAlign: 'center', padding: '3rem 0', color: 'rgba(0,0,0,0.6)' }}>Loading live database inventory...</p>
      </div>
    );
  }

  return (
    <div className="listings-wrapper">
      <div className="listings-header">
        <div>
          <h2 className="listings-title">Guesthouse Inventory Management</h2>
          <p className="listings-subtitle">Review, manage, and filter registered stays across Botswana (Firestore Live)</p>
        </div>

        <div className="listings-controls">
          <div className="listings-search-wrapper">
            <Search className="listings-search-icon" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="listings-search"
            />
          </div>

          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Locations</option>
            <option value="Palapye">Palapye</option>
            <option value="Gaborone">Gaborone</option>
            <option value="Maun">Maun</option>
            <option value="Francistown">Francistown</option>
          </select>
        </div>
      </div>

      <div className="listings-table-container">
        <table className="listings-table">
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Location</th>
              <th>Category</th>
              <th>Nightly Rate</th>
              <th>Quality Score</th>
              <th className="table-actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.length === 0 ? (
              <tr>
                <td colSpan={6} className="listings-empty-cell">
                  <Building2 className="listings-empty-icon" />
                  No guesthouse listings found in database matching your filter.
                </td>
              </tr>
            ) : (
              filteredListings.map(item => (
                <tr key={item.id}>
                  <td className="table-cell-bold">{item.name}</td>
                  <td>
                    <span className="location-cell-flex">
                      <MapPin className="location-cell-icon" />
                      {item.location}
                    </span>
                  </td>
                  <td>
                    {item.badge ? <span className="badge-pill">{item.badge}</span> : <span className="standard-badge-text">Standard</span>}
                  </td>
                  <td className="table-cell-bold">P{item.price} / night</td>
                  <td>
                    <span className="rating-cell-flex">
                      <Star className="rating-star-icon" />
                      {item.rating} <span className="rating-count-sub">({item.reviewsCount})</span>
                    </span>
                  </td>
                  <td className="table-actions-cell">
                    <button onClick={() => handleDelete(item.id)} className="action-btn-danger" title="Remove listing">
                      <Trash2 style={{ width: '0.75rem', height: '0.75rem', display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} /> Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}