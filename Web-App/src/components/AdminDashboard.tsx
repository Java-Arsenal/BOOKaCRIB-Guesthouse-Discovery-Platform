import { useState, useEffect } from 'react';
import { LayoutDashboard, Building2, PlusCircle, Users, Search, Download, Plus, Building, MapPin, Star, ChevronRight, TrendingUp, SlidersHorizontal, MessageSquare, Trash2, Smartphone } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { db } from '../firebase';
import RegisterGuesthouse from './RegisterGuesthouse';
import GuesthouseListing from './GuesthouseListing';
import AdminManagement from './AdminManagement';
import UserManagement from './UserManagement';
import '../styling/AdminDashboard.css';

interface Guesthouse {
  id: string;
  name: string;
  location?: string;
  price_per_night_bwp?: number;
  price?: number;
  badge?: string;
  rating?: number;
  reviewsCount?: number;
  createdAt?: any;
}

interface Review {
  id: string;
  guesthouseId: string;
  guesthouseName: string;
  customerName: string;
  rating?: number;
  comment: string;
  date: string;
}

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'register' | 'listings' | 'management' | 'users'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All');
  const [sortByPrice, setSortByPrice] = useState<'default' | 'asc' | 'desc'>('default');
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);

  const [guesthouses, setGuesthouses] = useState<Guesthouse[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Guesthouses
      const querySnapshot = await getDocs(collection(db, 'guesthouses'));
      const normalizedData: Guesthouse[] = querySnapshot.docs.map(document => {
        const item = document.data() as any;
        const cityString = (typeof item.city === 'string' && item.city) || (typeof item.location === 'string' && item.location) || 'Palapye';
        return {
          id: document.id,
          name: item.name || 'Unnamed Property',
          location: cityString,
          price: Number(item.price_per_night_bwp ?? item.price ?? 0),
          badge: item.badge || 'Premier Rated',
          rating: Math.round(Number(item.average_rating ?? item.rating ?? 0) * 10) / 10,
          reviewsCount: Number(item.rating_count ?? 0),
          createdAt: item.created_at ?? item.createdAt,
        };
      });
      setGuesthouses(normalizedData);

      // 2. Fetch Real Reviews
      const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
      const realReviews: Review[] = ratingsSnapshot.docs.map(doc => {
        const rev = doc.data();
        const gh = normalizedData.find(g => g.id === rev.guesthouse_id);
        
        // Safely parse Firestore dates
        let dateStr = "Recently";
        if (rev.created_at) {
           if (typeof rev.created_at.toDate === 'function') {
             dateStr = rev.created_at.toDate().toLocaleDateString();
           } else if (rev.created_at._seconds) {
             dateStr = new Date(rev.created_at._seconds * 1000).toLocaleDateString();
           }
        }

        return {
          id: doc.id,
          guesthouseId: rev.guesthouse_id,
          guesthouseName: gh ? gh.name : 'Deleted Property', // Better fallback
          customerName: "Verified Guest",
          rating: Number(rev.score ?? 0),
          comment: rev.comment || "Great stay!",
          date: dateStr
        };
      });
      setReviews(realReviews);

    } catch (err) {
      console.error("Error fetching dashboard data: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeView]);

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleDeleteReview = async (reviewId: string, guesthouseId: string, score: number) => {
    if (!window.confirm("Delete this review permanently?")) return;
    try {
      // 1. Delete the rating document
      await deleteDoc(doc(db, 'ratings', reviewId));
      
      // 2. Update the Guesthouse aggregate scores (if the guesthouse still exists)
      const ghRef = doc(db, 'guesthouses', guesthouseId);
      const ghSnap = await getDoc(ghRef);
      if (ghSnap.exists()) {
        const data = ghSnap.data();
        const newSum = (data.rating_sum || 0) - score;
        const newCount = Math.max(0, (data.rating_count || 0) - 1);
        await updateDoc(ghRef, {
          rating_sum: newSum,
          rating_count: newCount,
          average_rating: newCount === 0 ? 0 : Math.round((newSum / newCount) * 10) / 10
        });
      }
      
      // 3. Refresh the UI
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to delete review: ", err);
      alert("Failed to delete review.");
    }
  };

  const totalListings = guesthouses.length;
  const availableCities = ['All', ...Array.from(new Set(guesthouses.map(g => g.location || 'Palapye')))];
  const locationCounts = guesthouses.reduce((acc: { [key: string]: number }, curr) => {
    const loc = curr.location || 'Palapye';
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});
  
  const dominantHub = Object.keys(locationCounts).reduce((a, b) => locationCounts[a] > locationCounts[b] ? a : b, 'None');
  const dominantHubCount = dominantHub !== 'None' ? locationCounts[dominantHub] : 0;
  const dominantHubPercentage = totalListings > 0 ? ((dominantHubCount / totalListings) * 100).toFixed(1) : '0';
  
  const premierStay = guesthouses.length > 0 ? [...guesthouses].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0] : null;
  
  // Calculate stats for ALL cities for the distribution card
  const cityStats = Object.keys(locationCounts).map(city => {
    const cityStays = guesthouses.filter(g => (g.location || 'Palapye') === city);
    const avgPrice = cityStays.reduce((sum, g) => sum + (g.price ?? 0), 0) / cityStays.length;
    return { name: city, count: locationCounts[city], avgPrice: Math.round(avgPrice) };
  }).sort((a, b) => b.count - a.count); // Sort by most guesthouses

  const allPrices = guesthouses.map(g => g.price ?? 0);
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;
  const avgPrice = allPrices.length > 0 ? Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length) : 0;

  const handleExportCSV = () => {
    if (guesthouses.length === 0) {
      alert("No guesthouse data available to export.");
      return;
    }
    const headers = ["ID", "Name", "Location", "Price (BWP)", "Badge", "Rating", "Reviews Count"];
    const rows = guesthouses.map(g => [g.id, `"${g.name.replace(/"/g, '""')}"`, `"${g.location || 'Palapye'}"`, g.price ?? 0, `"${g.badge || ''}"`, g.rating ?? 0, g.reviewsCount ?? 0]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookacrib_inventory_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredGuesthouses = guesthouses.filter(g => {
    const loc = (g.location || 'Palapye').trim().toLowerCase();
    const currentFilter = selectedCityFilter.trim().toLowerCase();
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || loc.includes(searchQuery.toLowerCase());
    const matchesCity = selectedCityFilter === 'All' || loc === currentFilter;
    const matchesRating = (g.rating ?? 0) >= minRatingFilter;
    return matchesSearch && matchesCity && matchesRating;
  }).sort((a, b) => {
    if (sortByPrice === 'asc') return (a.price ?? 0) - (b.price ?? 0);
    if (sortByPrice === 'desc') return (b.price ?? 0) - (a.price ?? 0);
    return 0;
  });

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div>
          <div className="sidebar-brand-container">
            <h1 className="sidebar-brand-title">BOOKaCRIB</h1>
            <p className="sidebar-brand-subtitle">Management Portal</p>
          </div>
          <div className="nav-section-title">Admin Hub</div>
          <nav className="admin-nav">
            <button onClick={() => setActiveView('overview')} className={`nav-link ${activeView === 'overview' ? 'active' : ''}`}><LayoutDashboard className="nav-icon" /> Dashboard</button>
            <button onClick={() => setActiveView('listings')} className={`nav-link ${activeView === 'listings' ? 'active' : ''}`}><Building2 className="nav-icon" /> Guesthouse Listings</button>
            <button onClick={() => setActiveView('register')} className={`nav-link ${activeView === 'register' ? 'active' : ''}`}><PlusCircle className="nav-icon" /> Register Guesthouse</button>
            <button onClick={() => setActiveView('management')} className={`nav-link ${activeView === 'management' ? 'active' : ''}`}><Users className="nav-icon" /> Admin Management</button>
            <button onClick={() => setActiveView('users')} className={`nav-link ${activeView === 'users' ? 'active' : ''}`}><Smartphone className="nav-icon" /> Mobile Users</button>
          </nav>
        </div>
        <div className="sidebar-footer">
          <p className="sidebar-footer-name">
            {getAuth().currentUser?.email || 'admin@bookacrib.bw'}
          </p>
          <p className="sidebar-footer-role">Management Portal</p>
          <button onClick={handleSignOut} className="sidebar-signout-btn">Sign Out</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-search-box">
            <Search className="admin-search-icon" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="admin-search-input" />
          </div>
          <div className="admin-header-actions">
            <button className="btn-secondary" onClick={handleExportCSV}><Download className="btn-icon" /> Export Report CSV</button>
            <button onClick={() => setActiveView('register')} className="btn-primary"><Plus className="btn-icon" /> Register New Guesthouse</button>
          </div>
        </header>

        {activeView === 'register' ? (
          <div className="view-wrapper-padded"><RegisterGuesthouse /></div>
        ) : activeView === 'listings' ? (
          <div className="view-wrapper-padded"><GuesthouseListing /></div>
        ) : activeView === 'management' ? (
          <div className="view-wrapper-padded"><AdminManagement /></div>
        ) : activeView === 'users' ? (
          <div className="view-wrapper-padded"><UserManagement /></div>
        ) : (
          <div className="admin-workspace">
            <div className="dashboard-title-container">
              <h2 className="dashboard-main-title">Admin Executive Dashboard</h2>
              <p className="dashboard-main-subtitle">Real-time inventory metrics, geographic footprint, and guest engagement across Botswana</p>
            </div>

            <div className="city-pills-container">
              {availableCities.map(city => {
                const cityCount = city === 'All' ? guesthouses.length : guesthouses.filter(g => (g.location || 'Palapye').trim().toLowerCase() === city.trim().toLowerCase()).length;
                return (
                  <button key={city} onClick={() => setSelectedCityFilter(city)} className={`city-pill-btn ${selectedCityFilter.trim().toLowerCase() === city.trim().toLowerCase() ? 'active' : ''}`}>
                    {city} {city !== 'All' && `(${cityCount})`}
                  </button>
                );
              })}
            </div>

            <div className="filters-container">
              <div className="filter-group">
                <label className="filter-label">Sort by Price:</label>
                <select value={sortByPrice} onChange={(e) => setSortByPrice(e.target.value as any)} className="filter-select">
                  <option value="default">Default Order</option>
                  <option value="asc">Price: Low to High (Cheapest first)</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Min Rating:</label>
                <select value={minRatingFilter} onChange={(e) => setMinRatingFilter(Number(e.target.value))} className="filter-select">
                  <option value="0">All Ratings</option>
                  <option value="3">★ 3.0 & above</option>
                  <option value="4">★ 4.0 & above</option>
                  <option value="4.5">★ 4.5 & above</option>
                </select>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card" onClick={() => setActiveView('listings')}>
                <div className="metric-card-top-flex"><span className="metric-title">Total Listings</span><Building className="metric-card-icon" /></div>
                <div className="metric-value">{loading ? '...' : totalListings}</div>
                <div className="metric-footer">
                  <span className="metric-trend-label"><TrendingUp className="trend-icon" /> Firebase Live</span>
                  <span>{totalListings === 0 ? 'No listings yet' : `${totalListings} active stays`}</span>
                </div>
              </div>
              <div className="metric-card" onClick={() => { if (dominantHub !== 'None') setSearchQuery(dominantHub); setActiveView('listings'); }}>
                <div className="metric-card-top-flex"><span className="metric-title">Dominant Hub</span><MapPin className="metric-card-icon" /></div>
                <div className={`metric-value ${dominantHub.length > 8 ? 'long-hub-title' : ''}`}>{loading ? '...' : dominantHub}</div>
                <div className="metric-footer"><span>{dominantHubCount} Guesthouses</span><span>{dominantHubPercentage}% of platform</span></div>
              </div>
              <div className="metric-card" onClick={() => { if (premierStay) setSearchQuery(premierStay.name); setActiveView('listings'); }}>
                <div className="metric-card-top-flex"><span className="metric-title">Premier Rated</span><Star className="metric-card-icon" /></div>
                <div className="premier-title">{loading ? '...' : (premierStay ? premierStay.name : 'No listings added')}</div>
                <div className="metric-footer">
                  <span className="premier-rating-label">{premierStay ? `★ ${(premierStay.rating ?? 5).toFixed(1)}` : '★ New'}</span>
                  <span className="premier-reviews-label">{premierStay ? `(${premierStay.reviewsCount} reviews)` : '(No reviews)'}</span>
                  <span className="premier-location-label">{premierStay ? (premierStay.location || 'Palapye') : '-'}</span>
                </div>
              </div>
              <div className="metric-card" onClick={() => setActiveView('listings')}>
                <div className="metric-card-top-flex"><span className="metric-title">Nightly Rate Analytics</span><Building className="metric-card-icon" /></div>
                <div className="metric-value analytics-value">{loading ? '...' : `P${avgPrice}`} <span className="analytics-avg-suffix">avg</span></div>
                <div className="metric-footer"><span>Min: P{minPrice}</span><span>Max: P{maxPrice}</span></div>
              </div>
            </div>

            <div className="split-sections">
              <div className="admin-card clickable-card">
                <div className="city-dist-header"><h3 className="city-dist-title">City Distribution</h3><SlidersHorizontal className="city-dist-icon" /></div>
                <p className="city-dist-subtitle">Active units and baseline pricing across districts</p>
                {totalListings === 0 ? (
                  <p className="empty-state-text">No regional data available yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {/* Map through all cities */}
                    {cityStats.map((city) => (
                      <div key={city.name} className="city-dist-row" onClick={() => setSelectedCityFilter(city.name)} style={{ cursor: 'pointer' }}>
                        <div className="city-row-left"><span className="city-dot"></span><span className="city-name-label">{city.name}</span></div>
                        <div className="city-stats-label">Avg. P{city.avgPrice}/night • <span className="city-stats-bold">{city.count} Stays</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-card">
                <div className="onboard-header-flex">
                  <div>
                    <h3 className="onboard-title">Live Customer Reviews</h3>
                    <p className="onboard-subtitle">Real-time feedback submitted from mobile app</p>
                  </div>
                  <MessageSquare className="reviews-card-icon" />
                </div>
                <div className="reviews-feed-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {reviews.length === 0 ? (
                    <p className="empty-reviews-text">No customer reviews submitted from the mobile app yet.</p>
                  ) : (
                    reviews.map(rev => (
                      <div key={rev.id} className="review-bubble" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div className="review-bubble-header" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600 }}>{rev.guesthouseName}</span>
                            <span className="review-stars">★ {(rev.rating ?? 0).toFixed(1)}</span>
                          </div>
                          <p className="review-comment-text">"{rev.comment}"</p>
                          <div className="review-meta-text">By {rev.customerName} • {rev.date}</div>
                        </div>
                        <button 
                          onClick={() => handleDeleteReview(rev.id, rev.guesthouseId, rev.rating || 0)}
                          style={{ background: 'none', border: 'none', color: '#E63946', cursor: 'pointer', padding: '4px' }}
                          title="Delete Review"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="admin-card table-section-card">
              <div className="onboard-header-flex">
                <div>
                  <h3 className="onboard-title">Registered Guesthouses Inventory</h3>
                  <p className="onboard-subtitle">Showing results for filter: <strong>{selectedCityFilter}</strong></p>
                </div>
                <button onClick={() => setActiveView('listings')} className="view-all-btn">View full management <ChevronRight className="chevron-icon" /></button>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr><th>Guesthouse</th><th>Location</th><th>Nightly Rate</th><th className="th-right">Quality Score</th></tr>
                  </thead>
                  <tbody>
                    {filteredGuesthouses.length === 0 ? (
                      <tr><td colSpan={4} className="table-empty-cell">No guesthouses match your search or filter.</td></tr>
                    ) : (
                      filteredGuesthouses.map((guesthouse) => (
                        <tr key={guesthouse.id} onClick={() => { setSearchQuery(guesthouse.name); setActiveView('listings'); }} className="table-row-clickable">
                          <td>
                            <div className="table-guesthouse-name">{guesthouse.name}</div>
                            <div className="table-guesthouse-badge">{guesthouse.badge}</div>
                          </td>
                          <td className="table-location-text">{guesthouse.location || 'Palapye'}</td>
                          <td className="table-price-text">P{guesthouse.price} / night</td>
                          <td className="table-score-cell">★ {(guesthouse.rating ?? 5).toFixed(1)} ({guesthouse.reviewsCount})</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}