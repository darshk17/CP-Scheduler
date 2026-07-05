# Phase 17: Postman Testing Guide (Register API)

This guide details how to verify and test the user registration API using Postman and MongoDB Atlas.

---

## 📡 1. API Call Details

- **URL**: `http://localhost:5000/api/auth/register`
- **HTTP Method / Request Type**: `POST`
- **Headers**:
  - `Content-Type`: `application/json`

---

## 📝 2. Request Payload (JSON Body)

In Postman, select the **Body** tab, choose the **raw** radio button, and select **JSON** from the dropdown menu. Paste the following payload:

```json
{
  "fullName": "Jane Doe",
  "email": "janedoe@example.com",
  "password": "SecurePassword123",
  "leetcodeUsername": "jane_lc",
  "codeforcesUsername": "jane_cf",
  "codechefUsername": "jane_cc"
}
```

---

## 🟢 3. Expected Success Response

- **Status Code**: `201 Created`
- **Response Body**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "60d5ecb8b39d1b2048cf6801",
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

---

## 🔴 4. Expected Duplicate Email Response

If you send the exact same request again with the duplicate email:

- **Status Code**: `409 Conflict` (or `400 Bad Request` depending on validation logic)
- **Response Body**:
```json
{
  "status": "error",
  "message": "Duplicate value entered for field: email. Please use another value."
}
```

---

## 🍃 5. MongoDB Atlas Verification

To confirm the record was saved correctly in the cloud:

1. **Log in to Atlas**: Access your database at [MongoDB Atlas](https://cloud.mongodb.com/).
2. **Access Collection**: Click on **Database** under the deployment menu, and click the **Browse Collections** button on your database cluster.
3. **Find Database**: Locate the `cp-scheduler` database and select the `users` collection.
4. **Locate Record**: Use the search bar `{ email: "janedoe@example.com" }` and click **Filter**.
5. **Verify Fields**:
   - Verify `password` contains a 60-character bcrypt hash string (starting with `$2a$10$`) rather than plain text `"SecurePassword123"`.
   - Verify auto-generated `createdAt` and `updatedAt` timestamps are populated.
