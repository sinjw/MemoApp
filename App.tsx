import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { MemoArea } from "./component/memo_area";
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MemoArea />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
