import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { MemoArea } from "./component/memo_area";
import { MemoList } from "./component/memo_list";
import { MemoDetail } from "./component/memo_detail";
import MyCalender from "./component/calender";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={MemoArea}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen
          name="MemoList"
          component={MemoList}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen
          name="MemoDetail"
          component={MemoDetail}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen
          name="Calender"
          component={MyCalender}
          options={{ title: "Welcome" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    marginTop: 20,
  },
});
