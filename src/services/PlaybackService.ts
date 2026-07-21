import TrackPlayer, { Event } from 'react-native-track-player';

/**
 * PlaybackService — runs even when the app UI is closed.
 *
 * This is what Android Auto, CarPlay's system controls, the lock screen,
 * Bluetooth steering-wheel buttons, and headphone buttons talk to.
 * Registered in index.ts via TrackPlayer.registerPlaybackService.
 *
 * Station switching: the queue holds both stations (Imperial Valley,
 * San Diego), so "next/previous" in the car or on the lock screen hops
 * between them.
 */
export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    await TrackPlayer.skipToNext();
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    await TrackPlayer.skipToPrevious();
    TrackPlayer.play();
  });

  // Audio ducking (navigation prompts, phone calls): pause and resume.
  TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
    if (event.paused) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  });
}
