import {useEffect, useState} from "react";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from "react-native-track-player";

export const useLoadAssets = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    async function run() {
      try {
        if (!loaded) {
          await TrackPlayer.setupPlayer();
          await TrackPlayer.updateOptions({
            alwaysPauseOnInterruption: true,
            progressUpdateEventInterval: 1, // seconds
            android: {
              appKilledPlaybackBehavior:
                AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
            },
            capabilities: [
              Capability.Play,
              Capability.Pause,
              Capability.SkipToNext,
              Capability.SkipToPrevious,
              Capability.SeekTo,
            ],
            compactCapabilities: [
              Capability.Play,
              Capability.Pause,
              Capability.SkipToNext,
              Capability.SkipToPrevious,
            ],
          });
        }
        setLoaded(true);
      } catch (err) {
        console.error(err);
        setLoaded(true);
      }
    }

    run();
  }, []);
  return loaded;
};
