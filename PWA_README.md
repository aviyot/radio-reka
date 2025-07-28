# רדיו רקע אמהרית - PWA

## מימוש PWA מלא

האפליקציה כוללת מימוש מלא של Progressive Web App (PWA) עם התכונות הבאות:

### תכונות PWA

1. **התקנה** - האפליקציה ניתנת להתקנה על מכשירים ניידים ודסקטופ
2. **עבודה אופליין** - תמיכה בעבודה ללא חיבור לאינטרנט
3. **עדכונים אוטומטיים** - עדכון האפליקציה ברקע
4. **שיתוף תוכן** - שיתוף קישורים בקלות
5. **מותאם לנייד** - עיצוב רספונסיבי מלא

### הגדרות נדרשות

#### 1. הרצת האפליקציה
```bash
npm install
npm run dev
```

#### 2. בדיקת PWA
בדפדפן:
- פתח DevTools → Application
- בדוק Lighthouse audit
- נסה התקנה על מכשיר נייד

### קבצים שנוצרו

1. **Service Worker** - `public/sw.js`
2. **Manifest** - `public/manifest.json`
3. **PWA Hook** - `hooks/usePWA.ts`
4. **רכיבי PWA**:
   - `components/PWAStatus.tsx` - סטטוס והודעות
   - `components/PWASettings.tsx` - הגדרות PWA
   - `components/ShareButton.tsx` - כפתור שיתוף
5. **API Routes**:
   - `app/api/subscribe/route.ts` - הרשמה להתראות
   - `app/api/push/route.ts` - שליחת התראות
6. **הגדרות**:
   - `browserconfig.xml` - הגדרות Windows
   - `sitemap.xml` - מפת האתר
   - `robots.txt` - הגדרות זחילה

### איך להשתמש

#### התקנה
1. גש לאתר במכשיר הנייד
2. הופיע banner התקנה או לחץ על כפתור "הוסף למסך הבית"
3. האפליקציה תותקן כאפליקציה מקומית

#### הגדרות
1. לחץ על כפתור ההגדרות (⚙️) בתחתית המסך
2. הצג מידע על האפליקציה
3. בדוק סטטוס התקנה

#### שיתוף
1. לחץ על כפתור השיתוף בתחתית האפליקציה
2. בחר איך לשתף (WhatsApp, Email, etc.)

### בדיקה

#### Chrome DevTools
1. פתח DevTools → Application
2. בדוק:
   - Service Workers
   - Manifest
   - Storage
   - Push Notifications

#### Lighthouse
הרץ Lighthouse audit לבדיקת ציון PWA:
```bash
npm run build
npm run start
```

### נקודות חשובות

1. **HTTPS נדרש** - PWA עובד רק עם HTTPS
2. **Service Worker** - מתעדכן אוטומטית
3. **אייקונים** - ודא שכל האייקונים קיימים ב-`public/img/icons/`
4. **מטא-תגים** - כל המטא-תגים מוגדרים ב-`layout.tsx`

### שיפורים עתידיים (אופציונלי)

1. **Push Notifications** - התראות על תכניות חדשות (דורש web-push)
2. **Background Sync** - סנכרון נתונים ברקע
3. **App Shortcuts** - קיצורי דרך במארז
4. **Share Target** - קבלת תוכן משותף מאפליקציות אחרות

### הערות

- **HTTPS נדרש** - PWA עובד רק עם HTTPS
- **Service Worker** - מתעדכן אוטומטית
- **אייקונים** - ודא שכל האייקונים קיימים ב-`public/img/icons/`
- **Push Notifications** - כרגע מבוטלות, ניתן להפעיל בעתיד

האפליקציה מוכנה לפרסום כ-PWA בסיסי ויעיל!
