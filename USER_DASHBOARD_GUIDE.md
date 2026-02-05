# User Dashboard Guide

## Overview
When a user logs in, they are automatically redirected to the User Dashboard where they can browse products, search, filter by category, and make purchases.

## Dashboard Features

### 1. Header Section
- **Logo**: BuyFastBD branding
- **Search Bar**: Search products by name or description with category filtering
- **User Info**: Displays logged-in username
- **Cart Button**: Shows number of items in cart
- **Logout Button**: Safely logout from the platform

### 2. Shop Tab
The main shopping interface with two sections:

#### Flash Deals Section
- Shows today's special deals
- Displays discount percentage
- Quick "Add to Cart" button
- Real-time updates from Firestore

#### Featured Products Section
- Browse all products or search results
- Category filter for easy navigation
- Product cards showing:
  - Product image placeholder
  - Product name
  - Category tag
  - Price in Bangladeshi Taka (৳)
  - Stock status
  - Add to Cart button

### 3. My Account Tab
- View account information
- Email and membership details
- Quick access to:
  - My Orders (view purchase history)
  - Wishlist (save favorite items)
  - Addresses (manage delivery locations)
  - Support (contact customer service)

### 4. Shopping Cart
- **Floating Cart Sidebar**: Opens from the right side
- **Cart Items**: Shows all added products with:
  - Product name and price
  - Quantity controls (+ and -)
  - Individual item total
  - Remove button
- **Cart Summary**: 
  - Subtotal calculation
  - Free delivery
  - Total amount
- **Checkout Button**: Place order with Cash on Delivery

## How to Use

### Shopping
1. Browse products in the Shop tab
2. Use search bar to find specific items
3. Filter by category using the category dropdown
4. Click "Add to Cart" on any product
5. View cart by clicking the cart button

### Managing Cart
1. Click the cart button to open cart sidebar
2. Adjust quantities using + and - buttons
3. Remove items using the trash icon
4. View total price and delivery info

### Checkout
1. Review items in cart
2. Click "Checkout (Cash on Delivery)"
3. Order is placed and saved to Firestore
4. Cart is cleared after successful order
5. Success message appears for 3 seconds

### Account Management
1. Click "My Account" tab
2. View your profile information
3. Access order history, wishlist, and support

## Features

### Real-time Updates
- Products and deals update instantly from Firestore
- Cart persists in browser localStorage
- Search results update as you type

### Search & Filter
- Search by product name or description
- Filter by category
- Combine search and category filters
- Clear search to see all products

### Cart Management
- Add multiple quantities of same product
- Adjust quantities anytime
- Remove items individually
- View running total

### Order Placement
- Cash on Delivery payment method
- Orders saved to Firestore
- Order includes:
  - User information
  - All cart items
  - Total amount
  - Timestamp
  - Status (pending)

## Data Storage

### Cart Storage
- Cart saved to browser localStorage
- Persists across page refreshes
- Cleared after successful checkout

### Orders
- Stored in Firestore `orders` collection
- Includes user details, items, total, and timestamp
- Can be viewed in order history

## Responsive Design
- Fully responsive on mobile, tablet, and desktop
- Touch-friendly buttons and controls
- Optimized cart sidebar for all screen sizes
- Mobile-optimized search and category filters

## Technical Details

### Components Used
- SearchBar: Product search with category filter
- CategoryFilter: Browse by category
- UserDashboard: Main shopping interface

### Firestore Collections
- `products`: All available products
- `bestDeals`: Flash deals
- `orders`: Customer orders

### Local Storage
- `userCart`: Shopping cart items

## Tips
- Use search for quick product lookup
- Filter by category to browse specific items
- Add multiple items before checkout
- Check cart total before placing order
- Orders are confirmed with success message
