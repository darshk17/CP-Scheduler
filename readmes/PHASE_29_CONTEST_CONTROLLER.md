# Phase 29: Contest Controller Implementation Documentation

This phase implements the backend logic for bookmarking, removing, and listing saved contests using MongoDB atomic operations.

---

## 🛠️ Controller Implementation: `contestController.js`

Created in [server/controllers/contestController.js](file:///d:/CP-Scheduler/server/controllers/contestController.js):

- `saveContest`: Adds unique identifiers via the `$addToSet` operator.
- `removeSavedContest`: Removes specified identifiers via the `$pull` operator.
- `getSavedContests`: Returns the active array of bookmarked IDs.

---

## 💡 Important MongoDB Operators Explained

### 1. `$addToSet`
- **What it does**: Appends a value to an array *only* if the value is not already present.
- **Why it matters**: It prevents race conditions or duplicate entries (e.g. preventing the user from bookmarking the exact same contest twice).

### 2. `$pull`
- **What it does**: Removes all occurrences of a specified value from an array matching the query filter.
- **Why it matters**: It cleanly handles deletion in a single atomic call instead of retrieving the document, modifying the array in Javascript memory, and writing it back to the database.

### 3. `{ new: true }`
- **What it does**: Tells Mongoose to return the updated database document *after* applying modification updates, rather than returning the original document state before the query ran.
- **Why it matters**: Allows returning the updated lists to the client instantly.
