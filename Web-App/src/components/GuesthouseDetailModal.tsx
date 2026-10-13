import { X, Star, MapPin, CheckCircle2, User, Mail, Phone } from 'lucide-react';
import '../styling/GuesthouseDetailModal.css';

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

interface GuesthouseDetailModalProps {
  guesthouse: Guesthouse;
  onClose: () => void;
}

export default function GuesthouseDetailModal({ guesthouse, onClose }: GuesthouseDetailModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header-img-container">
          <img src={guesthouse.image} alt={guesthouse.name} className="modal-header-img" />
          <button onClick={onClose} className="modal-close-btn" title="Close details">
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
          {guesthouse.badge && (
            <span style={{ position: 'absolute', bottom: '1rem', left: '1rem', backgroundColor: 'rgba(255,255,255,0.9)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, color: '#000000' }}>
              {guesthouse.badge}
            </span>
          )}
        </div>

        <div className="modal-body">
          <div className="modal-title-row">
            <div>
              <h2 className="modal-title">{guesthouse.name}</h2>
              <div className="modal-location">
                <MapPin style={{ width: '1rem', height: '1rem', color: '#9ca3af' }} />
                <span>{guesthouse.location}, Botswana (Verified Local Stay)</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', border: '1px solid #fde68a' }}>
              <Star style={{ width: '1rem', height: '1rem', fill: '#f59e0b', color: '#f59e0b' }} />
              <span>{guesthouse.rating}</span>
              <span style={{ fontWeight: 'normal', color: '#6b7280' }}>({guesthouse.reviewsCount} reviews)</span>
            </div>
          </div>

          <div>
            <h3 className="modal-section-title">Property Highlights & Amenities</h3>
            <div className="modal-amenities-list">
              {guesthouse.amenities.map((amenity, idx) => (
                <span key={idx} className="modal-amenity-tag">
                  <CheckCircle2 style={{ width: '0.875rem', height: '0.875rem', display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: '#10b981' }} />
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="modal-section-title">Host & Contact Information</h3>
            <div className="host-contact-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', fontWeight: 600, color: '#1e293b' }}>
                <User style={{ width: '1rem', height: '1rem' }} /> Host Management Desk
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Mail style={{ width: '0.875rem', height: '0.875rem', color: '#64748b' }} /> stays@{guesthouse.name.toLowerCase().replace(/\s+/g, '')}.bw
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Phone style={{ width: '0.875rem', height: '0.875rem', color: '#64748b' }} /> +267 300 {Math.floor(1000 + Math.random() * 9000)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-price">
            P{guesthouse.price} <span>/ night avg</span>
          </div>
          <button onClick={onClose} style={{ padding: '0.625rem 1.25rem', backgroundColor: '#000000', color: '#ffffff', fontSize: '0.75rem', fontWeight: 600, borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}