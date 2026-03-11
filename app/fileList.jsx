import React, { useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter, Link, useFocusEffect } from 'expo-router';
import { Text, View, StyleSheet, TouchableOpacity, Alert, FlatList, ActivityIndicator, RefreshControl } from "react-native";

const FileList = () => {
    const router = useRouter();
    
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const db = useSQLiteContext();

    const loadFiles = async () => {
        try {
            setLoading(true);
            const results = await db.getAllAsync(`SELECT * FROM file ORDER BY lastUpdated DESC`);
            setFiles(results);
        } catch (error) {
            Alert.alert("Erro", "Houve problemas tentando coletar seus dados...");
        } finally {
            setLoading(false);
            const results = await db.getAllAsync(`SELECT * FROM file`);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadFiles();
        }, [])
    );

    const goToFileEditor = (idFile) => {
        router.push({
            pathname: "/[id]",
            params: {
                id: idFile
            },
        });
    };

    if (loading){
        return <ActivityIndicator color="#000" />;
    }

    return(
        <FlatList
            style={{width: "100%", height: "100%", flex: 1}}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={loadFiles} />
            }
            data={files}
            keyExtractor={(item) => String(item.idFile)}
            renderItem={({item}) => (
                <View style={styles.fileCard}>
                    <Text style={{fontSize: 20, color: "white", fontWeight: "600"}}>{item.name}</Text>
                    <Text style={{color: "#cdcdcd"}}>{item.creationDate}</Text>
                    <TouchableOpacity style={styles.editButton} onPress={() => goToFileEditor(item.idFile)}>
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                </View>
            )}
            ListEmptyComponent={<Text style={styles.noFileText}>Nenhum arquivo foi criado ainda.</Text>}
        />
    );
}

export default FileList;

const styles = StyleSheet.create({
    fileCard: {
        width: "95%",
        height: 200,
        marginBottom: 20,
        alignSelf: "center",
        borderRadius: 10,
        padding: 15,
        backgroundColor: "#3F4144"
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
        backgroundColor: "lightblue"
    },
    buttonText: {
        fontSize: 19,
    },
    noFileText: {
        width: "100%",
        textAlign: "center",
        color: "white"
    }
});
