import { Stack, useRouter } from "expo-router";
import { Text, View, TouchableOpacity, StyleSheet, Image, Alert, FlatList, TextInput, Modal, Button } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: "#6C1085",
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#fff'
    }}>
      <Stack.Screen name="home" options={{ title: "Editor de PDF" }} />
      <Stack.Screen name="fileEditor" options={{ title: 'Nome do arquivo' }} />
      <Stack.Screen name="file_editing/[id]" options={{ title: 'Nome do arquivo' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#6C1085",
    flex: 1, 
    padding: 4,
    justifyContent: 'center', 
    alignItems: 'center'
  },
})
