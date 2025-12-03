import { usePrivy } from '@privy-io/expo';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { user, isReady } = usePrivy();

  // If user is authenticated, redirect to tabs (handles Farcaster login redirect)
  useEffect(() => {
    if (isReady && user) {
      router.replace('/(tabs)/fitness');
    }
  }, [isReady, user, router]);

  const handleGoToAuth = () => {
    console.log('Navigating to auth...');
    router.push('/(auth)');
  };

  const handleGoToTabs = () => {
    console.log('Navigating to tabs...');
    router.push('/(tabs)/home');
  };

  console.log('Index component rendering...');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moxito Fitness</Text>
      <Text style={styles.subtitle}>Welcome to your fitness app!</Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleGoToAuth}>
          <Text style={styles.buttonText}>Go to Auth</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleGoToTabs}>
          <Text style={styles.buttonText}>Go to Tabs</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 20,
  },
  button: {
    backgroundColor: '#9747FF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
