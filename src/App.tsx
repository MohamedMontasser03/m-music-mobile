import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "./screens/Home";
import {useLoadAssets} from "./hooks/useLoadAssets";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const App = () => {
  const loaded = useLoadAssets();

  if (!loaded) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
