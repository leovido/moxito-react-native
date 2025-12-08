import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock Data
type Stat = {
  id: number;
  label: string;
  value: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
};

const STATS: Stat[] = [
  { id: 1, label: 'Heart Rate', value: '55 BPM', icon: 'heart-pulse', color: '#FF4757' },
  { id: 2, label: 'Distance', value: '34km', icon: 'map-marker-distance', color: '#10B981' },
  { id: 3, label: 'Workouts', value: '3 workouts', icon: 'dumbbell', color: '#F59E0B' },
  { id: 4, label: 'Avg BPM', value: '55 BPM', icon: 'speedometer', color: '#A855F7' },
];

export default function DesignPreviewScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Week');

  const TABS = ['Today', 'Week', 'Month'];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      {/* Background Gradient Orbs for Atmosphere */}
      <View style={[styles.orb, styles.orbPurple]} />
      <View style={[styles.orb, styles.orbGreen]} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello, Leovido</Text>
              <Text style={styles.lastUpdate}>Last update: 20 min ago</Text>
            </View>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={24} color="#FFF" />
            </View>
          </View>

          {/* Main Progress Card */}
          <LinearGradient
            colors={['rgba(151, 71, 255, 0.8)', 'rgba(124, 58, 237, 0.6)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainCard}
          >
            <View style={styles.mainCardContent}>
              <View>
                <Text style={styles.stepsValue}>10039 / 10000</Text>
                <Text style={styles.pointsValue}>48 points</Text>
              </View>
              {/* Progress Ring Placeholder - Could be an SVG */}
              <View style={styles.progressRing}>
                <MaterialCommunityIcons name="shoe-print" size={32} color="rgba(255,255,255,0.8)" />
              </View>
            </View>
          </LinearGradient>

          {/* Timeframe Toggles */}
          <View style={styles.tabsContainer}>
            {TABS.map((tab) => (
              <Pressable
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Stats Grid */}
          <View style={styles.gridContainer}>
            {STATS.map((stat) => (
              <BlurView key={stat.id} intensity={20} tint="dark" style={styles.statCard}>
                <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                  <MaterialCommunityIcons name={stat.icon} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </BlurView>
            ))}
          </View>

          {/* Large Chart/Info Card */}
          <BlurView intensity={10} tint="dark" style={styles.largeCard}>
            <View style={styles.largeCardPlaceholder}>
              <MaterialCommunityIcons name="chart-timeline-variant" size={48} color="#555" />
              <Text style={styles.largeCardText}>Activity Analysis</Text>
            </View>
          </BlurView>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* Bottom Claim Button */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating Claim Button */}
        <View style={styles.bottomContainer}>
          <Pressable style={styles.claimButton} onPress={() => console.log('Claim')}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.claimGradient}
            >
              <Text style={styles.claimText}>Claim</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Back Button for Demo */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  orb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.3,
  },
  orbPurple: {
    backgroundColor: '#9747FF',
    top: -50,
    left: -100,
  },
  orbGreen: {
    backgroundColor: '#10B981',
    bottom: 100,
    right: -100,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 40, // Space for back button
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Lato_700Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  lastUpdate: {
    fontSize: 14,
    color: '#AAA',
    fontFamily: 'Lato_400Regular',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  mainCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mainCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepsValue: {
    fontSize: 32,
    fontFamily: 'Lato_900Black',
    color: '#FFF',
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'Lato_700Bold',
  },
  progressRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#333',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 56) / 2, // 20px padding * 2 + 16px gap
    backgroundColor: 'rgba(30,30,30,0.6)',
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#AAA',
  },
  largeCard: {
    height: 180,
    borderRadius: 20,
    backgroundColor: 'rgba(30,30,30,0.6)',
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  largeCardPlaceholder: {
    alignItems: 'center',
    opacity: 0.5,
  },
  largeCardText: {
    color: '#888',
    marginTop: 12,
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  activeDot: {
    backgroundColor: '#FFF',
    width: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'transparent',
  },
  claimButton: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  claimGradient: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  claimText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
