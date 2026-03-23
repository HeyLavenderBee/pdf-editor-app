import React, { useState, useEffect, useRef } from "react";
import { useLocalSearchParams } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import styles from "../style";

const DeletePageButton = ({loadPages, id}) => {
    const db = useSQLiteContext();

    const deletePage = async () => {
        try{
            await db.runAsync("DELETE FROM page WHERE idPage = ?", [id]);
            await loadPages();
            Alert.alert("Página deletada.");
        } catch (error){
            Alert.alert(`Error", "Não foi possível deletar a página. Erro: ${error}`);
            console.log(error);
        }
    }

    return(
        <TouchableOpacity style={styles.deletePageButton} onPress={() => deletePage()}>
            <Text style={{textAlign: "center", margin: "auto"}}>X</Text>
        </TouchableOpacity>
    );
}

export default DeletePageButton;
