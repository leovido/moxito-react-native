import {
  type HealthDailySummary,
  healthDataService,
  contractService,
  createPrivyWalletClient,
} from '@moxito/services';
import { theme } from '@moxito/theme';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatsCard } from '@/components/StatsCard';
import { usePrivyWallet } from '@/hooks/usePrivyWallet';
import type { Address } from 'viem';

type LoadState = 'loading' | 'ready' | 'error';

export default function FitnessScreen() {
  const [summary, setSummary] = useState<HealthDailySummary | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Wallet and contract state
  const {
    isConnected,
    address,
    chainId,
    isOnScrollSepolia,
    connectExternalWallet,
    user,
  } = usePrivyWallet();
  const [checkInCount, setCheckInCount] = useState<bigint | null>(null);
  const [steps10KCount, setSteps10KCount] = useState<bigint | null>(null);
  const [contractLoading, setContractLoading] = useState(false);
  const [contractError, setContractError] = useState<string | null>(null);
  const [transactionLoading, setTransactionLoading] = useState<string | null>(null);

  // Load health data
  useEffect(() => {
    let isMounted = true;

    async function syncHealthData() {
      setLoadState('loading');
      setErrorMessage(null);

      try {
        await healthDataService.requestAuthorization();
        const data = await healthDataService.getDailySummary();

        if (!isMounted) {
          return;
        }

        setSummary(data);
        setLoadState('ready');
      } catch (error) {
        console.warn('Unable to load health stats', error);
        if (!isMounted) {
          return;
        }
        setSummary(null);
        setErrorMessage('Unable to sync health data right now.');
        setLoadState('error');
      }
    }

    syncHealthData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load contract data when wallet is connected
  useEffect(() => {
    if (!isConnected || !address) {
      setCheckInCount(null);
      setSteps10KCount(null);
      return;
    }

    let isMounted = true;

    async function loadContractData() {
      setContractLoading(true);
      setContractError(null);

      try {
        const [checkInResult, stepsResult] = await Promise.all([
          contractService.getUserCheckInCount(address),
          contractService.getUserSteps10KCount(address),
        ]);

        if (!isMounted) {
          return;
        }

        if (checkInResult.error) {
          setContractError(checkInResult.error.message);
        } else {
          setCheckInCount(checkInResult.data);
        }

        if (stepsResult.error) {
          setContractError(stepsResult.error.message);
        } else {
          setSteps10KCount(stepsResult.data);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setContractError(error instanceof Error ? error.message : 'Failed to load contract data');
      } finally {
        if (isMounted) {
          setContractLoading(false);
        }
      }
    }

    loadContractData();

    return () => {
      isMounted = false;
    };
  }, [isConnected, address]);

  const formattedDate = formatSummaryDate(summary?.date ?? new Date());
  const metrics = useMemo(
    () => [
      {
        label: 'Steps',
        value: summary ? summary.steps.toLocaleString() : '--',
        unit: 'steps',
      },
      {
        label: 'Date',
        value: formattedDate,
        unit: '',
      },
      {
        label: 'Heart Rate',
        value: summary ? summary.heartRateBpm : '--',
        unit: 'bpm',
      },
      {
        label: 'Distance',
        value: summary ? summary.distanceKm.toFixed(2) : '--',
        unit: 'km',
      },
    ],
    [formattedDate, summary]
  );
  const sourceLabel =
    summary?.source === 'ios'
      ? 'Apple Health'
      : summary?.source === 'android'
        ? 'Health Connect'
        : 'Preview data';

  const handleRecordCheckIn = async () => {
    if (!isConnected || !address) {
      Alert.alert('Wallet Not Connected', 'Please connect your wallet first.');
      return;
    }

    if (!isOnScrollSepolia) {
      Alert.alert(
        'Wrong Network',
        'Please switch to Scroll Sepolia network to record check-ins.'
      );
      return;
    }

    try {
      setTransactionLoading('checkIn');

      // Get wallet provider from Privy user
      // Note: This may need adjustment based on Privy Expo SDK's actual API
      const walletAccount = user?.linked_accounts?.find(
        (account: { type: string }) => account.type === 'wallet'
      );

      if (!walletAccount || !('address' in walletAccount)) {
        throw new Error('Wallet account not found');
      }

      // Create wallet client - this may need adjustment based on Privy's provider API
      // For now, we'll need to get the provider from Privy's wallet object
      // This is a placeholder - actual implementation depends on Privy Expo SDK
      const walletClient = createPrivyWalletClient(
        (walletAccount as { provider?: unknown }).provider,
        address as Address
      );

      const result = await contractService.recordCheckIn(walletClient);

      if (result.error) {
        Alert.alert('Transaction Failed', result.error.message);
      } else {
        Alert.alert('Success', 'Check-in recorded on blockchain!');
        // Reload contract data
        const checkInResult = await contractService.getUserCheckInCount(address);
        if (checkInResult.data !== null) {
          setCheckInCount(checkInResult.data);
        }
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to record check-in'
      );
    } finally {
      setTransactionLoading(null);
    }
  };

  const handleRecordSteps = async () => {
    if (!isConnected || !address) {
      Alert.alert('Wallet Not Connected', 'Please connect your wallet first.');
      return;
    }

    if (!isOnScrollSepolia) {
      Alert.alert(
        'Wrong Network',
        'Please switch to Scroll Sepolia network to record steps.'
      );
      return;
    }

    if (!summary || summary.steps < 10000) {
      Alert.alert('Insufficient Steps', 'You need at least 10,000 steps to record.');
      return;
    }

    try {
      setTransactionLoading('steps');

      const walletAccount = user?.linked_accounts?.find(
        (account: { type: string }) => account.type === 'wallet'
      );

      if (!walletAccount || !('address' in walletAccount)) {
        throw new Error('Wallet account not found');
      }

      const walletClient = createPrivyWalletClient(
        (walletAccount as { provider?: unknown }).provider,
        address as Address
      );

      const result = await contractService.recordSteps(walletClient, BigInt(summary.steps));

      if (result.error) {
        Alert.alert('Transaction Failed', result.error.message);
      } else {
        Alert.alert('Success', 'Steps recorded on blockchain!');
        // Reload contract data
        const stepsResult = await contractService.getUserSteps10KCount(address);
        if (stepsResult.data !== null) {
          setSteps10KCount(stepsResult.data);
        }
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to record steps'
      );
    } finally {
      setTransactionLoading(null);
    }
  };

  const formatAddress = (addr: Address | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Health Snapshot</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.metaText}>Source • {sourceLabel}</Text>
        </View>

        {/* Wallet Connection Section */}
        <View style={styles.walletSection}>
          <Text style={styles.sectionTitle}>Blockchain Achievements</Text>
          {!isConnected ? (
            <Pressable
              style={styles.connectButton}
              onPress={connectExternalWallet}
              disabled={!user}
            >
              <Text style={styles.connectButtonText}>Connect Wallet</Text>
            </Pressable>
          ) : (
            <View style={styles.walletInfo}>
              <Text style={styles.walletAddress}>Wallet: {formatAddress(address)}</Text>
              {!isOnScrollSepolia && (
                <Text style={styles.networkWarning}>
                  ⚠️ Please switch to Scroll Sepolia (Chain ID: 534351)
                </Text>
              )}
              {contractLoading ? (
                <ActivityIndicator size="small" color={theme.colors.primary[100]} />
              ) : contractError ? (
                <Text style={styles.errorText}>{contractError}</Text>
              ) : (
                <View style={styles.achievementStats}>
                  <Text style={styles.achievementText}>
                    Check-ins: {checkInCount?.toString() ?? '0'}
                  </Text>
                  <Text style={styles.achievementText}>
                    10K Steps: {steps10KCount?.toString() ?? '0'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Transaction Buttons */}
        {isConnected && isOnScrollSepolia && (
          <View style={styles.actionButtons}>
            <Pressable
              style={[
                styles.actionButton,
                transactionLoading === 'checkIn' && styles.actionButtonDisabled,
              ]}
              onPress={handleRecordCheckIn}
              disabled={!!transactionLoading}
            >
              {transactionLoading === 'checkIn' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionButtonText}>Record Check-In</Text>
              )}
            </Pressable>
            <Pressable
              style={[
                styles.actionButton,
                (transactionLoading === 'steps' ||
                  !summary ||
                  summary.steps < 10000) &&
                  styles.actionButtonDisabled,
              ]}
              onPress={handleRecordSteps}
              disabled={!!transactionLoading || !summary || summary.steps < 10000}
            >
              {transactionLoading === 'steps' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionButtonText}>
                  Record Steps ({summary?.steps.toLocaleString() ?? '0'})
                </Text>
              )}
            </Pressable>
          </View>
        )}

        {loadState === 'loading' ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={theme.colors.primary[100]} />
            <Text style={styles.metaText}>Syncing health data…</Text>
          </View>
        ) : (
          <>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <View style={styles.statsGroup}>
              {metrics.map((metric) => (
                <StatsCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  unit={metric.unit}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const formatSummaryDate = (date: Date) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.warn('Failed to format date, falling back to default string', error);
    return date.toDateString();
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white[100],
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[6],
    gap: theme.spacing[4],
  },
  header: {
    gap: theme.spacing[1],
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.black[100],
    fontFamily: 'Lato_700Bold',
  },
  dateText: {
    fontSize: 16,
    color: theme.colors.black[16],
    fontFamily: 'Lato_400Regular',
  },
  metaText: {
    fontSize: 14,
    color: theme.colors.black[16],
    fontFamily: 'Lato_400Regular',
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[10],
    gap: theme.spacing[2],
  },
  statsGroup: {
    borderRadius: 16,
    backgroundColor: theme.colors.white[100],
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    padding: theme.spacing[2],
  },
  errorText: {
    color: theme.colors.red[100],
    fontSize: 14,
    fontFamily: 'Lato_400Regular',
  },
  walletSection: {
    borderRadius: 16,
    backgroundColor: theme.colors.white[100],
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.black[100],
    fontFamily: 'Lato_700Bold',
  },
  connectButton: {
    backgroundColor: theme.colors.primary[100] || '#9747FF',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: 8,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Lato_700Bold',
  },
  walletInfo: {
    gap: theme.spacing[2],
  },
  walletAddress: {
    fontSize: 14,
    color: theme.colors.black[100],
    fontFamily: 'Lato_400Regular',
  },
  networkWarning: {
    fontSize: 12,
    color: theme.colors.red[100] || '#FF4444',
    fontFamily: 'Lato_400Regular',
  },
  achievementStats: {
    gap: theme.spacing[1],
  },
  achievementText: {
    fontSize: 14,
    color: theme.colors.black[100],
    fontFamily: 'Lato_400Regular',
  },
  actionButtons: {
    gap: theme.spacing[3],
  },
  actionButton: {
    backgroundColor: theme.colors.primary[100] || '#9747FF',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Lato_700Bold',
  },
});
