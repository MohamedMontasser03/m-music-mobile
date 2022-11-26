import {useQuery} from "@tanstack/react-query";
import React from "react";
import {ActivityIndicator, FlatList, Text, View} from "react-native";
import {TileList} from "../components/ItemList/TileList";
import {Item, ItemSection} from "../schema/list";
import {serverUrl} from "../constants";
import {serverFetch} from "../utils/serverFetch";
import MainLayout from "../layouts";

type HomePageData = {
  continuation?: string;
  sections: ItemSection[];
};

const SearchResults = props => {
  const query = props.route.params?.query ?? "";
  const {data, isLoading, error} = useQuery(
    ["SearchResult", query],
    () => serverFetch<HomePageData>(`${serverUrl}/search?query=${query}`),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      keepPreviousData: false,
      retry: false,
    },
  );

  if (!query) {
    props.navigation.navigate("Home");
    return null;
  }

  return (
    <MainLayout>
      {isLoading ? (
        <ActivityIndicator
          style={{
            marginVertical: 12,
          }}
          size="large"
        />
      ) : error ? (
        <Text style={{color: "#ff0000"}}>{`Error: ${error}`}</Text>
      ) : (
        <FlatList
          data={data?.sections}
          renderItem={({item}) => (
            <TileList
              containerStyles={{marginTop: 12}}
              {...item}
              items={item.items as Item[]}
            />
          )}
          keyExtractor={item => item.title}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <View style={{height: 16}} />}
        />
      )}
    </MainLayout>
  );
};

export default SearchResults;
