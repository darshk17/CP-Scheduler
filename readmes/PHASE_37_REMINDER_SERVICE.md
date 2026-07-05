# Phase 37: Reminder Service Placeholder Documentation

This phase implements the placeholder service structure for the automated contest reminder matching engine.

---

## ⏰ Background Service: `reminderService.js`

Created in [server/services/reminderService.js](file:///d:/CP-Scheduler/server/services/reminderService.js):

- **Placeholder Function**: `processReminders()` orchestrates the background scan loop.
- **Workflow Comments**:
  - Step 1: Query database for users with reminders enabled.
  - Step 2: Retrieve list of upcoming contests.
  - Step 3: Match user bookmark lists against contest dates.
  - Step 4: Compare differences to target warning windows and check duplicate guards.
  - Step 5: Trigger Nodemailer email transmissions.
  - Step 6: Update user document locks (`remindersSent`) to prevent duplicate spams.
- **Default Action**: Returns a mock success status.

---

## 💡 Important Design Steps

1. **Internal Execution Scope**: Because this is a background engine scheduled via internal jobs, it has no direct routes or public controllers, protecting it from external network triggers.
2. **Modular Helper Integration**: References `User` model schemas and `sendEmail` functions in the header, preparing it to easily link components in the next phase.
