# Phase 19: Postman Login Testing Guide

This guide details how to verify and test the user login API using Postman, explaining all success, failure, and token validation scenarios.

---

## 📡 1. API Call Details

- **URL**: `http://localhost:5000/api/auth/login`
- **HTTP Method / Request Type**: `POST`
- **Headers**:
  - `Content-Type`: `application/json`

---

## 🟢 2. Scenario A: Correct Login (Success)

### JSON Body:
```json
{
  "email": "janedoe@example.com",
  "password": "SecurePassword123"
}
```

### Expected Response:
- **Status Code**: `200 OK`
- **Response Body**:
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDkzMzkyMWQzZ... (JWT token string)",
  "data": {
    "user": {
      "id": "6a4933921d3d5cd86d90f5d4",
      "fullName": "Jane Doe",
      "email": "janedoe@example.com",
      "leetcodeUsername": "jane_lc",
      "codeforcesUsername": "jane_cf",
      "codechefUsername": "jane_cc",
      "savedContests": [],
      "reminderSettings": {
        "emailEnabled": true,
        "minutesBefore": 30
      }
    }
  }
}
```
### Response Explanation:
- Returns `200 OK` indicating the request was processed successfully.
- Generates and returns a signed `token` string which the client will use for subsequent protected requests.
- Returns the user profile details while omitting the password field.

---

## 🔴 3. Scenario B: Wrong Password (Failure)

### JSON Body:
```json
{
  "email": "janedoe@example.com",
  "password": "WrongPassword456"
}
```

### Expected Response:
- **Status Code**: `401 Unauthorized`
- **Response Body**:
```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```
### Response Explanation:
- Returns `401 Unauthorized` because the credentials provided are incorrect.
- For security reasons, we return the generic message `"Invalid email or password"` rather than `"Wrong password"` to prevent attackers from verifying which emails exist in our system.

---

## 🔴 4. Scenario C: Wrong Email (Failure)

### JSON Body:
```json
{
  "email": "unknown@example.com",
  "password": "SecurePassword123"
}
```

### Expected Response:
- **Status Code**: `401 Unauthorized`
- **Response Body**:
```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```
### Response Explanation:
- Returns `401 Unauthorized` since the email does not exist in the database.
- Uses the same generic message (`"Invalid email or password"`) for security consistency.

---

## 🔑 5. JWT Token Verification

To verify that the token returned from a successful login is valid:

1. **Copy Token**: Copy the exact `token` string value from the correct login response.
2. **Decode Token**: Go to [jwt.io](https://jwt.io/).
3. **Analyze Structure**: Paste the token in the "Encoded" box.
4. **Verify Payload**: Look at the "Payload: Data" panel:
   - It should contain an `id` field matching the user's MongoDB `_id`.
   - It should contain issuance (`iat`) and expiration (`exp`) epoch timestamps.
   - Verify that no sensitive data (like password hashes) is inside the payload.
