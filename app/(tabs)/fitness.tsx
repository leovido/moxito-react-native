import { type HealthDailySummary, healthDataService } from '@moxito/services';
import { theme } from '@moxito/theme';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatsCard } from '@/components/StatsCard';

type LoadState = 'loading' | 'ready' | 'error';

export default function FitnessScreen() {
  const [summary, setSummary] = useState<HealthDailySummary | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Health Snapshot</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.metaText}>Source • {sourceLabel}</Text>
        </View>

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
});
