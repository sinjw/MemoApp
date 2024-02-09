import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  SafeAreaView,
  ScrollView,
  Animated,
} from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { RootState } from "../config";
import { Dimensions } from "react-native";
interface memos {
  id: number;
  title: string;
  text: string;
  day: string;
}

export const MemoList = ({ navigation }: any) => {
  // 새로고침 상태 추가
  const memoUpdate = useSelector((state: RootState) => state.upDate);

  const [pressList, setPressList] = useState(0);
  const [preMemoList, setPreMemoList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [search, setSearch] = useState("");
  const [openButtonMenu, setOpenButtonMenu] = useState<boolean>(false);
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
  }, [memoUpdate]);
  const handleSearchChange = (e: string) => {
    setSearch(e);
    if (e) {
      const searchTerm = e.toUpperCase();
      const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣ぁ-んァ-ヶa-zA-Z0-9]+$/;

      const filteredMemos = preMemoList.filter((el: memos) => {
        const isTextMatchedRegex = regex.test(el.text);
        const isTitleMatchedRegex = regex.test(el.title);
        if (isTextMatchedRegex && isTitleMatchedRegex) {
          return (
            el.text.toUpperCase().includes(searchTerm) ||
            el.title.toUpperCase().includes(searchTerm)
          );
        }
      });

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
  const handlesort = (): any => {
    const sortedMemoList = [...preMemoList].sort((a: memos, b: memos) => {
      // 날짜를 문자열로 비교하여 최신 순으로 정렬
      if (b.day < a.day) {
        return 1;
      }
      if (b.day > a.day) {
        return -1;
      }
      return 0;
    });

    setPreMemoList(sortedMemoList);
  };
  const handleOpenButtonMenu = () => {
    setOpenButtonMenu(!openButtonMenu);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9EDBE" }}>
      <Pressable style={styles.buttonStyle} onPress={handleOpenButtonMenu}>
        {openButtonMenu ? (
          <Pressable
            style={styles.moveMemoStyle}
            onPress={() => navigation.navigate("Home")}
          >
            <Pressable
              style={styles.moveCalendarStyle}
              onPress={() =>
                navigation.navigate("Calender", { dayinfo: preMemoList })
              }
            >
              <Text>MyCalender</Text>
            </Pressable>
          </Pressable>
        ) : (
          <></>
        )}
      </Pressable>

      <ScrollView style={{ marginTop: 10 }}>
        <View style={styles.MemoListHeader}>
          <Text style={{ textAlign: "center", marginRight: 10 }}>
            {preMemoList.length}
          </Text>
          <Pressable onPress={handlesort}>
            <Text style={{ textAlign: "right", marginRight: 10 }}>
              내림차순
            </Text>
          </Pressable>
          <Pressable style={{ marginRight: 10 }} onPress={handleDeleteAll}>
            <Text>전체삭제</Text>
          </Pressable>
          <Text style={{ marginRight: 10 }}>SEARCH</Text>
        </View>
        <TextInput
          style={styles.noteArea}
          onChangeText={handleSearchChange}
        ></TextInput>

        {preMemoList.length !== 0 ? (
          preMemoList
            .slice()
            .reverse()
            .map((el: memos) => (
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
      </ScrollView>
    </SafeAreaView>
  );
};
const screenHeight = Dimensions.get("window").height;
const bottomPosition = (screenHeight * 20) / 100;
const styles = StyleSheet.create({
  MemoListHeader: {
    backgroundColor: "lightblue",
    flexDirection: "row",
    marginTop: 40,
  },
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
  buttonStyle: {
    backgroundColor: "red",
    width: 50,
    height: 50,
    textAlign: "center",
    zIndex: 10,
    marginRight: 10,
    position: "absolute",
    bottom: bottomPosition,
    right: 30,
  },
  buttonStyleComponents: {
    left: 0,
    bottom: 0,
  },
  moveMemoStyle: {
    backgroundColor: "red",
    width: 50,
    height: 50,
    left: -120,
  },
  moveCalendarStyle: {
    backgroundColor: "red",
    width: 50,
    height: 50,
    top: -120,
    left: 120,
  },
});
