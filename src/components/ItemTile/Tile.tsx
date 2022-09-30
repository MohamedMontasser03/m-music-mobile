import React from "react";
import {Image, StyleProp, Text, View, ViewStyle} from "react-native";
import {Item} from "../../schema/list";

type Props = {
  item: Item;
  containerStyles?: StyleProp<ViewStyle>;
};

export const Tile: React.FC<Props> = ({item, containerStyles}) => {
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
        elevation: 5,
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
            uri: item.thumbnails[0].url,
          }}
        />
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
