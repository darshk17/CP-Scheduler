# Phase 56: LeetCode Scheduler Rewrite Documentation

This phase implements a reliable anchor-date algorithm on the backend to accurately generate upcoming LeetCode Weekly and Biweekly contests.

---

## 🛠️ Modified Files

### 1. Backend Service: `contestService.js` (Updated)
Modified [server/services/contestService.js](file:///d:/CP-Scheduler/server/services/contestService.js):
- **Anchor-Date Approach**: Replaces complex calendar week number checks with absolute date anchors:
  - **Weekly Anchor**: Contest `509` at `Sunday, July 5, 2026, 08:00 AM IST` (02:30 UTC).
  - **Biweekly Anchor**: Contest `186` at `Saturday, July 4, 2026, 08:00 PM IST` (14:30 UTC).
- **Time/Duration Metrics**:
  - Weekly occurrences trigger every 7 days (`WEEK_MS`).
  - Biweekly occurrences trigger every 14 days (`BIWEEK_MS`).
  - Contest durations are locked at `5400` seconds (90 minutes).
- **Upcoming Window Limit**: Automatically filters past contests and compiles the next `6` Weekly rounds and `3` Biweekly rounds.
- **Helper Pruning**: Deleted legacy helper functions `getWeekNumber()` and `getSundayOfWeek()` since they are no longer required.
