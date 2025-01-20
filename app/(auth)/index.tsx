import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace("/(tabs)/fitness");
  };

  return (
    <>
      <Image
        source={require("../../assets/images/login.png")}
        style={styles.backgroundImage}
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Sign in to Moxito with Farcaster</Text>
          <Text style={styles.subtitle}>
            Sign in to the apps to display your profile or skip this step.
          </Text>
          <Pressable style={styles.signInButton} onPress={handleLogin}>
            <Text style={styles.signInButtonText}>Sign in</Text>
          </Pressable>
          <Pressable style={styles.skipButton} onPress={handleLogin}>
            <Text style={styles.skipButtonText}>Skip this step</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    flexDirection: "column",
    alignItems: "center",
    margin: 20,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Lato_700Bold",
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 10,
  },
  skipButtonText: {
    marginTop: 20,
    color: "#000",
  },
  signInButtonText: {
    color: "#fff",
    fontFamily: "Lato_700Bold",
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: "#A87AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  skipButton: {
    marginTop: 20,
    color: "#000",
  },
});
