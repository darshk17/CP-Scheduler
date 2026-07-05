# Phase 38: Codeforces Service Documentation

This phase implements the Codeforces statistics retrieval service using native `fetch` and the official Codeforces API.

---

## 🏆 Profile Statistics Service: `codeforcesService.js`

Created in [server/services/codeforcesService.js](file:///d:/CP-Scheduler/server/services/codeforcesService.js):

- **API Endpoint**: `https://codeforces.com/api/user.info?handles={username}`.
- **Dynamic Formatting**: Maps Codeforces keys to clean, formatted parameters:
  - `handle` (Handle username case-sanitized by the server)
  - `rating` (Current contest rating)
  - `maxRating` (Peak history rating)
  - `rank` (Current rank title, e.g. "candidate master")
  - `maxRank` (Peak history rank title)
- **Graceful Failures**: Catches network exceptions and API failure packets (`status === "FAILED"`), returning `null` instead of crashing the server thread.

---

## 💡 Code Design Choices

1. **Native Fetch**: Uses Node's native global `fetch` API, eliminating external dependency loading overhead.
2. **Encoding Security**: Uses `encodeURIComponent(username)` to protect the HTTP request against handle strings containing path-manipulative characters.
