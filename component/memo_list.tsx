import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
interface memos {
  id: number;
  title: string;
  text: string;
}

export const MemoList = ({ navigation }: any) => {
  const [pressList, setPressList] = useState(0);
  const [preMemoList, setPreMemoList] = useState([]);

  const handlePressList = (something: number) => {
    setPressList(something);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const preMemo = await AsyncStorage.getItem("memoList");
        const preMemoList = preMemo ? JSON.parse(preMemo) : [];
        setPreMemoList(preMemoList);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteAll = async () => {
    try {
      await AsyncStorage.clear();
      setPreMemoList([]);
      // 삭제 후에 UI를 업데이트하거나 다른 작업을 수행할 수 있습니다.
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Pressable onPress={handleDeleteAll}>
        <Text>전체삭제</Text>
      </Pressable>
      {preMemoList ? (
        preMemoList.map((el: memos) => (
          <Pressable
            onPress={() => navigation.navigate("MemoDetail", { id: el.id })}
          >
            <View style={styles.noteArea} key={el.id}>
              <Text key={`${el.id}-title`}>{el.title}</Text>
              <Text key={`${el.id}-text`}>{el.text}</Text>
            </View>
          </Pressable>
        ))
      ) : (
        <Text>내용이 없습니다</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  noteArea: {
    backgroundColor: "#fff",
    border: "1px",
    margin: 10,
  },
  deleteModal: {
    opacity: 1,
  },
  deleteBasic: {
    opacity: 0,
  },
});
