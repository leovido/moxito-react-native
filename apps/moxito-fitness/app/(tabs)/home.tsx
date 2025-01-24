import { StyleSheet, View, Text, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { startWorkout, endWorkout } from "../../workoutSlice";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const workoutStatus = useSelector((state: RootState) => state.workout.isActive);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Dashboard</Text>
      <Text>Workout Status: {workoutStatus ? 'Active' : 'Inactive'}</Text>
      <Button
        title={workoutStatus ? "End Workout" : "Start Workout"}
        onPress={() => {
          dispatch(workoutStatus ? endWorkout() : startWorkout());
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
