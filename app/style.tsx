import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3b3939"
  },
  downloadButton: {
    width: 40, 
    height: 40,
    padding: 4,
    margin: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "100%",
  },
  header: {
    width: "100%",
    height: 60,
    marginBottom: 20,
    flexDirection: "row",
    backgroundColor: "#779dde"
  },
  button: {
    padding: 8,
    width: "30%",
    marginBottom: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#779dde"
  },
  modalContainer: {
    width: "80%",
    height: 180,
    borderRadius: 10,
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    margin: "auto",
    justifyContent: "center",
    backgroundColor: "white"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0000004a"
  },
  modalButton: {
    width: "60%",
    padding: 5,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "lightblue"
  },
  image: {
    width: "90%",
    height: 420,
    margin: "auto",
  },
  list: {
    width: "100%",
    height: "40%",
    marginBottom: 30,
    padding: 10,
    flex: 1,
  },
  fileBox: {
    width: "95%",
    height: 180,
    margin: "auto",
    marginBottom: 20,
    backgroundColor: "gray",
    flexDirection: "row",
    gap: 20,
    padding: 10,
  },
  fileIcon: {
    width: "30%",
    height: "90%",
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: 10,
    backgroundColor: "#c5c5c5"
  },
  fileButton: {
    width: 90,
    height: 40,
    padding: 10,
    marginLeft: "auto",
    marginTop: "auto",
    backgroundColor: "lightblue"
  },
  fileRightSide: {
    width: "60%",
    height: "100%",
    padding: 5,
    flexDirection: "column"
  },
  title: {
    fontSize: 20,
  },
  fileNameInput: {
    width: "50%",
    margin: "auto",
    padding: 3,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: "white"
  },
  pageBase: {
    width: "90%",
    height: 475,
    margin: "auto",
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: "#dedede"
  },
  deletePageButton: {
    width: 30,
    height: 30,
    position: "absolute",
    borderRadius: "100%",
    backgroundColor: "red",
    margin: 10,
  },
})

export default styles;
