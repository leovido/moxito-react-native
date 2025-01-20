import React from 'react';
import { View, StyleSheet, Text, Image, ScrollView, Platform, ImageBackground, Pressable, TouchableOpacity } from 'react-native';
import { theme } from '../../src/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const icons = (label: string) => {
  switch (label) {
    case 'Steps today':
      return <Image source={require('../../assets/images/icon-run.png')} style={styles.statsIcon} />
    case 'Calories burned':
      return <Image source={require('../../assets/images/icon-calories.png')} style={styles.statsIcon} />
    case 'Distance traveled':
      return <Image source={require('../../assets/images/icon-run.png')} style={styles.statsIcon} />
    case 'Resting Heart Rate':
      return <Image source={require('../../assets/images/icon-like.png')} style={styles.statsIcon} />
    default:
      return null;
  }
}
// Components
const StatsCard = ({ label, value, unit }: { label: string; value: string | number; unit: string }) => (
  <View style={styles.statsRow}>
    <View style={styles.iconContainer}>
      {icons(label)}
    </View>
    <View style={styles.statsTextContainer}>
      <Text style={styles.statsLabel} numberOfLines={2}>{label.split(' ')[0]}</Text>
      <Text style={styles.statsLabel} numberOfLines={2}>{label.split(' ')[1]}</Text>
    </View>
    <View style={styles.valueContainer}>
      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.unitText}>{unit}</Text>
    </View>
  </View>
);

const EarningsCard = () => (
  <LinearGradient
    colors={['#1D1D1D', '#3D3D3D']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.earningsCard}>
    <Image source={require('../../assets/images/icon-run-move.png')} style={[styles.moxieCoin, {width: '40%', height: '100%'}]} />

    <View style={styles.earningsContent}>
      <Text style={[styles.earningsLabel, {fontFamily: 'Lato_300Light'}]}>Earned from steps</Text>
      <Text style={styles.earningsValue}>859</Text>
      <Text style={styles.earningsSubtext}>~$ 1.23</Text>
    </View>
  </LinearGradient>
);

export default function HomeScreen() {
  const username = 'Disky.eth';

  return (
    // <View style={styles.container}>
      <ImageBackground 
      source={require('../../assets/images/app-bg2.png')}
      style={styles.container}
      resizeMode="cover"
      >
        {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            <Text style={[styles.greetingLight, {fontFamily: 'Lato_300Light'}]}>Hi, </Text>
            <Text style={[styles.greetingBold, {fontFamily: 'Lato_700Bold'}]}>{username}</Text>
          </Text>
          <Text style={[styles.lastUpdate,
            {
              fontFamily: Platform.select({
                android: 'Lato_300Light',
                ios: 'Lato-Light',
              }),
            },
          ]}>Last update: 8h ago</Text>
        </View>
        <View style={styles.headerIcons}>
          <Pressable 
            style={styles.settingsIcon}
            onPress={() => {router.push('/(auth)')}}
          />
          <Pressable 
            style={styles.profileIcon}
            onPress={() => {console.log('profile')}}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
      {/* Moxie Banner */}
      <LinearGradient
        colors={[theme.colors.primary[100], '#BC99FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.moxieBanner}
      >
        <Text style={styles.moxieText}>You are earning points while running!</Text>
      </LinearGradient>

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
        <TouchableOpacity 
          style={styles.activeTimeFilter}
          onPress={() => console.log('Daily selected')}
        >
          <Text style={styles.timeFilterText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.inactiveTimeFilter}
          onPress={() => console.log('Weekly selected')}
        >
          <Text style={styles.timeFilterText}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.inactiveTimeFilter}
          onPress={() => console.log('Monthly selected')}
        >
          <Text style={styles.timeFilterText}>Month</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </ImageBackground>
      
    // </View>
    
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
    color: theme.colors.black[100],
  },
  greetingLight: {
    fontWeight: theme.fontWeights.light,
  },
  greetingBold: {
    fontWeight: theme.fontWeights.black,
  },
  lastUpdate: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.black[100],
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
    padding: theme.spacing[4],
    borderRadius: 24,
    marginBottom: theme.spacing[4],
  },
  moxieText: {
    color: theme.colors.white[100],
    fontSize: theme.fontSizes.sm,
    textAlign: 'center',
    fontFamily: 'Lato_400Regular',
  },
  earningsCard: {
    flex: 1,
    backgroundColor: theme.colors.black[100],
    borderRadius: 24,
    padding: theme.spacing[7],
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: theme.spacing[4],
    gap: theme.spacing[4],
  },
  moxieCoin: {
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
    fontSize: 54,
    fontWeight: theme.fontWeights.bold,
    fontFamily: 'Lato_700Bold',
  },
  earningsSubtext: {
    color: theme.colors.white[50],
    fontSize: 20,
    fontFamily: 'Lato_300Light',
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
    padding: theme.spacing[2],
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.black[8],
    borderRadius: 20,
    marginRight: theme.spacing[3],
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsTextContainer: {
    flex: 1,
  },
  statsLabel: {
    fontSize: 18,
    color: theme.colors.black[100],
    fontFamily: 'Lato_700Bold',
    fontWeight: theme.fontWeights.bold,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing[1],
  },
  valueText: {
    fontSize: 32,
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
  statsIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
}); 