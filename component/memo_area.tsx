import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
  SafeAreaView,
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
  const [memoDate, setMemoDate] = useState("");
  const [reload, setReload] = useState(false);
  const dispatch = useDispatch();
  const handleChange = (text: string) => {
    setValue(text);
  };
  const handleChangeTitle = (text: string) => {
    setMemoTitle(text);
  };
  const fetchData = () => {
    AsyncStorage.getItem("memoList")
      .then((preMemo) => {
        const getmemo = preMemo !== null ? JSON.parse(preMemo) : [];
        setMemoData(getmemo);
      })
      .catch((error) => {
        console.error(" 오류가 발생했습니다:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = async () => {
    const now = new Date(); // 현재 시간 가져오기
    const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const newMemo = {
      id: now,
      title: memoTitle,
      text: value,
      day: koreanTime.toISOString().split("T")[0],
    };
    const preMemo = await AsyncStorage.getItem("memoList");
    let preMemoList = preMemo ? JSON.parse(preMemo) : [];
    if (value !== "") {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, justifyContent: "center", margin: 15 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Image
            style={{ alignItems: "center", marginBottom: 10 }}
            source={require("./../assets/MyMemoLogo.png")}
          />
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
          style={styles.titleArea}
          onChangeText={handleChangeTitle}
          value={memoTitle}
        ></TextInput>
        <TextInput
          style={styles.noteArea}
          onChangeText={handleChange}
          value={value}
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
  logoimg: { width: 80 },
  deleteModal: {
    opacity: 1,
  },
  deleteBasic: {
    opacity: 0,
  },
  moveMeMoList: {},
});
