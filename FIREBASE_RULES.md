# Firebase Firestore Security Rules

## Setup Instructions

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `websitev2-96c80`
3. Navigate to **Firestore Database** → **Rules** tab
4. Replace all content with the rules below
5. Click **Publish**

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection - public read, authenticated write
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Best Deals (Flash Deals) collection - public read, authenticated write
    match /bestDeals/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Orders collection - authenticated only
    match /orders/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Users collection - user can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Admins collection - authenticated users only
    match /admins/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Rule Breakdown

### Products
- **Read**: Public (anyone can view products)
- **Write**: Authenticated users only (admin can add/edit/delete)

### Best Deals (Flash Deals)
- **Read**: Public (anyone can view flash deals)
- **Write**: Authenticated users only (admin can add/remove deals)

### Orders
- **Read**: Authenticated users only
- **Write**: Authenticated users only

### Users
- **Read**: Users can only read their own data
- **Write**: Users can only write their own data

### Admins
- **Read**: Authenticated users only
- **Write**: Authenticated users only

## Troubleshooting

If you get "Missing or insufficient permissions" error:

1. Make sure you're logged in as admin
2. Check that the rules are published (green checkmark)
3. Wait a few seconds for rules to propagate
4. Refresh the page and try again

## Collections Structure

```
firestore/
├── products/
│   └── {productId}
│       ├── name: string
│       ├── price: number
│       ├── stock: number
│       ├── discount: number
│       ├── description: string
│       ├── category: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── bestDeals/
│   └── {dealId}
│       ├── productId: string
│       ├── productName: string
│       ├── price: number
│       ├── discount: number
│       ├── description: string
│       └── createdAt: timestamp
│
├── orders/
│   └── {orderId}
│       ├── customerName: string
│       ├── amount: number
│       ├── status: string
│       ├── items: array
│       └── createdAt: timestamp
│
├── users/
│   └── {userId}
│       ├── uid: string
│       ├── email: string
│       ├── displayName: string
│       ├── photoURL: string
│       ├── role: string
│       └── createdAt: timestamp
│
└── admins/
    └── {adminId}
        ├── uid: string
        ├── email: string
        ├── role: string
        └── createdAt: timestamp
```
