// CustomTabBar.tsx
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const icons = (label: string, isSelected: boolean) => {
  const iconStyle = [styles.statsIcon, { tintColor: isSelected ? '#FFFFFF' : '#222222' }];

  switch (label) {
    case 'profile':
      return <Image source={require('../assets/images/icon-profile.png')} style={iconStyle} />;
    case 'fitness':
      return <Image source={require('../assets/images/icon-run.png')} style={iconStyle} />;
    case 'home':
      return <Image source={require('../assets/images/icon-home.png')} style={iconStyle} />;
    case 'search':
      return <Image source={require('../assets/images/icon-search.png')} style={iconStyle} />;
    default:
      return null;
  }
};

const getTabLabel = (routeName: string) => {
  switch (routeName) {
    case 'home':
      return 'Home';
    case 'fitness':
      return 'Fitness';
    case 'search':
      return 'Search';
    case 'profile':
      return 'Profile';
    default:
      return routeName;
  }
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']} style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={
                options.tabBarAccessibilityLabel || `${getTabLabel(route.name)} tab`
              }
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tab, isFocused && styles.selectedTab]}
            >
              {icons(route.name, isFocused)}
              <Text style={[styles.tabLabel, { color: isFocused ? '#FFFFFF' : '#222222' }]}>
                {getTabLabel(route.name)}
              </Text>
            </Pressable>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 90 : 70,
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderRadius: 20,
    height: 50,
    paddingVertical: 8,
  },
  selectedTab: {
    backgroundColor: '#9747FF',
    shadowColor: '#9747FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  statsIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
});
