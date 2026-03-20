# Tobi LiveProof Architecture

LiveProof is a social proof and widget-delivery platform for e-commerce websites. It helps online stores increase trust and conversion rates by showing real-time customer activity (e.g., current viewers, recent purchases, exit-intent offers).

## Components

1.  **Next.js Dashboard**:
    -   Where users (store owners) sign up, log in, and configure their widgets.
    -   Settings are stored in MongoDB (`User` model).
    -   API endpoints for managing campaigns, viewing analytics, and handling payments.

2.  **Tracking Script (`live.js`)**:
    -   A client-side JavaScript file served from the `/public` directory.
    -   Injects widgets (floating bubbles, popups, flash sale store) into the client's website.
    -   Communicates with the LiveProof API for configuration and tracking data.

3.  **Real-time Server (`server.js`)**:
    -   A custom Node.js server that runs Next.js and a WebSocket Server (`ws`).
    -   Tracks live counts of "Who is viewing this page" across all client websites using WebSocket on `/api/ws`.

4.  **Database (MongoDB)**:
    -   Stores user profiles, widget settings, campaign data, visitor history, and purchase events.
    -   Uses Mongoose for schema management.

## System Flow

1.  **Deployment**: Store owner embeds `<script src=".../live.js" data-key="YOUR_API_KEY"></script>`.
2.  **Initial Load**: `live.js` runs on the client's site, extracts `data-key`, and calls `/api/widgets/all` to fetch the user's configuration.
3.  **Widget Activation**: Based on settings, `live.js` initializes different widgets (e.g., WebSocket for viewers, API fetch for purchases).
4.  **Tracking**: `live.js` sends data back to `/api/track-visitor` and `/api/analytics` to record activity for the dashboard.
5.  **Payment**: Integrates with **SePay** for processing "Pro" and "Premium" plan upgrades.
