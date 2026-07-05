/**
 * Fetch profile statistics for a Codeforces user handle using the official API.
 * @param {string} username - Codeforces handle
 * @returns {Promise<object>} - Formatted profile details or null if not found
 */
const getCodeforcesProfile = async (username) => {
  try {
    if (!username) {
      throw new Error('Username handle must be provided');
    }

    // 1. Query the official Codeforces REST API user.info endpoint
    const url = `https://codeforces.com/api/user.info?handles=${encodeURIComponent(username)}`;
    const response = await fetch(url);
    const data = await response.json();

    // 2. Validate response status
    // Codeforces returns { status: "FAILED", comment: "handles: User not found" } for invalid handles
    if (data.status !== 'OK' || !data.result || data.result.length === 0) {
      console.warn(`⚠️ Codeforces user info query failed for handle: ${username}`);
      return null;
    }

    // 3. Format and return requested parameters
    const profile = data.result[0];
    return {
      handle: profile.handle,
      rating: profile.rating || 0,
      maxRating: profile.maxRating || 0,
      rank: profile.rank || 'unrated',
      maxRank: profile.maxRank || 'unrated'
    };

  } catch (error) {
    console.error(`❌ Exception fetching Codeforces profile for ${username}:`, error.message);
    return null;
  }
};

module.exports = {
  getCodeforcesProfile
};
