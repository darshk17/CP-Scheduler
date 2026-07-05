# Phase 18: User Login Implementation Documentation

This phase implements user login credentials verification, comparing hashed passwords via Bcrypt and generating token session payloads via JWT.

---

## 🛠 Controller Implementation: `login`

Defined in [server/controllers/authController.js](file:///d:/CP-Scheduler/server/controllers/authController.js):

```javascript
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validation: Check that credentials are provided
    if (!email || !password) {
      const error = new Error('Please provide email and password');
      error.statusCode = 400;
      return next(error);
    }

    // 2. Query User: Find user by email in database
    const user = await User.findOne({ email });

    // 3. Match Credentials: Check if user exists and password is correct
    if (!user || !(await user.matchPassword(password))) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401; // 401 Unauthorized
      return next(error);
    }

    // 4. Generate JWT token
    const token = signToken(user._id);

    // 5. Send Response: Return user data and token
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: formatUserResponse(user)
      }
    });

  } catch (error) {
    next(error);
  }
};
```

---

## 💡 Login Steps Explained

1. **Destructuring**: `const { email, password } = req.body;` extracts credentials from the request body.
2. **Payload Check**: Verifies that both fields were entered. If missing, passes a `400 Bad Request` error to the global handler.
3. **Database Query**: Queries the user by email using the indexed field (`User.findOne({ email })`).
4. **Password Verification**: Invokes the Mongoose custom method `user.matchPassword(password)`, which uses `bcrypt.compare` to compare the candidate password with the stored hash safely.
5. **JWT Token Signing**: Triggers the `signToken` helper:
   ```javascript
   jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
   ```
   This encrypts the user's ID into a tamper-proof token payload.
6. **Success Return**: Sends a `200 OK` status returning both the token and the formatted user profile.
