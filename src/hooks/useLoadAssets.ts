import {useEffect, useState} from "react";
import TrackPlayer, {Capability} from "react-native-track-player";

export const useLoadAssets = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    async function run() {
      try {
        if (!loaded) {
          await TrackPlayer.setupPlayer();
          await TrackPlayer.updateOptions({
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
