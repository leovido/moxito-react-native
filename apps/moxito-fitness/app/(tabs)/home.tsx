import { StyleSheet, View, Text, Button } from "react-native";

export default function HomeScreen() {
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Dashboard</Text>
      <Button
        title={"Start Workout"}
        onPress={() => {
          console.log("Start Workout");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
