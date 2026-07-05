// ── Helpers for Rule-Based Schedule Generation ───────────────────────────
function snapTo(ms, utcHour, utcMin) {
  const d = new Date(ms);
  d.setUTCHours(utcHour, utcMin, 0, 0);
  return d.getTime();
}

// ── Fallback Codeforces Generator ─────────────────────────────────────────
function generateCodeforcesFallback() {
  const contests = [];
  const now = Date.now();
  for (let i = 1; i <= 5; i++) {
    const start = now + i * 5 * 86400000;
    contests.push({
      id: `cf-fallback-${i}`,
      platform: 'codeforces',
      name: `Codeforces Round (Div. ${i % 2 === 0 ? 2 : 3}) #${900 + i}`,
      startTime: snapTo(start, 19, 35),
      duration: 7200,
      url: 'https://codeforces.com/contests',
    });
  }
  return contests;
}

// ── Codeforces Fetcher ────────────────────────────────────────────────────
async function fetchCodeforces() {
  try {
    const res = await fetch('https://codeforces.com/api/contest.list?gym=false');
    const data = await res.json();
    if (data.status !== 'OK') return [];

    const now = Date.now();
    return data.result
      .filter(c => {
        const start = c.startTimeSeconds * 1000;
        return (c.phase === 'BEFORE' || c.phase === 'CODING') &&
          start > now - 86400000 &&
          start < now + 30 * 86400000;
      })
      .map(c => ({
        id: `cf-${c.id}`,
        platform: 'codeforces',
        name: c.name,
        startTime: c.startTimeSeconds * 1000,
        duration: c.durationSeconds,
        url: `https://codeforces.com/contest/${c.id}`,
      }))
      .slice(0, 15);
  } catch (error) {
    console.warn('Codeforces live API fetch failed, executing fallback generator:', error.message);
    return generateCodeforcesFallback();
  }
}

// ── LeetCode Generator (Anchor-Date Approach) ─────────────────────────────
// ── LeetCode Generator (Anchor-Date Approach) ─────────────────────────────
async function generateLeetCode() {
  const contests = [];
  const now = Date.now();

  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const WEEK_MS = 7 * ONE_DAY_MS;
  const BIWEEK_MS = 14 * ONE_DAY_MS;
  const CONTEST_DURATION_SECONDS = 90 * 60;

  // Weekly Contest 509
  // Sunday, 5 July 2026, 08:00 AM IST = 02:30 UTC
  const WEEKLY_ANCHOR = {
    contestNumber: 509,
    startTime: Date.UTC(2026, 6, 5, 2, 30, 0)
  };

  // Biweekly Contest 186
  // Saturday, 4 July 2026, 08:00 PM IST = 14:30 UTC
  const BIWEEKLY_ANCHOR = {
    contestNumber: 186,
    startTime: Date.UTC(2026, 6, 4, 14, 30, 0)
  };

  // ---------------- Weekly Contests ----------------

  let weeklyOffset = Math.floor(
    (now - WEEKLY_ANCHOR.startTime) / WEEK_MS
  );

  if (weeklyOffset < 0) {
    weeklyOffset = 0;
  }

  while (
    WEEKLY_ANCHOR.startTime +
    weeklyOffset * WEEK_MS +
    CONTEST_DURATION_SECONDS * 1000 <
    now
  ) {
    weeklyOffset++;
  }

  for (let i = 0; i < 6; i++) {
    const offset = weeklyOffset + i;

    contests.push({
      id: `lc-weekly-${WEEKLY_ANCHOR.contestNumber + offset}`,
      platform: 'leetcode',
      name: `LeetCode Weekly Contest ${WEEKLY_ANCHOR.contestNumber + offset}`,
      startTime: WEEKLY_ANCHOR.startTime + offset * WEEK_MS,
      duration: CONTEST_DURATION_SECONDS,
      url: 'https://leetcode.com/contest/',
    });
  }

  // ---------------- Biweekly Contests ----------------

  let biweeklyOffset = Math.floor(
    (now - BIWEEKLY_ANCHOR.startTime) / BIWEEK_MS
  );

  if (biweeklyOffset < 0) {
    biweeklyOffset = 0;
  }

  while (
    BIWEEKLY_ANCHOR.startTime +
    biweeklyOffset * BIWEEK_MS +
    CONTEST_DURATION_SECONDS * 1000 <
    now
  ) {
    biweeklyOffset++;
  }

  for (let i = 0; i < 3; i++) {
    const offset = biweeklyOffset + i;

    contests.push({
      id: `lc-biweekly-${BIWEEKLY_ANCHOR.contestNumber + offset}`,
      platform: 'leetcode',
      name: `LeetCode Biweekly Contest ${BIWEEKLY_ANCHOR.contestNumber + offset}`,
      startTime: BIWEEKLY_ANCHOR.startTime + offset * BIWEEK_MS,
      duration: CONTEST_DURATION_SECONDS,
      url: 'https://leetcode.com/contest/',
    });
  }

  return contests;
}

// ── CodeChef Generator ────────────────────────────────────────────────────
// ── CodeChef Generator (Anchor-Date Approach) ─────────────────────────────
async function generateCodeChef() {
  const contests = [];
  const now = Date.now();

  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const WEEK_MS = 7 * ONE_DAY_MS;
  const CONTEST_DURATION_SECONDS = 2 * 60 * 60;

  // Starters 246
  // Wednesday, 8 July 2026
  // 08:00 PM IST = 14:30 UTC

  const CODECHEF_ANCHOR = {
    contestNumber: 246,
    startTime: Date.UTC(2026, 6, 8, 14, 30, 0)
  };

  let offset = Math.floor(
    (now - CODECHEF_ANCHOR.startTime) / WEEK_MS
  );

  if (offset < 0) {
    offset = 0;
  }

  // Skip contests that have already finished
  while (
    CODECHEF_ANCHOR.startTime +
    offset * WEEK_MS +
    CONTEST_DURATION_SECONDS * 1000 <
    now
  ) {
    offset++;
  }

  // Generate next 6 Starters contests
  for (let i = 0; i < 6; i++) {
    const currentOffset = offset + i;

    contests.push({
      id: `cc-starters-${CODECHEF_ANCHOR.contestNumber + currentOffset}`,
      platform: 'codechef',
      name: `CodeChef Starters ${CODECHEF_ANCHOR.contestNumber + currentOffset}`,
      startTime:
        CODECHEF_ANCHOR.startTime +
        currentOffset * WEEK_MS,
      duration: CONTEST_DURATION_SECONDS,
      url: 'https://www.codechef.com/contests'
    });
  }

  return contests;
}
/**
 * Merges and returns upcoming scheduled contests from Codeforces, LeetCode and CodeChef.
 * @returns {Promise<Array>} - List of normalized upcoming contests
 */
const getUpcomingContests = async () => {
  try {
    const [cfContests, lcContests, ccContests] = await Promise.all([
      fetchCodeforces(),
      generateLeetCode(),
      generateCodeChef()
    ]);
    const contests = [
      ...cfContests,
      ...lcContests,
      ...ccContests
    ];

    // Sort contests by start time
    contests.sort((a, b) => a.startTime - b.startTime);

    return contests;
  } catch (error) {
    console.error('❌ Error inside contestService getUpcomingContests:', error.message);
    return [];
  }
};

module.exports = {
  getUpcomingContests
};
