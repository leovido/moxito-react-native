import { useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const [userProfile] = useState({
    name: 'Moxie User',
    email: 'user@moxito.xyz',
    avatar: null,
    level: 'Beginner',
    totalWorkouts: 0,
    totalMinutes: 0,
    streak: 0,
  });

  const handleEditProfile = () => {
    console.log('Edit Profile');
    // TODO: Navigate to edit profile screen
  };

  const handleSettings = () => {
    console.log('Settings');
    // TODO: Navigate to settings screen
  };

  const handleLogout = () => {
    console.log('Logout');
    // TODO: Implement logout functionality
  };

  const profileOptions = [
    { title: 'Edit Profile', icon: '✏️', onPress: handleEditProfile },
    { title: 'Settings', icon: '⚙️', onPress: handleSettings },
    { title: 'Help & Support', icon: '❓', onPress: () => console.log('Help') },
    { title: 'About', icon: 'ℹ️', onPress: () => console.log('About') },
  ];

  return (
    <ImageBackground
      source={require('../../assets/images/app-bg2.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {userProfile.avatar ? (
                <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{userProfile.name.charAt(0).toUpperCase()}</Text>
                </View>
              )}
            </View>

            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
            <Text style={styles.userLevel}>{userProfile.level}</Text>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsOverview}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.totalWorkouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>

          {/* Profile Options */}
          <View style={styles.profileOptions}>
            <Text style={styles.sectionTitle}>Profile</Text>
            {profileOptions.map((option, _index) => (
              <Pressable key={option.title} style={styles.optionItem} onPress={option.onPress}>
                <View style={styles.optionContent}>
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                </View>
                <Text style={styles.optionArrow}>›</Text>
              </Pressable>
            ))}
          </View>

          {/* Logout Button */}
          <View style={styles.logoutSection}>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </Pressable>
          </View>

          {/* App Version */}
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Moxito Fitness v1.0.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#9747FF',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#9747FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#9747FF',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Lato_700Bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'Lato_700Bold',
  },
  userEmail: {
    fontSize: 16,
    color: '#E5E7EB',
    marginBottom: 8,
    fontFamily: 'Lato_400Regular',
  },
  userLevel: {
    fontSize: 14,
    color: '#9747FF',
    fontWeight: '600',
    fontFamily: 'Lato_700Bold',
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 15,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9747FF',
    marginBottom: 4,
    fontFamily: 'Lato_700Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#D1D5DB',
    textAlign: 'center',
    fontFamily: 'Lato_400Regular',
  },
  profileOptions: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    fontFamily: 'Lato_700Bold',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  optionTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Lato_700Bold',
  },
  optionArrow: {
    fontSize: 18,
    color: '#9CA3AF',
    fontFamily: 'Lato_400Regular',
  },
  logoutSection: {
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Lato_700Bold',
  },
  versionInfo: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Lato_400Regular',
  },
});
