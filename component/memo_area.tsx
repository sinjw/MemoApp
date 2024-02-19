import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableHighlight,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MemoList } from "./memo_list";
import { NavigationProp } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUpdateMemo } from "../reducer/update-reducer"; // 리듀서 파일의 경로에 따라 import 경로가 달라질 수 있음
export const MemoArea: React.FC = ({ navigation }: any) => {
  const [value, setValue] = useState<string>("");
  const [memoTitle, setMemoTitle] = useState<string>("");
  const [memoData, setMemoData] = useState([]);
  const [reload, setReload] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (text: string) => {
    setValue(text);
  };
  const handleChangeTitle = (text: string) => {
    setMemoTitle(text);
  };

  const handleClick = async () => {
    const now = new Date(); // 현재 시간 가져오기
    const year = now.getFullYear().toString().padStart(4, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const koreanTime = `${year}.${month}.${day}`;
    const preMemo = await AsyncStorage.getItem("memoList");
    let preMemoList = preMemo ? JSON.parse(preMemo) : [];

    const idnumber = String(now);
    const newMemo = {
      id: `${idnumber}`,
      title: memoTitle,
      text: value,
      day: koreanTime,
    };
    if (value || memoTitle !== "") {
      const updatedMemoList: any = [...preMemoList, newMemo];
      await AsyncStorage.setItem("memoList", JSON.stringify(updatedMemoList));
      setMemoData(updatedMemoList);
      dispatch(setUpdateMemo(newMemo.title));
      setValue("");
      setMemoTitle("");
      setReload(true);
      navigation.navigate("MemoList", { reload: reload });
    }
  };
  const handleCancel = () => {
    navigation.goBack(); // 이전 화면으로 이동
  };
  console.log(memoTitle);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: "#F9EBDE",
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", margin: 15 }}>
        <Image
          style={{
            alignItems: "center",
            marginBottom: 10,
            resizeMode: "contain",
            width: 180,
            alignSelf: "center",
          }}
          source={require("./../assets/MyMemoLogo.png")}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableHighlight
              style={{
                marginRight: 10,
                width: 45,
                height: 30,
                alignItems: "center",
                borderRadius: 5,
                justifyContent: "center",
              }}
              onPress={handleCancel}
              underlayColor="#DDDDDD"
            >
              <Text>취소</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                width: 45,
                height: 30,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleClick}
              underlayColor="#DDDDDD"
            >
              <Text>작성</Text>
            </TouchableHighlight>
          </View>
        </View>

        <TextInput
          keyboardType="default"
          style={styles.titleArea}
          onChangeText={handleChangeTitle}
          value={memoTitle}
        ></TextInput>
        <TextInput
          keyboardType="default"
          style={styles.noteArea}
          onChangeText={handleChange}
          value={value}
          multiline={true}
        ></TextInput>
      </View>
      <View>
        <Pressable></Pressable>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  titleArea: {
    backgroundColor: "white",
    height: 50,
    borderRadius: 5,
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    elevation: 5,
  },
  noteArea: {
    fontSize: 20,
    backgroundColor: "white",
    height: 400,
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    elevation: 5,
  },
  logoimg: { width: 20 },
  deleteModal: {
    opacity: 1,
  },
  deleteBasic: {
    opacity: 0,
  },
  moveMeMoList: {},
});
