import { MapPin, SlidersHorizontal } from 'lucide-react';
import '../styling/CityFilterDrawer.css';

interface CityFilterDrawerProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

const BOTSWANA_HUBS = ['All', 'Palapye', 'Gaborone', 'Maun', 'Francistown', 'Kasane'];

export default function CityFilterDrawer({ selectedCity, onSelectCity }: CityFilterDrawerProps) {
  return (
    <div className="filter-drawer-container">
      <div className="filter-header">
        <h3 className="filter-title">
          <SlidersHorizontal style={{ width: '1rem', height: '1rem', color: '#000000' }} />
          Filter Stays by Botswana Hub
        </h3>
        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          Explore localized guesthouse availability
        </span>
      </div>

      <div className="city-chips-wrapper">
        {BOTSWANA_HUBS.map(hub => {
          const isActive = selectedCity === hub;
          return (
            <button
              key={hub}
              onClick={() => onSelectCity(hub)}
              className={`city-chip ${isActive ? 'active' : ''}`}
            >
              <MapPin style={{ width: '0.75rem', height: '0.75rem', display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
              {hub}
            </button>
          );
        })}
      </div>
    </div>
  );
}