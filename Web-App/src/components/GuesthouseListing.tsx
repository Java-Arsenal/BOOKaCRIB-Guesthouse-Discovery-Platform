import { useState, useEffect } from 'react';
import { Building2, Search, Trash2, Star, MapPin, ImageOff } from 'lucide-react';
import { getGuesthouses, deleteGuesthouse } from '../services/api';
import '../styling/GuesthouseListing.css';

interface Guesthouse {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  logoUrl?: string;
}

export default function GuesthouseListing() {
  const [listings, setListings] = useState<Guesthouse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const items = await getGuesthouses();
        setListings(
          items.map((item: any) => ({
            id: item.id || item.guesthouse_id,
            name: item.name || 'Unnamed Property',
            location:
              (typeof item.location === 'string' && item.location) ||
              item.city ||
              'Palapye',
            price: Number(item.price ?? item.price_per_night_bwp ?? 0),
            rating: Number(item.average_rating ?? item.rating ?? 0),
            reviewsCount: Number(item.reviewsCount ?? item.rating_count ?? 0),
            badge: item.badge,
            logoUrl: item.logo_url,
          })),
        );
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
      await deleteGuesthouse(id);
      setListings(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting guesthouse: ", error);
      alert('Failed to delete guesthouse. Make sure you are signed in as an admin.');
    }
  };

  const availableLocations = ['All', ...Array.from(new Set(
    listings.map(item => item.location).filter(Boolean)
  )).sort()];

  const filteredListings = listings.filter(item => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (item.name || '').toLowerCase().includes(search) ||
      (item.location || '').toLowerCase().includes(search);
    const matchesLocation =
      selectedLocation === 'All' || item.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return (
      <div className="listings-wrapper">
        <p style={{ textAlign: 'center', padding: '3rem 0', color: 'rgba(0,0,0,0.6)' }}>
          Loading live database inventory...
        </p>
      </div>
    );
  }

  return (
    <div className="listings-wrapper">
      <div className="listings-header">
        <div>
          <h2 className="listings-title">Guesthouse Inventory Management</h2>
          <p className="listings-subtitle">
            Review, manage, and filter registered stays across Botswana (Live Backend)
          </p>
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
            {availableLocations.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="listings-table-container">
        <table className="listings-table">
          <thead>
            <tr>
              <th>Photo</th>
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
                <td colSpan={7} className="listings-empty-cell">
                  <Building2 className="listings-empty-icon" />
                  No guesthouse listings found in database matching your filter.
                </td>
              </tr>
            ) : (
              filteredListings.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={item.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '0.375rem' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '0.375rem',
                          backgroundColor: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ImageOff style={{ width: '1rem', height: '1rem', color: '#94a3b8' }} />
                      </div>
                    )}
                  </td>
                  <td className="table-cell-bold">{item.name}</td>
                  <td>
                    <span className="location-cell-flex">
                      <MapPin className="location-cell-icon" />
                      {item.location || 'Palapye'}
                    </span>
                  </td>
                  <td>
                    {item.badge
                      ? <span className="badge-pill">{item.badge}</span>
                      : <span className="standard-badge-text">Standard</span>}
                  </td>
                  <td className="table-cell-bold">P{item.price} / night</td>
                  <td>
                    <span className="rating-cell-flex">
                      <Star className="rating-star-icon" />
                      {item.rating ?? 0}{' '}
                      <span className="rating-count-sub">({item.reviewsCount ?? 0})</span>
                    </span>
                  </td>
                  <td className="table-actions-cell">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="action-btn-danger"
                      title="Remove listing"
                    >
                      <Trash2
                        style={{
                          width: '0.75rem',
                          height: '0.75rem',
                          display: 'inline',
                          verticalAlign: 'middle',
                          marginRight: '2px',
                        }}
                      />{' '}
                      Remove
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