import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MemoDetail = ({ route, navigation }: any) => {
  const {
    id,
    text: initialText,
    title: initialTitle,
    day: initalday,
  } = route.params;
  const [insert, setInsert] = useState(false);
  const [text, setText] = useState(initialText);
  const [title, setTitle] = useState(initialTitle);
  const [day, setDay] = useState(initalday);
  const handleInsertClick = (e: boolean) => {
    setInsert(e);
    setDay(KT);
  };
  const now = new Date();
  const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const KT = koreanTime.toISOString().split("T")[0];

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
      navigation.navigate("MyCalendar", { reload: true });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <View>
        {insert === false ? (
          <View>
            <Pressable onPress={() => handleInsertClick(true)}>
              <Text>수정</Text>
            </Pressable>
            <Text>삭제</Text>
            <Text>취소</Text>
          </View>
        ) : (
          <View>
            <Pressable onPress={() => handleInsertClick(false)}>
              <Text>취소</Text>
            </Pressable>
            <Pressable onPress={handleSave}>
              <Text>완료</Text>
            </Pressable>
            <Text>삭제</Text>
          </View>
        )}

        {insert ? (
          <>
            <View>
              <TextInput
                onChangeText={setTitle}
                style={styles.input}
                value={title}
              />
              <TextInput
                onChangeText={setText}
                style={[styles.input, { height: 200 }]}
                multiline={true}
                value={text}
              />
            </View>
          </>
        ) : (
          <Text>
            {title}
            {text}
          </Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
  },
});
