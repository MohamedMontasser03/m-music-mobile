import React, {useEffect} from "react";
import {View} from "react-native";
import {BottomTabBar, BottomTabBarProps} from "@react-navigation/bottom-tabs";
import {PlayerController} from "../player-controller/PlayerController";
import {GestureDetector} from "react-native-gesture-handler";
import layout from "../../constants/layout";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {usePlayerStore} from "../../app/track-player/playerStore";
import {useExpandableSheet} from "../../hooks/useExpandableSheet";

type Props = {
  tabBarProps: BottomTabBarProps;
};

export const controlsHeights = {
  collapsed: 70 as number,
  full: layout.height,
} as const;

export const TabBar: React.FC<Props> = ({tabBarProps}) => {
  const queue = usePlayerStore(state => state.queue);
  const {height, gesture} = useExpandableSheet(controlsHeights, 0);

  useEffect(() => {
    if (queue.length > 0 && height.value === 0) {
      height.value = withTiming(controlsHeights.collapsed, {
        duration: 300,
      });
    }
  }, [queue.length]);

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    marginTop: Math.min(controlsHeights.collapsed, height.value),
    transform: [
      {
        translateY: interpolate(
          height.value,
          [controlsHeights.collapsed, controlsHeights.full],
          [0, layout.tabBarHeight],
        ),
      },
    ],
  }));

  return (
    <View>
      {queue.length > 0 && (
        <GestureDetector gesture={gesture}>
          <PlayerController height={height} />
        </GestureDetector>
      )}
      <Animated.View style={[drawerAnimatedStyle]}>
        <BottomTabBar {...tabBarProps} />
      </Animated.View>
    </View>
  );
};
