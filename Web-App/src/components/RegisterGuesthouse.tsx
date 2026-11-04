import { useState } from 'react';
import { auth } from '../firebase';
import { createGuesthouse, uploadGuesthouseImage } from '../services/api';
import '../styling/RegisterGuesthouse.css';

export default function RegisterGuesthouse() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [city, setCity] = useState(''); // <-- Changed from 'Palapye' to empty
  const [country] = useState('Botswana');
  const [price, setPrice] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [badge, setBadge] = useState('Premier Rated');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGalleryChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setGalleryFiles(prev => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !price || !description || !latitude || !longitude || !city || !contactName || !contactPhone) {
      setErrorMessage('Please fill in all required fields, including city, coordinates, and contact details.');
      return;
    }

    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      setErrorMessage('You must be signed in as an admin to register a guesthouse.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Send the text data to the Backend API
      const result = await createGuesthouse({
        name,
        description,
        amenities: amenities.split(',').map(item => item.trim()).filter(Boolean),
        location: { latitude: Number(latitude), longitude: Number(longitude) },
        price_per_night_bwp: Number(price),
        city,
        country,
        contact_details: {
          contact_name: contactName,
          phone: contactPhone,
          ...(contactEmail ? { email: contactEmail } : {}),
        },
      }, token);

      const guesthouseId = result?.data?.guesthouse_id;

      // 2. Send the images to Cloudinary via the Backend API
      if (guesthouseId) {
        if (logoFile) {
          await uploadGuesthouseImage(guesthouseId, logoFile, 'logo', token);
        }
        for (const file of galleryFiles) {
          if (file) await uploadGuesthouseImage(guesthouseId, file, 'gallery', token);
        }
      }

      setSuccessMessage(true);
      setName('');
      setDescription('');
      setAmenities('');
      setLatitude('');
      setLongitude('');
      setCity('');
      setPrice('');
      setContactName('');
      setContactPhone('');
      setContactEmail('');
      setLogoFile(null);
      setGalleryFiles([null, null, null, null]);
      setTimeout(() => setSuccessMessage(false), 3000);
    } catch (err) {
      console.error('Error registering guesthouse: ', err);
      setErrorMessage('Failed to register guesthouse. Check the console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-header">
        <h2 className="register-title">Register New Guesthouse</h2>
        <p className="register-subtitle">Onboard a new Botswana property with full project rubric fields</p>
      </div>

      {successMessage && (
        <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '0.75rem', borderRadius: '0.5rem', fontWeight: 500 }}>
          Guesthouse successfully registered and saved to the backend!
        </div>
      )}

      {errorMessage && (
        <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.75rem', borderRadius: '0.5rem', fontWeight: 500 }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="register-form">
        {/* Name & Logo */}
        <div className="register-row-grid">
          <div className="register-field-group">
            <label className="register-label">Guesthouse Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="register-input"
              required
            />
          </div>
          <div className="register-field-group">
            <label className="register-label">Property Logo (Optional File)</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setLogoFile(e.target.files?.[0] ?? null)}
              className="register-input"
            />
          </div>
        </div>

        {/* Description */}
        <div className="register-field-group">
          <label className="register-label">Description *</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="register-input"
            rows={3}
            required
            style={{ resize: 'vertical', padding: '0.75rem' }}
          />
        </div>

        {/* City & Country */}
        <div className="register-row-grid">
          <div className="register-field-group">
            <label className="register-label">City / Hub *</label>
            {/* REPLACED DROPDOWN WITH TEXT INPUT */}
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="register-input"
              placeholder="e.g., Gaborone, Maun, Kang"
              required
            />
          </div>

          <div className="register-field-group">
            <label className="register-label">Country</label>
            <input
              type="text"
              value={country}
              disabled
              className="register-input"
              style={{ backgroundColor: '#f8fafc', color: '#64748b' }}
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="register-row-grid">
          <div className="register-field-group">
            <label className="register-label">Latitude *</label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
              className="register-input"
              required
            />
          </div>

          <div className="register-field-group">
            <label className="register-label">Longitude *</label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
              className="register-input"
              required
            />
          </div>
        </div>

        <div className="register-row-grid">
          <div className="register-field-group">
            <label className="register-label">Nightly Rate (Pula - BWP) *</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="register-input"
              required
            />
          </div>

          <div className="register-field-group">
            <label className="register-label">Amenities (Comma separated)</label>
            <input
              type="text"
              value={amenities}
              onChange={e => setAmenities(e.target.value)}
              className="register-input"
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="register-row-grid">
          <div className="register-field-group">
            <label className="register-label">Host Contact Name *</label>
            <input
              type="text"
              value={contactName}
              onChange={e => setContactName(e.target.value)}
              className="register-input"
              required
            />
          </div>

          <div className="register-field-group">
            <label className="register-label">Host Phone *</label>
            <input
              type="text"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              className="register-input"
              required
            />
          </div>
        </div>

        <div className="register-field-group">
          <label className="register-label">Host Email (Optional)</label>
          <input
            type="email"
            value={contactEmail}
            onChange={e => setContactEmail(e.target.value)}
            className="register-input"
          />
        </div>

        <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
          Gallery Images (Multiple Photos)
        </div>
        {[0, 1, 2, 3].map((index) => (
          <div className="register-field-group" key={index}>
            <label className="register-label" style={{ fontSize: '0.75rem' }}>Gallery Photo {index + 1} (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleGalleryChange(index, e)}
              className="register-input"
            />
            {galleryFiles[index] && (
              <span style={{ fontSize: '0.7rem', color: '#16a34a', marginTop: '0.25rem', display: 'block' }}>
                ✓ Photo {index + 1} selected
              </span>
            )}
          </div>
        ))}

        <div className="register-field-group" style={{ marginTop: '1rem' }}>
          <label className="register-label">Property Category / Badge (display only, not yet saved to backend)</label>
          <select
            value={badge}
            onChange={e => setBadge(e.target.value)}
            className="register-select"
          >
            <option value="Premier Rated">Premier Rated</option>
            <option value="Popular">Popular</option>
            <option value="Budget Friendly">Budget Friendly</option>
            <option value="Scenic View">Scenic View</option>
            <option value="Business Choice">Business Choice</option>
          </select>
        </div>

        <button type="submit" className="register-submit-btn" disabled={submitting}>
          {submitting ? 'Registering...' : 'Complete Registration & Save to Inventory'}
        </button>
      </form>
    </div>
  );
}