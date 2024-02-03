import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MemoList } from "./memo_list";
import { NavigationProp } from "@react-navigation/native";

export const MemoArea: React.FC = ({ navigation }: any) => {
  const [value, setValue] = useState<string>("");
  const [memoTitle, setMemoTitle] = useState<string>("");
  const [accept, setAccept] = useState("");
  const [insert, setInsert] = useState();
  const [memoData, setMemoData] = useState([]);

  const handleChange = (text: string) => {
    setValue(text);
    console.log(text);
  };
  const handleChangeTitle = (text: string) => {
    setMemoTitle(text);
    console.log(text);
  };
  useEffect(() => {
    AsyncStorage.getItem("memoList")
      .then((preMemo) => {
        const getmemo = preMemo !== null ? JSON.parse(preMemo) : [];
        setMemoData(getmemo);
      })
      .catch((error) => {
        console.error(" 오류가 발생했습니다:", error);
      });
  }, []);

  const handleClick = async () => {
    const newMemo = { id: Math.random(), title: memoTitle, text: value };
    const preMemo = await AsyncStorage.getItem("memoList");
    let preMemoList = preMemo ? JSON.parse(preMemo) : [];
    if (value !== "") {
      const updatedMemoList: any = [...preMemoList, newMemo];
      await AsyncStorage.setItem("memoList", JSON.stringify(updatedMemoList));
      setValue("");
      setMemoTitle("");
      setMemoData(updatedMemoList);
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
          <Text>MemoList{memoData.length}</Text>
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
