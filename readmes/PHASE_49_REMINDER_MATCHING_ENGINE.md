# Phase 49: Reminder Matching Engine Implementation Documentation

This phase implements the matching engine logic inside the background scheduler services, scanning, matching, and notifying users of upcoming bookmarked events.

---

## 🛠️ Modified Files

### 1. Matcher: `reminderService.js` (Updated)
Modified [server/services/reminderService.js](file:///d:/CP-Scheduler/server/services/reminderService.js):
- Queries MongoDB for users with `reminderSettings.emailEnabled = true` and `savedContests.length > 0`.
- Invokes `getUpcomingContests()` from the contest service.
- Loops through user bookmarks:
  - Finds contest dates matching `contestId`.
  - Computes remaining duration in minutes: `const minutesRemaining = (contest.startTime - Date.now()) / (1000 * 60)`.
  - Sends email alert if: `minutesRemaining <= minutesBefore` and `minutesRemaining > minutesBefore - 1`.
  - Protects against duplicate alerts by confirming the contest ID is not present inside `user.remindersSent`.
  - Transmits a rich HTML mail using `sendEmail()`.
  - Logs successful sends and updates the user document locks:
    ```javascript
    await User.findByIdAndUpdate(user._id, {
      $push: { remindersSent: { contestId, sentAt: new Date() } }
    });
    ```
