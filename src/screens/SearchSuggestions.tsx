import {useQuery} from "@tanstack/react-query";
import React, {useEffect} from "react";
import {Text, View} from "react-native";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import shallow from "zustand/shallow";
import {useSearchStore} from "../components/header/Header";
import {serverUrl} from "../constants";
import {serverFetch} from "../utils/serverFetch";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SearchSuggestions = props => {
  const [query, setQuery] = useSearchStore(
    state => [state.query, state.setSearch],
    shallow,
  );
  const {data: searchKeys, refetch} = useQuery(
    ["searchKeys", query],
    () =>
      serverFetch<string[]>(`${serverUrl}/get_search_suggestion`, {
        method: "POST",
        body: JSON.stringify({query: query}),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    {
      enabled: query !== "",
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <ScrollView>
      {searchKeys?.map(key => (
        <View
          key={key}
          style={{
            width: "100%",
            justifyContent: "space-between",
            paddingRight: 12,
            flexDirection: "row",
            alignItems: "center",
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              setQuery(key);
              props.navigation.navigate("SR", {query: key});
            }}>
            <Text
              style={{
                color: "black",
                fontSize: 16,
                fontWeight: "bold",
                padding: 12,
              }}>
              {key}
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setQuery(key);
            }}>
            <Icon name="content-copy" size={18} color="black" />
          </TouchableWithoutFeedback>
        </View>
      ))}
    </ScrollView>
  );
};

export default SearchSuggestions;
