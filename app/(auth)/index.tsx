import { View, Text, Button, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace('/(tabs)/fitness');
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
          headerBackVisible: false,
          gestureEnabled: false
        }} 
      />
      <ImageBackground 
        source={require('../../assets/images/login.png')} 
        style={styles.backgroundImage}
      >
				<View style={styles.container}>
					<View style={styles.content}>
          <Text style={styles.title}>Sign in to Moxito with Farcaster</Text>
          <Text style={styles.subtitle}>Sign in to the apps to display your profile or skip this step.</Text>
          <Pressable style={styles.signInButton} onPress={() => {router.replace('/(tabs)/fitness')}}>
            <Text style={styles.signInButtonText}>Sign in</Text>
          </Pressable>
          <Pressable style={styles.skipButton} onPress={() => {router.replace('/(tabs)/fitness')}}>
            <Text style={styles.skipButtonText}>Skip this step</Text>
          </Pressable>
        	</View>
				</View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
	},
	container: {
		flex: 1,
    justifyContent: 'flex-end',
	},
	content: {
		flexDirection: 'column',
		alignItems: 'center',
		margin: 20,
		padding: 20,
		borderRadius: 24,
		backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Lato_700Bold',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  skipButtonText: {
    marginTop: 20,
    color: '#000'
  },
  signInButtonText: {
    color: '#fff',
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: '#A87AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  skipButton: {
    marginTop: 20,
    color: '#000'
  }
});