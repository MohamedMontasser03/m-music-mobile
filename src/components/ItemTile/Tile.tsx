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
import {serverUrl} from "../../constants";
import {Item} from "../../schema/list";
import {Track} from "../../schema/track";
import {selectThumb} from "../../utils/images";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {usePlayerStore} from "../../app/track-player/playerStore";

type Props = {
  item: Item;
  containerStyles?: StyleProp<ViewStyle>;
};

export const Tile: React.FC<Props> = ({item, containerStyles}) => {
  const setQueue = usePlayerStore(state => state.actions.setQueue);
  const pushTrack = usePlayerStore(state => state.actions.pushTrack);
  const {refetch} = useQuery<Track | Track[]>(
    ["track", item.id],
    async () => {
      const res = await fetch(
        `${serverUrl}/${item.type === "track" ? "track" : "track-list"}?id=${
          item.id
        }`,
      );
      return res.json();
    },
    {
      enabled: false,
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
      <View
        style={{
          position: "relative",
          marginTop: -16,
          marginLeft: -16,
        }}>
        <Image
          style={{
            width: 200,
            height: 200,
            borderRadius: 8,
            marginBottom: 8,
            backgroundColor: "#eee",
          }}
          resizeMode="cover"
          source={{
            uri: selectThumb(item.thumbnails, 200),
          }}
        />
        <TouchableOpacity
          onPress={async () => {
            refetch().then(async res => {
              "id" in (res.data ?? {})
                ? setQueue([res.data as Track])
                : setQueue(res.data as Track[]);
            });
          }}
          onLongPress={() => {
            refetch().then(res => {
              "id" in (res.data ?? {})
                ? pushTrack(res.data as Track)
                : pushTrack((res.data as Track[])[0]);
            });
          }}
          activeOpacity={0.8}
          style={{
            position: "absolute",
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#ff0000",
            justifyContent: "center",
            alignItems: "center",
            bottom: 16,
            right: -4,
          }}>
          <Icon name="play" size={20} />
        </TouchableOpacity>
      </View>
      <View>
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
