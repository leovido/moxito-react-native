import type React from 'react';
import { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface RedactedProps {
  children: React.ReactNode;
  isLoading: boolean;
}

export function Redacted({ children, isLoading }: RedactedProps) {
  const shimmerValue = new Animated.Value(0);

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isLoading, shimmerValue]);

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {children}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.shimmer,
          {
            opacity: shimmerValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.7],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  shimmer: {
    backgroundColor: '#E0E0E0',
  },
});
