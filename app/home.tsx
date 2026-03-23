import React, { useState } from "react";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Button } from "react-native";

// Componentes da tela
import CreateFile from "./createFile"; 
import FileList from "./fileList";
import FileEditing from "./file_editing/[id]";

export default function Home() {
    const [fileName, setFilename] = useState("");

    return(
        <View style={{flex: 1, backgroundColor: "#202123"}}>
            <StatusBar style="auto" />
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
                        CREATE TABLE IF NOT EXISTS page (
                            idPage INTEGER PRIMARY KEY AUTOINCREMENT,
                            content LONGBLOB,
                            idFile int,
                            FOREIGN KEY (idFile) REFERENCES file(idFile)
                        );
                        PRAGMA journal_mode=WAL;
                    `);
                }}
                options={{useNewConnection: false}}
            >
                <View style={styles.fileList}>
                    <CreateFile />
                    <FileList />
                </View>
            </SQLiteProvider>
        </View>
    );
}

const styles = StyleSheet.create({
  fileCard:{
    height: 160,
    width: "95%",
    borderRadius: 7,
    justifyContent: 'center',
    alignSelf: "center",
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: "#505157",
  },
  fileEditButton: {
    width: 80,
    padding: 5,
    borderRadius: 5,
    marginTop: "auto",
    marginLeft: "auto",
    margin: 10,
    backgroundColor: "#7f93aa",
  },
  fileList: {
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
})
