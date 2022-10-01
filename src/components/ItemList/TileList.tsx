import React from "react";
import {FlatList, StyleProp, Text, TextStyle, View} from "react-native";
import {ItemSection} from "../../schema/list";
import {Tile} from "../ItemTile/Tile";

type Props = ItemSection & {
  containerStyles?: StyleProp<TextStyle>;
};

export const TileList: React.FC<Props> = ({items, title, containerStyles}) => {
  return (
    <View style={containerStyles}>
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#000",
            height: 40,
            marginLeft: 16,
          }}>
          {title}
        </Text>
      </View>
      <FlatList
        data={items}
        horizontal
        renderItem={({item, index}) => (
          <Tile
            item={item}
            containerStyles={{
              marginRight: 16,
              marginLeft: index === 0 ? 16 : 0,
            }}
          />
        )}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
