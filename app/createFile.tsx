import React, { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Button, TextInput } from "react-native";

export const CreateFile = () => {
    const [newFile, setNewFile] = useState({fileName: "", creationDate: "", lastUpdated: ""});

    const db = useSQLiteContext(); //abrir conexão com o banco de dados

    const createNewFile = async () => {
        const results = await db.getAllAsync(`SELECT * FROM file`);
        const name = "Arquivo " + (results.length + 1);
        console.log(results)

        /*
        setNewFile(prev => ({ ...prev, fileName: name }))

        console.log(newFile.fileName);
        console.log(name)
        */
        
        const curDate = new Date() + "";

        try{
            await db.runAsync(
                "INSERT INTO file (name, creationDate, lastUpdated) VALUES (?, ?, ?);",
                [name, curDate, curDate]
            );
            Alert.alert("Novo arquivo foi criado!");
            setNewFile({fileName: "", creationDate: "", lastUpdated: ""}); //resetar dados
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro no banco de dados...");
        }
    }

    return(
        <View>
            <TouchableOpacity onPress={createNewFile} style={styles.button}>
                <Text style={styles.buttonText}>Criar novo arquivo</Text>
            </TouchableOpacity>
        </View>
       
    );
}

const styles = StyleSheet.create({
  button: {
    width: "50%",
    height: 45,
    padding: 5,
    borderRadius: 6,
    margin: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
  },
  buttonText: {
    fontSize: 18,
  }
})
