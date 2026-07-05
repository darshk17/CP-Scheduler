/**
 * Formats a raw user document into a clean JSON response object,
 * ensuring no sensitive details (like password hashes) are sent back.
 */
exports.formatUserResponse = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    leetcodeUsername: user.leetcodeUsername || '',
    codeforcesUsername: user.codeforcesUsername || '',
    codechefUsername: user.codechefUsername || '',
    savedContests: user.savedContests || [],
    reminderSettings: user.reminderSettings || {
      emailEnabled: true,
      minutesBefore: 30
    }
  };
};
