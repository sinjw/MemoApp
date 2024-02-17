import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { MemoArea } from "./component/memo_area";
import { MemoList } from "./component/memo_list";
import { MemoDetail } from "./component/memo_detail";
import MyCalender from "./component/calender";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import store from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Provider store={store}>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="MemoList" component={MemoList} />
            <Stack.Screen name="Home" component={MemoArea} />
            <Stack.Screen name="MemoDetail" component={MemoDetail} />
            <Stack.Screen name="Calender" component={MyCalender} />
          </Stack.Navigator>
        </SafeAreaView>
      </Provider>
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
