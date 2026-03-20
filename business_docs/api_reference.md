# Tobi LiveProof API Reference

This document summarizes the internal API endpoints used by the dashboard and the `live.js` tracking script.

## 🟢 Internal Site Owner APIs (Protected by Auth)
These are used by the Next.js dashboard and usually require a valid session cookie.
-   `GET /api/user`: Get current user profile and widget settings.
-   `PATCH /api/user`: Update user profile or widget settings.
-   `GET /api/campaigns`: List all Flash Sale campaigns.
-   `POST /api/campaigns`: Create a new campaign.
-   `POST /api/payment/create`: Create a new SePay payment request.

## 🔵 Pixel/Tracking APIs (Open to Public)
These are called by the `live.js` script from client websites. They require an `apiKey`.

### 1. `GET /api/boot?key={apiKey}&widget={type}`
-   **Purpose**: Get settings for a specific widget.
-   **Returns**: `{ settings, plan }`.

### 2. `GET /api/widgets/all?key={apiKey}`
-   **Purpose**: Bootstrapping initialization of the tracking script.
-   **Returns**: All enabled widgets and active Flash Sale campaigns for the project.

### 3. `POST /api/analytics`
-   **Purpose**: Record widget interactions (view/click).
-   **Payload**: `{ apiKey, widgetType, eventType }`.

### 4. `POST /api/track-visitor`
-   **Purpose**: Record visitor activity and check for "Returning User" status.
-   **Payload**: `{ key, visitorId, url }`.
-   **Returns**: `{ isReturning, visitCount, specialTrigger }`.

### 5. `GET /api/purchases/latest?key={apiKey}`
-   **Purpose**: Fetch the most recent purchase to show "Someone recently bought..." notification.

### 6. `WS /api/ws?key={apiKey}&page={path}`
-   **Purpose**: Real-time "Viewers" count tracking.
-   **Operation**: Bidirectional communication for page-specific viewer updates.

## 🔴 Payment Hook (SePay)
-   **Endpoint**: `/api/payment/webhook` (or similar, depending on implementation).
-   **Purpose**: Receives payment confirmation from SePay to upgrade user plans.
