import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // TODO: Implement actual search functionality
      console.log('Searching for:', searchQuery);

      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false);
        // TODO: Replace with actual search results
        setSearchResults([]);
      }, 1000);
    }
  };

  const handleWorkoutSearch = (workoutType: string) => {
    setSearchQuery(workoutType);
    handleSearch();
  };

  const quickSearches = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Running', 'Cycling'];

  return (
    <ImageBackground
      source={require('../../assets/images/app-bg2.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Search Workouts</Text>
            <Text style={styles.subtitle}>Find the perfect workout for you</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search workouts, exercises, or routines..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <Pressable style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Search</Text>
              </Pressable>
            </View>
          </View>

          {/* Quick Search Options */}
          <View style={styles.quickSearch}>
            <Text style={styles.sectionTitle}>Quick Search</Text>
            <View style={styles.quickSearchGrid}>
              {quickSearches.map((workout, _index) => (
                <Pressable
                  key={workout}
                  style={styles.quickSearchItem}
                  onPress={() => handleWorkoutSearch(workout)}
                >
                  <LinearGradient
                    colors={['rgba(151, 71, 255, 0.8)', 'rgba(124, 58, 237, 0.8)']}
                    style={styles.quickSearchGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.quickSearchText}>{workout}</Text>
                  </LinearGradient>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Search Results */}
          <View style={styles.searchResults}>
            <Text style={styles.sectionTitle}>Search Results</Text>

            {isSearching ? (
              <View style={styles.loadingCard}>
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            ) : searchQuery && searchResults.length === 0 ? (
              <View style={styles.noResultsCard}>
                <Text style={styles.noResultsText}>No workouts found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try adjusting your search terms or browse our quick search options
                </Text>
              </View>
            ) : !searchQuery ? (
              <View style={styles.placeholderCard}>
                <Text style={styles.placeholderText}>Start searching to find workouts</Text>
                <Text style={styles.placeholderSubtext}>
                  Use the search bar above or try our quick search options
                </Text>
              </View>
            ) : null}
          </View>

          {/* Popular Workouts */}
          <View style={styles.popularWorkouts}>
            <Text style={styles.sectionTitle}>Popular Workouts</Text>
            <View style={styles.popularGrid}>
              {['Full Body', 'Core', 'Upper Body', 'Lower Body'].map((workout, _index) => (
                <Pressable key={workout} style={styles.popularItem}>
                  <View style={styles.popularItemContent}>
                    <Text style={styles.popularItemText}>{workout}</Text>
                    <Text style={styles.popularItemSubtext}>Workout</Text>
                  </View>
                </Pressable>
              ))}
            </View>
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
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Lato_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    fontFamily: 'Lato_400Regular',
  },
  searchContainer: {
    marginBottom: 30,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Lato_400Regular',
  },
  searchButton: {
    backgroundColor: '#9747FF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Lato_700Bold',
  },
  quickSearch: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    fontFamily: 'Lato_700Bold',
  },
  quickSearchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickSearchItem: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#9747FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  quickSearchGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  quickSearchText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Lato_700Bold',
    textAlign: 'center',
  },
  searchResults: {
    marginBottom: 30,
  },
  loadingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Lato_700Bold',
  },
  noResultsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'Lato_700Bold',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    fontFamily: 'Lato_400Regular',
  },
  placeholderCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'Lato_700Bold',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    fontFamily: 'Lato_400Regular',
  },
  popularWorkouts: {
    marginBottom: 30,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  popularItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  popularItemContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  popularItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Lato_700Bold',
    textAlign: 'center',
  },
  popularItemSubtext: {
    fontSize: 12,
    color: '#D1D5DB',
    fontFamily: 'Lato_400Regular',
  },
});
