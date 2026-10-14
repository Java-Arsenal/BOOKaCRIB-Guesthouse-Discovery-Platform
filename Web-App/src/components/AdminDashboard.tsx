import { useState } from 'react';
import { LayoutDashboard, Building2, PlusCircle, Users, Search, Download, Plus, Building, MapPin, Star, ChevronRight, TrendingUp, SlidersHorizontal } from 'lucide-react';
import RegisterGuesthouse from './RegisterGuesthouse';
import GuesthouseListing from './GuesthouseListing';
import AdminManagement from './AdminManagement';
import '../styling/AdminDashboard.css';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'register' | 'listings' | 'management'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="admin-layout">
      {/* 1. SIDEBAR */}
      <aside className="admin-sidebar">
        <div>
          <div className="sidebar-brand-container">
            <h1 className="sidebar-brand-title">BOOKaCRIB</h1>
            <p className="sidebar-brand-subtitle">Management Portal</p>
          </div>

          <div className="nav-section-title">Admin Hub</div>
          <nav className="admin-nav">
            <button
              onClick={() => setActiveView('overview')}
              className={`nav-link ${activeView === 'overview' ? 'active' : ''}`}
            >
              <LayoutDashboard style={{ width: '1rem', height: '1rem', flexShrink: 0 }} /> Dashboard
            </button>
            <button
              onClick={() => setActiveView('listings')}
              className={`nav-link ${activeView === 'listings' ? 'active' : ''}`}
            >
              <Building2 style={{ width: '1rem', height: '1rem', flexShrink: 0 }} /> Guesthouse Listings
            </button>
            <button
              onClick={() => setActiveView('register')}
              className={`nav-link ${activeView === 'register' ? 'active' : ''}`}
            >
              <PlusCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} /> Register Guesthouse
            </button>
            <button
              onClick={() => setActiveView('management')}
              className={`nav-link ${activeView === 'management' ? 'active' : ''}`}
            >
              <Users style={{ width: '1rem', height: '1rem', flexShrink: 0 }} /> Admin Management
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <p className="sidebar-footer-name">Winonah Monare</p>
          <p className="sidebar-footer-role">Management Portal</p>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-search-box">
            <Search className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search properties, hosts, reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
          </div>
          <div className="admin-header-actions">
            <button className="btn-secondary">
              <Download style={{ width: '0.875rem', height: '0.875rem' }} /> Export Report CSV
            </button>
            <button onClick={() => setActiveView('register')} className="btn-primary">
              <Plus style={{ width: '0.875rem', height: '0.875rem' }} /> Register New Guesthouse
            </button>
          </div>
        </header>

        {activeView === 'register' ? (
          <div className="view-wrapper-padded">
            <RegisterGuesthouse />
          </div>
        ) : activeView === 'listings' ? (
          <div className="view-wrapper-padded">
            <GuesthouseListing />
          </div>
        ) : activeView === 'management' ? (
          <div className="view-wrapper-padded">
            <AdminManagement />
          </div>
        ) : (
          <div className="admin-workspace">
            <div className="dashboard-title-container">
              <h2 className="dashboard-main-title">Admin Executive Dashboard</h2>
              <p className="dashboard-main-subtitle">
                Real-time inventory metrics, geographic footprint, and guest engagement across Botswana
              </p>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-card-top-flex">
                  <span className="metric-title">Total Listings</span>
                  <Building className="metric-card-icon" />
                </div>
                <div className="metric-value">48</div>
                <div className="metric-footer">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, color: '#000000' }}>
                    <TrendingUp style={{ width: '0.75rem', height: '0.75rem' }} /> +14% mo/mo
                  </span>
                  <span>+12 this month</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-card-top-flex">
                  <span className="metric-title">Dominant Hub</span>
                  <MapPin className="metric-card-icon" />
                </div>
                <div className="metric-value">Palapye</div>
                <div className="metric-footer">
                  <span>22 Guesthouses</span>
                  <span>45.8% of platform</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-card-top-flex">
                  <span className="metric-title">Premier Rated</span>
                  <Star className="metric-card-icon" />
                </div>
                <div className="premier-title">Kopano Hill Retreat</div>
                <div className="metric-footer">
                  <span style={{ fontWeight: 600, color: '#000000' }}>★ 4.99</span>
                  <span style={{ color: 'rgba(0,0,0,0.5)' }}>(31 reviews)</span>
                  <span style={{ marginLeft: 'auto', color: 'rgba(0,0,0,0.4)' }}>Palapye</span>
                </div>
              </div>
            </div>

            <div className="split-sections">
              <div className="admin-card">
                <div>
                  <div className="city-dist-header">
                    <h3 className="city-dist-title">City Distribution</h3>
                    <SlidersHorizontal className="city-dist-icon" />
                  </div>
                  <p className="city-dist-subtitle">Active units and baseline pricing across districts</p>
                  
                  <div className="city-dist-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="city-dot"></span>
                      <span className="city-name-label">Palapye</span>
                    </div>
                    <div className="city-stats-label">
                      Avg. P325/night • <span className="city-stats-bold">22 Stays</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="onboard-header-flex">
                  <div>
                    <h3 className="onboard-title">Recently Onboarded Stays</h3>
                    <p className="onboard-subtitle">Platform registration queue and verified properties</p>
                  </div>
                  <button onClick={() => setActiveView('listings')} className="view-all-btn">
                    View all 48 <ChevronRight style={{ width: '0.75rem', height: '0.75rem' }} />
                  </button>
                </div>

                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Guesthouse</th>
                        <th>Location</th>
                        <th>Nightly Rate</th>
                        <th style={{ textAlign: 'right' }}>Quality Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div style={{ fontWeight: 'bold', color: '#000000' }}>Kopano Hill Retreat</div>
                          <div style={{ fontSize: '0.625rem', color: 'rgba(0,0,0,0.5)' }}>Near Lotsane River</div>
                        </td>
                        <td style={{ color: 'rgba(0,0,0,0.7)' }}>Palapye</td>
                        <td style={{ fontWeight: 'bold', color: '#000000' }}>P380 / night</td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#000000' }}>★ 4.9</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}