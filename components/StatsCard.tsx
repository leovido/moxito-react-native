import { theme } from '@moxito/theme';
import { StyleSheet, Text, View } from 'react-native';
import { getFitnessIcon } from '@/constants/icons';

interface StatsCardProps {
  label: string;
  value: string | number;
  unit: string;
}

export const StatsCard = ({ label, value, unit }: StatsCardProps) => (
  <View style={styles.statsRow}>
    <View style={styles.iconContainer}>{getFitnessIcon(label)}</View>
    <View style={styles.statsTextContainer}>
      <Text style={styles.statsLabel} numberOfLines={2}>
        {label.split(' ')[0]}
      </Text>
      <Text style={styles.statsLabel} numberOfLines={2}>
        {label.split(' ')[1]}
      </Text>
    </View>
    <View style={styles.valueContainer}>
      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.unitText}>{unit}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
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
});
