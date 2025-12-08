import { switchToScrollSepolia } from '@moxito/services';
import { theme } from '@moxito/theme';
import { usePrivy } from '@privy-io/expo';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePrivyWallet } from '../hooks/usePrivyWallet';

export default function SettingsScreen() {
  const { isConnected, address, walletProvider, connectExternalWallet, isOnScrollSepolia } =
    usePrivyWallet();
  const { logout } = usePrivy();
  const router = useRouter();

  // If logged out, send back to login screen
  useEffect(() => {
    if (!isConnected) {
      router.replace('/');
    }
  }, [isConnected, router]);

  const handleConnect = async () => {
    try {
      await connectExternalWallet();
    } catch (error) {
      Alert.alert('Connection Failed', error instanceof Error ? error.message : 'Try again.');
    }
  };

  const handleSwitchNetwork = async () => {
    if (!walletProvider) {
      Alert.alert(
        'Wallet Not Ready',
        'Please connect your wallet via Privy, then try switching again.'
      );
      return;
    }
    try {
      await switchToScrollSepolia(walletProvider);
    } catch (error) {
      Alert.alert(
        'Network Switch Failed',
        error instanceof Error ? error.message : 'Unable to switch network.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Wallet</Text>
          <Text style={styles.label}>Status: {isConnected ? 'Connected' : 'Not connected'}</Text>
          <Text style={styles.label}>Address: {address ?? '—'}</Text>
          <Pressable style={styles.primaryButton} onPress={handleConnect}>
            <Text style={styles.primaryButtonText}>Connect External Wallet</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Network</Text>
          <Text style={styles.label}>
            Current: {isOnScrollSepolia ? 'Scroll Sepolia' : 'Unknown / Other'}
          </Text>
          <Pressable style={styles.secondaryButton} onPress={handleSwitchNetwork}>
            <Text style={styles.secondaryButtonText}>Switch to Scroll Sepolia</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Session</Text>
          <Pressable
            style={[styles.secondaryButton, styles.dangerButton]}
            onPress={() => logout?.()}
          >
            <Text style={styles.secondaryButtonText}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0B0F',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  label: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary[100] || '#9747FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#0B0B0F',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dangerButton: {
    borderColor: '#FF6666',
    backgroundColor: 'rgba(255,102,102,0.12)',
  },
});
