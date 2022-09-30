import React from "react";
import {
  FlatList,
  SectionList,
  StyleProp,
  Text,
  TextStyle,
  View,
} from "react-native";
import {Item, Section} from "../../schema/list";
import {Tile} from "../ItemTile/Tile";

type Props = Section & {
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
          }}>
          {title}
        </Text>
      </View>
      <FlatList
        data={items}
        horizontal
        renderItem={({item}) => (
          <Tile item={item as Item} containerStyles={{marginRight: 16}} />
        )}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
