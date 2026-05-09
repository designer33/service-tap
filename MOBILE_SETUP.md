# 📱 ServiceTap Mobile APK Build Guide

This guide explains how to build the Android APK for ServiceTap using Capacitor.

## 🛠 Prerequisites

1. **Android Studio**: Install from [developer.android.com](https://developer.android.com/studio).
2. **Java 17**: Ensure you have JDK 17 installed.
3. **Node.js**: Already installed for the React app.

---

## 🚀 Step-by-Step Build Process

### 1. Build the Web Application
Capacitor requires a production build of your React app.
```bash
cd client
npm run build
```

### 2. Sync with Capacitor
Copy the build files into the Android project.
```bash
npx cap sync
```

### 3. Open in Android Studio
```bash
npx cap open android
```

### 4. Build the Signed APK
Inside Android Studio:
1. Go to **Build** > **Generate Signed Bundle / APK...**
2. Select **APK** and click **Next**.
3. Create a new key store if you don't have one (keep it safe!).
4. Select **Release** build variant.
5. Click **Finish**.

Your APK will be generated at: `android/app/release/app-release.apk`

---

## 🔧 Maintenance Commands

* **Update native code**: If you add new Capacitor plugins:
  ```bash
  npx cap update
  ```
* **Run on Emulator/Device directly**:
  ```bash
  npx cap run android
  ```

---

## 🎨 App Customization

### App Icon & Splash Screen
We use `@capacitor/assets` to generate these automatically.
1. Place your icon in `assets/icon.png` (1024x1024).
2. Place your splash in `assets/splash.png` (2732x2732).
3. Run:
   ```bash
   npx @capacitor/assets generate --android
   ```

---

## 📝 Best Practices for Mobile
* **API URLs**: Ensure your backend URL is accessible from the mobile device (not `localhost`). Update your `.env` or `axios` config to use a public IP or production domain.
* **Pull to Refresh**: Already supported by native webviews, but can be enhanced with custom logic.
* **Offline Handling**: Consider adding a "No Internet" banner for a better native feel.
