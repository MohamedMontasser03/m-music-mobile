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
          </TabNav.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;
