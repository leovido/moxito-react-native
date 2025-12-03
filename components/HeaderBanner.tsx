import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Accessibility,
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from '../constants/DesignSystem';

interface HeaderBannerProps {
  /** Greeting text (e.g., "Hello, Moxito") */
  greeting: string;
  /** Last update text (e.g., "Last update: 7 seconds ago") */
  lastUpdate: string;
  /** Callback when Claim button is pressed */
  onClaim?: () => void;
  /** Callback when Settings button is pressed */
  onSettings?: () => void;
  /** Custom claim button text (default: "Claim") */
  claimButtonText?: string;
  /** Whether to show the claim button (default: true) */
  showClaimButton?: boolean;
  /** Whether to show the settings button (default: true) */
  showSettingsButton?: boolean;
}

export function HeaderBanner({
  greeting,
  lastUpdate,
  onClaim,
  onSettings,
  claimButtonText = 'Claim',
  showClaimButton = true,
  showSettingsButton = true,
}: HeaderBannerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.sm }]}>
      <View style={styles.leftContent}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.lastUpdate}>{lastUpdate}</Text>
      </View>
      <View style={styles.rightContent}>
        {showClaimButton && (
          <Pressable
            style={styles.claimButton}
            onPress={onClaim}
            accessibilityLabel={claimButtonText}
            accessibilityRole="button"
          >
            <Text style={styles.claimButtonText}>{claimButtonText}</Text>
          </Pressable>
        )}
        {showSettingsButton && (
          <Pressable
            style={styles.settingsButton}
            onPress={onSettings}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <Ionicons name="settings-outline" size={20} color={Colors.primary[500]} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    width: '100%',
  },
  leftContent: {
    flex: 1,
    flexDirection: 'column',
  },
  greeting: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    fontFamily: 'Lato_700Bold',
  },
  lastUpdate: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.text.primary,
    opacity: 0.9,
    fontFamily: 'Lato_400Regular',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  claimButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    minHeight: Accessibility.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimButtonText: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    fontFamily: 'Lato_700Bold',
  },
  settingsButton: {
    width: Accessibility.minTouchTarget,
    height: Accessibility.minTouchTarget,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[0],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
