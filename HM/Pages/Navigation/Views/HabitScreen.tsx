import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  Modal,
  Alert,
  TextInput,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

interface HomeScreenProps {
  navigation: object;
}

const getCurrentDay = () => {
  const today = new Date().getDay();
  return today === 0 ? Weekdays[6].name : Weekdays[today - 1].name;
};

const Weekdays = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 7, name: "Sunday" },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const currentDay = getCurrentDay();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [taskName, setTaskName] = React.useState("");
  const [dayList, setDayList] = React.useState(
    Weekdays.map((day) => ({ ...day, isSelected: false }))
  );
  const [habits, setHabits] = React.useState<string[]>([]);

  const handlePress = (selectedID) => {
    setDayList((prevList) =>
      prevList.map((day) =>
        day.id === selectedID ? { ...day, isSelected: !day.isSelected } : day
      )
    );
  };

  const createTask = async () => {
    // Check if taskName is empty
    if (!taskName.trim()) {
      console.error("Task name cannot be empty");
      return;
    }

    const selectedDays = dayList
      .filter((day) => day.isSelected)
      .map((day) => day.name);

    const taskData = {
      id: uuid.v4(), // Generate unique identifier
      taskName,
      selectedDays,
    };

    try {
      const savedHabitsString = await AsyncStorage.getItem("habits");
      const currentHabits = savedHabitsString
        ? JSON.parse(savedHabitsString)
        : [];

      // Save each habit as an object containing task ID, name, and selected days
      const updatedHabits = [
        ...currentHabits,
        {
          id: taskData.id,
          taskName: taskData.taskName,
          selectedDays: taskData.selectedDays,
        },
      ];

      await AsyncStorage.setItem("habits", JSON.stringify(updatedHabits));
      console.log("Habits updated successfully:", updatedHabits);

      // Update the habits state after successfully saving the new task
      setHabits(updatedHabits.map((habit) => habit.taskName));

      // Fetch updated habits
      fetchHabits();
    } catch (error) {
      console.error("Error saving task", error);
    }

    setModalVisible(false);
  };

  const fetchHabits = async () => {
    try {
      const savedHabitsString = await AsyncStorage.getItem("habits");
      console.log("Saved habits from AsyncStorage:", savedHabitsString);

      if (savedHabitsString !== null) {
        const savedHabits = JSON.parse(savedHabitsString);
        console.log("Parsed habits from AsyncStorage:", savedHabits);

        // Initialize selectedDaysForHabit with selected days for each habit
        const selectedDaysForHabitData = {};
        savedHabits.forEach((habit) => {
          selectedDaysForHabitData[habit.taskName] = habit.selectedDays;
        });
        setSelectedDaysForHabit(selectedDaysForHabitData);

        // Directly set the habit names from savedHabits
        const habitNames = savedHabits.map((habit) => habit.taskName);
        setHabits(habitNames);
      } else {
        console.log("No habits found in AsyncStorage");
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
        console.error("Error retrieving task and selected days:", error);
      }
    };

    fetchData();
    fetchHabits(); // Fetch habits on initial load
  }, []);

  const [selectedDaysForHabit, setSelectedDaysForHabit] = React.useState({});

  const handleCheckIn = (habit, day) => {
    setSelectedDaysForHabit((prevSelectedDays) => {
      const updatedSelectedDays = { ...prevSelectedDays };
      if (!updatedSelectedDays[habit]) {
        updatedSelectedDays[habit] = [day];
      } else {
        if (updatedSelectedDays[habit].includes(day)) {
          updatedSelectedDays[habit] = updatedSelectedDays[habit].filter(
            (d) => d !== day
          );
        } else {
          updatedSelectedDays[habit] = [...updatedSelectedDays[habit], day];
        }
      }
      return updatedSelectedDays;
    });
  };

  const handleRemoveHabit = async (habit) => {
    try {
      const updatedHabits = [...habits]; // Make a copy of the habits array
      const habitIndex = updatedHabits.findIndex((h) => h === habit); // Find the index of the habit to remove
      if (habitIndex !== -1) {
        updatedHabits.splice(habitIndex, 1); // Remove the habit from the array
        await AsyncStorage.setItem("habits", JSON.stringify(updatedHabits)); // Update AsyncStorage with the modified array
        setHabits(updatedHabits); // Update the habits state with the modified array
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
          Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
      >
        <View style={modalViewStyles.centeredView}>
          <View style={modalViewStyles.modalView}>
            <View style={{ width: "80%", alignContent: "center" }}>
              <TextInput
                style={modalViewStyles.modalText}
                onChangeText={setTaskName}
                placeholder="Enter task name"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
              }}
            >
              <Text style={{ color: "white" }}>Due days: </Text>
              {dayList.map((day) => (
                <TouchableOpacity
                  key={day.id}
                  style={{
                    backgroundColor: day.isSelected ? "#5669FF" : "#E2E2E2",
                    padding: 10,
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
      </Modal>

      <Text style={{ fontSize: 26, fontWeight: "bold", color: "white" }}>
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
                        : styles.dayButtonTextDisabled,
                    ]}
                    onPress={() => {
                      console.log(
                        "selectedDaysForHabit[item]: ",
                        selectedDaysForHabit[item]
                      );
                      console.log("day.name: ", day.name);
                    }}
                  >
                    {day.name.charAt(0)}
                  </Text>
                </TouchableOpacity>
              ))}
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

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "space-between",
    backgroundColor: "black",
  },
  buttonView: {
    width: "6%",
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  habitContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "gray",
    paddingVertical: 10,
  },
  habitText: {
    color: "white",
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayButton: {
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  dayButtonSelected: {},
  dayButtonDisabled: {},
  dayButtonText: {
    color: "white",
  },
  dayButtonTextSelected: {
    color: "cyan",
  },
  dayButtonTextDisabled: {
    color: "gray", // Gray text for unselected days
  },
  checkInButton: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  checkInButtonText: {
    color: "white",
  },
  removeButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  removeButtonText: {
    color: "white",
  },
});

const modalViewStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "black",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "100%",
    height: "20%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    backgroundColor: "gray",
  },
});

export default HomeScreen;
