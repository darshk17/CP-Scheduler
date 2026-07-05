import API from '../services/api';

/**
 * Fetch normalized upcoming contests list from the MERN backend.
 * @returns {Promise<Array>} - List of normalized contests
 */
export async function fetchContests() {
  try {
    const response = await API.get('/contests');
    if (response.data && response.data.status === 'success') {
      return response.data.data.contests;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch contests from backend:', error);
    return [];
  }
}
