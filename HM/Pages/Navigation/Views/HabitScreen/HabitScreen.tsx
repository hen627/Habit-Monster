import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { styles, modalViewStyles } from "./styles";
import { Weekdays, getCurrentDay, randomHexColor } from "../../../utils/utils";

interface HabitData {
  id: string;
  taskName: string;
  selectedDays: string[];
  color: string;
}

const HomeScreen: React.FC = ({}) => {
  const currentDay = getCurrentDay();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [taskName, setTaskName] = React.useState("");
  const [dayList, setDayList] = React.useState(
    Weekdays.map((day) => ({ ...day, isSelected: false }))
  );
  const [habits, setHabits] = React.useState([]);

  const handlePress = (selectedID: number) => {
    setDayList((prevList) =>
      prevList.map((day) =>
        day.id === selectedID ? { ...day, isSelected: !day.isSelected } : day
      )
    );
  };

  const createTask = async () => {
    if (!taskName.trim()) {
      console.error("Task name cannot be empty");
      return;
    }

    const selectedDays = dayList
      .filter((day) => day.isSelected)
      .map((day) => day.name);

    const taskData = {
      id: uuid.v4(),
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
          id: taskData.id,
          taskName: taskData.taskName,
          selectedDays: taskData.selectedDays,
          color: taskData.color,
        },
      ];

      await AsyncStorage.setItem("habits", JSON.stringify(updatedHabits));

      setHabits(updatedHabits.map((habit) => habit.taskName));

      fetchHabits();
    } catch (error) {
      console.error("Error saving task", error);
    }

    setModalVisible(false);
  };

  const fetchHabits = async () => {
    try {
      const savedHabitsString = await AsyncStorage.getItem("habits");

      if (savedHabitsString !== null) {
        const savedHabits = JSON.parse(savedHabitsString);

        const selectedDaysForHabitData = {};
        savedHabits.forEach((habit: HabitData) => {
          selectedDaysForHabitData[habit.taskName] = habit.selectedDays;
        });
        setSelectedDaysForHabit(selectedDaysForHabitData);

        const habitNames = savedHabits.map(
          (habit: HabitData) => habit.taskName
        );
        setHabits(habitNames);
      } else {
        setHabits([]);
      }
    } catch (error) {
      console.error("Error retrieving habits:", error);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const savedTaskName = await AsyncStorage.getItem("taskName");
        const savedSelectedDays = await AsyncStorage.getItem("selectedDays");

        if (savedTaskName !== null && savedSelectedDays !== null) {
          setTaskName(savedTaskName);
          setDayList((prevList) =>
            prevList.map((day) => ({
              ...day,
              isSelected: JSON.parse(savedSelectedDays).includes(day.name),
            }))
          );
        }
      } catch (error) {
        console.error("Error retreiving AsyncStorage:", error);
      }
    };

    fetchData();
    fetchHabits();
  }, []);

  const [selectedDaysForHabit, setSelectedDaysForHabit] = React.useState({});
  const [checkedInDays, setCheckedInDays] = React.useState({});

  const handleCheckIn = (habit: string, day: string) => {
    setCheckedInDays((prevCheckedInDays) => {
      const updatedCheckedInDays = { ...prevCheckedInDays };
      if (!updatedCheckedInDays[habit]) {
        updatedCheckedInDays[habit] = [day];
      } else {
        if (updatedCheckedInDays[habit].includes(day)) {
          updatedCheckedInDays[habit] = updatedCheckedInDays[habit].filter(
            (d: string) => d !== day
          );
        } else {
          updatedCheckedInDays[habit] = [...updatedCheckedInDays[habit], day];
        }
      }
      return updatedCheckedInDays;
    });
  };

  const handleRemoveHabit = async (habit: string) => {
    try {
      const updatedHabits = [...habits];
      const habitIndex = updatedHabits.findIndex((h) => h === habit);
      if (habitIndex !== -1) {
        updatedHabits.splice(habitIndex, 1);
        await AsyncStorage.setItem("habits", JSON.stringify(updatedHabits));
        setHabits(updatedHabits);
        const updatedSelectedDays = { ...selectedDaysForHabit };
        delete updatedSelectedDays[habit];
        setSelectedDaysForHabit(updatedSelectedDays);
      }
    } catch (error) {
      console.error("Error removing habit:", error);
    }
  };

  return (
    <View style={styles.viewContainer}>
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
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                }}
              >
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
                <Text style={modalViewStyles.textStyle}>Create task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          color: modalVisible ? "black" : "white",
        }}
      >
        Habits
      </Text>

      <FlatList
        data={habits}
        renderItem={({ item }) => (
          <View style={styles.habitContainer}>
            <Text style={styles.habitText}>{item}</Text>
            <View style={styles.buttonsContainer}>
              {Weekdays.map((day) => (
                <TouchableOpacity
                  key={day.id}
                  style={[
                    styles.dayButton,
                    selectedDaysForHabit[item] &&
                    selectedDaysForHabit[item].includes(day.name)
                      ? styles.dayButtonSelected
                      : styles.dayButtonDisabled,
                  ]}
                  onPress={() => {
                    if (!selectedDaysForHabit[item]) {
                      handleCheckIn(item, day.name);
                    }
                  }}
                  disabled={
                    !selectedDaysForHabit[item] ||
                    !selectedDaysForHabit[item].includes(day.name)
                  }
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDaysForHabit[item] &&
                      selectedDaysForHabit[item].includes(day.name)
                        ? styles.dayButtonTextSelected
                        : selectedDaysForHabit[item] &&
                          !selectedDaysForHabit[item].includes(day.name)
                        ? styles.dayButtonTextDisabled
                        : null,
                      checkedInDays[item] &&
                      checkedInDays[item].includes(day.name)
                        ? styles.dayButtonTextCheckedIn
                        : null,
                    ]}
                    onPress={() => {
                      console.log(
                        "selectedDaysForHabit[item]: ",
                        selectedDaysForHabit[item]
                      );
                    }}
                  >
                    {day.name.charAt(0)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.habitButtons}>
              <TouchableOpacity
                style={styles.checkInButton}
                onPress={() => handleCheckIn(item, currentDay)}
              >
                <Text style={styles.checkInButtonText}>Check-in</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveHabit(item)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item}
      />
      <View style={styles.buttonView}>
        <Button
          title="+"
          color="darkgreen"
          onPress={() => setModalVisible(true)}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
