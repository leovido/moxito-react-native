import type { HealthDailySummary } from '@moxito/services';
import { theme } from '@moxito/theme';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatsCard } from '@/components/StatsCard';

export default function FitnessScreen() {
  // Health data will be loaded when workout starts
  // For now, show empty state or mock data
  const [summary] = useState<HealthDailySummary | null>(null);

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

        {summary ? (
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
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Health data will appear here after you start a workout.
            </Text>
          </View>
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[10],
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.colors.black[16],
    fontFamily: 'Lato_400Regular',
    textAlign: 'center',
  },
});
