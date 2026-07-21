# JP2 Radio App

React Native (Expo SDK 55) app for JP2 Catholic Radio.

## Quick Start

```bash
npm install
npx expo start
```

## Build for App Store

```bash
eas build --platform ios
```

See `DEPLOYMENT_GUIDE.md` for complete instructions.

## Configuration

Edit `src/constants/config.ts` to update:

### Banner URLs
Currently using your existing panel200.xml and panel100.xml.
When you create new banner folders (1080x810, 1080x360), uncomment the new URLs.

### OneSignal
Replace `YOUR_ONESIGNAL_APP_ID_HERE` with your OneSignal App ID.

### Bundle ID
If your existing App Store app uses a different bundle ID, update it in `app.json`.

## Features

- ✅ Live streaming (Imperial Valley & San Diego)
- ✅ CarPlay support
- ✅ Banner rotators (fetched from server)
- ✅ Blog RSS feed
- ✅ Push notifications (OneSignal)
- ✅ Voice recording (Mic)
- ✅ Sleep timer
- ✅ Program schedule
- ✅ Donate, Connect, Events, Podcasts, YouTube

## Project Structure

```
jp2-radio/
├── App.tsx                 # Main app with navigation
├── app.json                # Expo config (bundle ID, permissions)
├── src/
│   ├── constants/
│   │   ├── config.ts       # URLs, streams, OneSignal config
│   │   └── theme.ts        # Colors, spacing
│   ├── screens/            # All app screens
│   └── services/
│       ├── BannerService.ts      # Fetches banner XML
│       ├── BlogService.ts        # Fetches RSS feed
│       ├── CarPlayService.ts     # CarPlay integration
│       └── NotificationService.ts # OneSignal push
├── assets/
│   └── icon.png            # App icon (1024x1024)
└── DEPLOYMENT_GUIDE.md     # Full build instructions
```

## Support

Questions? Contact info@jp2radio.com
