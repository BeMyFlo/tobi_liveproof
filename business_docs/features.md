# Tobi LiveProof Features & Business Value

LiveProof provides several features to increase conversions and customer engagement for e-commerce stores.

## Social Proof Widgets

### 1. **Live Viewers** (👁️)
-   **Business Value**: Increases urgency and shows product popularity.
-   **How it works**: Real-time count of active WebSocket connections on the same page path for a specific API Key.
-   **Customization**: Message template (e.g., "{count} người đang xem"), delay, and display duration.

### 2. **Recent Purchases** (🛒)
-   **Business Value**: Builds social proof by showing that others are buying.
-   **How it works**: Fetches the latest purchase events for a project's domain and displays them as a notification popup.
-   **Data Storage**: Purchase events are stored in the `Purchase` model.

### 3. **Exit-Intent Offers** (💡)
-   **Business Value**: Prevents customer churn by showing a discount or message when the user is about to leave.
-   **How it works**: Detects mouse movement towards the top of the browser window and shows a popup.
-   **Settings**: Support for discount codes, redirect URLs, and API-based reward delivery.

### 4. **Retention Popups** (💎)
-   **Business Value**: Rewards loyal customers who stay on the site for a certain period.
-   **How it works**: After a configurable delay (e.g., 30s), a popup with a discount code is shown to encourage checkout.

### 5. **Scarcity Alerts** (🔥)
-   **Business Value**: Creates fear of missing out (FOMO) by showing limited stock levels.
-   **How it works**: Shows a message (e.g., "Only 3 items left!") based on inventory levels (or simulated numbers).

### 6. **Loyalty / Returning User Welcome** (👋)
-   **Business Value**: Personalizes the shopping experience and makes returning customers feel valued.
-   **How it works**: Detects a returning visitor ID via `localStorage` and `visitor_id` in MongoDB. Shows a "Welcome back" message if it's been a while (Long Time No See trigger).

## Marketing & Sales Tools

### **Flash Sale Store** ⚡
-   **Feature**: A dedicated overlay store showing specific products with fixed countdown timers and discount codes.
-   **How it works**: Campaign-based (stored in `Campaign` model). Users can click a "Flash Sale" bubble to open a full-screen shop experience without leaving the current page.

### **URL Filtering** 🌐
-   **Feature**: Ability to show/hide widgets based on the current page URL.
-   **Use Case**: Only show "People are viewing" on product pages, not the homepage or contact page.

### **Analytics Dashboard** 📊
-   **Feature**: Visual charts showing "Views" and "Clicks" for each widget type, helping store owners measure the ROI of LiveProof.
