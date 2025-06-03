# Firebase Setup Guide

## 🎯 Quick Fix for Black Layout Issues

The black layout issues have been **FIXED** by temporarily removing the problematic ad placements. Your app should now work normally without any black bars or layout problems.

## 🔧 Next Steps: Complete Firebase Configuration

To complete your Firebase Analytics setup, you need to create a `.env` file with your actual Firebase credentials.

### 1. Create `.env` file in your project root:

```bash
# In media_manipulator_ui folder, create a file called .env
touch .env
```

### 2. Add your Firebase configuration to `.env`:

```env
VITE_FB_API_KEY=your-firebase-api-key
VITE_FB_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FB_PROJECT_ID=your-project-id
VITE_FB_STORAGE_BUCKET=your-project.appspot.com
VITE_FB_MESSAGING_SENDER_ID=123456789
VITE_FB_APP_ID=1:123456789:web:abcdef123456
VITE_FB_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Get your Firebase credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one if you haven't)
3. Click **Project Settings** (gear icon)
4. Scroll to **Your apps** section
5. If you haven't added a web app, click **Add app** and choose Web
6. Copy the `firebaseConfig` values and map them to your `.env` file:

```javascript
// From Firebase Console
const firebaseConfig = {
  apiKey: "AIza...",           // → VITE_FB_API_KEY
  authDomain: "project.firebaseapp.com",  // → VITE_FB_AUTH_DOMAIN
  projectId: "project-id",     // → VITE_FB_PROJECT_ID
  storageBucket: "project.appspot.com",   // → VITE_FB_STORAGE_BUCKET
  messagingSenderId: "123456789",         // → VITE_FB_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123",        // → VITE_FB_APP_ID
  measurementId: "G-ABC123XYZ"            // → VITE_FB_MEASUREMENT_ID
};
```

### 4. Verify `.env` is in `.gitignore`:

Make sure your `.gitignore` file includes:
```
.env
.env.local
.env.production
```

## 🎉 What's Fixed:

✅ **Black layout issues resolved** - Removed problematic ads
✅ **Google Analytics configured** - Using your measurement ID `G-6J910CMHRY`
✅ **AdSense placeholder handling** - Won't show broken ads with placeholder IDs
✅ **Environment variables setup** - Firebase config uses secure env vars

## 🚀 Testing Your Setup:

1. **Create your `.env` file** with real Firebase credentials
2. **Restart your dev server**: `npm run dev`
3. **Check browser console** for any Firebase errors
4. **Test file uploads** - Analytics events should now track properly

## 🔍 Verifying Analytics:

After setting up Firebase properly:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Analytics** → **Events**
3. Use your app (upload files, convert, etc.)
4. Check for real-time events in the Firebase dashboard

## 📞 Need Help?

If you see any errors after setting up the `.env` file:

1. **Check browser console** for Firebase errors
2. **Verify all environment variables** are correctly set
3. **Restart the development server** after changing `.env`
4. **Check Firebase project permissions** - make sure Analytics is enabled

---