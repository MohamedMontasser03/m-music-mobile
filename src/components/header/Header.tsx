import {BottomTabHeaderProps} from "@react-navigation/bottom-tabs";
import React, {useEffect} from "react";
import {View, Text} from "react-native";
import {
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import IconEvil from "react-native-vector-icons/EvilIcons";
import create from "zustand";
import shallow from "zustand/shallow";

type Props = {
  headerProps: BottomTabHeaderProps;
  showSearch?: boolean;
};

type searchState = {
  query: string;
  setSearch: (search: string) => void;
  clearSearch: () => void;
};

export const useSearchStore = create<searchState>(set => ({
  query: "",
  setSearch: (query: string) => set({query}),
  clearSearch: () => set({query: ""}),
}));

export const Header: React.FC<Props> = ({headerProps, showSearch}) => {
  const [query, setQuery] = useSearchStore(
    state => [state.query, state.setSearch],
    shallow,
  );
  const inputRef = React.useRef<TextInput>(null);

  useEffect(() => {
    const unsubscribe = headerProps.navigation.addListener("state", e => {
      const state = e.data.state;
      if (state.routes[state.index].name === "SS") {
        // give time for rn to render the screen
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
      if (!["SS", "SR"].includes(state.routes[state.index].name)) {
        setQuery("");
      }
    });
    return unsubscribe;
  }, [headerProps.navigation]);

  return (
    <View
      style={{
        height: 56,
        width: headerProps.layout.width,
        backgroundColor: "white",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
      }}>
      {!showSearch ? (
        <Text style={{color: "black", fontSize: 20, fontWeight: "bold"}}>
          {headerProps.route.name}
        </Text>
      ) : (
        <View
          style={{
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 8,
            width: "100%",
            maxWidth: 300,
          }}>
          <TextInput
            ref={inputRef}
            returnKeyType="search"
            placeholder="Search"
            placeholderTextColor="#999"
            style={{
              flex: 1,
              height: 36,
              backgroundColor: "#f0f0f0",
              color: "black",
              paddingHorizontal: 12,
              paddingRight: 36,
            }}
            value={query}
            showSoftInputOnFocus={headerProps.route.name === "SS"}
            onChangeText={setQuery}
            onSubmitEditing={() => {
              if (headerProps.route.name === "SS" && query) {
                headerProps.navigation.navigate("SR", {query});
              }
            }}
            onFocus={() => {
              if (headerProps.route.name !== "SS") {
                headerProps.navigation.navigate("SS");
              }
            }}
          />
          {query && (
            <View
              style={{
                position: "absolute",
                right: 6,
                top: 6,
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setQuery("");
                }}>
                <IconEvil name="close" size={30} color="#000" />
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
      )}
      <TouchableWithoutFeedback
        style={{marginRight: 20}}
        onPress={() => {
          if (headerProps.route.name === "SS" && query) {
            headerProps.navigation.navigate("SR", {query});

            inputRef.current?.focus();
            return;
          }
          headerProps.navigation.navigate("SS");
        }}>
        <IconEvil name="search" size={30} color="#000" />
      </TouchableWithoutFeedback>
    </View>
  );
};
