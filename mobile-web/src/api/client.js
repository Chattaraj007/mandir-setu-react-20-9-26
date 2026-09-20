import { Platform } from 'react-native';

// In Docker, web tests talk to localhost:5000 or the docker proxy
// In Android emulator: 10.0.2.2:5000
// In physical mobile device with Expo Go: user's laptop LAN IP (e.g. 192.168.1.x:5000)
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_HOST;

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...options.headers,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn(`[API Warning] Request to ${endpoint} failed:`, error.message);
    return { success: false, message: error.message };
  }
}
