# Firebase Setup Guide

## Security Notice
The `src/firebase.js` file contains sensitive Firebase credentials and is **NOT** committed to Git for security reasons. You must create this file locally.

## Setup Instructions

### 1. Copy the Template File
```bash
cp src/firebase.example.js src/firebase.js
```

### 2. Add Your Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **websitev2-96c80**
3. Click on **Project Settings** (gear icon)
4. Under "Your apps", find your web app
5. Copy the Firebase configuration

### 3. Update src/firebase.js
Replace the placeholder values in `src/firebase.js` with your actual credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID",
  measurementId: "YOUR_ACTUAL_MEASUREMENT_ID"
}
```

### 4. Verify .gitignore
Make sure `.gitignore` includes:
```
src/firebase.js
```

This prevents accidental commits of sensitive credentials.

## For Team Members

When cloning the repository:
1. Run `cp src/firebase.example.js src/firebase.js`
2. Add your Firebase credentials to `src/firebase.js`
3. Never commit `src/firebase.js` to Git

## Environment Variables (Alternative Method)

You can also use environment variables for extra security:

1. Create a `.env` file in the project root:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

2. Update `src/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}
```

3. Add `.env` to `.gitignore`

## Troubleshooting

**Error: "Failed to resolve import '../firebase'"**
- Make sure `src/firebase.js` exists
- Run `cp src/firebase.example.js src/firebase.js`

**Firebase not initializing**
- Check that all credentials are correct
- Verify Firebase project is active in console
- Check browser console for specific error messages
