import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import {useLoadAssets} from "./hooks/useLoadAssets";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const TabNav = createBottomTabNavigator();
const queryClient = new QueryClient();

const App = () => {
  const loaded = useLoadAssets();

  if (!loaded) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <TabNav.Navigator
          initialRouteName="Home"
          screenOptions={{
            tabBarIcon: ({color, size}) => {
              return <Icon name="home" size={size} color={color} />;
            },
          }}>
          <TabNav.Screen name="Home" component={Home} />
        </TabNav.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
