import React, { useState, useEffect, useRef } from "react";
import { useLocalSearchParams } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { Text, View, StyleSheet, TouchableOpacity, Alert, Image, FlatList, Modal } from "react-native";
import styles from "../style";
import PageInsert from "./pageInsert";
import DeletePageButton from "./deleteButton";

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
                        <DeletePageButton loadPages={loadPages} id={item.idPage}/>
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
