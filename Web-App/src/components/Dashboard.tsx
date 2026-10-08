import { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Users,
  Search,
  Download,
  Plus,
  Building,
  MapPin,
  Star,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex min-h-screen bg-white text-black font-sans antialiased">
      {/* 1. SIDEBAR */}
      <aside className="w-64 border-r border-black/10 p-6 flex flex-col justify-between shrink-0 bg-white">
        <div>
          {/* Logo / Portal Title */}
          <div className="mb-8">
            <h1 className="text-xl font-extrabold tracking-tight text-black">BOOKaCRIB</h1>
            <p className="text-xs text-black/50 font-medium">Management Portal</p>
          </div>

          {/* Navigation Links */}
          <div className="mb-2 text-[11px] font-semibold tracking-wider text-black/40 uppercase">
            Admin Hub
          </div>
          <nav className="space-y-1">
            <a
              href="#dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg bg-black text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              Dashboard
            </a>
            <a
              href="#listings"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-black/70 hover:bg-black/5 hover:text-black transition-colors"
            >
              <Building2 className="w-4 h-4 shrink-0" />
              Guesthouse Listings
            </a>
            <a
              href="#register"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-black/70 hover:bg-black/5 hover:text-black transition-colors"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              Register Guesthouse
            </a>
            <a
              href="#admin"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-black/70 hover:bg-black/5 hover:text-black transition-colors"
            >
              <Users className="w-4 h-4 shrink-0" />
              Admin Management
            </a>
          </nav>
        </div>

        {/* User Footer Info */}
        <div className="pt-4 border-t border-black/10">
          <p className="text-xs font-semibold text-black">Kagiso Sechaba</p>
          <p className="text-[11px] text-black/50">Management Portal</p>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Header Bar */}
        <header className="h-16 px-8 border-b border-black/10 flex items-center justify-between gap-4 bg-white">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              type="text"
              placeholder="Search properties, hosts, bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-black/10 rounded-lg focus:outline-none focus:border-black bg-white text-black placeholder:text-black/40"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold border border-black/20 rounded-lg hover:bg-black/5 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export Report CSV
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-black text-white rounded-lg hover:bg-black/80 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Register New Guesthouse
            </button>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="p-8 space-y-8 overflow-y-auto">
          <div>
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Admin Executive Dashboard
            </h2>
            <p className="text-xs text-black/60 mt-1">
              Real-time inventory metrics, geographic footprint, and guest engagement across Botswana
            </p>
          </div>

          {/* Metric Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 border border-black/10 rounded-xl bg-white">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold tracking-wider text-black/50 uppercase">
                  Total Listings
                </span>
                <Building className="w-4 h-4 text-black/40" />
              </div>
              <div className="text-3xl font-extrabold text-black mt-2">48</div>
              <div className="flex items-center gap-3 mt-3 text-xs text-black/60 font-medium">
                <span className="flex items-center gap-1 font-semibold text-black">
                  <TrendingUp className="w-3 h-3" /> +14% mo/mo
                </span>
                <span>+12 this month</span>
              </div>
            </div>

            <div className="p-5 border border-black/10 rounded-xl bg-white">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold tracking-wider text-black/50 uppercase">
                  Dominant Hub
                </span>
                <MapPin className="w-4 h-4 text-black/40" />
              </div>
              <div className="text-3xl font-extrabold text-black mt-2">Palapye</div>
              <div className="flex items-center gap-3 mt-3 text-xs text-black/60 font-medium">
                <span>22 Guesthouses</span>
                <span>45.8% of platform</span>
              </div>
            </div>

            <div className="p-5 border border-black/10 rounded-xl bg-white">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold tracking-wider text-black/50 uppercase">
                  Premier Rated
                </span>
                <Star className="w-4 h-4 text-black/40" />
              </div>
              <div className="text-xl font-bold text-black mt-2">Kopano Hill Retreat</div>
              <div className="flex items-center gap-2 mt-3 text-xs text-black/60 font-medium">
                <span className="font-semibold text-black">★ 4.99</span>
                <span>(31 reviews)</span>
                <span className="ml-auto text-black/40">Palapye</span>
              </div>
            </div>
          </div>

          {/* Lower Split Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 border border-black/10 rounded-xl bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold text-black">City Distribution</h3>
                  <SlidersHorizontal className="w-4 h-4 text-black/40" />
                </div>
                <p className="text-xs text-black/50">
                  Active units and baseline pricing across districts
                </p>

                <div className="mt-6 p-4 border border-black/10 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-black"></span>
                    <span className="text-sm font-semibold text-black">Palapye</span>
                  </div>
                  <div className="text-xs text-black/60 font-medium">
                    Avg. P325/night • <span className="font-bold text-black">22 Stays</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border border-black/10 rounded-xl bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-black">Recently Onboarded Stays</h3>
                  <p className="text-xs text-black/50">
                    Platform registration queue and verified properties
                  </p>
                </div>
                <button className="text-xs font-semibold text-black hover:underline flex items-center gap-1">
                  View all 48 <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-black/10 text-black/40 uppercase tracking-wider font-bold">
                      <th className="py-2">Guesthouse</th>
                      <th className="py-2">Location</th>
                      <th className="py-2">Nightly Rate</th>
                      <th className="py-2 text-right">Quality Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    <tr>
                      <td className="py-3">
                        <div className="font-bold text-black">Kopano Hill Retreat</div>
                        <div className="text-[10px] text-black/50">Near Lotsane River</div>
                      </td>
                      <td className="py-3 text-black/70">Palapye</td>
                      <td className="py-3 font-bold text-black">P380 / night</td>
                      <td className="py-3 text-right font-bold text-black">★ 4.9</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}