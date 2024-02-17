import React from "react";

import { Text } from "react-native";

const CalendarHeader = ({ currentMonth }: any) => {
  return (
    <Text style={{ textAlign: "center", fontSize: 20 }}>{currentMonth}</Text>
  );
};

export default CalendarHeader;
