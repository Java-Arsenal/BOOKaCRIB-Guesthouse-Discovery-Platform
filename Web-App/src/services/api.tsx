import { auth } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// 1. Fetch all guesthouses for your dashboard & inventory view
export async function getGuesthouses() {
  try {
    const response = await fetch(`${API_BASE_URL}/guesthouses`);
    if (!response.ok) throw new Error('Failed to fetch guesthouses from backend');

    const result = await response.json();
    const items = Array.isArray(result) ? result : (result.data || []);

    return items.map((item: any) => ({
      ...item,
      id: item.id || item.guesthouse_id,
    price: Number(item.price_per_night_bwp ?? item.price ?? 0),
location:
  item.city ||
  (typeof item.location === 'string' ? item.location : null) ||
  'Palapye',
    }));
  } catch (error) {
    console.error("API Error (getGuesthouses):", error);
    return [];
  }
}

// 2. Register a new guesthouse
export async function createGuesthouse(guesthouseData: {
  name: string;
  description: string;
  amenities: string[];
  location: { latitude: number; longitude: number };
  price_per_night_bwp: number;
  city: string;
  country: string;
  contact_details: { phone: string; email: string };
}, token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/guesthouses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(guesthouseData),
    });

    if (!response.ok) throw new Error('Failed to register guesthouse');
    return await response.json();
  } catch (error) {
    console.error("API Error (createGuesthouse):", error);
    throw error;
  }
}

// 3. Delete a guesthouse (admin only)
export async function deleteGuesthouse(id: string) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Not signed in');

  const response = await fetch(`${API_BASE_URL}/guesthouses/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok && response.status !== 204) {
    throw new Error('Failed to delete guesthouse');
  }
}