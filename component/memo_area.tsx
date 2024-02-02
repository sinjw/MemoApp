import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MemoList } from "./memo_list";
import { NavigationProp } from "@react-navigation/native";

export const MemoArea: React.FC = ({ navigation }: any) => {
  const [value, setValue] = useState<string>("");
  const [memoTitle, setMemoTitle] = useState<string>("");
  const [accept, setAccept] = useState("");
  const [insert, setInsert] = useState();
  const [memolists, setMemoLists] = useState<any[]>([]);

  const handleChange = (text: string) => {
    setValue(text);
    console.log(text);
  };
  const handleChangeTitle = (text: string) => {
    setMemoTitle(text);
    console.log(text);
  };

  const handleClick = async () => {
    const newMemo = { id: Math.random(), title: memoTitle, text: value };
    const preMemo = await AsyncStorage.getItem("memoList");
    let preMemoList = preMemo ? JSON.parse(preMemo) : [];

    if (value !== "") {
      const updatedMemoList = [...preMemoList, newMemo];
      await AsyncStorage.setItem("memoList", JSON.stringify(updatedMemoList));
      setMemoLists(updatedMemoList);
      setValue("");
      setMemoTitle("");
    }
  };

  const handleConfirm = (text: string, e: number) => {
    if (e) {
      setAccept(text);
    }
  };

  return (
    <>
      <View>
        <TextInput
          style={styles.textArea}
          onChangeText={handleChangeTitle}
          value={memoTitle}
        ></TextInput>
        <TextInput
          style={styles.textArea}
          onChangeText={handleChange}
          value={value}
        ></TextInput>
        <Pressable onPress={handleClick}>
          <Text>작성</Text>
        </Pressable>
      </View>
      <View>
        <Pressable onPress={() => navigation.navigate("MemoList")}>
          <Text>MemoList{memolists.length}</Text>
        </Pressable>
        <Pressable></Pressable>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  textArea: {},
  noteArea: {},
  deleteModal: {
    opacity: 1,
  },
  deleteBasic: {
    opacity: 0,
  },
});
