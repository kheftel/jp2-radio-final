import { CarPlay, ListTemplate, NowPlayingTemplate } from 'react-native-carplay';
import { Streams } from '../constants/config';

type StreamType = typeof Streams.imperialValley;

interface CarPlayServiceCallbacks {
  onPlay: () => void;
  onPause: () => void;
  onStreamChange: (stream: StreamType) => void;
}

class CarPlayService {
  private isConnected: boolean = false;
  private callbacks: CarPlayServiceCallbacks | null = null;
  private currentStream: StreamType = Streams.imperialValley;

  initialize(callbacks: CarPlayServiceCallbacks) {
    this.callbacks = callbacks;

    try {
      // Listen for CarPlay connection
      CarPlay.registerOnConnect(() => {
        console.log('CarPlay connected');
        this.isConnected = true;
        this.setupCarPlayInterface();
      });

      CarPlay.registerOnDisconnect(() => {
        console.log('CarPlay disconnected');
        this.isConnected = false;
      });
    } catch (error) {
      console.log('CarPlay not available:', error);
    }
  }

  private setupCarPlayInterface() {
    try {
      // Create station list
      const stationListTemplate = new ListTemplate({
        title: 'JP2 Radio',
        sections: [
          {
            header: 'Stations',
            items: [
              {
                text: `${Streams.imperialValley.name}`,
                detailText: Streams.imperialValley.frequency,
              },
              {
                text: `${Streams.sanDiego.name}`,
                detailText: Streams.sanDiego.frequency,
              },
            ],
          },
        ],
        onItemSelect: async ({ index }: { index: number }) => {
          const streams = [Streams.imperialValley, Streams.sanDiego];
          this.selectStream(streams[index]);
        },
      });

      // Create Now Playing template
      const nowPlayingTemplate = new NowPlayingTemplate({
        albumArtistButtonEnabled: false,
        upNextButtonEnabled: false,
      });

      // Set the root template
      CarPlay.setRootTemplate(stationListTemplate);

      // Enable Now Playing
      CarPlay.enableNowPlaying(true);
    } catch (error) {
      console.log('Failed to setup CarPlay interface:', error);
    }
  }

  private selectStream(stream: StreamType) {
    this.currentStream = stream;
    if (this.callbacks) {
      this.callbacks.onStreamChange(stream);
      this.callbacks.onPlay();
    }
  }

  updateNowPlaying(showTitle?: string, isPlaying?: boolean) {
    // Now playing info is handled by the system media player
    // when using expo-av with proper metadata
  }

  setCurrentStream(stream: StreamType) {
    this.currentStream = stream;
  }

  cleanup() {
    this.callbacks = null;
  }
}

export const carPlayService = new CarPlayService();
