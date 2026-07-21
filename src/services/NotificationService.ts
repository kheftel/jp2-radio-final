import { OneSignal } from 'react-native-onesignal';
import { OneSignalConfig } from '../constants/config';

class NotificationService {
  private initialized: boolean = false;

  initialize() {
    if (this.initialized) return;
    
    // Skip if no App ID configured
    if (!OneSignalConfig.appId || OneSignalConfig.appId === 'YOUR_ONESIGNAL_APP_ID_HERE') {
      console.log('OneSignal: No App ID configured, skipping initialization');
      return;
    }

    try {
      // Initialize OneSignal
      OneSignal.initialize(OneSignalConfig.appId);

      // Request push notification permission
      OneSignal.Notifications.requestPermission(true);

      // Handle notification opened
      OneSignal.Notifications.addEventListener('click', (event: any) => {
        console.log('Notification clicked:', event);
        // Handle deep linking or navigation here if needed
      });

      this.initialized = true;
      console.log('OneSignal initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OneSignal:', error);
    }
  }

  // Set user tags for segmentation (e.g., location preference)
  setUserTag(key: string, value: string) {
    if (!this.initialized) return;
    OneSignal.User.addTag(key, value);
  }

  // Set preferred station for targeted notifications
  setPreferredStation(station: 'imperial-valley' | 'san-diego') {
    this.setUserTag('preferred_station', station);
  }

  // Opt out of notifications
  optOut() {
    if (!this.initialized) return;
    OneSignal.User.pushSubscription.optOut();
  }

  // Opt back in
  optIn() {
    if (!this.initialized) return;
    OneSignal.User.pushSubscription.optIn();
  }
}

export const notificationService = new NotificationService();
