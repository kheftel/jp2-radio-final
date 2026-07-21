import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';

import App from './App';
import { PlaybackService } from './src/services/PlaybackService';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// Background playback service — powers Android Auto, lock screen, Bluetooth,
// and keeps the stream alive when the UI is closed.
TrackPlayer.registerPlaybackService(() => PlaybackService);
