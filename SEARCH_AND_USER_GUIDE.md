# Search & User Profile Features

## Search Bar with Category Filter

### Features
- **Category Dropdown**: Hover over the category button on the left to see all categories
- **Search Input**: Type product names or descriptions to search
- **Smart Filtering**: Search results are filtered by both query and selected category
- **Real-time Results**: Instant search results as you type

### How to Use
1. Click on the category dropdown (left side of search bar)
2. Hover to see all available categories
3. Select a category or keep "All Categories" selected
4. Type your search query in the search input
5. Click the Search button or press Enter
6. Results will display below with matching products

### Categories Available
- 🛍️ All Categories
- 🔌 Gadgets & Accessories
- 👕 Fashion / Lifestyle
- 🐶 Pet Products
- 🏠 Home & Kitchen
- 💡 Trending Items

## User Profile Display

### When Logged In
- Username displays in the navbar (👤 Username)
- Username is extracted from:
  - User's display name (if set)
  - Email username (if display name not available)
  - Default "User" if neither available

### Logout Button
- Red logout button appears next to username
- Click to safely logout from the platform
- Returns to homepage

### Guest Mode
- If not logged in, shows Sign Up, Admin, and Continue as Guest buttons
- Users can browse as guests without logging in

## Technical Details

### Search Implementation
- Searches product name and description fields
- Case-insensitive matching
- Filters by category simultaneously
- Returns filtered results instantly

### User Display
- Uses Firebase authentication
- Displays user email or display name
- Logout uses Firebase signOut
- Responsive design for mobile devices

## Mobile Responsive
- Search bar adapts to smaller screens
- Category dropdown becomes full-width on mobile
- User profile stacks vertically on small devices
- All features remain functional on mobile
