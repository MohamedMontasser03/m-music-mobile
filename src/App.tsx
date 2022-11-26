import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import {useLoadAssets} from "./hooks/useLoadAssets";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import layout from "./constants/layout";

import {TabBar} from "./components/tab-bar/TabBar";
import SearchSuggestions from "./screens/SearchSuggestions";
import {Header} from "./components/header/Header";
import SearchResults from "./screens/SearchResults";

const TabNav = createBottomTabNavigator();
const queryClient = new QueryClient();

const App = () => {
  const loaded = useLoadAssets();

  if (!loaded) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
          <TabNav.Navigator
            initialRouteName="Home"
            tabBar={props => {
              return <TabBar tabBarProps={props} />;
            }}
            screenOptions={{
              tabBarStyle: {
                height: layout.tabBarHeight,
              },
              header(props) {
                return <Header headerProps={props} />;
              },
            }}>
            <TabNav.Screen
              name="Home"
              component={Home}
              options={{
                tabBarIcon: ({color, size}) => {
                  return <Icon name="home" size={size} color={color} />;
                },
              }}
            />
            <TabNav.Group
              screenOptions={{
                tabBarButton: () => null,
                header(props) {
                  return <Header headerProps={props} showSearch />;
                },
              }}>
              <TabNav.Screen name="SS" component={SearchSuggestions} />
              <TabNav.Screen name="SR" component={SearchResults} />
            </TabNav.Group>
          </TabNav.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;
