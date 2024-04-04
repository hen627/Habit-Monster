import React from "react";
import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { styles, modalViewStyles } from "../styles";
import { randomHexColor } from "../../../../utils/utils";
import { ModalViewProps } from "../../../../Interfaces/interfaces";

const ModalView: React.FC<ModalViewProps> = ({
  modalVisible,
  setModalVisible,
  taskName,
  setTaskName,
  dayList,
  handlePress,
  setHabits,
  setSelectedDaysForHabit,
}) => {
  const createTask = async () => {
    if (!taskName.trim()) {
      console.error(
        "Task name cannot be empty(altough this isn't implemented yet"
      );
      return;
    }

    const selectedDays = dayList
      .filter((day) => day.isSelected)
      .map((day) => day.name);

    const taskData = {
      key: uuid.v4(),
      taskName,
      selectedDays,
      color: randomHexColor(),
    };

    try {
      const savedHabitsString = await AsyncStorage.getItem("habits");
      const currentHabits = savedHabitsString
        ? JSON.parse(savedHabitsString)
        : [];

      const updatedHabits = [
        ...currentHabits,
        {
          key: taskData.key,
          taskName: taskData.taskName,
          selectedDays: taskData.selectedDays,
          color: taskData.color,
        },
      ];

      await AsyncStorage.setItem("habits", JSON.stringify(updatedHabits));

      setHabits(updatedHabits.map((habit) => habit.taskName));

      const selectedDaysForHabitData = {};
      updatedHabits.forEach((habit) => {
        selectedDaysForHabitData[habit.taskName] = habit.selectedDays;
      });
      setSelectedDaysForHabit(selectedDaysForHabitData);

      setModalVisible(false);
    } catch (error) {
      console.error("Error saving task", error);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <View style={modalViewStyles.centeredView}>
          <View style={modalViewStyles.modalView}>
            <View style={{ width: "80%", alignContent: "center" }}>
              <TextInput
                style={modalViewStyles.modalText}
                onChangeText={setTaskName}
                placeholder="Habit name"
              />
            </View>
            <Text style={modalViewStyles.dueDays}>Due days: </Text>
            <View style={{ flexDirection: "row", alignContent: "center" }}>
              {dayList.map((day) => (
                <TouchableOpacity
                  key={day.id}
                  style={{
                    backgroundColor: day.isSelected ? "#5669FF" : "darkgray",
                    padding: 10,
                    width: "10%",
                    alignItems: "center",
                    borderRadius: 5,
                    margin: 5,
                  }}
                  onPress={() => handlePress(day.id)}
                >
                  <Text style={{ color: "white" }}>{day.name.charAt(0)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[modalViewStyles.button, modalViewStyles.buttonClose]}
              onPress={createTask}
            >
              <Text style={[modalViewStyles.textStyle]}>Create task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalView;
