import {useQuery} from "@tanstack/react-query";
import React from "react";
import {
  Image,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import TrackPlayer from "react-native-track-player";
import {serverUrl} from "../../constants";
import {Item} from "../../schema/list";
import {Track} from "../../schema/track";
import {selectThumb} from "../../utils/images";

type Props = {
  item: Item;
  containerStyles?: StyleProp<ViewStyle>;
};

export const Tile: React.FC<Props> = ({item, containerStyles}) => {
  const {refetch} = useQuery<Track>(
    ["track", item.id],
    async () => {
      const res = await fetch(`${serverUrl}/track?id=${item.id}`);
      return res.json();
    },
    {
      enabled: false,
      async onSuccess(data) {
        const urlObj = await fetch(`${serverUrl}/playback/audio?id=${item.id}`);
        const {url} = await urlObj.json();
        await TrackPlayer.add({
          url: `${serverUrl}/audio?url=${url}`,
          title: data?.title,
          artist: data?.authorName,
          artwork: data?.thumbnails[0].url,
          duration: data?.duration,
        });
        await TrackPlayer.play();
      },
    },
  );

  return (
    <View
      style={{
        ...(containerStyles as object),
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: 200,
      }}>
      <View>
        <Image
          style={{
            width: 200,
            height: 200,
            borderRadius: 8,
            marginTop: -16,
            marginLeft: -16,
            marginBottom: 8,
            backgroundColor: "#eee",
          }}
          resizeMode="cover"
          source={{
            uri: selectThumb(item.thumbnails, 200),
          }}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={async () => {
            refetch();
          }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#000",
              height: 40,
              marginBottom: 4,
            }}>
            {item.title}
          </Text>
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 14,
            fontWeight: "normal",
            color: "#000",
            height: 20,
          }}>
          {item.authorName}
        </Text>
      </View>
    </View>
  );
};
