import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { theme } from '../../src/theme';

// Components
const StatsCard = ({ label, value, unit }: { label: string; value: string | number; unit: string }) => (
  <View style={styles.statsRow}>
    <View style={styles.iconContainer}>
      {/* You'll need to add proper icons here */}
      <View  />
    </View>
    <View style={styles.statsTextContainer}>
      <Text style={styles.statsLabel}>{label}</Text>
    </View>
    <View style={styles.valueContainer}>
      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.unitText}>{unit}</Text>
    </View>
  </View>
);

const EarningsCard = () => (
  <View style={styles.earningsCard}>
    {/* <Image 
      source={require('../../assets/images/moxie-coin.png')} 
      style={styles.moxieCoin}
    /> */}
    <View style={styles.earningsContent}>
      <Text style={styles.earningsLabel}>Earned from steps</Text>
      <Text style={styles.earningsValue}>859</Text>
      <Text style={styles.earningsSubtext}>~$ 1.23</Text>
    </View>
  </View>
);

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, Disky.eth</Text>
          <Text style={styles.lastUpdate}>Last update: 8h ago</Text>
        </View>
        <View style={styles.headerIcons}>
          <View style={styles.settingsIcon} />
          <View style={styles.profileIcon} />
        </View>
      </View>

      {/* Moxie Banner */}
      <View style={styles.moxieBanner}>
        <Text style={styles.moxieText}>You are earning Moxie while running!</Text>
      </View>

      {/* Earnings Card */}
      <EarningsCard />

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatsCard label="Steps today" value="6733" unit="10k" />
        <StatsCard label="Calories burned" value="2112" unit="kcal" />
        <StatsCard label="Distance traveled" value="23" unit="kcal" />
        <StatsCard label="Resting Heart Rate" value="80" unit="bpm" />
      </View>

      {/* Time Filter */}
      <View style={styles.timeFilter}>
        <View style={styles.activeTimeFilter}>
          <Text style={styles.timeFilterText}>Daily</Text>
        </View>
        <View style={styles.inactiveTimeFilter}>
          <Text style={styles.timeFilterText}>Weekly</Text>
        </View>
        <View style={styles.inactiveTimeFilter}>
          <Text style={styles.timeFilterText}>Month</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary[10],
    padding: theme.spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[4],
  },
  greeting: {
    fontSize: theme.fontSizes['2xl'],
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.black[100],
  },
  lastUpdate: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.black[16],
  },
  headerIcons: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  settingsIcon: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.white[100],
    borderRadius: 20,
  },
  profileIcon: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.primary[100],
    borderRadius: 20,
  },
  moxieBanner: {
    backgroundColor: theme.colors.primary[100],
    padding: theme.spacing[4],
    borderRadius: 12,
    marginBottom: theme.spacing[4],
  },
  moxieText: {
    color: theme.colors.white[100],
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
  },
  earningsCard: {
    backgroundColor: theme.colors.black[100],
    borderRadius: 16,
    padding: theme.spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  moxieCoin: {
    width: 60,
    height: 60,
    marginRight: theme.spacing[4],
  },
  earningsContent: {
    flex: 1,
  },
  earningsLabel: {
    color: theme.colors.white[100],
    fontSize: theme.fontSizes.sm,
  },
  earningsValue: {
    color: theme.colors.white[100],
    fontSize: theme.fontSizes['3xl'],
    fontWeight: theme.fontWeights.bold,
  },
  earningsSubtext: {
    color: theme.colors.white[50],
    fontSize: theme.fontSizes.sm,
  },
  statsContainer: {
    backgroundColor: theme.colors.white[100],
    borderRadius: 16,
    padding: theme.spacing[4],
    gap: theme.spacing[4],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.black[8],
    borderRadius: 20,
    marginRight: theme.spacing[3],
  },
  statsTextContainer: {
    flex: 1,
  },
  statsLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.black[100],
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing[1],
  },
  valueText: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.black[100],
  },
  unitText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.black[16],
  },
  timeFilter: {
    flexDirection: 'row',
    gap: theme.spacing[2],
    marginTop: theme.spacing[4],
  },
  activeTimeFilter: {
    backgroundColor: theme.colors.black[100],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    borderRadius: 24,
  },
  inactiveTimeFilter: {
    backgroundColor: theme.colors.black[8],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    borderRadius: 24,
  },
  timeFilterText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.white[100],
  },
}); 