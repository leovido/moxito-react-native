import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {/* Profile Tab */}
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => router.push('/profile')}
      >
        <Ionicons 
          name={pathname === '/profile' ? 'person' : 'person-outline'} 
          size={24} 
          color={pathname === '/profile' ? theme.colors.primary[100] : theme.colors.black[16]} 
        />
      </TouchableOpacity>

      {/* Home Tab */}
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => router.push('/home')}
      >
        <Ionicons 
          name={pathname === '/home' ? 'home' : 'home-outline'} 
          size={24} 
          color={pathname === '/home' ? theme.colors.primary[100] : theme.colors.black[16]} 
        />
      </TouchableOpacity>

      {/* Center Running Button */}
      <TouchableOpacity 
        style={styles.centerButton}
        onPress={() => router.push('/fitness')}
      >
        <View style={styles.runningIconContainer}>
          <Ionicons name="walk" size={24} color={theme.colors.white[100]} />
        </View>
      </TouchableOpacity>

      {/* Search Tab */}
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => router.push('/search')}
      >
        <Ionicons 
          name={pathname === '/search' ? 'search' : 'search-outline'} 
          size={24} 
          color={pathname === '/search' ? theme.colors.primary[100] : theme.colors.black[16]} 
        />
      </TouchableOpacity>

      {/* Settings Tab */}
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => router.push('/settings')}
      >
        <Ionicons 
          name={pathname === '/settings' ? 'settings' : 'settings-outline'} 
          size={24} 
          color={pathname === '/settings' ? theme.colors.primary[100] : theme.colors.black[16]} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: theme.colors.white[100],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: theme.colors.black[100],
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 56,
    height: 56,
    marginBottom: 40, // Offset to make it stick out from the tab bar
    backgroundColor: theme.colors.primary[100],
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary[100],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  runningIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 