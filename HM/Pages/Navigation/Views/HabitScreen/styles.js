import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    viewContainer: {
      flexDirection: "column",
      alignItems: "center",
      flexGrow: 1,
      justifyContent: "space-between",
      backgroundColor: "black",
      padding: 10,
      width: "100%",
      overflow: "scroll"
    },
    buttonView: {
      width: 30,
      justifyContent: "flex-end",
      paddingBottom: 10,

    },
    habitContainer: {
      width: 300,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#141414",
      padding: 10,
      borderRadius: 15,
      marginTop: 10,

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
      color: "gray", 
    },
    dayButtonTextCheckedIn: {
      color: "green", 
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
    habitButtons:{
      flexDirection: "row",
    }
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
      width: "100%",
      height: "30%", 
    },
    button: {
      borderRadius: 20,
      padding: 10,
      margin: 12,

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
      marginBottom: 13,
      width: "100%",
      height: 40,
      textAlign: "center",
      backgroundColor: "gray",
      borderRadius: 4,
    },
    dueDays: {
      paddingBottom: 10,
      color: "white",
    },
  });
  