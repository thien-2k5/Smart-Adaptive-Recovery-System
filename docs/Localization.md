# Localization (i18n)

## Overview
The Smart Adaptive Recovery System (SARS) requires full bilingual support (Vietnamese and English). The UI must never contain hardcoded text.

---

## Frontend Implementation

We use `react-i18next` for managing translations in the React application.

### Setup
1. Translations are stored in JSON files under `src/i18n/locales/`:
   - `vi.json` (Default)
   - `en.json`
2. The language toggle is located in the global Header component.
3. Language preference is persisted in `localStorage` so it survives page reloads.

### Translation File Structure
JSON files are namespaced by page/component for maintainability:

```json
{
  "common": {
    "loading": "Đang tải...",
    "error": "Có lỗi xảy ra"
  },
  "nav": {
    "home": "Trang chủ",
    "myShipment": "Đơn hàng của tôi",
    "recoveryCenter": "Recovery Center",
    "helpCenter": "Trung tâm hỗ trợ"
  },
  "landing": {
    "heroTitle": "Smart Adaptive Recovery System (SARS)",
    "demoButton": "Tạo đơn hàng demo"
  }
}
```

### Usage in Components
Always use the `useTranslation` hook:

```tsx
import { useTranslation } from 'react-i18next';

export const MyComponent = () => {
  const { t } = useTranslation();
  return <button>{t('landing.demoButton')}</button>;
};
```

---

## Backend Implementation

While the frontend handles UI localization, the backend must support localized dynamic content (e.g., Help Center articles).

### Database Schema for Bilingual Content
For entities like `help_center_articles`, we store both languages in the same row:
- `title_vi`, `content_vi`
- `title_en`, `content_en`

### API Response
The API accepts an optional `lang` query parameter (defaults to `vi`). It returns the appropriate fields mapped to generic `title` and `content` properties in the DTO, so the frontend doesn't need conditional logic to render the data.
