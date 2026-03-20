# Tobi LiveProof Localization (i18n)

LiveProof is built with multi-language support from the ground up, catering primarily to English and Vietnamese users.

## 1. Dashboard Localization (`next-intl`)
The Next.js dashboard uses the `next-intl` library to handle translations.
-   **Structure**: `messages/[locale].json` (e.g., `en.json`, `vi.json`).
-   **Routes**: `/en/*` and `/vi/*` via Next.js middleware.
-   **Keys**: Covers everything from navigation names to button labels and pricing table text.

## 2. Tracking Script Localization (`live.js`)
The embedded tracking script automatically detects the user's browser language to show widgets in the correct language.
-   **Detection**: `navigator.language.startsWith('vi') ? 'vi' : 'en'`.
-   **Strings**: A local `strings` object within `live.js` provides translations for:
    -   "people are viewing this page" (người đang xem trang này)
    -   "Someone just purchased" (Ai đó vừa mới mua)
    -   "Wait! Don't leave empty handed!" (Khoan đã! Đừng rời đi tay trắng!)
    -   "Welcome back!" (Chào mừng bạn quay lại!)
    -   And more...

## 3. Dynamic Content
-   `User` settings allow store owners to customize widget templates (e.g., "🔥 {count} people are viewing").
-   Owners can provide different templates for different regions or overwrite them in the dashboard settings.
