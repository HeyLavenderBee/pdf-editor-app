import React, { useState } from "react";
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function Home() {
    //const router = useRouter();

    return(
        <View>
            <StatusBar style="auto" />
                <View style={styles.fileCard}>
                    <TouchableOpacity style={styles.fileEditButton}>
                        <Link href="/file_editor">
                            <Text style={{color:"white", textAlign: "center"}}>Editar</Text>
                        </Link>
                    </TouchableOpacity>
                </View>
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
})
