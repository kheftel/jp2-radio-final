# JP2 Radio App v2.1.0 — Build & Deployment Guide

Complete step-by-step instructions for building and deploying the JP2 Radio app update.

---

## OVERVIEW

**App Version:** 2.1.0  
**Bundle ID (iOS):** `com.jacapps.jp2radio`  
**Package Name (Android):** `com.jacapps.jp2radio`  
**OneSignal App ID:** `695e4a88-67c8-454f-b969-5f61fd18ff25` (already configured)

**What's New in This Version:**
- Push notifications (OneSignal)
- New banner system (1080×540 hero, 1080×270 sponsor)
- Improved background audio playback
- Sleep timer with countdown
- CarPlay support
- Voice message recording
- San Diego stream added

---

## IMPORTANT NOTES

### This is an UPDATE to the Existing App
- Same App Store listing, same bundle ID
- Users will receive this as an update, not a new app
- All existing entitlements (CarPlay, push) carry over

### CarPlay & Push Notifications
These features **do not work in Expo Go**. You must build with EAS Build to test them.

---

## PART 1: ONE-TIME SETUP (Skip if already done)

### Step 1: Install Required Software

#### On Mac (Required for iOS builds):

**1. Install Xcode**
- Open Mac App Store: https://apps.apple.com/us/app/xcode/id497799835
- Click "Get" → "Install"
- Wait 30-60 minutes for download
- After installing, open Xcode once and accept the license agreement
- Install Command Line Tools:
  ```
  xcode-select --install
  ```

**2. Install Node.js**
- Go to: https://nodejs.org/en/download/
- Click the green "LTS" button (recommended version)
- Run the downloaded installer
- Click "Continue" through all steps
- Verify installation — open Terminal and type:
  ```
  node --version
  ```
  Should show something like `v20.x.x`

**3. Install EAS CLI**
- Open Terminal (Finder → Applications → Utilities → Terminal)
- Run:
  ```
  npm install -g eas-cli
  ```

**4. Install Transporter (for uploading to App Store)**
- Open Mac App Store
- Search "Transporter"
- Install the free app by Apple: https://apps.apple.com/us/app/transporter/id1450874784

#### On Windows (Android only):

**1. Install Node.js**
- Go to: https://nodejs.org/en/download/
- Download Windows Installer (.msi)
- Run installer, accept defaults

**2. Install EAS CLI**
- Open Command Prompt (search "cmd" in Start menu)
- Run:
  ```
  npm install -g eas-cli
  ```

---

### Step 2: Create/Login to Expo Account

**Create Account (if you don't have one):**
1. Go to: https://expo.dev/signup
2. Create account with email
3. Verify your email

**Login:**
1. Open Terminal (Mac) or Command Prompt (Windows)
2. Run:
   ```
   eas login
   ```
3. Enter your Expo username and password

---

### Step 3: Verify Apple Developer Access

1. Go to: https://developer.apple.com/account
2. Sign in with the Apple ID that owns the JP2 Radio app
3. Confirm you see "ST. JPII EDUCATIONAL MEDIA, INC." as the team
4. Note the **Team ID**: `VRQ8R34TWQ`

---

## PART 2: PROJECT SETUP

### Step 4: Download and Unzip Project

1. Download the `jp2-radio.zip` file
2. Unzip to a folder (e.g., Desktop or Documents)
3. You should see a `jp2-radio` folder containing:
   ```
   jp2-radio/
   ├── App.tsx
   ├── app.json
   ├── package.json
   ├── google-services.json    ← Android push config
   ├── src/
   ├── assets/
   └── ...
   ```

---

### Step 5: Open Terminal in Project Folder

**Mac:**
1. Open Terminal
2. Type `cd ` (with a space after)
3. Drag the `jp2-radio` folder into Terminal
4. Press Enter
5. Verify with `ls` — you should see App.tsx, app.json, etc.

**Windows:**
1. Open the `jp2-radio` folder in File Explorer
2. Click the address bar
3. Type `cmd` and press Enter
4. Command Prompt opens in that folder

---

### Step 6: Install Dependencies

Run:
```
npm install
```

Wait 1-2 minutes. You'll see some warnings — that's normal. As long as it doesn't say "error", you're good.

---

### Step 7: Clean Prebuild (Required for Plugin Changes)

Run:
```
npx expo prebuild --clean
```

This generates fresh iOS/Android native folders with:
- Background playback enabled
- OneSignal push notifications
- CarPlay entitlement

**If asked about overwriting:** Type `y` and press Enter.

---

## PART 3: BUILD THE APP

### Step 8: Configure EAS (First Time Only)

Run:
```
eas build:configure
```

If asked questions:
- Platform: Select "All"
- It will create/update `eas.json`

---

### Step 9: Build for iOS

Run:
```
eas build --platform ios
```

**Prompts you may see:**

1. **"Would you like to create a new project?"**
   - Select: Use existing (if JP2 Radio exists) or Create new

2. **"Log in to your Apple Developer account"**
   - Enter your Apple ID email
   - Enter your password
   - If 2FA: Enter the code from your phone

3. **"Select a team"**
   - Choose: ST. JPII EDUCATIONAL MEDIA, INC.

4. **"Would you like to set up Push Notifications?"**
   - Select: Yes

5. **"How would you like to manage credentials?"**
   - Select: "Let Expo handle it" (easiest)

6. **Build starts** — you'll see:
   ```
   Build started. Waiting...
   ```
   
7. **Wait 15-30 minutes**

8. **When complete**, you get a URL like:
   ```
   https://expo.dev/artifacts/eas/xxxxx.ipa
   ```
   
**Download and save the `.ipa` file!**

---

### Step 10: Build for Android

Run:
```
eas build --platform android
```

Similar process, but simpler (no Apple credentials needed).

When complete, download the `.aab` file.

---

## PART 4: UPLOAD TO TEST

### Step 11: Upload iOS to TestFlight

**Using Transporter (Recommended):**

1. Open **Transporter** app on your Mac
2. Sign in with Apple ID (same one as developer account)
3. Click the **+** or drag the `.ipa` file into the window
4. Click **Deliver**
5. Wait 5-10 minutes for upload

**After Upload:**

1. Go to: https://appstoreconnect.apple.com
2. Sign in
3. Click **My Apps** → **JP2 Radio**
4. Click **TestFlight** tab
5. Wait 10-15 minutes — build appears under "iOS Builds"
6. Click on the build number
7. Answer **Export Compliance**: 
   - "Does this app use encryption?" → **No** (our app doesn't use custom encryption)
8. Build status changes to "Ready to Test"

---

### Step 12: Add Testers to TestFlight

1. In App Store Connect → TestFlight
2. Click **Internal Testing** or **External Testing**
3. Add tester emails (Raul's email, your email)
4. Testers receive email invitation
5. They install **TestFlight** app from App Store: https://apps.apple.com/us/app/testflight/id899247664
6. Open TestFlight → Install JP2 Radio

---

### Step 13: Upload Android to Google Play

1. Go to: https://play.google.com/console
2. Sign in
3. Select **JP2 Radio** app
4. Go to **Testing** → **Internal testing** (or **Closed testing**)
5. Click **Create new release**
6. Upload the `.aab` file
7. Add release notes
8. Click **Review release** → **Start rollout**

---

## PART 5: TEST CHECKLIST

Before submitting to stores, test everything:

### Streaming
- [ ] Imperial Valley stream plays
- [ ] San Diego stream plays  
- [ ] Stream switching works
- [ ] Play/pause works
- [ ] Volume slider works
- [ ] **Background playback**: Lock phone, stream keeps playing
- [ ] **Lock screen controls**: Play/pause from lock screen

### Sleep Timer
- [ ] Timer sets correctly (15/30/60 min)
- [ ] Countdown displays
- [ ] Cancel button works
- [ ] Stream stops when timer ends

### Voice Message (Mic)
- [ ] Recording starts
- [ ] Playback preview works
- [ ] Email opens with attachment
- [ ] Email goes to info@jp2radio.com

### Banners
- [ ] Hero banner loads (top, large)
- [ ] Sponsor banner loads (bottom, small)
- [ ] Banners rotate every 5 seconds
- [ ] Tap opens link (if configured)

### Navigation
- [ ] Schedule loads for both stations
- [ ] Blog feed loads articles
- [ ] Donate opens donation page
- [ ] Events opens events page
- [ ] Podcasts opens podcasts page
- [ ] YouTube opens channel

### Connect Screen
- [ ] Call button dials 888-388-8821
- [ ] Email opens mail to info@jp2radio.com
- [ ] Text opens SMS to 888-388-8821
- [ ] Facebook opens correct page
- [ ] Instagram opens correct page
- [ ] YouTube opens correct page

### Push Notifications
1. Go to: https://dashboard.onesignal.com
2. Sign in
3. Select JP2 Radio app
4. Click **Messages** → **New Push**
5. Send test notification
6. [ ] Notification appears on test device

### CarPlay (if available)
- [ ] App appears in CarPlay
- [ ] Stream plays in car
- [ ] Play/pause works from car screen

### Visual
- [ ] App icon looks correct
- [ ] Splash screen shows JP2 logo on red
- [ ] Dark theme throughout

---

## PART 6: SUBMIT TO STORES

### Step 14: Submit iOS to App Store

1. Go to: https://appstoreconnect.apple.com
2. Click **My Apps** → **JP2 Radio**
3. In left sidebar, click the **+ Version** button (or existing draft)
4. Enter version: `2.1.0`
5. Fill in **What's New**:
   ```
   • Push notifications — stay updated with JP2 Radio announcements
   • New San Diego stream (93.7 FM)
   • Improved streaming reliability and background playback
   • Sleep timer with countdown display
   • New rotating banner system
   • Voice message feature — send us your thoughts
   • CarPlay support for in-vehicle listening
   • Bug fixes and performance improvements
   ```
6. Select the TestFlight build
7. Ensure screenshots are current (or update them)
8. Review all fields
9. Click **Add for Review** → **Submit to App Review**
10. Wait 24-48 hours

---

### Step 15: Submit Android to Google Play

1. Go to: https://play.google.com/console
2. Select **JP2 Radio**
3. Go to **Production** → **Create new release**
4. Upload the `.aab` file (if not already done from testing)
5. Add release notes (same as iOS)
6. Click **Review release**
7. Click **Start rollout to Production**
8. Usually approved within hours

---

## TROUBLESHOOTING

### "npm install fails with ERESOLVE / peer dependency error"
The project includes an `.npmrc` file that handles this automatically.
If you still see the error, run:
```
npm install --legacy-peer-deps
```
(Cause: the CarPlay library declares React 17/18 support but Expo SDK 55 uses React 19. The library works fine — npm is just being strict.)

### "Command not found: eas"
```
npm install -g eas-cli
```
Then close and reopen Terminal.

### "Apple login failed"
- Check credentials at https://developer.apple.com
- Ensure 2FA code is entered quickly
- Try: `eas logout` then `eas login`

### "Build failed"
1. Check the error message in Expo dashboard
2. Common fixes:
   ```
   rm -rf node_modules
   npm install
   npx expo prebuild --clean
   eas build --platform ios --clear-cache
   ```

### "App not appearing in TestFlight"
- Wait 15 minutes after upload
- Check App Store Connect → TestFlight → Processing
- Ensure Export Compliance is answered

### "Push notifications not working"
1. Verify OneSignal dashboard shows the app
2. Check that APNs certificate was uploaded
3. On device: Settings → Notifications → JP2 Radio → Allow

### "CarPlay not showing"
- Only works on real build (not Expo Go)
- Car must support CarPlay
- Try: Disconnect/reconnect phone

---

## KEY LINKS

| Resource | URL |
|----------|-----|
| Expo Dashboard | https://expo.dev |
| App Store Connect | https://appstoreconnect.apple.com |
| Apple Developer | https://developer.apple.com |
| Google Play Console | https://play.google.com/console |
| OneSignal Dashboard | https://dashboard.onesignal.com |
| Firebase Console | https://console.firebase.google.com |
| Node.js Download | https://nodejs.org |
| Xcode (Mac App Store) | https://apps.apple.com/us/app/xcode/id497799835 |
| Transporter (Mac App Store) | https://apps.apple.com/us/app/transporter/id1450874784 |
| TestFlight (iOS App Store) | https://apps.apple.com/us/app/testflight/id899247664 |

---

## KEY CREDENTIALS (Keep Secure)

| Item | Value |
|------|-------|
| Bundle ID (iOS) | `com.jacapps.jp2radio` |
| Package Name (Android) | `com.jacapps.jp2radio` |
| Apple Team ID | `VRQ8R34TWQ` |
| OneSignal App ID | `695e4a88-67c8-454f-b969-5f61fd18ff25` |
| APNs Key ID | `U67CGUK5NJ` |

**Files to Keep Safe:**
- `AuthKey_U67CGUK5NJ.p8` (Apple push key — cannot re-download)
- Firebase service account JSON (for OneSignal Android)

---

## CONTACTS

| Who | For What |
|-----|----------|
| Raul | App content, banners, schedule questions |
| Apple Developer Support | https://developer.apple.com/contact |
| Google Play Support | https://support.google.com/googleplay/android-developer |
| Expo Support | https://expo.dev/contact |
| OneSignal Support | https://onesignal.com/contact |

---

## ESTIMATED TIME

| Task | Time |
|------|------|
| Setup (first time) | 1-2 hours |
| npm install + prebuild | 5 minutes |
| iOS build | 15-30 minutes |
| Android build | 10-20 minutes |
| Upload to TestFlight | 10 minutes |
| TestFlight processing | 10-15 minutes |
| Testing | 30-60 minutes |
| App Store review | 24-48 hours |
| Google Play review | 2-24 hours |

**Total (excluding reviews):** 2-3 hours

---

*Last updated: April 2026*
*App Version: 2.1.0*
