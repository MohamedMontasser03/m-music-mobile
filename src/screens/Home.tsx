import React from "react";
import {StatusBar, Text, View} from "react-native";

const Home = () => {
  return (
    <View>
      <StatusBar />
      <Text
        style={{
          color: "#000",
          fontSize: 24,
          fontWeight: "600",
        }}>
        Hello React Native!
      </Text>
    </View>
  );
};

export default Home;
