import React, { useState } from "react";
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, StyleSheet, Image, Alert, FlatList, TextInput, Modal, Button } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import styles from './style';

export default function Index() {
  const router = useRouter();
  
  const [ selectedImage, setSelectedImage ] = useState("");
  //const [ selectedDocument, setSelectedDocument ] = useState("");
  const [ docName, setDocName ] = useState("");
  const [ selectedImages, setSelectedImages ] = useState([]);
  const [ fileName, setFileName ] = useState("");
  const [ pages, setPages ] = useState([]);
  const [ modalVisible, setModalVisible] = useState(false);
  const [ loading, setLoading] = useState(false);
  
  function getHTMLContent() {
    for (let i = 0; i < pages.length - 1; i++){

    }
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
      setLoading(true);

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
    })
    if(!result.canceled){
      const base64Image = await convertToBase64(result.assets[0].uri);
      setSelectedImage(base64Image);
      setSelectedImages([...selectedImages, {id: selectedImages.length, uri: base64Image}]);
      setSelectedImage(""); //clear the selectedImage const
      const newPageHTML = `<div class="page"><img src="${base64Image}" style="width: 100%; height: 100%;" /></div>`;
      setPages([...pages, newPageHTML]);
      setModalVisible(false); 
      Alert.alert("Imagem adicionada!");
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <TextInput style={styles.fileNameInput} placeholder="Digite o nome do arquivo" onChangeText={setFileName} />
          <TouchableOpacity style={styles.downloadButton} onPress={createAndSavePDF}>
            <MaterialIcons name="download" size={24} color="black" />
        </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.centeredView}>
            <View style={styles.modalContainer}>
              <Text>Adicionar página</Text>
              <TouchableOpacity style={styles.modalButton} onPress={pickImageAsync}>
                <Text>Adicionar imagem</Text>
              </TouchableOpacity>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
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
              <TouchableOpacity style={styles.deletePageButton}>
                <Text style={{textAlign: "center", margin: "auto"}}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.button} onPress={addPage}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}
