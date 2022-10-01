import React, {PropsWithChildren} from "react";
import {StatusBar, View} from "react-native";

const MainLayout: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <View>
      <StatusBar />
      {children}
    </View>
  );
};

export default MainLayout;
