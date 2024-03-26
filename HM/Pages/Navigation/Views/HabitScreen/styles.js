import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    viewContainer: {
      flexDirection: "column",
      alignItems: "center",
      flexGrow: 1,
      justifyContent: "space-between",
      backgroundColor: "black",
      padding: 10,
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
      fontSize: 15,
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
      color: "red",
    },
    dayButtonTextDisabled: {
      color: "gray", // Gray text for unselected days
    },
    dayButtonTextCheckedIn: {
      color: "lightgreen", // Adjust the color as needed
    },
    dayButtonTextUnchecked: {
      backgroundColor: "transparent",
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
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.98)",
    },
  });
  
  export const modalViewStyles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      flexDirection: "column",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderRadius: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      width: "100%",
      height: "30%",
      padding: 5,
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
      width: "100%",
      textAlign: "center",
      backgroundColor: "gray",
      borderRadius: 4,
    },
    dueDays: {
      paddingBottom: 10,
      color: "white",
    },
  });
  