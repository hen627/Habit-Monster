import * as React from "react";
import { View, Text, Button, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles";
import { Weekdays, getCurrentDay } from "../../../utils/utils";
import ModalView from "./components/ModalView";
import HabitItem from "./components/ListofHabits";
import { HabitData } from "../../../Interfaces/interfaces";

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
      <ModalView
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        taskName={taskName}
        setTaskName={setTaskName}
        dayList={dayList}
        handlePress={handlePress}
        setHabits={setHabits}
        setSelectedDaysForHabit={setSelectedDaysForHabit}
      />
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>Habits</Text>
      <FlatList
        data={habits}
        renderItem={({ item }) => (
          <HabitItem
            item={item}
            selectedDaysForHabit={selectedDaysForHabit}
            checkedInDays={checkedInDays}
            handleCheckIn={handleCheckIn}
            handleRemoveHabit={handleRemoveHabit}
            currentDay={currentDay}
          />
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
