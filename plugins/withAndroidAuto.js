/**
 * Expo config plugin: Android Auto support.
 *
 * Does three things at prebuild time:
 *  1. Writes res/xml/automotive_app_desc.xml (declares this as a "media" car app)
 *  2. Adds <meta-data com.google.android.gms.car.application> to the manifest
 *  3. Ensures react-native-track-player's MusicService is exported with the
 *     MediaBrowserService intent-filter so Android Auto can bind to it
 *
 * If Android Auto ever needs to be disabled, just remove "./plugins/withAndroidAuto"
 * from app.json plugins — the phone app is unaffected.
 */
const { withAndroidManifest, withDangerousMod, AndroidConfig } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const AUTOMOTIVE_DESC = `<?xml version="1.0" encoding="utf-8"?>
<automotiveApp>
    <uses name="media"/>
</automotiveApp>
`;

// 1) Write res/xml/automotive_app_desc.xml
function withAutomotiveDescriptor(config) {
  return withDangerousMod(config, [
    'android',
    async (cfg) => {
      const xmlDir = path.join(cfg.modRequest.platformProjectRoot, 'app/src/main/res/xml');
      fs.mkdirSync(xmlDir, { recursive: true });
      fs.writeFileSync(path.join(xmlDir, 'automotive_app_desc.xml'), AUTOMOTIVE_DESC);
      return cfg;
    },
  ]);
}

// 2) + 3) Manifest entries
function withAutoManifest(config) {
  return withAndroidManifest(config, (cfg) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(cfg.modResults);

    // meta-data: declare the car app descriptor
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      app,
      'com.google.android.gms.car.application',
      '@xml/automotive_app_desc',
      'resource'
    );

    // Ensure the RNTP playback service is visible to Android Auto.
    // tools:node="merge" folds this into the service the library declares.
    const manifest = cfg.modResults.manifest;
    manifest.$ = manifest.$ || {};
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }
    app.service = app.service || [];
    const svcName = 'com.doublesymmetry.trackplayer.service.MusicService';
    const existing = app.service.find((s) => s.$ && s.$['android:name'] === svcName);
    const serviceEntry = existing || { $: { 'android:name': svcName } };
    serviceEntry.$['android:exported'] = 'true';
    serviceEntry.$['tools:node'] = 'merge';
    serviceEntry.$['android:foregroundServiceType'] = 'mediaPlayback';
    serviceEntry['intent-filter'] = serviceEntry['intent-filter'] || [];
    const hasBrowserIF = serviceEntry['intent-filter'].some(
      (f) =>
        f.action &&
        f.action.some((a) => a.$ && a.$['android:name'] === 'android.media.browse.MediaBrowserService')
    );
    if (!hasBrowserIF) {
      serviceEntry['intent-filter'].push({
        action: [{ $: { 'android:name': 'android.media.browse.MediaBrowserService' } }],
      });
    }
    if (!existing) app.service.push(serviceEntry);

    return cfg;
  });
}

module.exports = function withAndroidAuto(config) {
  config = withAutomotiveDescriptor(config);
  config = withAutoManifest(config);
  return config;
};
