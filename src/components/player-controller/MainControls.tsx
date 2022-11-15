import React from "react";
import {usePlayerStore} from "../../app/track-player/playerStore";
import shallow from "zustand/shallow";
import {Text, View} from "react-native";
import layout from "../../constants/layout";
import Slider from "@react-native-community/slider";
import {formatTime} from "../../utils/time";
import {TouchableWithoutFeedback} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {PlaylistControls} from "./PlaylistControls";

export const MainControls: React.FC = () => {
  const {
    queue,
    currentTrack: idx,
    progress,
    isPlaying,
    actions: {
      setProgress,
      play,
      pause,
      playNext,
      playPrev,
      toggleLoop,
      toggleShuffle,
    },
    plaerOptions: {loop, shuffle},
  } = usePlayerStore(
    state => ({
      progress: state.progress,
      queue: state.queue,
      currentTrack: state.currentTrack,
      actions: state.actions,
      isPlaying: state.isPlaying,
      plaerOptions: state.playerOptions,
    }),
    shallow,
  );

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 40,
        height: "100%",
      }}>
      <View>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#000",
            marginBottom: 10,
            maxWidth: layout.width,
          }}>
          {queue[idx].title}
        </Text>
        <Text style={{fontSize: 16, color: "#000"}}>
          {queue[idx].authorName}
        </Text>
        <View
          style={{marginTop: 20, flexDirection: "row", alignItems: "center"}}>
          <Text
            style={{
              fontSize: 16,
              color: "#000",
            }}>
            {formatTime(progress, queue[idx].duration)}
          </Text>
          <View style={{flex: 1, alignItems: "center"}}>
            <View
              style={{
                transform: [{scaleX: 1.5}, {scaleY: 1.5}],
                width: `${100 / 1.5}%`,
              }}>
              <Slider
                style={{
                  height: 40,
                }}
                minimumTrackTintColor="#77f"
                thumbTintColor="#77f"
                maximumTrackTintColor="#000"
                value={progress}
                minimumValue={0}
                maximumValue={queue[idx].duration}
                onSlidingComplete={value => {
                  setProgress(value, true);
                }}
                onResponderGrant={() => true}
              />
            </View>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: "#000",
            }}>
            {formatTime(queue[idx].duration)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30,
          }}>
          <TouchableWithoutFeedback
            style={{marginRight: 20}}
            onPress={() => toggleShuffle()}>
            <Icon
              name={"shuffle-variant"}
              size={30}
              color={shuffle ? "#000" : "#888"}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => playPrev()}>
            <Icon name="skip-previous" size={45} color="#000" />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              isPlaying ? pause() : play();
            }}
            style={{
              marginHorizontal: 20,
              backgroundColor: "#ccc",
              padding: 5,
              borderRadius: 30,
            }}>
            <Icon name={isPlaying ? "pause" : "play"} size={50} color="#000" />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            disabled={idx === queue.length - 1 && loop === "none"}
            onPress={() => playNext()}>
            <Icon
              name="skip-next"
              size={45}
              color={
                idx === queue.length - 1 && loop === "none" ? "#ccc" : "#000"
              }
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={{marginLeft: 20}}
            onPress={() => toggleLoop()}>
            <Icon
              name={
                loop === "none"
                  ? "repeat-off"
                  : loop === "one"
                  ? "repeat-once"
                  : "repeat"
              }
              size={30}
              color="#000"
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
      <PlaylistControls />
    </View>
  );
};
