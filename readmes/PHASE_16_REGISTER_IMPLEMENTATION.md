# Phase 16: User Registration Implementation Documentation

This phase implements user registration logic, incorporating payload validation, email duplicate checks, database insertion, and structured response returns.

---

## 🛠 Controller Implementation: `register`

Defined in [server/controllers/authController.js](file:///d:/CP-Scheduler/server/controllers/authController.js):

```javascript
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, leetcodeUsername, codeforcesUsername, codechefUsername } = req.body;

    // 1. Validation: Check that required fields are present
    if (!fullName || !email || !password) {
      const error = new Error('Please fill in all required fields (fullName, email, password)');
      error.statusCode = 400;
      return next(error);
    }

    // 2. Validation: Check password length
    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters long');
      error.statusCode = 400;
      return next(error);
    }

    // 3. Validation: Check for duplicate email
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error('A user with this email already exists');
      error.statusCode = 409; // 409 Conflict
      return next(error);
    }

    // 4. Create User: Save user in MongoDB
    // (Note: The password will be hashed automatically by the pre-save hook in models/User.js)
    const user = await User.create({
      fullName,
      email,
      password,
      leetcodeUsername,
      codeforcesUsername,
      codechefUsername
    });

    // 5. Return success response
    res.status(201).json({
      status: 'success',
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

## 💡 Important Lines Explained

1. **`const { fullName, email, password, ... } = req.body;`**: Uses ES6 object destructuring to pull specific fields from the request body payload.
2. **`const userExists = await User.findOne({ email });`**: Searches MongoDB to check if a user record with the input email exists. Since `email` is a unique index, this query is extremely fast ($O(1)$).
3. **`User.create({...})`**: Creates and saves a new document in MongoDB. This triggers Mongoose's pre-save middleware to securely hash the password via Bcryptjs.
4. **`res.status(201).json({...})`**: Employs HTTP status code `201 Created` to declare a new resource was successfully created.
5. **`return next(error);`**: Passes validation errors to Express's global error handler middleware, separating application-level routing from unified error formatting.
