import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  SafeAreaView,
  ScrollView,
  Animated,
  Modal,
  StatusBar,
  Image,
  TouchableHighlight,
} from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useMemo } from "react";
import { RootState } from "../config";
import { Dimensions } from "react-native";
import { MemoDetail } from "./memo_detail";
interface memos {
  id: number;
  title: string;
  text: string;
  day: string;
}

export const MemoList = ({ navigation }: any) => {
  // 새로고침 상태 추가
  const memoUpdate = useSelector((state: RootState) => state.upDate);
  const [memoList, setMemoList] = useState([]);
  const [search, setSearch] = useState("");
  const [openButtonMenu, setOpenButtonMenu] = useState<boolean>(false);
  const [searchButton, setSearchButton] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false); // 모달 가시성 상태 추가
  const [buttonPresed, setButtonPressed] = useState(false);
  const fetchData = async () => {
    try {
      const preMemo = await AsyncStorage.getItem("memoList");
      const preMemoList = preMemo ? JSON.parse(preMemo) : [];
      setMemoList(preMemoList);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [memoUpdate]);

  const searchResult = useMemo(() => {
    const searchTerm = search.toUpperCase();

    const filteredMemos = memoList.filter((el: memos) => {
      if (el.title || el.text !== "") {
        return (
          el.text.toUpperCase().includes(searchTerm) ||
          el.title.toUpperCase().includes(searchTerm)
        );
      }
    });
    return filteredMemos;
  }, [search, memoList, memoUpdate]);
  const handleSearchChange = (e: string) => {
    setSearch(e);
  };
  const handleDeleteAll = async () => {
    try {
      await AsyncStorage.clear();
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleOpenSearchButton = () => {
    setSearchButton(!searchButton);
  };
  const handleOpenButtonMenu = () => {
    setOpenButtonMenu(!openButtonMenu);
  };
  const handleClickMoveCalendar = () => {
    navigation.navigate("Calender", { dayinfo: searchResult });
    setModalVisible(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: "#F9EBDE",
      }}
    >
      {modalVisible && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "#ccc",
            opacity: 0.5,
            zIndex: 2,
          }}
        ></View>
      )}

      <TouchableHighlight
        style={styles.buttonStyle}
        onPress={() => navigation.navigate("Home")}
        underlayColor="#DDDDDD"
      >
        <Image
          style={{
            resizeMode: "contain",
            alignSelf: "center",
            width: 125,
            height: 55,
          }}
          source={require("./../assets/MemoButton.png")}
        />
      </TouchableHighlight>

      <ScrollView style={{ marginTop: 10 }}>
        <View style={styles.MemoListHeader}>
          <View style={{ flex: 4 }}>
            <Image
              style={{
                resizeMode: "contain",
                alignSelf: "center",
                width: 135,
                height: 35,
              }}
              source={require("./../assets/MyMemoLogo.png")}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flex: 3,
              justifyContent: "flex-end",
            }}
          >
            <TouchableHighlight
              style={{ borderRadius: 10, marginRight: 10 }}
              onPress={handleOpenSearchButton}
              underlayColor="#e3d8cf"
            >
              <Image
                style={{
                  alignItems: "center",
                  resizeMode: "contain",
                  alignSelf: "center",
                  width: 45,
                  height: 20,

                  marginTop: 10,
                }}
                source={require("./../assets/SearchButton.png")}
              />
            </TouchableHighlight>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderRadius: 5,
              flex: 1,
              backgroundColor: buttonPresed ? "#e3d8cf" : "#F9EBDE",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pressable
              onPress={() => setModalVisible(true)}
              onPressIn={() => setButtonPressed(true)}
              onPressOut={() => setButtonPressed(false)}
            >
              <Image
                style={{
                  resizeMode: "contain",
                  alignSelf: "center",

                  width: 35,
                  height: 35,
                }}
                source={require("./../assets/MenuButton.png")}
              />
            </Pressable>
          </View>
        </View>
        {searchButton ? (
          <TextInput
            style={styles.searchBox}
            onChangeText={handleSearchChange}
          ></TextInput>
        ) : (
          <></>
        )}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 2,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#F9EBDE",
                borderRadius: 20,
                width: 200,
                height: 250,
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Text style={styles.modalLengthStyle}>
                My Memo '{searchResult.length}'
              </Text>
              <View style={{ justifyContent: "space-around", height: 100 }}>
                <TouchableHighlight
                  style={{ borderRadius: 10 }}
                  onPress={handleClickMoveCalendar}
                  underlayColor="#e3d8cf"
                >
                  <Text style={styles.modalTextStyle}>Calendar</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ borderRadius: 10 }}
                  onPress={handleDeleteAll}
                  underlayColor="#e3d8cf"
                >
                  <Text style={styles.modalTextStyle}>전체삭제</Text>
                </TouchableHighlight>
              </View>

              <TouchableHighlight
                style={{ marginTop: 20, borderRadius: 10 }}
                onPress={() => setModalVisible(false)}
                underlayColor="#e3d8cf"
              >
                <Text
                  style={{
                    width: 150,
                    marginTop: 5,
                    height: 40,
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "#815854",
                  }}
                >
                  Close
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        {searchResult.length !== 0 ? (
          searchResult
            .slice()
            .reverse()
            .map((el: memos) => (
              <TouchableHighlight
                style={styles.noteArea}
                onPress={() =>
                  navigation.navigate("MemoDetail", {
                    id: el.id,
                    text: el.text,
                    title: el.title,
                  })
                }
                underlayColor="#DDDDDD"
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                  key={el.id}
                >
                  {el.title === "" ? (
                    <Text style={styles.noteText} key={`${el.id}-text`}>
                      {el.text.length > 12
                        ? el.text.substring(0, 12) + "..."
                        : el.text}
                    </Text>
                  ) : (
                    <Text style={styles.noteText} key={`${el.id}-title`}>
                      {el.title.length > 12
                        ? el.title.substring(0, 12) + "..."
                        : el.title}
                    </Text>
                  )}
                  <Text style={styles.noteTextDay} key={`${el.id}-day`}>
                    {el.day}
                  </Text>
                </View>
              </TouchableHighlight>
            ))
        ) : (
          <>
            <Text style={styles.noteArea}>
              <Text style={styles.noteText}>Note area</Text>
            </Text>
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
    display: "flex",
    flexDirection: "row",
    height: 40,
    justifyContent: "space-around",
  },
  MemoListView: {
    flex: 1,
    justifyContent: "center",
  },
  noteArea: {
    border: "1px",
    margin: 5,
    display: "flex",
    flexDirection: "row",
    height: 50,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  noteTextDay: {
    marginRight: 10,
    fontSize: 12,
    color: "#9c9c9c",
  },
  noteText: {
    textAlign: "center",
    fontWeight: "normal",
    color: "#555",
    fontSize: 16,
    flex: 2,
  },
  deleteModal: {
    opacity: 1,
  },
  deleteBasic: {
    opacity: 0,
  },
  buttonStyle: {
    backgroundColor: "white",
    width: 65,
    height: 65,
    textAlign: "center",
    zIndex: 1,
    marginRight: 10,
    position: "absolute",
    bottom: bottomPosition,
    right: 30,
    borderRadius: 8,
    shadowColor: "#000",
    paddingTop: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
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
    width: 150,
    height: 50,
    marginTop: 10,
  },
  modalLengthStyle: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    color: "#815854",
    borderRadius: 15,
    width: 150,
    fontSize: 15,
    fontWeight: "bold",
  },
  modalTextStyle: {
    backgroundColor: "#815854",
    color: "white",
    borderRadius: 15,
    textAlign: "center",
    width: 150,
    fontSize: 20,
    height: 40,
    justifyContent: "center",
  },
  searchStyle: {
    marginRight: 10,
  },
  searchBox: {
    backgroundColor: "white",
    width: "90%",
    marginLeft: "5%",
    marginBottom: 25,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
    elevation: 5,
  },
});
