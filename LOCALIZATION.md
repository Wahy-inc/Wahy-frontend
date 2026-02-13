# Localization Guide

## Overview
The app now has a complete localization system supporting English and Arabic. The language can be switched via the navbar dropdown.

## File Structure
- `/lib/localization/en.json` - English translations
- `/lib/localization/ar.json` - Arabic translations  
- `/lib/localization-context.tsx` - Language context and hook

## How to Use

### 1. In Components
Import the `useLocalization` hook and use the `t()` function:

```tsx
'use client'

import { useLocalization } from '@/lib/localization-context'

export default function MyComponent() {
  const { t } = useLocalization()
  
  return (
    <div>
      <h1>{t('lessons.title')}</h1>
      <button>{t('common.create')}</button>
    </div>
  )
}
```

### 2. Adding New Translations
1. Add the new text to both `en.json` and `ar.json`:

**en.json:**
```json
{
  "my_section": {
    "my_key": "English text here"
  }
}
```

**ar.json:**
```json
{
  "my_section": {
    "my_key": "النص العربي هنا"
  }
}
```

2. Use in component: `t('my_section.my_key')`

### 3. Key Features
- Language preference is saved in localStorage
- Page direction automatically changes (RTL for Arabic, LTR for English)
- Page language attribute is updated for SEO
- All text uses the `t()` function for consistency

## Translation Keys Structure

The translations are organized by feature/section:
- `navbar.*` - Navigation bar
- `common.*` - Common words (create, update, delete, etc.)
- `lessons.*` - Lessons section
- `schedules.*` - Schedules section  
- `students.*` - Students section
- `invoices.*` - Invoices section
- `profile.*` - Profile section
- `analytics.*` - Analytics section
- `library.*` - Library section
- `messages.*` - General messages

## Pages to Update
These pages still have hardcoded English text and should be updated to use localization:

1. `app/platform/dashboard/lessons/title_element.tsx`
2. `app/platform/dashboard/lessons/page.tsx`
3. `app/platform/dashboard/schedules/title_element.tsx`
4. `app/platform/dashboard/schedules/page.tsx`
5. `app/platform/dashboard/students/page.tsx`
6. `app/platform/dashboard/invoices/page.tsx`
7. `app/platform/dashboard/analytics/page.tsx`
8. `app/platform/dashboard/library/page.tsx`

## Example: Updating a Page

Before:
```tsx
<h1>Lessons</h1>
<button>Create Lesson</button>
<p>Loading lessons...</p>
```

After:
```tsx
import { useLocalization } from '@/lib/localization-context'

export default function Lessons() {
  const { t } = useLocalization()
  
  return (
    <div>
      <h1>{t('lessons.title')}</h1>
      <button>{t('lessons.create_lesson')}</button>
      <p>{t('lessons.loading_lessons')}</p>
    </div>
  )
}
```

## Current Status
✅ Localization system set up
✅ Language switching works in navbar
✅ Profile page partially updated
⏳ Other pages to be updated

## Testing
1. Open the app and change the language in the navbar
2. Verify that translated text appears
3. Check that page direction changes for Arabic
4. Verify language persists after page reload
