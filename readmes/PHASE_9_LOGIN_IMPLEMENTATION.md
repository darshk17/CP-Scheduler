# Phase 9: Login Implementation Documentation

This phase implements user authentication (login) logic, featuring password comparison using **bcryptjs** and session token generation via **jsonwebtoken (JWT)**.

---

## 🔒 Password Verification in User Model

We have added a custom instance method to our User Schema in [server/models/User.js](file:///d:/CP-Scheduler/server/models/User.js) to compare the entered plain-text password with the encrypted hash saved in MongoDB:

```javascript
// Method to check if entered password matches hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

---

## 🛠 Controller Implementation: `authController.js`

Here is a detailed breakdown of the `login` controller function inside [server/controllers/authController.js](file:///d:/CP-Scheduler/server/controllers/authController.js):

### The Login Controller Logic
```javascript
// Log in existing user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validation: Ensure both fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Query User: Find user by email in database
    const user = await User.findOne({ email });

    // 3. Match Credentials: Check if user exists and password is correct
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 4. Generate session token
    const token = signToken(user._id);

    // 5. Send Response
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          leetcodeUsername: user.leetcodeUsername,
          codeforcesUsername: user.codeforcesUsername,
          codechefUsername: user.codechefUsername,
          savedContests: user.savedContests
        }
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
```

---

## 📚 Concepts Explained

### 1. JWT Generation
A **JSON Web Token (JWT)** consists of three parts separated by dots (`.`):
1.  **Header**: Specifies the token type (JWT) and signing algorithm (e.g., HS256).
2.  **Payload**: Holds the claims (data you want to store, like the user's database ID `user._id`).
3.  **Signature**: Created by combining the encoded header, payload, and your secret key (`JWT_SECRET`) using the specified algorithm. This prevents tampering—if a user tries to modify their ID in the payload, the signature becomes invalid, and the server rejects it.

### 2. Token Expiration
We configure our JWT with an expiration duration (e.g., `JWT_EXPIRES_IN=7d` which means 7 days). 
*   **Why it exists**: If a malicious actor steals a user's token (from local storage or network sniffing), they can only impersonate the user until the token expires. Setting an expiration limit ensures tokens do not stay authorized forever.

### 3. Why Passwords are Never Stored in Plain Text
*   **Database Leaks**: Databases are sometimes leaked or hacked. If we store passwords as plain text (e.g. `"MyPassword123"`), hackers immediately gain access to every user's credentials.
*   **Credential Stuffing**: Most users reuse the same password across multiple websites. A leak on your site could compromise their emails, social media, or bank accounts on other sites.
*   **Bcrypt Security**: Bcrypt hashes passwords one-way. Even if hackers steal the database, they only get unreadable hashes (e.g. `$2a$10$...`). It is mathematically impossible to reverse a hash back to the original password.
