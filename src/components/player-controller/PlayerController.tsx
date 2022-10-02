import React from "react";
import {Image, Text, TouchableWithoutFeedback, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {usePlayerStore} from "../../app/track-player/playerStore";

export const PlayerController: React.FC = () => {
  const {
    queue,
    currentTrack: idx,
    isPlaying,
    actions: {play, pause},
  } = usePlayerStore();
  if (!queue.length) return null;
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 15,
      }}>
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
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            flexGrow: 1,
          }}>
          <Image
            source={{uri: queue[idx].thumbnails[0].url}}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
          />
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
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}>
          <TouchableWithoutFeedback disabled={idx === 0}>
            <Icon
              name="skip-previous"
              size={30}
              color={idx === 0 ? "#ccc" : "#000"}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              isPlaying ? pause() : play();
            }}>
            <Icon name={isPlaying ? "pause" : "play"} size={30} color="#000" />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            disabled={idx === queue.length - 1}
            onPress={() => play(idx + 1)}>
            <Icon
              name="skip-next"
              size={30}
              color={idx === queue.length - 1 ? "#ccc" : "#000"}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={{height: 4, backgroundColor: "#766", width: 100 + "%"}} />
    </View>
  );
};
