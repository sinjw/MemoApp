import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
interface memos {
  id: number;
  title: string;
  text: string;
  day: string;
}

export const MemoList = ({ navigation }: any) => {
  // 새로고침 상태 추가

  const [pressList, setPressList] = useState(0);
  const [preMemoList, setPreMemoList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [search, setSearch] = useState("");
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
      const searchTerm = e.toUpperCase();

      const filteredMemos = preMemoList.filter(
        (el: memos) =>
          el.text.toUpperCase().includes(searchTerm) ||
          el.title.toUpperCase().includes(searchTerm)
      );

      setPreMemoList(filteredMemos);
      console.log(e);

      console.log(filteredMemos);
    } else {
      fetchData();
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
  const handleArray = (): any => {
    const sortedMemoList = preMemoList.sort((a: memos, b: memos) => {
      // a와 b의 날짜를 비교하여 최신 순으로 정렬
      return new Date(a.day).getTime() - new Date(b.day).getTime();
    });
  };

  return (
    <ScrollView style={{ marginTop: 80 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9EDBE" }}>
        <View>
          <Text style={{ textAlign: "center" }}>{preMemoList.length}</Text>
          <Pressable onPress={handleArray}>
            <Text style={{ textAlign: "right" }}>내림차순</Text>
          </Pressable>
          <Pressable onPress={handleDeleteAll}>
            <Text>전체삭제</Text>
          </Pressable>
          <Text>SEARCH</Text>
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Text>+</Text>
          </Pressable>
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
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  MemoListView: {
    backgroundColor: "F9EBDE",
    flex: 1,
    justifyContent: "center",
  },
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
