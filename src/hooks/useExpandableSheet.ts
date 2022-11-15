import {useEffect} from "react";
import {BackHandler} from "react-native";
import {Gesture} from "react-native-gesture-handler";
import {Easing, useSharedValue, withTiming} from "react-native-reanimated";

type Heights = {
  collapsed: number;
  full: number;
};

type State = keyof Heights;

export const useExpandableSheet = (
  heights: Heights,
  initialHeight?: number,
) => {
  const state = useSharedValue<State>("collapsed");
  const height = useSharedValue(initialHeight ?? heights.collapsed);

  useEffect(() => {
    const backAction = () => {
      if (state.value === "full") {
        height.value = withTiming(
          heights.collapsed,
          {
            duration: 500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          },
          () => {
            state.value = "collapsed";
          },
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const gesture = Gesture.Pan()
    .onUpdate(e => {
      height.value = heights[state.value] - e.translationY;
      height.value = Math.min(heights.full, height.value);
      height.value = Math.max(heights.collapsed, height.value);
    })
    .onEnd(e => {
      const velocityThreshold = 3000;
      const heightThreshold = heights.full / 2;
      let newCollapsed = height.value < heightThreshold;
      if (Math.abs(e.velocityY) > velocityThreshold) {
        newCollapsed = e.velocityY > 0;
      }

      const duration =
        (Math.abs(height.value - heights[newCollapsed ? "collapsed" : "full"]) /
          heights.full) *
        500;
      height.value = withTiming(
        newCollapsed ? heights.collapsed : heights.full,
        {
          duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
        () => {
          state.value = newCollapsed ? "collapsed" : "full";
        },
      );
    });

  return {
    height,
    state,
    gesture,
  };
};
