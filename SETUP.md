# BuyFastBD - Setup Instructions

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## Getting Started

### First Time Setup - Create Admin Account
1. Click the **👨‍💼 Admin** button in the navbar
2. Click **🔧 Create Admin Account** button
3. Enter admin credentials (or use defaults):
   - Email: `admin@buyfastbd.com`
   - Password: `admin123456`
4. Click "Create Admin Account"
5. Once created, you'll be redirected to login
6. Login with the credentials you just created

### Admin Dashboard
- Access full product management system
- Add, edit, and delete products
- Manage flash deals
- View orders and analytics
- Track inventory and sales

### User Features
- Optional Google signup (or continue as guest)
- Browse real products from database
- View flash deals
- Add items to cart
- Checkout without account

## Admin Dashboard Overview

The admin dashboard shows key metrics:
- **Total Orders**: Number of orders placed
- **Total Revenue**: Sum of all order amounts
- **Total Products**: Number of products in catalog
- **Flash Deals**: Number of products marked as flash deals
- **Total Stock**: Total inventory across all products

## Homepage Sections

### Flash Deals (⚡ Today's Flash Deals)
- Displays products marked as **Flash Deals** by admin
- Shows only featured deals with discounts
- Updates in real-time when admin adds/removes deals

### Featured Products
- Displays **all products** EXCEPT those marked as Flash Deals
- Shows regular product inventory
- Products marked as Flash Deals appear only in Flash Deals section
- Updates in real-time when admin adds/removes products

## Product Management

### Adding Products
1. Login as admin
2. Go to **📦 Products** tab
3. Click **➕ Add Product**
4. Fill in product details:
   - Product Name (required)
   - Category
   - Price in ৳ (required)
   - Stock Quantity (required)
   - Discount % (optional)
   - Description (optional)
5. Click "Add Product"
6. Product appears in **Featured Products** section on homepage

### Editing Products
1. In Products tab, click **✏️ Edit** on any product
2. Update the details
3. Click "Update Product"

### Deleting Products
1. In Products tab, click **🗑️ Delete** on any product
2. Confirm deletion

## Flash Deals Management

### Adding Products to Flash Deals
1. Login as admin
2. Go to **📦 Products** tab
3. Click **⚡ Flash Deal** button on any product
4. Product is instantly added to Flash Deals
5. Product appears in **Flash Deals** section on homepage

### Viewing Flash Deals in Admin Panel
1. Click **⚡ Flash Deals** tab in admin dashboard
2. View all products marked as flash deals
3. See deal prices, discounts, and descriptions
4. Count of flash deals shown in tab label

### Removing from Flash Deals
1. Go to **⚡ Flash Deals** tab in Product Management
2. Click **✕** button on any deal card
3. Product is removed from Flash Deals
4. Product disappears from **Flash Deals** section on homepage
5. Product remains in **Featured Products** section

## Firebase Configuration

Your Firebase project is configured with:
- Authentication (Email/Password for Admin, Google OAuth for Users)
- Firestore Database (for products, orders, and user data)

The configuration is in `src/firebase.js`

### Important: Firestore Security Rules

You must configure Firestore Security Rules for the app to work properly. See `FIREBASE_RULES.md` for detailed instructions.

**Quick Setup:**
1. Go to Firebase Console → Firestore Database → Rules
2. Copy rules from `FIREBASE_RULES.md`
3. Publish the rules

Without proper rules, you'll get "Missing or insufficient permissions" errors.

## Project Structure

```
src/
├── App.jsx                      # Main app with routing
├── firebase.js                  # Firebase config
├── pages/
│   ├── AdminLogin.jsx           # Admin login
│   ├── AdminSetup.jsx           # Admin account creation
│   ├── AdminDashboard.jsx       # Admin dashboard
│   ├── ProductManagement.jsx    # Product CRUD operations
│   ├── UserSignup.jsx           # User Google signup
│   └── Dashboard.jsx            # User dashboard
├── styles/
│   ├── Auth.css                 # Auth pages styling
│   ├── AdminDashboard.css       # Admin dashboard styling
│   ├── ProductManagement.css    # Product management styling
│   └── Dashboard.css            # User dashboard styling
├── index.css                    # Global styles
└── main.jsx                     # React entry point
```

## Features

✅ Real product management with Firestore
✅ Real-time product updates (no refresh needed)
✅ Real-time flash deals updates (no refresh needed)
✅ Add, edit, delete products instantly
✅ Flash deals management system
✅ Admin dashboard with overview, products, flash deals, orders, analytics
✅ Optional user signup with Google OAuth
✅ Guest checkout (no signup required)
✅ Real-time product display on homepage
✅ Real-time flash deals display on homepage
✅ Responsive design for all devices
✅ Logout functionality

## Database Collections

### products
- name: string
- price: number
- stock: number
- discount: number (optional)
- description: string (optional)
- category: string
- createdAt: timestamp
- updatedAt: timestamp

### bestDeals (Flash Deals)
- productId: string
- productName: string
- price: number
- discount: number
- description: string
- createdAt: timestamp

### orders
- customerName: string
- amount: number
- status: string
- items: array
- createdAt: timestamp

### users
- uid: string
- email: string
- displayName: string
- photoURL: string
- role: string
- createdAt: timestamp

### admins
- uid: string
- email: string
- role: string
- createdAt: timestamp

## Admin Dashboard Tabs

1. **📊 Overview** - Key metrics and recent orders
2. **📦 Products** - Manage all products (add, edit, delete)
3. **⚡ Flash Deals** - View all featured deals
4. **📋 Orders** - Manage customer orders
5. **📈 Analytics** - Sales and revenue reports

## Notes

- All demo data has been removed
- Products are fetched from Firestore in real-time
- Flash deals are fetched from Firestore in real-time
- Admin can manage complete product catalog
- Homepage displays actual products from database
- No hardcoded data - everything is database-driven
- Flash deals count updates in real-time in admin dashboard
