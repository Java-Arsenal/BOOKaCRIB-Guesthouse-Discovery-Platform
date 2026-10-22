import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styling/RegisterGuesthouse.css';

export default function RegisterGuesthouse() {
  // Required Project Fields State
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [location, setLocation] = useState('Palapye');
  const [country] = useState('Botswana');
  const [price, setPrice] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [images, setImages] = useState<string[]>(['', '', '', '']);
  const [badge, setBadge] = useState('Premier Rated');
  const [successMessage, setSuccessMessage] = useState(false);

  // General file reader helper for local images/logos
  const handleFileToGenerativeBase64 = (callback: (base64: string) => void, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileToGenerativeBase64((base64) => {
      const updatedImages = [...images];
      updatedImages[index] = base64;
      setImages(updatedImages);
    }, e);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description) return;

    try {
      await addDoc(collection(db, 'guesthouses'), {
        name,
        logo,
        description,
        amenities: amenities.split(',').map(item => item.trim()).filter(Boolean), // Saves as a clean array of amenities
        coordinates,
        location,
        country,
        price: Number(price),
        contactDetails,
        images,
        badge,
        rating: 0,
        reviewsCount: 0,
        createdAt: new Date()
      });

      setSuccessMessage(true);
      // Reset form fields
      setName('');
      setLogo('');
      setDescription('');
      setAmenities('');
      setCoordinates('');
      setPrice('');
      setContactDetails('');
      setImages(['', '', '', '']);
      setTimeout(() => setSuccessMessage(false), 3000);
    } catch (err) {
      console.error("Error adding guesthouse to Firestore: ", err);
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
          Guesthouse successfully registered with all project fields and saved to Firestore!
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
              onChange={e => handleFileToGenerativeBase64(setLogo, e)}
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

        {/* Location & City & Country */}
        <div className="register-row-grid">
          <div className="register-field-group">
            <label className="register-label">City / Hub *</label>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="register-select"
            >
              <option value="Palapye">Palapye</option>
              <option value="Gaborone">Gaborone</option>
              <option value="Maun">Maun</option>
              <option value="Francistown">Francistown</option>
              <option value="Kasane">Kasane</option>
              <option value="Serowe">Serowe</option>
              <option value="Lobatse">Lobatse</option>
              <option value="Molepolole">Molepolole</option>
              <option value="Selibe Phikwe">Selibe Phikwe</option>
            </select>
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

        <div className="register-row-grid">
          <div className="register-field-group">
            <label className="register-label">Google Maps Coordinates</label>
            <input
              type="text"
              value={coordinates}
              onChange={e => setCoordinates(e.target.value)}
              className="register-input"
            />
          </div>

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
        </div>

        {/* Amenities & Contact Details */}
        <div className="register-row-grid">
          <div className="register-field-group">
            <label className="register-label">Amenities (Comma separated)</label>
            <input
              type="text"
              value={amenities}
              onChange={e => setAmenities(e.target.value)}
              className="register-input"
            />
          </div>

          <div className="register-field-group">
            <label className="register-label">Contact Details</label>
            <input
              type="text"
              value={contactDetails}
              onChange={e => setContactDetails(e.target.value)}
              className="register-input"
            />
          </div>
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
              onChange={(e) => handleImageChange(index, e)}
              className="register-input"
            />
            {images[index] && (
              <span style={{ fontSize: '0.7rem', color: '#16a34a', marginTop: '0.25rem', display: 'block' }}>
                ✓ Photo {index + 1} loaded
              </span>
            )}
          </div>
        ))}

        <div className="register-field-group" style={{ marginTop: '1rem' }}>
          <label className="register-label">Property Category / Badge</label>
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

        <button type="submit" className="register-submit-btn">
          Complete Registration & Save to Inventory
        </button>
      </form>
    </div>
  );
}