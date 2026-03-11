import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useRouter, Link } from 'expo-router';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Image, FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import styles from "./style";

const PageInsert = ({loadPages, id}) => {
    const db = useSQLiteContext();
    const [selectedImage, setSelectedImage] = useState("");

    const convertToBase64 = async (uri: string) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return `data:image/jpeg;base64,${base64}`;
        } catch (e) {
            //console.error("Conversion failed", e);
            return null;
        }
    };

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
        })
        if(!result.canceled){
            const base64Image: string | null = await convertToBase64(result.assets[0].uri);
            setSelectedImage(base64Image);
            setSelectedImage(""); //clear the selectedImage const
            const newPageHTML = `<div class="page"><img src="${base64Image}" style="width: 100%; height: 100%;" /></div>`;
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
        <TouchableOpacity style={styles.button} onPress={pickImageAsync}>
            <Text>Adicionar página</Text>
        </TouchableOpacity>
    );
}

const FileEditingContent = ({id}) => {
    const db = useSQLiteContext();
    const [results, setResults] = useState([]);

    const loadPages = async () => {
        const data = await db.getAllAsync("SELECT * FROM page WHERE idFile = ?", [id]);
        setResults(data);
    };

    useEffect(() => {loadPages()}, []);

    return (
        <View style={{backgroundColor: "#202123", flex: 1}}>
            <Text style={{color: "white"}}>{id}</Text>

            <PageInsert loadPages={loadPages} id={id} />

            <FlatList
                style={styles.list}
                data={results}
                keyExtractor={(item) => item.idPage.toString()}
                renderItem={({ item }) => (
                    <View style={styles.pageBase}>
                        <Image
                            source={{ uri: item.content }}
                            style={styles.image}
                        />
                        <TouchableOpacity style={styles.deletePageButton}>
                            <Text style={{textAlign: "center", margin: "auto"}}>X</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const FileEditing = () => {
    const { id } = useLocalSearchParams();

    return(
        <SQLiteProvider
            databaseName="pdfeditordatabase.db"
            onInit={async (db) => {
                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS file (
                        idFile INTEGER PRIMARY KEY AUTOINCREMENT,
                        name varchar(255) NOT NULL,
                        creationDate TIMESTAMP NOT NULL,
                        lastUpdated TIMESTAMP NOT NULL
                    );
                `);
                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS page (
                        idPage INTEGER PRIMARY KEY AUTOINCREMENT,
                        content LONGBLOB,
                        idFile int,
                        FOREIGN KEY (idFile) REFERENCES file(idFile)
                    );
                `);
                await db.execAsync(`
                    PRAGMA journal_mode=WAL;
                `);
                    
            }}
            options={{useNewConnection: false}}
        >
            <FileEditingContent id={id} />
        </SQLiteProvider>
    );
}

export default FileEditing;
