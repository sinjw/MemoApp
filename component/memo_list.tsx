import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
interface memos {
  id: number;
  title: string;
  text: string;
  day: string;
}

export const MemoList = ({ navigation }: any) => {
  const [pressList, setPressList] = useState(0);
  const [preMemoList, setPreMemoList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [search, setSearch] = useState("");
  const handlePressList = (something: number) => {
    setPressList(something);
  };
  const fetchData = async () => {
    try {
      const preMemo = await AsyncStorage.getItem("memoList");
      const preMemoList = preMemo ? JSON.parse(preMemo) : [];
      setPreMemoList(preMemoList);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleSearchChange = (e: string) => {
    setSearch(e);
    if (e) {
      const searchTerm = e.toLowerCase(); // 검색어를 소문자로 변환

      const filteredMemos = preMemoList.filter(
        (el: memos) =>
          el.text.toLowerCase().includes(searchTerm) ||
          el.title.toLowerCase().includes(searchTerm) ||
          el.day.includes(searchTerm)
      );
      setPreMemoList(filteredMemos);
      console.log(e);
      console.log(filteredMemos);
    } else {
      fetchData(); // 검색어가 없는 경우 전체 메모 리스트로 복원
    }
  };
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
      <Text>SEARCH</Text>
      <TextInput
        style={styles.noteArea}
        onChangeText={handleSearchChange}
      ></TextInput>
      {preMemoList.length !== 0 ? (
        preMemoList.map((el: memos) => (
          <>
            <Pressable
              onPress={() =>
                navigation.navigate("MemoDetail", {
                  id: el.id,
                  text: el.text,
                  title: el.title,
                })
              }
            >
              <View style={styles.noteArea} key={el.id}>
                <Text>{el.day}</Text>
                <Text key={`${el.id}-title`}>{el.title}</Text>
                <Text key={`${el.id}-text`}>{el.text}</Text>
              </View>
            </Pressable>
          </>
        ))
      ) : (
        <>
          <Text>내용이 없습니다</Text>
          <Text>메모작성</Text>
        </>
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
