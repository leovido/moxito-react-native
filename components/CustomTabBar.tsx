// CustomTabBar.tsx
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

const icons = (label: string, isSelected: boolean) => {
  const iconStyle = [
    styles.statsIcon,
    { tintColor: isSelected ? '#FFFFFF' : '#222222' }
  ];
  
  switch (label) {
    case 'profile':
      return <Image source={require('../assets/images/icon-profile.png')} style={iconStyle} />
    case 'fitness':
      return <Image source={require('../assets/images/icon-run.png')} style={iconStyle} />
    case 'home':
      return <Image source={require('../assets/images/icon-home.png')} style={iconStyle} />
    case 'search':
      return <Image source={require('../assets/images/icon-search.png')} style={iconStyle} />
    default:
      return null;
  }
}

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tab,
              isFocused && styles.selectedTab
            ]}
          >
            {icons(route.name, isFocused)}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 50,
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    borderRadius: 20,
    height: 36,
  },
  selectedTab: {
    backgroundColor: '#9747FF',
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statsIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#222222',
  },
});