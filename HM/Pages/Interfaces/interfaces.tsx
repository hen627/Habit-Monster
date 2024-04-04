export interface HabitData {
  id: string;
  taskName: string;
  selectedDays: string[];
  color: string;
}

export interface ModalViewProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  taskName: string;
  setTaskName: (name: string) => void;
  dayList: { id: number; name: string; isSelected: boolean }[];
  handlePress: (selectedID: number) => void;
  setHabits: (habits: string[]) => void;
  setSelectedDaysForHabit: (selectedDays: { [key: string]: string[] }) => void;
}

export interface HabitItemProps {
  item: string;
  selectedDaysForHabit: { [key: string]: string[] };
  checkedInDays: { [key: string]: string[] };
  handleCheckIn: (habit: string, day: string) => void;
  handleRemoveHabit: (habit: string) => void;
  currentDay: string;
}
