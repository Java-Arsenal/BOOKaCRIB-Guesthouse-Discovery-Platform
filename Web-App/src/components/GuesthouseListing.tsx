import { useState } from 'react';
import { Building2, Search, Trash2, Star, MapPin } from 'lucide-react';
import '../styling/GuesthouseListing.css';

interface Guesthouse {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
}

const MOCK_LISTINGS: Guesthouse[] = [
  { id: 1, name: 'Kopano Hill Retreat', location: 'Palapye', price: 380, rating: 4.9, reviewsCount: 31, badge: 'Premier Rated' },
  { id: 2, name: 'Tshwene Acacia Lodge', location: 'Gaborone', price: 450, rating: 4.8, reviewsCount: 42, badge: 'Popular' },
  { id: 3, name: 'Kgale View Haven', location: 'Gaborone', price: 320, rating: 4.6, reviewsCount: 19, badge: 'Budget Friendly' },
  { id: 4, name: 'Okavango Delta Oasis', location: 'Maun', price: 650, rating: 4.95, reviewsCount: 54, badge: 'Scenic View' },
  { id: 5, name: 'The Grand Francistown Stay', location: 'Francistown', price: 410, rating: 4.7, reviewsCount: 27, badge: 'Business Choice' }
];

export default function GuesthouseListing() {
  const [listings, setListings] = useState<Guesthouse[]>(MOCK_LISTINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const handleDelete = (id: number) => {
    setListings(prev => prev.filter(item => item.id !== id));
  };

  const filteredListings = listings.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'All' || item.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="listings-wrapper">
      <div className="listings-header">
        <div>
          <h2 className="listings-title">Guesthouse Inventory Management</h2>
          <p className="listings-subtitle">Review, manage, and filter registered stays across Botswana</p>
        </div>

        <div className="listings-controls">
          <div style={{ position: 'relative' }}>
            <Search style={{ width: '1rem', height: '1rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.4)' }} />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="listings-search"
              style={{ paddingLeft: '2.25rem' }}
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
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 0', color: 'rgba(0,0,0,0.5)' }}>
                  <Building2 style={{ width: '2rem', height: '2rem', margin: '0 auto 0.5rem auto', display: 'block', color: 'rgba(0,0,0,0.3)' }} />
                  No guesthouse listings found matching your filter.
                </td>
              </tr>
            ) : (
              filteredListings.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 'bold' }}>{item.name}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin style={{ width: '0.75rem', height: '0.75rem', color: 'rgba(0,0,0,0.4)' }} />
                      {item.location}
                    </span>
                  </td>
                  <td>
                    {item.badge ? <span className="badge-pill">{item.badge}</span> : <span style={{ color: 'rgba(0,0,0,0.4)' }}>Standard</span>}
                  </td>
                  <td style={{ fontWeight: 'bold' }}>P{item.price} / night</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 'bold', color: '#92400e' }}>
                      <Star style={{ width: '0.75rem', height: '0.75rem', fill: '#f59e0b', color: '#f59e0b' }} />
                      {item.rating} <span style={{ fontWeight: 'normal', color: 'rgba(0,0,0,0.5)' }}>({item.reviewsCount})</span>
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
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