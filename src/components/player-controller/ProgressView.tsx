import React from "react";
import {usePlayerStore} from "../../app/track-player/playerStore";
import shallow from "zustand/shallow";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

export const ProgressView: React.FC = () => {
  const {
    progress,
    queue,
    currentTrack: idx,
  } = usePlayerStore(
    state => ({
      progress: state.progress,
      queue: state.queue,
      currentTrack: state.currentTrack,
    }),
    shallow,
  );

  const scale = useDerivedValue(
    () => progress / queue[idx].duration,
    [progress],
  );

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: withTiming(`${scale.value * 100}%`, {
        duration: 1000,
      }),
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 4,
          backgroundColor: "#766",
        },
        animatedStyles,
      ]}
    />
  );
};
