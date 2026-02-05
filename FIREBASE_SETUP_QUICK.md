# Firebase Quick Setup Guide

## Error: "Missing or insufficient permissions"

This error means your Firestore Security Rules are not configured correctly.

## Fix in 3 Steps

### Step 1: Open Firebase Console
- Go to https://console.firebase.google.com/
- Select project: **websitev2-96c80**

### Step 2: Update Security Rules
- Click **Firestore Database** in left menu
- Click **Rules** tab at the top
- Delete all existing rules
- Paste this code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /bestDeals/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /admins/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 3: Publish Rules
- Click **Publish** button
- Wait for confirmation (green checkmark)
- Refresh your app

## Done! ✅

Now you should be able to:
- ✅ Add products
- ✅ Add flash deals
- ✅ Manage orders
- ✅ Create user accounts

## Still Getting Errors?

1. **Make sure you're logged in as admin**
   - Click Admin button
   - Login with: admin@buyfastbd.com / admin123456

2. **Check rules are published**
   - Look for green checkmark in Firebase Console

3. **Wait a few seconds**
   - Rules take a moment to propagate

4. **Refresh the page**
   - Clear browser cache if needed

5. **Check browser console**
   - Press F12 to open developer tools
   - Look for error messages

## Need More Help?

See `FIREBASE_RULES.md` for detailed rule explanations and collection structure.
