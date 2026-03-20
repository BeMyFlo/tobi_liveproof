# Tobi LiveProof: How It Works Internally

This document explains the technical implementation of key business features.

## 🟢 Real-time "Viewers" Tracking

LiveProof uses a dedicated WebSocket implementation to count active page visitors.

1.  **WebSocket Server (`server.js`)**:
    -   Starts a `WebSocketServer` sharing the same port as the Next.js app.
    -   Handles connections on path `/api/ws`.
    -   Maintains a nested Map Structure: `connections: Map<apiKey, Map<pagePath, Set<WebSocket>>>`.
    -   When a new connection arrives, it increments the count for that `apiKey` and `pagePath`.
    -   It broadcasts an `update` message with the current `count` to all connected clients on the same page.
    -   On disconnect (`ws.on('close')`), it decrements the count and re-broadcasts.

2.  **Client-side (`live.js`)**:
    -   Connects to `wss://${baseUrl}/api/ws?key=${apiKey}&page=${window.location.pathname}`.
    -   Listens for `update` messages and updates the UI bubble text.
    -   Handles automatic reconnection if the socket drops.

## 👤 Visitor Tracking & Loyalty (Returning Users)

LiveProof tracks anonymous visitors using localized storage and server-side visitor logs.

1.  **Unique Identification**:
    -   `live.js` checks `localStorage` for `lp_vid`.
    -   If not found, it generates a random string (e.g., `vid_xyz...`) and sets it.
2.  **Tracking Loop**:
    -   Every page load, `live.js` sends a POST to `/api/track-visitor` with `key`, `visitorId`, and current `url`.
    -   The backend searches for a `Visitor` document by `visitorId` and `userId` (via API key).
    -   It updates `lastVisit`, increments `visitCount`, and adds the current URL to `recentPages`.
3.  **Returning User Trigger**:
    -   The API returns whether the user is returning (`isReturning: true`) and special triggers like `LONG_TIME_NO_SEE` (if it's been many days since the last visit).
    -   If a user is returning AND the "Loyalty" widget is enabled, `live.js` displays a personalized "Welcome back!" message.

## 💸 Payment Integration (SePay)

LiveProof uses **SePay** for automated bank transfer verification.

1.  **Creation**: When a user selects a plan, a `Payment` record is created in MongoDB with a unique `orderCode` and `memo`.
2.  **Memo Generation**: The `memo` is a unique string that the user must include in their bank transfer description.
3.  **Webhook / Manual Sync**: When SePay receives a payment with that memo, it notifies LiveProof (or LiveProof queries SePay), and the system updates the `User` plan to `pro` or `premium`.

## 🎨 Widget Rendering

-   `live.js` is built with vanilla JavaScript for zero-dependency embedding.
-   It uses `document.createElement('div')` to inject UI elements directly into the DOM of the host website.
-   Styles are applied using `element.style.cssText` or inline styles to avoid CSS conflicts with the parent site's stylesheets.
-   It uses `backdrop-filter: blur(10px)` for a modern "Glassmorphism" look.
