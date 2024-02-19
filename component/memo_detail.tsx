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
  TouchableOpacity,
  Modal,
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
  const [memoList, setMemoList] = useState([]);
  const [text, setText] = useState(initialText);
  const [title, setTitle] = useState(initialTitle);
  const [day, setDay] = useState(initalday);
  const [deleteModal, setDeleteModal] = useState<boolean>();
  const [modalVisible, setModalVisible] = useState(false); // 모달 가시성 상태 추가
  const now = new Date();
  const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const KT = koreanTime.toISOString().split("T")[0];
  const dispatch = useDispatch();
  const handleInsertClick = (e: boolean) => {
    setInsert(e);
    setDay(KT);
  };
  console.log(route.params);
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

  const handleDelete = async (listId: string) => {
    console.log(listId);
    try {
      const memoList = await AsyncStorage.getItem("memoList");
      const parsedMemoList = memoList ? JSON.parse(memoList) : [];
      const deleteList = parsedMemoList.filter((el: any) => el.id !== listId);
      await AsyncStorage.setItem("memoList", JSON.stringify(deleteList));

      dispatch(setUpdateMemo(id));
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
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              height: 60,
              width: "96.6%",
              marginLeft: 12,
            }}
          >
            <TouchableHighlight
              style={styles.buttonText}
              onPress={() => handleInsertClick(true)}
              underlayColor="#DDDDDD"
            >
              <Text>수정</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.buttonText}
              onPress={() => {
                setModalVisible(true);
              }}
              underlayColor="#DDDDDD"
            >
              <Text>삭제</Text>
            </TouchableHighlight>
            <Modal
              visible={modalVisible}
              transparent={true}
              onRequestClose={() => {
                setModalVisible(false);
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  backgroundColor: "#333",
                  opacity: 0.7,
                }}
              >
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: "#fff" }}>삭제하시겠습니까?</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableHighlight
                    style={{ marginRight: 15, borderRadius: 10 }}
                    onPress={() => handleDelete(id)}
                    underlayColor={"#333"}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        width: 40,
                        height: 30,
                        alignItems: "center",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      삭제
                    </Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{
                      borderRadius: 10,
                    }}
                    onPress={() => setModalVisible(false)}
                    underlayColor={"#333"}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        width: 40,
                        height: 30,
                        alignItems: "center",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      취소
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </View>
        ) : (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              height: 60,
              width: "97%",
            }}
          >
            <TouchableHighlight
              style={{
                display: "flex",
                height: 40,
                width: 80,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                marginRight: 10,
                borderRadius: 5,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 1.84,
                elevation: 5,
              }}
              onPress={() => handleInsertClick(false)}
              underlayColor="#DDDDDD"
            >
              <Text>취소</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                display: "flex",
                height: 40,
                width: 80,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",

                borderRadius: 5,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 1.84,
                elevation: 5,
              }}
              onPress={handleSave}
              underlayColor="#DDDDDD"
            >
              <Text>완료</Text>
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
                style={styles.inputText}
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
              height: windowHeight - 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.insertTitle}
              onLongPress={() => handleInsertClick(true)}
              delayLongPress={600}
              activeOpacity={0.7}
            >
              <Text style={{ marginTop: 5 }}>{title}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.insertText}
              onLongPress={() => handleInsertClick(true)}
              delayLongPress={600}
              activeOpacity={0.7}
            >
              <Text>{text}</Text>
            </TouchableOpacity>
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
    padding: 10,
    marginBottom: 5,
    backgroundColor: "white",
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    elevation: 5,
  },
  inputText: {
    padding: 10,
    marginBottom: 10,
    flex: 1,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    elevation: 5,
  },
  insertTitle: {
    height: 50,
    width: "95%",

    padding: 10,
    marginBottom: 5,
    backgroundColor: "white",
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    elevation: 5,
  },
  insertText: {
    padding: 10,
    marginBottom: 10,
    flex: 1,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    elevation: 5,
  },
  buttonText: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 80,
    marginRight: 10,
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    elevation: 5,
  },
});
