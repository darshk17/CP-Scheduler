/**
 * Fetch profile statistics for a LeetCode user handle using LeetCode's GraphQL API.
 * @param {string} username - LeetCode username handle
 * @returns {Promise<object>} - Formatted statistics or null if not found
 */
const getLeetCodeProfile = async (username) => {
  try {
    if (!username) {
      throw new Error('LeetCode username must be provided');
    }

    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
          }
        }
      }
    `;

    // 1. Fire GraphQL query to official LeetCode endpoint
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // Some platforms block bare requests
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });

    const json = await response.json();

    // 2. Validate response structure
    // If the user does not exist, matchedUser will be null
    if (!json.data || !json.data.matchedUser) {
      console.warn(`⚠️ LeetCode user query failed for handle: ${username}`);
      return null;
    }

    const user = json.data.matchedUser;
    const submissionStats = user.submitStats.acSubmissionNum;

    // 3. Extract difficulty counts
    const getCount = (difficulty) => {
      const stat = submissionStats.find(item => item.difficulty === difficulty);
      return stat ? stat.count : 0;
    };

    // 4. Return formatted data payload
    return {
      username: user.username,
      totalSolved: getCount('All'),
      easySolved: getCount('Easy'),
      mediumSolved: getCount('Medium'),
      hardSolved: getCount('Hard'),
      ranking: user.profile ? user.profile.ranking : 0
    };

  } catch (error) {
    console.error(`❌ Exception fetching LeetCode profile for ${username}:`, error.message);
    return null;
  }
};

module.exports = {
  getLeetCodeProfile
};
