# Phase 21: Protected Profile Route Documentation

This phase implements a protected test route `GET /api/auth/profile` allowing logged-in users to fetch their profile details securely.

---

## 📍 Route Definition: `GET /profile`

Mapped in [server/routes/authRoutes.js](file:///d:/CP-Scheduler/server/routes/authRoutes.js):

```javascript
router.get('/profile', protect, getCurrentUser);
```

Mapped to `getCurrentUser` in [server/controllers/authController.js](file:///d:/CP-Scheduler/server/controllers/authController.js):

```javascript
exports.getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: formatUserResponse(req.user)
      }
    });
  } catch (error) {
    next(error);
  }
};
```

---

## 🔄 Request Flow & Middleware Execution

```mermaid
graph TD
    Client[React Client] -->|GET /api/auth/profile + Bearer JWT| Server[Express Server]
    Server -->|Pass Request| protect[protect Middleware]
    
    subgraph protect_middleware [protectMiddleware.js]
        validateHeader{Header contains Bearer Token?}
        validateHeader -->|No| errorNoToken[Return 401 Not authorized, no token provided]
        validateHeader -->|Yes| verifySignature{jwt.verify Signature Valid?}
        verifySignature -->|No| errorInvalid[Return 401 Invalid Token / Expired]
        verifySignature -->|Yes| fetchDB[Fetch user from MongoDB without password]
        fetchDB --> attachUser[Attach User to req.user]
        attachUser --> triggerNext[Call next]
    end

    triggerNext -->|Proceed| Controller[getCurrentUser Controller]
    Controller -->|Respond 200 OK| success[Return req.user Payload]
    success --> Client
```

1. **Client Request**: The client requests `/api/auth/profile` and attaches the token in the `Authorization` header.
2. **Middleware Interception**: The `protect` middleware runs first:
   - Reads the token.
   - Verifies the signature with `jwt.verify()`.
   - Queries MongoDB using the token's payload user ID.
   - Strips the password out of the retrieved user document.
   - Attaches the user object to the request context: `req.user = user`.
   - Calls `next()`.
3. **Controller Execution**: The `getCurrentUser` controller retrieves the pre-attached user details from `req.user`, processes them through the `userFormatter`, and returns the profile details to the client in a JSON success response.
