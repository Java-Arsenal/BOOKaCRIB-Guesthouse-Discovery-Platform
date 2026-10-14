import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styling/RegisterGuesthouse.css';

export default function RegisterGuesthouse() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Palapye');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [badge, setBadge] = useState('Premier Rated');
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !image) return;

    try {
      await addDoc(collection(db, 'guesthouses'), {
        name,
        location,
        price: Number(price),
        image,
        badge,
        rating: 5.0,
        reviewsCount: 1,
        createdAt: new Date()
      });

      setSuccessMessage(true);
      setName('');
      setPrice('');
      setImage('');
      setTimeout(() => setSuccessMessage(false), 3000);
    } catch (err) {
      console.error("Error adding guesthouse: ", err);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-header">
        <h2 className="register-title">Register New Guesthouse</h2>
        <p className="register-subtitle">Onboard a new Botswana property to the BOOKaCRIB inventory</p>
      </div>

      {successMessage && (
        <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '0.75rem', borderRadius: '0.5rem', fontWeight: 500 }}>
          Guesthouse successfully registered and added to Firestore inventory!
        </div>
      )}

      <form onSubmit={handleSubmit} className="register-form">
        <div className="register-field-group">
          <label className="register-label">Guesthouse Name</label>
          <input
            type="text"
            placeholder="e.g., Kopano Hill Retreat"
            value={name}
            onChange={e => setName(e.target.value)}
            className="register-input"
            required
          />
        </div>

        <div className="register-row-grid">
          <div className="register-field-group">
            <label className="register-label">Location in Botswana</label>
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
            <label className="register-label">Nightly Rate (Pula - BWP)</label>
            <input
              type="number"
              placeholder="e.g., 380"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="register-input"
              required
            />
          </div>
        </div>

        <div className="register-field-group">
          <label className="register-label">High-Resolution Photo URL</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={image}
            onChange={e => setImage(e.target.value)}
            className="register-input"
            required
          />
        </div>

        <div className="register-field-group">
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