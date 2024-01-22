import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";

export const MemoArea: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [memoTitle, setMemoTitle] = useState<string>("");
  const [memoList, setMemoList] = useState<
    { id: number; text: string; title: string }[]
  >([]);

  const handleChange = (text: string) => {
    setValue(text);
    console.log(text);
  };
  const handleChangeTitle = (text: string) => {
    setMemoTitle(text);
    console.log(text);
  };

  const handleClick = () => {
    const newMemo = { id: Math.random(), title: memoTitle, text: value };
    if (value !== "") {
      setMemoList((prevMemos) => [...prevMemos, newMemo]);
      setValue("");
      setMemoTitle("");
    }
  };

  return (
    <>
      <View>
        <Text>안녕</Text>
        <TextInput
          style={styles.textArea}
          onChangeText={handleChangeTitle}
          value={memoTitle}
        ></TextInput>
        <TextInput
          style={styles.textArea}
          onChangeText={handleChange}
          value={value}
        ></TextInput>
        <Pressable onPress={handleClick}>
          <Text>Press me</Text>
        </Pressable>
      </View>
      <View>
        {memoList.map((el) => (
          <View key={el.id}>
            <Text>{el.title}</Text>
            <Text style={styles.noteArea}>
              {el.text}
              {el.id}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  textArea: {
    backgroundColor: "#fff",
    border: "1px solid#333",
    width: "90%",
    height: "100%",
    margin: 0,
    marginLeft: "auto",
    marginRight: "auto",
  },
  noteArea: {
    backgroundColor: "#fff",
    border: "1px solid#333",
  },
});
