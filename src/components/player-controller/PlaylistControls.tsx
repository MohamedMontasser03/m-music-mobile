import React from "react";
import {Image, Text, View} from "react-native";
import {
  FlatList,
  GestureDetector,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Animated, {useAnimatedStyle} from "react-native-reanimated";
import shallow from "zustand/shallow";
import {usePlayerStore} from "../../app/track-player/playerStore";
import layout from "../../constants/layout";
import {useExpandableSheet} from "../../hooks/useExpandableSheet";

const heights = {
  collapsed: 60,
  full: layout.fullHeight,
};

export const PlaylistControls: React.FC = () => {
  const {
    queue,
    idx,
    actions: {play},
  } = usePlayerStore(
    state => ({
      queue: state.queue,
      idx: state.currentTrack,
      actions: state.actions,
    }),
    shallow,
  );
  const {gesture, height} = useExpandableSheet(heights);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 60,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "#fff",
          },
          containerAnimatedStyle,
        ]}>
        <View
          style={{
            height: 60,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Text
            style={{
              fontSize: 20,
              color: "#000",
              fontWeight: "bold",
            }}>
            Playlist
          </Text>
        </View>
        <FlatList
          data={queue}
          removeClippedSubviews
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <View
              style={{
                marginHorizontal: 16,
              }}>
              <TouchableWithoutFeedback onPress={() => play(index)}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    marginBottom: 12,
                    borderRadius: 8,
                    height: 60,
                    backgroundColor: index === idx ? "#2299ee" : "#fff",
                  }}>
                  <Image
                    source={{uri: item.thumbnails[0].url}}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginRight: 16,
                    }}
                  />
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 20,
                      color: "#000",
                      fontWeight: "bold",
                      maxWidth: 250,
                    }}>
                    {item.title}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        />
      </Animated.View>
    </GestureDetector>
  );
};
