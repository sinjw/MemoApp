import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Pressable, Modal } from "react-native"; // Modal 추가
import { useRoute } from "@react-navigation/native";
import { Calendar } from "react-native-big-calendar";
import AsyncStorage from "@react-native-async-storage/async-storage";
const MyCalendar = ({ navigation }: any) => {
  const [currentMonth, setCurrentMonth] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // 선택된 이벤트 상태 추가
  const [modalVisible, setModalVisible] = useState(false); // 모달 가시성 상태 추가
  const [reload, setReload] = useState(false); // 새로고침 상태 추가
  const route = useRoute();
  const { dayinfo }: any = route.params;
  const events = dayinfo.map((memo: any) => ({
    title: memo.title,
    start: new Date(memo.day),
    end: new Date(memo.day),
    color: "blue",
    id: memo.id,

    text: memo.text,
  }));

  useEffect(() => {
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    setCurrentMonth(month);
  }, []);

  const handleClickEvent = (event: any) => {
    setSelectedEvent(event); // 선택된 이벤트 설정
    setModalVisible(true); // 모달 표시
  };
  const handleClickMoveMemo = () => {
    if (selectedEvent) {
      navigation.navigate("MemoDetail", {
        id: selectedEvent.id,
        text: selectedEvent.text,
        title: selectedEvent.title,
      });
      setModalVisible(false);
    }
  };

  return (
    <>
      <Calendar
        events={events}
        height={600}
        ampm={false}
        mode={"month"}
        showAdjacentMonths={true}
        swipeEnabled={false}
        onPressEvent={(event) => handleClickEvent(event)}
        eventCellStyle={{
          backgroundColor: "skyblue",
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "white",
          marginTop: 5,
          padding: 10,
        }}
        renderHeader={undefined}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
          >
            <Text>{selectedEvent && selectedEvent.title}</Text>
            <Pressable onPress={() => handleClickMoveMemo()}>
              <Text>Open</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MyCalendar;
