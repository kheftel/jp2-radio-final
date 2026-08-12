module.exports = {
  expo: {
    name: "JP2 Radio",
    slug: "jp2-radio",
    version: "2.2.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#C72027",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.jacapps.jp2radio",
      infoPlist: {
        NSMicrophoneUsageDescription:
          "JP2 Radio needs microphone access to record voice messages.",
        UIBackgroundModes: [
          "audio",
          "remote-notification",
          "audio",
          "remote-notification",
        ],
        NSAppleMusicUsageDescription:
          "JP2 Radio uses CarPlay to stream Catholic radio in your vehicle.",
      },
      entitlements: {
        "com.apple.developer.carplay-audio": true,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#C72027",
      },
      package: "com.jacapps.jp2radio",
      permissions: [
        "RECORD_AUDIO",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "RECORD_AUDIO",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
      ],
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
    },
    web: {
      favicon: "./assets/icon.png",
    },
    plugins: [
      [
        "onesignal-expo-plugin",
        {
          mode: "development",
          iPhoneDeploymentTarget: "15.1",
        },
      ],
      [
        "expo-audio",
        {
          enableBackgroundPlayback: true,
          microphonePermission:
            "JP2 Radio needs microphone access to record voice messages.",
        },
      ],
      "./plugins/withAndroidAuto",
      "./plugins/withCarPlayScenes",
      [
        "expo-build-properties",
        {
          android: {
            newArchEnabled: false,
            edgeToEdgeEnabled: true,
            compileSdkVersion: 36,
            targetSdkVersion: 36,
            buildToolsVersion: "36.0.0",
          },
          ios: { newArchEnabled: true, deploymentTarget: "15.1" },
        },
      ],
    ],
    extra: {
      eas: {
        build: {
          experimental: {
            ios: {
              appExtensions: [
                {
                  targetName: "OneSignalNotificationServiceExtension",
                  bundleIdentifier:
                    "com.jacapps.jp2radio.OneSignalNotificationServiceExtension",
                  entitlements: {
                    "com.apple.security.application-groups": [
                      "group.com.jacapps.jp2radio.onesignal",
                    ],
                  },
                },
              ],
            },
          },
        },
        projectId: "f9a5ac79-feda-4ccd-878e-a3f1a1e06672",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/f9a5ac79-feda-4ccd-878e-a3f1a1e06672",
    },
  },
};
