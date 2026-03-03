import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, StyleSheet, Image, Alert, FlatList, TextInput, Modal, Button } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function Index() {
  const [ selectedImage, setSelectedImage ] = useState("");
  //const [ selectedDocument, setSelectedDocument ] = useState("");
  const [ docName, setDocName ] = useState("");
  const [ selectedImages, setSelectedImages ] = useState([]);
  const [ fileName, setFileName ] = useState("");
  const [ pages, setPages ] = useState([]);
  const [ modalVisible, setModalVisible] = useState(false);
  
  function getHTMLContent() {
    const docPages = pages.join('');

    return `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica'; margin: 0; padding: 0; }
            .page {
              height: 90%;
              padding: 20px;
              page-break-after: always;
            }
            h1 { color: #2c3e50; }
            .footer { position: absolute; bottom: 20px; width: 100%; text-align: center; }
          </style>
        </head>
        <body>
          ${docPages}
        </body>
      </html>
    `;
  }

  function addPage(){
    if(selectedImage == ""){
      setModalVisible(true);
    }
    setSelectedImage("");
  }

  const createAndSavePDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: getHTMLContent() });
      console.log('PDF generated at:', uri);

      const newPath =
      FileSystem.documentDirectory + `${fileName}.pdf`;

      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      console.log("PDF saved at:", newPath);

      await Sharing.shareAsync(newPath);

    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };

  const convertToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (e) {
      console.error("Conversion failed", e);
      return null;
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3,4]
    })
    if(!result.canceled){

    if (!result.canceled) {
      const base64Image = await convertToBase64(result.assets[0].uri);
      setSelectedImage(base64Image);
      setSelectedImages([...selectedImages, {id: selectedImages.length, uri: base64Image}])
      setSelectedImage(""); //clear the selectedImage const
      const newPageHTML = `<div class="page"><img src="${base64Image}" style="width: 100%; height: 100%;" /></div>`
      setPages([...pages, newPageHTML])
      setModalVisible(false);
      Alert.alert("Imagem adicionada!");
    }
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
        <View style={styles.header}>
          <TextInput style={styles.fileNameInput} placeholder="Digite o nome do arquivo" onChangeText={setFileName} />
        </View>

        <Modal visible={modalVisible} transparent={true} style={styles.pageAddContainer}>
          <View style={styles.pageAddContainer}>
            <Text>Adicionar página</Text>
            <TouchableOpacity style={styles.modalButton} onPress={pickImageAsync}>
              <Text>Adicionar imagem</Text>
            </TouchableOpacity>
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>


        <FlatList
          style={styles.list}
          data={selectedImages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.pageBase}>
              <Image
                src={item.uri}
                style={styles.image}
              />
            </View>
          )}
        />

        <TouchableOpacity style={styles.button} onPress={addPage}>
          <Text style={{textAlign: "center"}}>Adicionar página</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={createAndSavePDF}>
          <Text style={{textAlign: "center"}}>Baixar documento</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3b3939"
  },
  header: {
    width: "100%",
    height: 50,
    marginBottom: 20,
    backgroundColor: "lightblue"
  },
  button: {
    padding: 8,
    width: "40%",
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "lightblue"
  },
  pageAddContainer: {
    width: "80%",
    height: 200,
    borderRadius: 10,
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  modalButton: {
    width: "60%",
    padding: 5,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "lightblue"
  },
  image: {
    width: "80%",
    height: 400,
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
    borderRadius: 5,
    backgroundColor: "white"
  },
  pageBase: {
    width: "90%",
    height: 475,
    margin: "auto",
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: "#dedede"
  }
})

