module.exports = {
  project: {},
  dependencies: {
    // Disable autolinking of react-native-carplay on Android
    // because it contains Kotlin code that is incompatible with RN 0.79
    "react-native-carplay": {
      platforms: {
        android: null,
      },
    },
  },
};
