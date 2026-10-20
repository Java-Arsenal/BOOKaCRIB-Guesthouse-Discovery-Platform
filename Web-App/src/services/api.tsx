const API_BASE_URL = 'http://127.0.0.1:5000/api';

// 1. Fetch all guesthouses for your dashboard & inventory view
export async function getGuesthouses() {
  try {
    const response = await fetch(`${API_BASE_URL}/guesthouses`);
    if (!response.ok) throw new Error('Failed to fetch guesthouses from backend');
    
    const result = await response.json();
    
    // Safely extract the array whether it's wrapped in { success: true, data: [...] } or sent directly
    const items = Array.isArray(result) ? result : (result.data || []);

    // Map backend keys (like guesthouse_id) to match your frontend expectations
    return items.map((item: any) => ({
      ...item,
      id: item.id || item.guesthouse_id,
      price: item.price || item.price_per_night_bwp || 0,
      location: item.location || item.city || 'Palapye'
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