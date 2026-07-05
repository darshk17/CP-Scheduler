# Phase 6: User Model Documentation

This phase defines the database structure for our users using **Mongoose Schemas**. It establishes validations (like email formats, password lengths) and structures preferences for upcoming features like contest reminder emails and username tracking.

---

## 📄 User Schema Fields & Explanations

Here is a breakdown of the fields defined in [server/models/User.js](file:///d:/CP-Scheduler/server/models/User.js):

| Field Name | Data Type | Validation | Purpose | Why it exists |
| :--- | :--- | :--- | :--- | :--- |
| `fullName` | `String` | Required, Trimmed | Stores the user's name. | To personalize dashboard greetings. |
| `email` | `String` | Required, Unique, Lowercase, Regex Email Match | Stores the user's login email. | Acts as the login credential and target destination for contest reminder emails. |
| `password` | `String` | Required, Min length 6 | Stores the encrypted password. | Secures the user's account against unauthorized access. |
| `profilePicture`| `String` | Optional, Default: `""` | Stores a URL link to the image. | For the dashboard profile header. |
| `leetcodeUsername` | `String` | Trimmed, Default: `""` | LeetCode handle. | Used by the background tracker to fetch rating stats from LeetCode. |
| `codeforcesUsername`| `String`| Trimmed, Default: `""` | Codeforces handle. | Used by the background tracker to fetch rating stats from Codeforces. |
| `codechefUsername` | `String` | Trimmed, Default: `""` | CodeChef handle. | Used by the background tracker to fetch rating stats from CodeChef. |
| `savedContests` | `[String]`| Array of Strings | List of contest IDs. | Remembers which upcoming contests the user registered for or saved. |
| `reminderPreferences`| `Object` | Defaults configured | Nested configuration. | Allows users to customize how they want to receive notifications. |
| `reminderPreferences.emailEnabled`| `Boolean`| Default: `true` | Notification toggle. | Lets users turn off email alerts globally. |
| `reminderPreferences.minutesBefore`| `Number`| Default: `30` | Notification offset. | Adjusts how many minutes before a contest starts to send the reminder. |
| `createdAt` | `Date` | Generated automatically | Auto-timestamp. | Logs when the account was registered. |
| `updatedAt` | `Date` | Generated automatically | Auto-timestamp. | Logs when user credentials or preferences were last modified. |

---

## 🛠 File Creation: `server/models/User.js`

Write the following Mongoose schema inside the `models` folder to register the data model:

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    profilePicture: {
      type: String,
      default: ''
    },
    leetcodeUsername: {
      type: String,
      trim: true,
      default: ''
    },
    codeforcesUsername: {
      type: String,
      trim: true,
      default: ''
    },
    codechefUsername: {
      type: String,
      trim: true,
      default: ''
    },
    savedContests: [
      {
        type: String // Stores contest identifiers, e.g. "cf-1920", "lc-weekly-12"
      }
    ],
    reminderPreferences: {
      emailEnabled: {
        type: Boolean,
        default: true
      },
      minutesBefore: {
        type: Number,
        default: 30 // Default reminder is 30 minutes before the contest starts
      }
    }
  },
  {
    timestamps: true // Automatically generates and manages createdAt & updatedAt fields
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
```
