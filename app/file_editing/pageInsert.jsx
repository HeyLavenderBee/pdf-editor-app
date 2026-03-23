import React, { useState, useRef } from "react";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { Text, View, StyleSheet, TouchableOpacity, Alert, Image, FlatList, Modal, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system/legacy';
import { CameraView, useCameraPermissions, cameraRef } from "expo-camera";
import styles from "../style";

const PageInsert = ({loadPages, id}) => {
    const db = useSQLiteContext();
    const [selectedImage, setSelectedImage] = useState("");
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [showModal, setShowModal] = useState(false);
    const [showPhotoTakingModal, setShowPhotoTakingModal] = useState(false);
    const [takenPhoto, setTakenPhoto] = useState("");
    const cameraRef = useRef(null);

    if (!cameraPermission){
        return(<View />);
    }

    const takePhoto = async () => {
        if (!cameraPermission.granted){
            setShowModal(true);
            return;
        } else{
            setShowModal(false);
            if(cameraRef.current){
                try{
                    const options = {quality: 0.5, base64: true};
                    var data = await cameraRef.current.takePictureAsync(options);
                    setTakenPhoto(data);
                } catch (error){
                    Alert.alert("Erro", `Não foi possível tirar a foto. Tente novamente. Erro: ${error}`);
                } finally {
                    try{
                        await db.runAsync(
                            "INSERT INTO page (content, idFile) VALUES (?, ?)",
                            [takePhoto, id]
                        );

                        Alert.alert("Página adicionada!");
                    } catch (error) {
                        Alert.alert("Erro", "Ocorreu um erro ao adicionar a foto...");
                    }
                    await loadPages();
                }
            }
        }
    }

    const showPhotoModal = () => {
        setShowPhotoTakingModal(true);
    }

    const convertToBase64 = async (uri) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return `data:image/jpeg;base64,${base64}`;
        } catch (e) {
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
            setSelectedImage(""); //clear the selectedImage const
            //const newPageHTML = `<div class="page"><img src="${base64Image}" style="width: 100%; height: 100%;" /></div>`;
            
            try{
                await db.runAsync(
                    "INSERT INTO page (content, idFile) VALUES (?, ?);",
                    [base64Image, id]
                );
                Alert.alert("Página adicionada!");
            } catch (error) {
                Alert.alert("Erro", "Ocorreu um erro ao adicionar a página...");
            } 
            await loadPages();
        }
    }
    return(
        <View>
            <TouchableOpacity style={styles.button} onPress={pickImageAsync}>
                <Text>Adicionar página</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={showPhotoModal}>
                <Text>Adicionar foto</Text>
            </TouchableOpacity>
            <Modal visible={showModal} animationType="slide">
                <View style={styles.centeredView}>
                    <View style={styles.modalContainer}>
                        <Text>Precisamos de permissão para usar a câmera</Text>
                        <TouchableOpacity onPress={() => {requestCameraPermission(); setShowModal(false);}}><Text>Permitir</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal visible={showPhotoTakingModal} animationType="slide" transparent={true}>
                <View style={insert_styles.modalStyle}>
                    <CameraView ref={cameraRef} style={{width: "90%", height: 600, borderRadius: 10}}></CameraView>
                    <TouchableOpacity onPress={() => {takePhoto(), setShowPhotoTakingModal(false)}} style={insert_styles.takePhotoButton}>
                        <Text style={{textAlign: "center", color: "white", fontWeight: 500}}>Tirar foto</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

export default PageInsert;

const insert_styles = StyleSheet.create({
    modalStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2e3347",
    },
    takePhotoButton: {
        backgroundColor: "#5d2e97",
        width: "30%",
        padding: 10,
        borderRadius: 6,
        margin: 20,
    }
});
