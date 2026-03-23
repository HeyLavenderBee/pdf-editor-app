import React, { useState } from "react";
import { useRouter } from 'expo-router';
import { useSQLiteContext } from "expo-sqlite";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";

const CreateFile = () => {
    const router = useRouter();
    const [newFile, setNewFile] = useState({fileName: "", creationDate: "", lastUpdated: ""});

    const db = useSQLiteContext(); //abrir conexão com o banco de dados

    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear(); //formato YYYY
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); //formato MM
        const day = date.getDate().toString().padStart(2, "0"); //formato DD
        const time = `${date.getHours().toString().padStart(2,"0")}:${date.getMinutes().toString().padStart(2,"0")}:${date.getSeconds().toString().padStart(2,"0")}`;

        return `${year}-${month}-${day} ${time}`;
    }

    const createNewFile = async () => {
        const results = await db.getAllAsync(`SELECT * FROM file`);
        const name = "Arquivo " + (results.length + 1); //add +1 pois é o próximo id

        //setNewFile(prev => ({ ...prev, fileName: name }))
        
        const curDate = getCurrentDate();

        try{
            await db.runAsync(
                "INSERT INTO file (name, creationDate, lastUpdated) VALUES (?, ?, ?);",
                [name, curDate, curDate]
            );
            Alert.alert("Novo arquivo foi criado!");
            setNewFile({fileName: "", creationDate: "", lastUpdated: ""}); //resetar dados
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro no banco de dados...");
        } finally {
            const idResult = await db.getAllAsync("SELECT * FROM file;")
            const idCount = idResult.length; 
            goToFileEditor(idCount); //ir para último arquivo criado
        }
    }

    const goToFileEditor = (idFile: number) => {
        router.push({
            pathname: "/file_editing/[id]",
            params: {
                id: idFile
            },
        });
    };

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

export default CreateFile;
