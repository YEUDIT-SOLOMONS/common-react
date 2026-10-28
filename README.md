# common - ניהול ציוד צילום

צד לקוח ב-React + TypeScript לקהילת COMMON, קהילת צלמות שמשכירות ציוד צילום אחת לשנייה.
המערכת מציגה את קטלוג הציוד ומאפשרת להוסיף ולערוך פריטים. יש בה שני סוגי משתמשים עם הרשאות שונות.

## טכנולוגיות

| נושא | ספרייה | איפה בקוד |
|---|---|---|
| שפה | React 19 + TypeScript | כל הקבצים `.tsx` / `.ts`, והטיפוסים ב-`src/types.ts` |
| ניתוב | React Router | `src/App.tsx`, `ProtectedRoute`, `AdminRoute` |
| טפסים | React Hook Form | `ItemForm`, `AddressForm`, `LoginPage`, `RegisterPage` |
| קריאות לשרת | React Query | `src/hooks/useItems.ts`, `src/hooks/useCategories.ts` |
| מצב גלובלי | Context | `src/context/AuthContext.tsx` |

## הרצה

```bash
npm install
npm run dev
```

האתר עולה בכתובת `http://localhost:5173`. בזמן פיתוח, Vite מעביר כל בקשה ל-`/api` ול-`/img` לשרת
(ההגדרה ב-`vite.config.ts`), כך שהדפדפן רואה כתובת אחת ואין בעיות CORS.

## בענן

| חלק | איפה |
|---|---|
| לקוח (React) | Firebase Hosting - https://common-react.web.app |
| שרת (ASP.NET Core) | Google Cloud Run - `photorental-api` |
| מסד נתונים | Firebase Firestore |

ב-Firebase Hosting מוגדרת הפניה (`firebase.json`): כל בקשה ל-`/api` ול-`/img` עוברת לשרת ב-Cloud Run,
וכל כתובת אחרת מחזירה את `index.html` כדי ש-React Router יטפל בה. הפריסה: `deploy.cmd`.

## מבנה התיקיות

```
src/
  api/         פונקציות שפונות לשרת (fetch) - אחת לכל פעולה
  context/     AuthContext - המשתמשת המחוברת, התחברות, הרשמה ויציאה
  hooks/       Hooks של React Query, ו-usePermissions לבדיקת הרשאות
  components/  רכיבים לשימוש חוזר: כרטיס פריט, טופס פריט, סינון, טעינה, שגיאה
  pages/       עמוד לכל נתיב
  types.ts     הטיפוסים של כל המידע במערכת
```

## השרת - לאן הלקוח פונה

השרת הוא ASP.NET Core, והמידע נשמר ב-Firestore (Firebase). כל הבקשות עוברות דרך `apiRequest`
שב-`src/api/client.ts`. הפונקציה מצרפת את הטוקן, ממירה את התשובה ל-JSON, וזורקת שגיאה עם
ההודעה מהשרת אם משהו נכשל.

| פעולה | בקשה | נשלח | חוזר |
|---|---|---|---|
| הרשמה | `POST /api/auth/register` | שם, אימייל, טלפון, סיסמה, אישור תנאים | טוקן + פרטי המשתמשת |
| התחברות | `POST /api/auth/login` | אימייל וסיסמה | טוקן + פרטי המשתמשת |
| כל הפריטים | `GET /api/items` | - | מערך פריטים |
| הפריטים שלי | `GET /api/items?ownerId=` | - | מערך פריטים |
| פריט אחד | `GET /api/items/{id}` | - | פריט, כולל כל התמונות |
| הוספה | `POST /api/items` | שדות הטופס + מזהה הבעלים | הפריט שנוצר |
| עריכה | `PUT /api/items/{id}` | הפריט עם השדות המעודכנים | הפריט המעודכן |
| מחיקה | `DELETE /api/items/{id}` | - | - |
| כתובת | `PATCH /api/users/{id}/address` | רחוב, עיר, קומה, דירה | המשתמשת המעודכנת |
| קטגוריות | `GET /api/categories` | - | מערך קטגוריות |

## התחברות והרשאות

1. אחרי התחברות או הרשמה, השרת מחזיר **JWT**. הטוקן נשמר ב-localStorage ונשלח בכל בקשה
   בכותרת `Authorization: Bearer ...`.
2. `AuthContext` מחזיק את המשתמשת המחוברת ומעביר אותה לכל הרכיבים. בטעינת האתר הוא בודק
   שהטוקן לא פג. אם פג, הוא מתנתק.
3. `ProtectedRoute` מעביר משתמשת לא מחוברת למסך הכניסה. `AdminRoute` מעביר מי שאינה מנהלת
   חזרה לרשימה.
4. **שני סוגי משתמשים:**
   - **משתמשת רגילה** רואה את כל הציוד הציבורי ואת הציוד שלה, ועורכת ומוחקת רק פריטים שלה.
   - **מנהלת** יכולה לערוך כל פריט, ויש לה גם עמוד "ניהול" עם נתונים על כל הקטלוג.
5. את ההרשאות בודקים בשני מקומות. הלקוח (`usePermissions`) מסתיר כפתורים שאסור ללחוץ עליהם.
   השרת בודק שוב בכל בקשה, ומחזיר 403 אם אין הרשאה.

## איך המסך מתעדכן

- `useQuery` שומר את הרשימה בזיכרון (cache) לפי מפתח, למשל `['items']`.
- אחרי הוספה, עריכה או מחיקה, `useMutation` קורא ל-`invalidateQueries({ queryKey: ['items'] })`.
  React Query מסמן את הרשימות כישנות, טוען אותן מחדש, והמסך מתרנדר עם המידע החדש.
- חיפוש, סינון ומיון נעשים בצד הלקוח ב-`ItemList`, עם `useState` ו-`useMemo`, בלי פנייה לשרת.
