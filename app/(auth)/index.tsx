import { useLoginWithFarcaster, usePrivy } from '@privy-io/expo';
import * as Application from 'expo-application';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function AuthScreen() {
  const router = useRouter();
  const { user, isReady } = usePrivy();
  const { loginWithFarcaster, state } = useLoginWithFarcaster({
    onSuccess: (user) => {
      console.log('Farcaster login successful:', user);
      router.replace('/(tabs)/fitness');
    },
    onError: (error) => {
      console.error('Farcaster login error:', error);
    },
  });

  // Log app identifier for debugging
  useEffect(() => {
    const appId = Application.applicationId;
    console.log('Current app identifier:', appId);
    console.log('iOS bundle identifier:', Application.getIosIdForVendorAsync?.() || 'N/A');
  }, []);

  const handleLogin = async () => {
    try {
      const redirectUrl = Linking.createURL('auth');
      // relyingParty is optional - only include if you have MFA configured
      // If you need it, it must be a valid URL origin (e.g., https://app.moxito.xyz)
      // and must match what's configured in your Privy dashboard
      await loginWithFarcaster({
        redirectUrl,
        // Only uncomment if you have relyingParty configured in Privy dashboard:
        relyingParty: process.env.EXPO_PUBLIC_RELYING_PARTY,
      });
    } catch (error) {
      console.error('Farcaster login error:', error);
    }
  };

  useEffect(() => {
    if (isReady && user) {
      router.replace('/(tabs)/fitness');
    }
  }, [isReady, user, router]);

  return (
    <>
      <Image source={require('../../assets/images/login.png')} style={styles.backgroundImage} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Sign in to Moxito with Farcaster</Text>
          {state.status === 'error' && state.error && (
            <Text style={styles.errorText}>{state.error.message}</Text>
          )}
          <Text style={styles.subtitle}>
            Sign in to the apps to display your profile or skip this step.
          </Text>
          <Pressable
            style={[styles.signInButton, state.status !== 'initial' && styles.signInButtonDisabled]}
            onPress={handleLogin}
            disabled={state.status !== 'initial'}
          >
            {state.status !== 'initial' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signInButtonText}>Sign in with Farcaster</Text>
            )}
          </Pressable>
          <Pressable style={styles.skipButton} onPress={() => router.replace('/(tabs)/fitness')}>
            <Text style={styles.skipButtonText}>Skip this step</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
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
    color: '#000',
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
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  skipButton: {
    marginTop: 20,
    color: '#000',
  },
  errorText: {
    color: '#FF4444',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Lato_400Regular',
  },
});
