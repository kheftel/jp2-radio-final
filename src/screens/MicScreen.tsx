import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  useAudioRecorder,
  useAudioPlayer,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  AudioPlayer,
  setAudioModeAsync,
  useAudioPlayerStatus,
} from "expo-audio";
import * as MailComposer from "expo-mail-composer";
import Header from "../components/Header";
import { Colors, Spacing, FontSizes, BorderRadius } from "../constants/theme";
import { Contact, AppConfig } from "../constants/config";

type RecordingState = "idle" | "recording" | "review";

/**
 * Custom hook wrapper for conditional audio player
 *
 * React hooks must be called unconditionally, but we only want a valid player
 * when we have a recording URI. This wrapper:
 * 1. Always calls useAudioPlayer (satisfies React rules)
 * 2. Returns null when no valid URI (satisfies safety requirement)
 */
// function useConditionalAudioPlayer(uri: string | null): AudioPlayer | null {
//   // Always call the hook with a valid string (empty string creates inactive player)
//   const audioPlayer = useAudioPlayer(uri || "");
//   // Only return usable player when we have a valid URI
//   return uri ? audioPlayer : null;
// }

export default function MicScreen() {
  const navigation = useNavigation<any>();
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio recorder hook
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY, (status) =>
    console.log("Recording status:", status),
  );

  // Audio player - null when no recording (safe conditional pattern)
  const player = useAudioPlayer(recordingUri);
  const playerStatus = useAudioPlayerStatus(player);
  const canPlayback = player !== null && recordingUri !== null;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      // Release player resources if available
      if (player && typeof player.remove === "function") {
        try {
          player.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Handle playback completion
  useEffect(() => {
    if (!canPlayback || !player) return;

    // Reset playing state when audio finishes
    if (!player.playing && isPlaying) {
      setIsPlaying(false);
    }
  }, [player?.playing, canPlayback, isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const { status } = await requestRecordingPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please allow microphone access to record messages.",
        );
        return;
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
      setRecordingState("recording");
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= AppConfig.maxRecordingDuration - 1) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Start recording error:", error);
      Alert.alert("Error", "Could not start recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      await recorder.stop();
      const uri = recorder.uri;
      console.log("uri: ", uri);
      if (uri) {
        setRecordingUri(uri);
        setRecordingState("review");
      } else {
        Alert.alert("Error", "Recording failed. Please try again.");
        setRecordingState("idle");
        setDuration(0);
      }
    } catch (error) {
      console.error("Stop recording error:", error);
      Alert.alert("Error", "Could not save recording. Please try again.");
      setRecordingState("idle");
      setDuration(0);
    }
  };

  const togglePlayback = async () => {
    // Guard against null player
    if (!canPlayback || !player) {
      Alert.alert("Error", "No recording available to play.");
      return;
    }

    try {
      if (player.playing) {
        player.pause();
        setIsPlaying(false);
      } else {
        player.seekTo(0);
        player.play();

        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Playback error:", error);
      Alert.alert("Error", "Could not play recording. Please try again.");
      setIsPlaying(false);
    }
  };

  const discardRecording = async () => {
    // Stop playback and release resources
    if (player && isPlaying) {
      try {
        player.pause();
      } catch (e) {
        // Ignore pause errors during discard
      }
    }

    // Release player resources if available
    if (player && typeof player.remove === "function") {
      try {
        player.remove();
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    setIsPlaying(false);
    setRecordingUri(null);
    setDuration(0);
    setRecordingState("idle");
  };

  const sendRecording = async () => {
    if (!recordingUri) {
      Alert.alert("Error", "No recording to send.");
      return;
    }

    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        "Email Not Available",
        "Please configure an email account on your device to send recordings.",
      );
      return;
    }

    try {
      await MailComposer.composeAsync({
        recipients: [Contact.email],
        subject: "JP2 Radio - Open Mic Submission",
        body: "Please find my voice message attached.\n\nSent from JP2 Radio App",
        attachments: [recordingUri],
      });
      await discardRecording();
    } catch (error) {
      console.error("Send recording error:", error);
      Alert.alert("Error", "Could not send recording. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.title}>Open Mic</Text>
        <Text style={styles.subtitle}>
          {recordingState === "idle" && "Share a message with JP2 Radio"}
          {recordingState === "recording" && "Recording..."}
          {recordingState === "review" && "Review your recording"}
        </Text>

        <View style={styles.buttonContainer}>
          {recordingState === "idle" && (
            <TouchableOpacity style={styles.micButton} onPress={startRecording}>
              <Ionicons name="mic" size={56} color={Colors.white} />
            </TouchableOpacity>
          )}
          {recordingState === "recording" && (
            <TouchableOpacity style={styles.micButton} onPress={stopRecording}>
              <Ionicons name="stop" size={48} color={Colors.white} />
            </TouchableOpacity>
          )}
          {recordingState === "review" && (
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={togglePlayback}
            >
              <Ionicons
                name={playerStatus.playing ? "pause" : "play"}
                size={32}
                color={Colors.white}
              />
            </TouchableOpacity>
          )}
        </View>

        {(recordingState === "recording" || recordingState === "review") && (
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>{formatTime(duration)}</Text>
            {recordingState === "recording" && (
              <Text style={styles.maxTime}>2:00 max</Text>
            )}
          </View>
        )}

        {recordingState === "idle" && (
          <Text style={styles.tapText}>Tap to record</Text>
        )}
        {recordingState === "recording" && (
          <TouchableOpacity onPress={discardRecording}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}

        {recordingState === "review" && (
          <View style={styles.reviewActions}>
            {playerStatus && (
              <>
                <Text style={styles.sendButtonText}>
                  Playing: {playerStatus.playing ? "Yes" : "No"}
                </Text>
                <Text style={styles.sendButtonText}>
                  Current Time: {playerStatus.currentTime}s
                </Text>
                <Text style={styles.sendButtonText}>
                  Duration: {playerStatus.duration}s
                </Text>
              </>
            )}
            <TouchableOpacity style={styles.sendButton} onPress={sendRecording}>
              <Text style={styles.sendButtonText}>Send to JP2 Radio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rerecordButton}
              onPress={discardRecording}
            >
              <Text style={styles.rerecordButtonText}>Re-record</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={discardRecording}>
              <Text style={styles.discardText}>Discard</Text>
            </TouchableOpacity>
          </View>
        )}

        {recordingState === "idle" && (
          <View style={styles.tipsBox}>
            <Text style={styles.tipsLabel}>TIPS</Text>
            <Text style={styles.tipsText}>
              • Find a quiet space{"\n"}• Speak clearly{"\n"}• Max 2 minutes
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, alignItems: "center", paddingTop: Spacing.xxl },
  title: {
    color: Colors.white,
    fontSize: FontSizes.title,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    marginBottom: Spacing.xxxl,
  },
  buttonContainer: { marginBottom: Spacing.xxl },
  micButton: {
    width: 140,
    height: 140,
    backgroundColor: Colors.primary,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewButton: {
    width: 80,
    height: 80,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  timerContainer: { alignItems: "center", marginBottom: Spacing.lg },
  timer: { color: Colors.white, fontSize: 32, fontWeight: "700" },
  maxTime: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginTop: 4,
  },
  tapText: { color: Colors.primary, fontSize: FontSizes.lg, fontWeight: "600" },
  cancelText: { color: Colors.textSecondary, fontSize: FontSizes.md },
  reviewActions: {
    width: "100%",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: "center",
  },
  sendButtonText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
  rerecordButton: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: "center",
  },
  rerecordButtonText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: "500",
  },
  discardText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    textAlign: "center",
    paddingTop: Spacing.md,
  },
  tipsBox: {
    marginTop: Spacing.xxxl,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    width: "80%",
  },
  tipsLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  tipsText: { color: Colors.textMuted, fontSize: FontSizes.sm, lineHeight: 22 },
});
