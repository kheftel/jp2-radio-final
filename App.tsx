import "react-native-gesture-handler"; // Must be first — required by React Navigation
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
// import TrackPlayer, {
//   Capability,
//   AppKilledPlaybackBehavior,
//   State,
//   Event,
//   useTrackPlayerEvents,
// } from "react-native-track-player";

import { Colors } from "./src/constants/theme";
import { Streams } from "./src/constants/config";
import { AudioContext, StreamType } from "./src/context/AudioContext";

import HomeScreen from "./src/screens/HomeScreen";
import MicScreen from "./src/screens/MicScreen";
import DonateScreen from "./src/screens/DonateScreen";
import ConnectScreen from "./src/screens/ConnectScreen";
import PlayerScreen from "./src/screens/PlayerScreen";
import ScheduleScreen from "./src/screens/ScheduleScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import MenuScreen from "./src/screens/MenuScreen";

// Services
import { notificationService } from "./src/services/NotificationService";
// import { carPlayService } from './src/services/CarPlayService';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// The queue holds both stations, in this order. Index in the queue ==
// index in this array, which is how we map RNTP's active track back to
// a stream. "Next/previous" in the car or lock screen hops stations.
const STREAM_LIST: StreamType[] = Object.values(Streams);

function streamToTrack(stream: StreamType) {
  return {
    id: stream.id,
    url: stream.url,
    title: stream.name,
    artist: "JP2 Radio",
    isLiveStream: true,
  };
}

/**
 * One-time player setup. Runs the native audio service with lock-screen /
 * Android Auto / CarPlay capabilities. Guarded so hot reloads don't
 * re-initialize.
 */
async function setupPlayer(): Promise<void> {
  try {
    // await TrackPlayer.setupPlayer({
    //   autoHandleInterruptions: true, // pause for calls, resume after
    // });
  } catch (err) {
    // "player has already been initialized" — safe to ignore on reload
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes("already been initialized")) throw err;
    return;
  }

  // await TrackPlayer.updateOptions({
  //   android: {
  //     // Keep the stream alive when the app is swiped away
  //     appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
  //   },
  //   capabilities: [
  //     Capability.Play,
  //     Capability.Pause,
  //     Capability.Stop,
  //     Capability.SkipToNext, // station hop in car / lock screen
  //     Capability.SkipToPrevious,
  //   ],
  //   compactCapabilities: [Capability.Play, Capability.Pause],
  // });

  // await TrackPlayer.add(STREAM_LIST.map(streamToTrack));
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 56,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Mic":
              iconName = focused ? "mic" : "mic-outline";
              break;
            case "Donate":
              iconName = focused ? "heart" : "heart-outline";
              break;
            case "Connect":
              iconName = focused ? "people" : "people-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mic" component={MicScreen} />
      <Tab.Screen name="Donate" component={DonateScreen} />
      <Tab.Screen name="Connect" component={ConnectScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStream, setCurrentStream] = useState<StreamType>(
    STREAM_LIST[0],
  );
  const [currentShow] = useState("JP2 Radio");
  const [streamError, setStreamError] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(1);
  const playerReady = useRef(false);

  // Initialize the audio engine once.
  useEffect(() => {
    setupPlayer()
      .then(() => {
        playerReady.current = true;
      })
      .catch((err) => {
        console.error("Player setup failed:", err);
        setStreamError("Audio player failed to start. Please restart the app.");
      });
  }, []);

  // Mirror the native player's real state into React state — single source
  // of truth. Fires for UI taps, lock screen, Android Auto, CarPlay alike.
  // useTrackPlayerEvents(
  //   [
  //     Event.PlaybackState,
  //     Event.PlaybackError,
  //     Event.PlaybackActiveTrackChanged,
  //   ],
  //   async (event) => {
  //     if (event.type === Event.PlaybackState) {
  //       const playing =
  //         event.state === State.Playing ||
  //         event.state === State.Buffering ||
  //         event.state === State.Loading;
  //       setIsPlaying(playing);
  //       if (event.state === State.Playing) setStreamError(null);
  //     } else if (event.type === Event.PlaybackError) {
  //       console.error("Playback error:", event);
  //       setStreamError("Stream unavailable. Check your connection.");
  //       setIsPlaying(false);
  //     } else if (event.type === Event.PlaybackActiveTrackChanged) {
  //       // Track changed from ANY surface (car, lock screen, our UI) —
  //       // keep the app's idea of the current station in sync.
  //       if (typeof event.index === "number" && STREAM_LIST[event.index]) {
  //         setCurrentStream(STREAM_LIST[event.index]);
  //       }
  //     }
  //   },
  // );

  const play = useCallback(() => {
    setStreamError(null);
    // TrackPlayer.play();
  }, []);

  const pause = useCallback(() => {
    // TrackPlayer.pause();
  }, []);

  const switchStream = useCallback(
    async (stream: StreamType) => {
      if (currentStream.id === stream.id) return;
      setStreamError(null);
      setCurrentStream(stream); // optimistic — event will confirm
      try {
        const index = STREAM_LIST.findIndex((s) => s.id === stream.id);
        if (index >= 0) {
          // await TrackPlayer.skip(index);
          // await TrackPlayer.play();
        }
      } catch (err) {
        console.error("Stream switch failed:", err);
        setStreamError("Could not switch stream. Please try again.");
      }
    },
    [currentStream],
  );

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    // TrackPlayer.setVolume(v);
  }, []);

  // Platform services: push notifications everywhere; CarPlay UI on iOS.
  // (Android Auto needs no JS service — RNTP's native media session drives it.)
  useEffect(() => {
    notificationService.initialize();

    // if (Platform.OS === 'ios') {
    //   carPlayService.initialize({ onPlay: play, onPause: pause, onStreamChange: switchStream });
    // }

    // return () => {
    //   if (Platform.OS === 'ios') carPlayService.cleanup();
    // };
  }, [play, pause, switchStream]);

  // Keep the iOS CarPlay Now Playing surface in sync.
  // useEffect(() => {
  //   if (Platform.OS === 'ios') {
  //     carPlayService.setCurrentStream(currentStream);
  //     carPlayService.updateNowPlaying(currentShow, isPlaying);
  //   }
  // }, [currentStream, currentShow, isPlaying]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentStream,
        currentShow,
        streamError,
        play,
        pause,
        switchStream,
        volume,
        setVolume,
      }}
    >
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="Player"
            component={PlayerScreen}
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen name="Schedule" component={ScheduleScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{
              presentation: "modal",
              animation: "slide_from_left",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioContext.Provider>
  );
}
