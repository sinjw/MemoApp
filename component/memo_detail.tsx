import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableHighlight,
} from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { setUpdateMemo } from "../reducer/update-reducer"; // 리듀서 파일의 경로에 따라 import 경로가 달라질 수 있음

export const MemoDetail = ({ route, navigation }: any) => {
  const {
    id: id,
    text: initialText,
    title: initialTitle,
    day: initalday,
  } = route.params;
  const windowHeight = Dimensions.get("window").height;
  const [insert, setInsert] = useState(false);
  const [text, setText] = useState(initialText);
  const [title, setTitle] = useState(initialTitle);
  const [day, setDay] = useState(initalday);
  const [deleteModal, setDeleteModal] = useState<boolean>();
  const handleInsertClick = (e: boolean) => {
    setInsert(e);
    setDay(KT);
  };
  const now = new Date();
  const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const KT = koreanTime.toISOString().split("T")[0];
  const dispatch = useDispatch();

  const handleSave = async () => {
    try {
      const updatedMemo = { id, text, title, day: day };
      const memoList = await AsyncStorage.getItem("memoList");
      const parsedMemoList = memoList ? JSON.parse(memoList) : [];
      const updatedMemoList = parsedMemoList.map((memo: any) =>
        memo.id === id ? updatedMemo : memo
      );

      await AsyncStorage.setItem("memoList", JSON.stringify(updatedMemoList));

      setInsert(false);
      navigation.navigate("MyCalendar");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleCancel = () => {
    navigation.goBack(); // 이전 화면으로 이동
  };
  const handledeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const handleAlert = (id: string) => {
    Alert.alert(
      "삭제 확인",
      "정말로 삭제하시겠습니까?",
      [
        // 취소 버튼
        {
          text: "취소",
          onPress: () => console.log("취소되었습니다."),
          style: "cancel",
        },
        // 삭제 버튼
        {
          text: "삭제",
          onPress: () => {
            handleDelete(id);
          },
        },
      ],
      { cancelable: false }
    );
    dispatch(setUpdateMemo(title));
  };

  const handleDelete = async (listId: string) => {
    try {
      const memoList = await AsyncStorage.getItem("memoList");
      const parsedMemoList = memoList ? JSON.parse(memoList) : [];
      const deleteList = parsedMemoList.filter((el: any) => el.id !== listId);
      await AsyncStorage.setItem("memoList", JSON.stringify(deleteList));
      console.log(id);
      navigation.goBack(); // 이전 화면으로 이동
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: "#F9EBDE",
      }}
    >
      <View>
        {insert === false ? (
          <View>
            <Pressable onPress={() => handleCancel()}>
              <Text>뒤로가기</Text>
            </Pressable>
            <Pressable onPress={() => handleInsertClick(true)}>
              <Text>수정</Text>
            </Pressable>
            <Pressable onPress={() => handleAlert(id)}>
              <Text>삭제</Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableHighlight
              style={{
                display: "flex",
                height: 50,
              }}
              onPress={() => handleInsertClick(false)}
            >
              <Text
                style={{
                  display: "flex",
                  height: 50,
                }}
              >
                취소
              </Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={handleSave}>
              <Text style={{ display: "flex", height: 50 }}>완료</Text>
            </TouchableHighlight>
          </View>
        )}

        {insert ? (
          <>
            <View
              style={{
                display: "flex",
                height: windowHeight - 70,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextInput
                onChangeText={setTitle}
                style={styles.inputTitle}
                value={title}
              />
              <TextInput
                onChangeText={setText}
                style={[styles.inputText]}
                multiline={true}
                textAlignVertical="top"
                value={text}
              />
            </View>
          </>
        ) : (
          <View
            style={{
              display: "flex",
            }}
          >
            <Text style={styles.insertTitle}>{title}</Text>
            <Text style={styles.insertText}>{text}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputTitle: {
    height: 50,
    width: "95%",
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 5,
  },
  inputText: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    flex: 1,
    width: "95%",
  },
  insertTitle: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
  },
  insertText: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
  },
});
