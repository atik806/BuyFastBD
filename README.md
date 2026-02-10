# 🛍️ BuyFastBD - Modern E-Commerce Platform

> A lightning-fast, feature-rich e-commerce platform built with React, Firebase, and modern web technologies. Designed for speed, conversion, and seamless user experience.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Latest-FFCA28?style=flat-square&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

### 🏪 Customer Features
- ⚡ **Lightning-Fast Homepage** - Real-time product updates with zero refresh needed
- 🛒 **Smart Shopping Cart** - LocalStorage persistence, quantity management
- 📱 **Product Detail Pages** - Conversion-optimized with:
  - Image gallery with thumbnails
  - Real-time price & discount calculations
  - Stock urgency indicators
  - 2-3 day delivery estimates
  - Cash on Delivery badge
  - Customer reviews with 5-star ratings
  - Sticky buy button for easy checkout
- 🔐 **Guest Checkout** - No signup required
- 👤 **Google Sign-In** - One-click user registration
- 💳 **Flexible Delivery Options**:
  - Inside Dhaka: ৳80
  - Outside Dhaka: ৳120
  - Real-time total calculation
- � **ROrder Tracking** - View order history and status
- � **PDF Rec eipts** - Download professional order receipts
- 🔄 **Easy Returns** - 7-day return policy

### 👨‍� Aydmin Features
- � **UReal-Time Dashboard** - Live analytics and metrics
- 📦 **Product Management** - Add, edit, delete products instantly
- ⚡ **Flash Deals** - Create and manage featured deals
- 📋 **Advanced Order Management**:
  - Search by Order ID, Customer Name, Email, Phone
  - Filter by Status (Pending, Accepted, Cancelled)
  - Filter by Date (Today, Last 7 Days, Last 30 Days)
  - Sort by Date or Amount
  - Accept/Cancel/Delete orders
  - Download PDF receipts
- 📈 **Analytics & Reports** - Sales insights and trends
- 👥 **User Management** - View and manage customers

### 🎨 Design & UX
- ✨ **Modern Animations** - Smooth transitions and interactions
- 📱 **Fully Responsive** - Mobile, tablet, and desktop optimized
- 🌈 **Beautiful UI** - Gradient backgrounds and intuitive layouts
- ⚡ **Real-Time Updates** - Firestore listeners for instant data sync
- 🎯 **Conversion Optimized** - Product pages designed to convert
- 📄 **Professional PDF Receipts** - Modern, single-page order receipts

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/buyfastbd.git
cd buyfastbd

# Install dependencies
npm install

# Setup Firebase (see Firebase Setup section)
cp src/firebase.example.js src/firebase.js
# Edit src/firebase.js with your credentials

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔧 Configuration

### Firebase Setup

**IMPORTANT: For security, firebase.js is NOT committed to Git**

1. Copy the template file:
```bash
cp src/firebase.example.js src/firebase.js
```

2. Get your Firebase config from [firebase.google.com](https://firebase.google.com)

3. Update `src/firebase.js` with your credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

### Firestore Security Rules

See [FIREBASE_RULES.md](./FIREBASE_RULES.md) for complete security rules setup.

---

## 📁 Project Structure

```
buyfastbd/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx              # Homepage with products
│   │   ├── ProductDetail.jsx         # Product detail page
│   │   ├── Cart.jsx                  # Shopping cart
│   │   ├── Checkout.jsx              # Checkout with delivery options
│   │   ├── AdminDashboard.jsx        # Admin dashboard
│   │   ├── ProductManagement.jsx     # Product CRUD
│   │   ├── OrdersManagement.jsx      # Order management with filters
│   │   ├── AdminLogin.jsx            # Admin login
│   │   ├── AdminSetup.jsx            # Admin setup
│   │   ├── UserSignup.jsx            # User signup
│   │   ├── UserDashboard.jsx         # User dashboard
│   │   ├── Analytics.jsx             # Analytics dashboard
│   │   ├── AboutUs.jsx               # About page
│   │   ├── Contact.jsx               # Contact page
│   │   └── FAQ.jsx                   # FAQ page
│   ├── components/
│   │   ├── LoginModal.jsx            # Login modal
│   │   └── CategoryFilter.jsx        # Category filter
│   ├── styles/
│   │   ├── index.css                 # Global styles
│   │   ├── ProductDetail.css         # Product page styles
│   │   ├── OrdersManagement.css      # Orders page styles
│   │   ├── Checkout.css              # Checkout styles
│   │   ├── Cart.css                  # Cart styles
│   │   └── ...
│   ├── utils/
│   │   └── generatePDF.js            # PDF receipt generator
│   ├── App.jsx                       # Main app with routing
│   ├── firebase.js                   # Firebase config (NOT in Git)
│   ├── firebase.example.js           # Firebase template
│   └── main.jsx                      # React entry point
├── index.html                        # HTML entry
├── vite.config.js                    # Vite config
├── package.json                      # Dependencies
├── .gitignore                        # Git ignore rules
├── FIREBASE_SETUP.md                 # Firebase setup guide
├── FIREBASE_RULES.md                 # Firestore security rules
└── README.md                         # This file
```

---

## 🎯 Key Pages

### 🏠 Homepage
- Real-time product listing
- Flash deals section
- Customer reviews
- Trust badges
- Responsive navigation

### 📦 Product Detail Page
- Image gallery with thumbnails
- Price with discount calculation
- Stock urgency warnings
- Delivery information
- Customer reviews
- Add to cart functionality
- Sticky buy button

### 🛒 Shopping Cart
- View all items
- Adjust quantities
- Remove items
- Real-time total calculation
- Proceed to checkout

### 💳 Checkout Page
- Delivery address form
- Delivery location selection (Inside/Outside Dhaka)
- Real-time delivery cost calculation
- Order review
- Payment method selection
- Order confirmation

### 👨‍💼 Admin Dashboard
- **Overview Tab** - Key metrics and recent orders
- **Products Tab** - Full product management
- **Flash Deals Tab** - Manage featured deals
- **Orders Tab** - Advanced order management with:
  - Real-time search
  - Multi-filter system
  - Sort options
  - PDF receipt download
  - Order status management
- **Analytics Tab** - Sales reports and insights

### 📋 Order Management
- **Search**: Order ID, Customer Name, Email, Phone
- **Filters**:
  - Status: All, Pending, Accepted, Cancelled
  - Date: All Time, Today, Last 7 Days, Last 30 Days
  - Sort: Newest, Oldest, Highest Amount, Lowest Amount
- **Actions**: Accept, Cancel, Download PDF, Delete
- **PDF Receipts**: Professional single-page receipts with:
  - Order details
  - Customer information
  - Order items
  - Delivery cost breakdown
  - Payment method
  - Estimated delivery date

---

## 🔐 Authentication

### Admin Login
- Email: `admin@buyfastbd.com`
- Password: `admin123456`
- First-time setup creates the admin account

### User Signup
- Google OAuth integration
- One-click registration
- Profile auto-saved to Firestore

### Guest Checkout
- No signup required
- Full shopping experience
- Cart stored locally

---

## 💾 Database Schema

### Collections

**products**
```javascript
{
  name: string,
  price: number,
  stock: number,
  discount: number,
  description: string,
  category: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**bestDeals** (Flash Deals)
```javascript
{
  productId: string,
  productName: string,
  price: number,
  discount: number,
  description: string,
  createdAt: timestamp
}
```

**orders**
```javascript
{
  userId: string,
  userName: string,
  userEmail: string,
  phone: string,
  items: array,
  subtotal: number,
  discount: number,
  deliveryCost: number,
  deliveryLocation: string,  // "inside" or "outside"
  total: number,
  status: string,            // "pending", "accepted", "cancelled"
  paymentMethod: string,
  deliveryAddress: string,
  createdAt: timestamp,
  estimatedDelivery: timestamp
}
```

**users**
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  role: string,
  createdAt: timestamp
}
```

---

## 🛠️ Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 📊 Real-Time Features

- ✅ Products update instantly across all pages
- ✅ Flash deals sync in real-time
- ✅ Admin dashboard shows live metrics
- ✅ Orders update in real-time
- ✅ Cart persists across sessions
- ✅ No manual refresh needed

---

## 📄 PDF Receipt Features

- **Modern Design** - Professional, customer-friendly layout
- **Single Page** - All information fits on one A4 page
- **Complete Details**:
  - Order ID and date
  - Customer information
  - Order items with quantities
  - Delivery cost breakdown
  - Total amount
  - Payment method
  - Estimated delivery date
- **Easy Download** - One-click PDF generation
- **Print Ready** - Optimized for printing

---

## 🎨 Design System

### Colors
- Primary: `#ff6b35` (Orange)
- Secondary: `#f7931e` (Light Orange)
- Background: `#f8f9fa` (Light Gray)
- Text: `#000` (Black)
- Success: `#4caf50` (Green)
- Error: `#f44336` (Red)

### Animations
- Fade In - Smooth opacity transitions
- Slide In - Elements slide into view
- Scale In - Elements grow into view
- Bounce - Continuous bouncing effect
- Pulse - Pulsing badge animations

---

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag and drop 'dist' folder to Netlify
```

---

## 🐛 Troubleshooting

### Firebase Import Error
```bash
# Make sure firebase.js exists
cp src/firebase.example.js src/firebase.js
# Then add your credentials
```

### Missing Dependencies
```bash
npm install
```

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### PDF Generation Issues
```bash
npm install jspdf html2canvas
```

---

## 📚 Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Firebase Security Rules](./FIREBASE_RULES.md)
- [Product Pages Guide](./PRODUCT_PAGES.md)
- [Setup Instructions](./SETUP.md)
- [Purchase Flow Guide](./PURCHASE_FLOW_README.md)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**BuyFastBD Team**
- Website: [buyfastbd.com](https://buyfastbd.com)
- Email: support@buyfastbd.com

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Firebase for real-time database
- Vite for blazing fast builds
- jsPDF & html2canvas for PDF generation
- All contributors and users

---

## 📞 Support

For support, email support@buyfastbd.com or open an issue on GitHub.

---

<div align="center">

### Made with ❤️ by BuyFastBD Team

⭐ If you like this project, please give it a star!

</div>