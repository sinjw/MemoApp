import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native"; // Modal 추가
import { useRoute } from "@react-navigation/native";

import { Calendar, CalendarProps } from "react-native-big-calendar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CalendarHeader from "./calendarHeader";
const MyCalendar = ({ navigation }: any) => {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // 선택된 이벤트 상태 추가
  const [modalVisible, setModalVisible] = useState(false); // 모달 가시성 상태 추가
  const [reload, setReload] = useState(false); // 새로고침 상태 추가
  const [currentDate, setCurrentDate] = useState(new Date());
  const route = useRoute();
  const { dayinfo }: any = route.params;
  const events = dayinfo.map((memo: any) => ({
    id: memo.id,
    text: memo.text,
    title: memo.title,
    start: new Date(memo.day),
    end: new Date(memo.day),
    color: "blue",
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
  const handleVisibleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    const month = newDate.toLocaleString("default", { month: "long" });
    setCurrentMonth(month);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: "#F9EBDE",
      }}
    >
      <CalendarHeader currentMonth={currentMonth} />
      <Calendar
        renderHeaderForMonthView={() => <CalendarHeader />}
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
      />
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
              borderRadius: 20,
              width: 200,
              height: 250,
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "#F9EBcc",
              borderWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                width: "100%",
                borderRadius: 20,
              }}
            >
              <Text>{selectedEvent && selectedEvent.title}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Pressable
                style={{
                  width: 100,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => handleClickMoveMemo()}
              >
                <Text>Open</Text>
              </Pressable>
              <Pressable
                style={{
                  width: 100,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 40,
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MyCalendar;
