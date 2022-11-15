import {useInfiniteQuery} from "@tanstack/react-query";
import React, {useEffect, useState} from "react";
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

const Home = () => {
  const {
    data: homeData,
    isLoading,
    error,
    fetchNextPage,
  } = useInfiniteQuery(
    ["home"],
    ({pageParam}) =>
      serverFetch<HomePageData>(
        `${serverUrl}/home${pageParam ? `?ctoken=${pageParam}` : ""}`,
      ),
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
  const [gt, setGt] = useState("");
  useEffect(() => {
    fetch("https://www.google.com")
      .then(res => res.text())
      .then(setGt);
  }, []);

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
        <Text style={{color: "#ff0000"}}>{`Error: ${error} ${gt}`}</Text>
      ) : (
        <FlatList
          data={homeData?.pages.flatMap(page => page.sections)}
          renderItem={({item}) => (
            <TileList
              containerStyles={{marginTop: 12}}
              {...item}
              items={item.items as Item[]}
            />
          )}
          keyExtractor={item => item.title}
          onEndReached={() => fetchNextPage()}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            homeData?.pages[homeData?.pages.length - 1].continuation ? (
              <ActivityIndicator
                size="large"
                style={{
                  marginVertical: 12,
                }}
              />
            ) : (
              <View style={{height: 16}} />
            )
          }
        />
      )}
    </MainLayout>
  );
};

export default Home;
