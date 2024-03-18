import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface HomeScreenProps {
  navigation: object;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity onPress={() => alert('This is the "Home" screen.')}>
        <Text style={{ fontSize: 26, fontWeight: "bold" }}>Home Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
