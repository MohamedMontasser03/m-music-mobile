import {useInfiniteQuery} from "@tanstack/react-query";
import React from "react";
import {FlatList, StatusBar, Text, View} from "react-native";
import {TileList} from "../components/ItemList/TileList";
import {Tile} from "../components/ItemTile/Tile";
import {Item, Section} from "../schema/list";

const data = {
  type: "track" as "track",
  title: "Hello React Native! gjyfjyffjfmhfhyfmhfymf",
  id: "123",
  authorName: "John Doe",
  authorId: "456",
  thumbnails: [
    {
      url: "https://i.ytimg.com/vi/QtF5LmZUe9A/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAndn6ePGWWamL1F291r95gut9ujQ",
      width: 200,
      height: 300,
    },
  ],
};

const serverUrl = "http://192.168.1.4:3000";

const Home = () => {
  const {
    data: homeData,
    isLoading,
    error,
    fetchNextPage,
  } = useInfiniteQuery<{
    continuation: string;
    sections: Section[];
  }>(
    ["home"],
    async ({pageParam}) => {
      const res = await fetch(
        `${serverUrl}/home${pageParam ? `?ctoken=${pageParam}` : ""}`,
      );
      return res.json();
    },
    {
      getNextPageParam: lastPage => lastPage?.continuation,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      keepPreviousData: true,
      retry: false,
    },
  );

  return (
    <View>
      <StatusBar />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{`Error: ${error}`}</Text>
      ) : (
        <FlatList
          data={homeData?.pages.flatMap(page => page.sections)}
          renderItem={({item}) => (
            <TileList containerStyles={{marginTop: 12}} {...item} />
          )}
          keyExtractor={item => item.title}
          onEndReached={() => fetchNextPage()}
          onEndReachedThreshold={0.5}
          style={{paddingLeft: 16, marginBottom: 16}}
        />
      )}
    </View>
  );
};

export default Home;
