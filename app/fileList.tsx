import React, { useState, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter, Link } from 'expo-router';
import { Text, View, StyleSheet, TouchableOpacity, Alert, FlatList, ActivityIndicator } from "react-native";

export const FileList = () => {
    const [files, setFiles] = useState();
    const [loading, setLoading] = useState(false);

    const db = useSQLiteContext();

    const loadFiles = async () => {
        try {
            const results = await db.getAllAsync(`SELECT * FROM file`);
            console.log(results);
            setFiles(results);
        } catch (error) {
            Alert.alert("Erro", "Houve problemas tentando coletar seus dados...");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadFiles();
    }, []);

    if (loading){
        return <ActivityIndicator color="fff" />;
    }

    return(
        <FlatList
            style={{width: "100%"}}
            data={files}
            keyExtractor={(item) => item.id + ""}
            renderItem={({item}) => (
                <View style={styles.fileCard}>
                    <Text>{item.name}</Text>
                    <Text>{item.creationDate}</Text>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                </View>
            )}
            ListEmptyComponent={<Text>Nenhum arquivo foi criado ainda.</Text>}
        />
    );
}

const styles = StyleSheet.create({
    fileCard: {
        width: "95%",
        height: 200,
        marginBottom: 20,
        alignSelf: "center",
        borderRadius: 10,
        backgroundColor: "#595959"
    },
    editButton: {
        width: 80,
        height: 40,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        marginTop: "auto",
        marginLeft: "auto",
        margin: 18,
        backgroundColor: "lightblue"
    },
    buttonText: {
        fontSize: 19,
    }
});
