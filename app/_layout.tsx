import { Stack, useRouter } from "expo-router";
import { Text, View, TouchableOpacity, StyleSheet, Image, Alert, FlatList, TextInput, Modal, Button } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  /*
     header: () => (
          <SafeAreaView style={{height: 100}}>
            <View style={styles.header}>
              <Text>Página Inicial</Text>
            </View>
          </SafeAreaView>
        ),
  */

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
      <StatusBar style="light" />
      <Stack.Screen name="home" options={{ title: "Editor de PDF" }} />
      <Stack.Screen name="file_editor" options={{ title: 'Overview' }} />
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
