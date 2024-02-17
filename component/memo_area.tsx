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

    const idnumber = String(memoData.length + 1);

    const newMemo = {
      id: `${idnumber}`,
      title: memoTitle,
      text: value,
      day: koreanTime,
    };
    const preMemo = await AsyncStorage.getItem("memoList");
    let preMemoList = preMemo ? JSON.parse(preMemo) : [];
    if (value || memoTitle !== "") {
      const updatedMemoList: any = [...preMemoList, newMemo];
      await AsyncStorage.setItem("memoList", JSON.stringify(updatedMemoList));

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
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Pressable onPress={handleClick}>
              <Text style={{ marginRight: 10 }}>작성</Text>
            </Pressable>
            <Pressable onPress={handleCancel}>
              <Text>취소</Text>
            </Pressable>
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
    borderWidth: 1,
    height: 50,
    borderRadius: 5,
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  noteArea: {
    borderWidth: 1,
    fontSize: 20,

    height: 400,
    borderRadius: 10,
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
