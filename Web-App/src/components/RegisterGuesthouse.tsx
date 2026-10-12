import { useState } from 'react';
import { Building2, CheckCircle2, Image, MapPin, Tag } from 'lucide-react';
import '../styling/RegisterGuesthouse.css';

export default function RegisterGuesthouse() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: 'Palapye',
    price: '',
    image: '',
    badge: 'Standard',
    amenities: [] as string[]
  });

  const availableAmenities = ['Free WiFi', 'Pool', 'Breakfast Included', 'Secure Parking', 'Air Conditioning', 'Kitchenette', 'Workspace'];

  const handleCheckboxChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev, amenities => [...prev.amenities, amenity]] as any
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-header">
          <Building2 style={{ width: '2.5rem', height: '2.5rem', color: '#000000', margin: '0 auto 0.5rem auto', display: 'block' }} />
          <h2 className="register-title">Register Your Guesthouse</h2>
          <p className="register-subtitle">Add your Botswana property to the BOOKaCRIB discovery platform</p>
        </div>

        {submitted ? (
          <div className="success-banner">
            <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem', display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
            <b>Property Registered Successfully!</b> Your guesthouse has been added to the discovery queue.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label className="form-label">Guesthouse Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Kopano Hill Retreat"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location in Botswana</label>
                <select
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="form-select"
                >
                  <option value="Palapye">Palapye</option>
                  <option value="Gaborone">Gaborone</option>
                  <option value="Maun">Maun</option>
                  <option value="Francistown">Francistown</option>
                  <option value="Kasane">Kasane</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nightly Rate (Pula - BWP)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g., 380"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">High-Resolution Photo URL</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Property Badge / Category</label>
              <select
                value={formData.badge}
                onChange={e => setFormData({ ...formData, badge: e.target.value })}
                className="form-select"
              >
                <option value="Premier Rated">Premier Rated</option>
                <option value="Popular">Popular</option>
                <option value="Budget Friendly">Budget Friendly</option>
                <option value="Scenic View">Scenic View</option>
                <option value="Business Choice">Business Choice</option>
              </select>
            </div>

            <div className="amenities-section">
              <label className="form-label">Select Offered Amenities</label>
              <div className="amenities-grid">
                {availableAmenities.map(amenity => (
                  <label key={amenity} className="amenity-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleCheckboxChange(amenity)}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Submit Guesthouse for Discovery
            </button>
          </form>
        )}
      </div>
    </div>
  );
}