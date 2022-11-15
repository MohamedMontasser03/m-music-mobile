import React from "react";
import {Text, TouchableWithoutFeedback, View} from "react-native";
import Animated, {interpolate, useAnimatedStyle} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {usePlayerStore} from "../../app/track-player/playerStore";
import layout from "../../constants/layout";
import {controlsHeights} from "../tab-bar/TabBar";
import {MainControls} from "./MainControls";
import {ProgressView} from "./ProgressView";

type Props = {
  height: Animated.SharedValue<number>;
};

export const PlayerController: React.FC<Props> = ({height}) => {
  const {
    queue,
    currentTrack: idx,
    isPlaying,
    playerOptions: {loop},
    actions: {play, pause, playNext, playPrev},
  } = usePlayerStore();

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      height.value,
      [controlsHeights.collapsed, controlsHeights.full],
      [controlsHeights.collapsed, layout.fullHeight],
    ),
    bottom: interpolate(
      height.value,
      [controlsHeights.collapsed, controlsHeights.full],
      [layout.tabBarHeight, 0],
    ),
  }));

  const collapsedFade = useAnimatedStyle(() => ({
    opacity: interpolate(
      height.value,
      [controlsHeights.collapsed, controlsHeights.full / 2],
      [1, 0],
    ),
  }));

  const fullScreenFade = useAnimatedStyle(() => ({
    opacity: interpolate(
      height.value,
      [controlsHeights.full / 2, controlsHeights.full],
      [0, 1],
    ),
    top: height.value / 2 + 20,
  }));

  const imageTransition = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          height.value,
          [controlsHeights.collapsed, controlsHeights.full],
          [10, layout.width / 2 - 20],
        ),
      },
      {
        translateY: interpolate(
          height.value,
          [controlsHeights.collapsed, controlsHeights.full],
          [
            (controlsHeights.collapsed - 40) / 2,
            controlsHeights.collapsed + 40 * 3,
          ],
        ),
      },
      {
        scale: interpolate(
          height.value,
          [controlsHeights.collapsed, controlsHeights.full],
          [1, 7],
        ),
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: layout.tabBarHeight,
          left: 0,
          right: 0,
          backgroundColor: "#ffddee",
        },
        containerAnimatedStyle,
      ]}>
      <Animated.Image
        source={{uri: queue[idx].thumbnails[0].url}}
        style={[
          {
            width: 40,
            height: 40,
            borderRadius: 20,
          },
          imageTransition,
        ]}
      />
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: height.value >= controlsHeights.collapsed ? 0 : undefined,
            top: height.value < controlsHeights.collapsed ? 0 : undefined,
            left: 0,
            right: 0,
            height: controlsHeights.collapsed,
          },
          collapsedFade,
        ]}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingHorizontal: 16,
          }}>
          <View
            style={{
              width: 40,
              height: 40,
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                marginLeft: 16,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#000",
                }}>
                {queue[idx].title}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontWeight: "normal",
                  color: "#000",
                }}>
                {queue[idx].authorName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}>
              <TouchableWithoutFeedback onPress={() => playPrev()}>
                <Icon name="skip-previous" size={30} color="#000" />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  isPlaying ? pause() : play();
                }}>
                <Icon
                  name={isPlaying ? "pause" : "play"}
                  size={30}
                  color="#000"
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                disabled={idx === queue.length - 1 && loop === "none"}
                onPress={() => playNext()}>
                <Icon
                  name="skip-next"
                  size={30}
                  color={
                    idx === queue.length - 1 && loop === "none"
                      ? "#ccc"
                      : "#000"
                  }
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
        <View>
          <ProgressView />
        </View>
      </Animated.View>
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          },
          fullScreenFade,
        ]}>
        <MainControls />
      </Animated.View>
    </Animated.View>
  );
};
