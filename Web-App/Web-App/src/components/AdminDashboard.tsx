import { useState } from 'react';
import { LayoutDashboard, Building2, PlusCircle, Users, Search, Download, Plus, Building, MapPin, Star, ChevronRight, TrendingUp, SlidersHorizontal } from 'lucide-react';
import RegisterGuesthouse from './RegisterGuesthouse';
import GuesthouseListing from './GuesthouseListing';
import '../styling/AdminDashboard.css';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'register' | 'listings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="admin-layout">
      {/* 1. SIDEBAR */}
      <aside className="admin-sidebar">
        <div>
          {/* Logo / Portal Title */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 className="sidebar-brand-title">BOOKaCRIB</h1>
            <p className="sidebar-brand-subtitle">Management Portal</p>
          </div>

          {/* Navigation Links */}
          <div className="nav-section-title">Admin Hub</div>
          <nav className="admin-nav">
            <button
              onClick={() => setActiveView('overview')}
              className={`nav-link ${activeView === 'overview' ? 'active' : ''}`}
              style={{ width: '100%', background: activeView === 'overview' ? undefined : 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <LayoutDashboard style={{ width: '1rem', height: '1rem', flexShrink: 0 }} /> Dashboard
            </button>
            <button
              onClick={() => setActiveView('listings')}
              className={`nav-link ${activeView === 'listings' ? 'active' : ''}`}
              style={{ width: '100%', background: activeView === 'listings' ? undefined : 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <Building2 style={{ width: '1rem', height: '1rem', flexShrink: 0 }} /> Guesthouse Listings
            </button>
            <button
              onClick={() => setActiveView('register')}
              className={`nav-link ${activeView === 'register' ? 'active' : ''}`}
              style={{ width: '100%', background: activeView === 'register' ? undefined : 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <PlusCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} /> Register Guesthouse
            </button>
            <a href="#admin" className="nav-link">
              <Users style={{ width: '1rem', height: '1rem', flexShrink: 0 }} /> Admin Management
            </a>
          </nav>
        </div>

        {/* User Footer Info */}
        <div className="sidebar-footer">
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#000000', margin: 0 }}>Kagiso Sechaba</p>
          <p style={{ fontSize: '0.6875rem', color: 'rgba(0,0,0,0.5)', margin: 0 }}>Management Portal</p>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="admin-main">
        {/* Top Header Bar */}
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

        {/* Dynamic View Rendering based on sidebar selection */}
        {activeView === 'register' ? (
          <div style={{ padding: '1rem' }}>
            <RegisterGuesthouse />
          </div>
        ) : activeView === 'listings' ? (
          <div style={{ padding: '1rem' }}>
            <GuesthouseListing />
          </div>
        ) : (
          <div className="admin-workspace">
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', letterSpacing: '-0.025em', margin: 0 }}>
                Admin Executive Dashboard
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.6)', marginTop: '0.25rem', margin: 0 }}>
                Real-time inventory metrics, geographic footprint, and guest engagement across Botswana
              </p>
            </div>

            {/* Metric Cards Section */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="metric-title">Total Listings</span>
                  <Building style={{ width: '1rem', height: '1rem', color: 'rgba(0,0,0,0.4)' }} />
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="metric-title">Dominant Hub</span>
                  <MapPin style={{ width: '1rem', height: '1rem', color: 'rgba(0,0,0,0.4)' }} />
                </div>
                <div className="metric-value">Palapye</div>
                <div className="metric-footer">
                  <span>22 Guesthouses</span>
                  <span>45.8% of platform</span>
                </div>
              </div>

              <div className="metric-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="metric-title">Premier Rated</span>
                  <Star style={{ width: '1rem', height: '1rem', color: 'rgba(0,0,0,0.4)' }} />
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#000000', marginTop: '0.5rem' }}>Kopano Hill Retreat</div>
                <div className="metric-footer">
                  <span style={{ fontWeight: 600, color: '#000000' }}>★ 4.99</span>
                  <span>(31 reviews)</span>
                  <span style={{ marginLeft: 'auto', color: 'rgba(0,0,0,0.4)' }}>Palapye</span>
                </div>
              </div>
            </div>

            {/* Lower Split Sections */}
            <div className="split-sections">
              <div className="admin-card">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#000000', margin: 0 }}>City Distribution</h3>
                    <SlidersHorizontal style={{ width: '1rem', height: '1rem', color: 'rgba(0,0,0,0.4)' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', margin: 0 }}>Active units and baseline pricing across districts</p>
                  
                  <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', backgroundColor: '#000000' }}></span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#000000' }}>Palapye</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.6)', fontWeight: 500 }}>
                      Avg. P325/night • <span style={{ fontWeight: 'bold', color: '#000000' }}>22 Stays</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#000000', margin: 0 }}>Recently Onboarded Stays</h3>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', margin: 0 }}>Platform registration queue and verified properties</p>
                  </div>
                  <button onClick={() => setActiveView('listings')} style={{ fontSize: '0.75rem', fontWeight: 600, color: '#000000', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    View all 48 <ChevronRight style={{ width: '0.75rem', height: '0.75rem' }} />
                  </button>
                </div>

                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ paddingBottom: '0.5rem' }}>Guesthouse</th>
                        <th style={{ paddingBottom: '0.5rem' }}>Location</th>
                        <th style={{ paddingBottom: '0.5rem' }}>Nightly Rate</th>
                        <th style={{ paddingBottom: '0.5rem', textAlign: 'right' }}>Quality Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '0.75rem 0' }}>
                          <div style={{ fontWeight: 'bold', color: '#000000' }}>Kopano Hill Retreat</div>
                          <div style={{ fontSize: '0.625rem', color: 'rgba(0,0,0,0.5)' }}>Near Lotsane River</div>
                        </td>
                        <td style={{ padding: '0.75rem 0', color: 'rgba(0,0,0,0.7)' }}>Palapye</td>
                        <td style={{ padding: '0.75rem 0', fontWeight: 'bold', color: '#000000' }}>P380 / night</td>
                        <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 'bold', color: '#000000' }}>★ 4.9</td>
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