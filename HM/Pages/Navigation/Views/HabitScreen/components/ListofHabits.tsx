import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles";
import { Weekdays } from "../../../../utils/utils";
import { HabitItemProps } from "../../../../Interfaces/interfaces";

const HabitItem: React.FC<HabitItemProps> = ({
  item,
  selectedDaysForHabit,
  checkedInDays,
  handleCheckIn,
  handleRemoveHabit,
  currentDay,
}) => {
  return (
    <View style={styles.habitContainer}>
      <Text style={styles.habitText}>{item}</Text>
      <View style={styles.buttonsContainer}>
        {Weekdays.map((day, index) => (
          <TouchableOpacity
            key={`${item}-${day.name}-${index}`}
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
                checkedInDays[item] && checkedInDays[item].includes(day.name)
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
  );
};

export default HabitItem;
