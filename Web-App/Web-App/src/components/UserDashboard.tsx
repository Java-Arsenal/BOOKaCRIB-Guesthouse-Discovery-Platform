import { useState } from 'react';
import { Search, Star, MapPin, Heart, Sparkles, Building, CheckCircle2 } from 'lucide-react';
import GuesthouseDetailModal from './GuesthouseDetailModal';
import CityFilterDrawer from './CityFilterDrawer';
import '../styling/UserDashboard.css';

interface Guesthouse {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  amenities: string[];
}

const INITIAL_GUESTHOUSES: Guesthouse[] = [
  {
    id: 1,
    name: 'Kopano Hill Retreat',
    location: 'Palapye',
    price: 380,
    rating: 4.9,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    badge: 'Premier Rated',
    amenities: ['Free WiFi', 'Pool', 'Breakfast Included', 'Secure Parking']
  },
  {
    id: 2,
    name: 'Tshwene Acacia Lodge',
    location: 'Gaborone',
    price: 450,
    rating: 4.8,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
    amenities: ['Air Conditioning', 'WiFi', 'Pool', 'En-suite Bar']
  },
  {
    id: 3,
    name: 'Kgale View Haven',
    location: 'Gaborone',
    price: 320,
    rating: 4.6,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    badge: 'Budget Friendly',
    amenities: ['WiFi', 'Kitchenette', 'Free Parking']
  },
  {
    id: 4,
    name: 'Okavango Delta Oasis',
    location: 'Maun',
    price: 650,
    rating: 4.95,
    reviewsCount: 54,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    badge: 'Scenic View',
    amenities: ['River Safari', 'Full Board', 'WiFi', 'Pool']
  },
  {
    id: 5,
    name: 'The Grand Francistown Stay',
    location: 'Francistown',
    price: 410,
    rating: 4.7,
    reviewsCount: 27,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    badge: 'Business Choice',
    amenities: ['Workspace', 'High-speed WiFi', 'Conference Room']
  }
];

export default function UserDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [aiActiveFilter, setAiActiveFilter] = useState<{ city?: string; maxPrice?: number } | null>(null);
  const [selectedGuesthouse, setSelectedGuesthouse] = useState<Guesthouse | null>(null);
  const [selectedCity, setSelectedCity] = useState('All');

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = aiPrompt.toLowerCase();
    
    let city = '';
    if (query.includes('gaborone')) city = 'gaborone';
    else if (query.includes('palapye')) city = 'palapye';
    else if (query.includes('maun')) city = 'maun';
    else if (query.includes('francistown')) city = 'francistown';

    let maxPrice = undefined;
    const priceMatch = query.match(/(?:under|below|less than)\s*(?:p)?(\d+)/);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    setAiActiveFilter({ city: city || undefined, maxPrice });
  };

  const clearAiFilter = () => {
    setAiActiveFilter(null);
    setAiPrompt('');
  };

  const filteredGuesthouses = INITIAL_GUESTHOUSES.filter(house => {
    if (activeTab === 'favorites' && !favorites.includes(house.id)) {
      return false;
    }

    if (selectedCity !== 'All' && house.location.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }

    if (aiActiveFilter) {
      if (aiActiveFilter.city && house.location.toLowerCase() !== aiActiveFilter.city) {
        return false;
      }
      if (aiActiveFilter.maxPrice && house.price > aiActiveFilter.maxPrice) {
        return false;
      }
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesName = house.name.toLowerCase().includes(q);
      const matchesLocation = house.location.toLowerCase().includes(q);
      const matchesAmenity = house.amenities.some(a => a.toLowerCase().includes(q));
      return matchesName || matchesLocation || matchesAmenity;
    }

    return true;
  });

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="brand-section">
          <Building style={{ width: '1.75rem', height: '1.75rem', color: '#000000' }} />
          <div>
            <h1 className="brand-title">BOOKaCRIB</h1>
            <p className="brand-subtitle">Botswana Guesthouse Discovery Platform</p>
          </div>
        </div>

        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search guesthouses, amenities, or towns (e.g. Palapye, Pool)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="nav-actions">
          <button
            onClick={() => setActiveTab('all')}
            className={`tab-btn ${activeTab === 'all' ? 'active-all' : 'inactive'}`}
          >
            All Stays ({INITIAL_GUESTHOUSES.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`tab-btn ${activeTab === 'favorites' ? 'active-fav' : 'inactive'}`}
          >
            <Heart style={{ width: '0.875rem', height: '0.875rem' }} className={activeTab === 'favorites' ? 'fill-white' : ''} />
            Favorites ({favorites.length})
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="ai-banner">
          <div style={{ position: 'absolute', right: 0, bottom: 0, transform: 'translate(2.5rem, 2.5rem)', opacity: 0.1, pointerEvents: 'none' }}>
            <Sparkles style={{ width: '16rem', height: '16rem' }} />
          </div>
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '42rem' }}>
            <div className="ai-badge">
              <Sparkles style={{ width: '0.875rem', height: '0.875rem' }} /> AI Discovery Assistant
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.025em', margin: 0 }}>
              Discover your ideal stay across Botswana
            </h2>
            <p style={{ color: '#d1d5db', fontSize: '0.75rem', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
              Ask our AI helper in plain English. Try: <span style={{ fontStyle: 'italic', color: '#ffffff' }}>"Find me a guesthouse in Gaborone for under 500 pula"</span>
            </p>

            <form onSubmit={handleAiSearch} className="ai-form">
              <input
                type="text"
                placeholder="Ask AI (e.g., guesthouse in Gaborone under 500pula)..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="ai-input"
              />
              <button type="submit" className="ai-submit-btn">
                <Sparkles style={{ width: '1rem', height: '1rem', color: '#f59e0b' }} /> Ask AI
              </button>
            </form>

            {aiActiveFilter && (
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#6ee7b7', backgroundColor: 'rgba(5, 46, 22, 0.5)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', width: 'fit-content' }}>
                <CheckCircle2 style={{ width: '1rem', height: '1rem' }} />
                <span>
                  Showing results {aiActiveFilter.city ? `in ${aiActiveFilter.city.toUpperCase()}` : ''} {aiActiveFilter.maxPrice ? `under P${aiActiveFilter.maxPrice}` : ''}
                </span>
                <button onClick={clearAiFilter} style={{ marginLeft: '0.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}>Clear filter</button>
              </div>
            )}
          </div>
        </section>

        {/* City Filter Hub Drawer */}
        <CityFilterDrawer selectedCity={selectedCity} onSelectCity={setSelectedCity} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              {activeTab === 'favorites' ? 'Your Saved Favorites' : 'Featured Guesthouses in Botswana'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.125rem 0 0 0' }}>
              Real-time reviews, verified ratings, nightly pricing, and pristine local hospitality.
            </p>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', padding: '0.375rem 0.75rem', borderRadius: '0.5rem' }}>
            Showing {filteredGuesthouses.length} properties
          </div>
        </div>

        {filteredGuesthouses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px dashed #d1d5db' }}>
            <Building style={{ width: '3rem', height: '3rem', color: '#d1d5db', margin: '0 auto 0.75rem auto', display: 'block' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>No guesthouses found</h4>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 1rem 0' }}>Try relaxing your search criteria or clearing active filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); clearAiFilter(); setActiveTab('all'); setSelectedCity('All'); }}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#000000', color: '#ffffff', fontSize: '0.75rem', fontWeight: 600, borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="guesthouse-grid">
            {filteredGuesthouses.map((house) => {
              const isFav = favorites.includes(house.id);
              return (
                <div key={house.id} className="guesthouse-card">
                  <div>
                    <div className="card-img-container">
                      <img src={house.image} alt={house.name} className="card-img" />
                      {house.badge && <span className="card-badge">{house.badge}</span>}
                      <button
                        onClick={() => toggleFavorite(house.id)}
                        className={`fav-btn ${isFav ? 'active' : 'inactive'}`}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart style={{ width: '1rem', height: '1rem' }} className={isFav ? 'fill-white' : ''} />
                      </button>
                    </div>

                    <div className="card-body">
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{house.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.125rem 0.375rem', borderRadius: '0.375rem', border: '1px solid #fde68a', flexShrink: 0 }}>
                          <Star style={{ width: '0.75rem', height: '0.75rem', fill: '#f59e0b', color: '#f59e0b' }} />
                          <span>{house.rating}</span>
                          <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>({house.reviewsCount})</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        <MapPin style={{ width: '0.875rem', height: '0.875rem', color: '#9ca3af' }} />
                        <span>{house.location}, Botswana</span>
                      </div>

                      <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {house.amenities.map((amenity, idx) => (
                          <span key={idx} className="amenity-tag">{amenity}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div>
                      <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#000000' }}>P{house.price}</span>
                      <span style={{ fontSize: '0.6875rem', color: '#6b7280', fontWeight: 500 }}> / night avg</span>
                    </div>
                    <button onClick={() => setSelectedGuesthouse(house)} className="explore-btn">View Details</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedGuesthouse && (
        <GuesthouseDetailModal 
          guesthouse={selectedGuesthouse} 
          onClose={() => setSelectedGuesthouse(null)} 
        />
      )}
    </div>
  );
}