import { AntDesign } from '@expo/vector-icons';
import { theme } from '@moxito/theme';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatsCard } from '@/components/StatsCard';
import useHealthData from '@/hooks/useHealthData';

export default function FitnessScreen() {
  const [date, setDate] = useState(new Date());
  const { steps, distance } = useHealthData(date);

  const changeDate = (numDays: number) => {
    const currentDate = new Date(date); // Create a copy of the current date
    // Update the date by adding/subtracting the number of days
    currentDate.setDate(currentDate.getDate() + numDays);

    setDate(currentDate); // Update the state variable
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.datePicker}>
          <AntDesign onPress={() => changeDate(-1)} name="left" size={20} color="#C3FF53" />
          <Text style={styles.date}>{date.toDateString()}</Text>

          <AntDesign onPress={() => changeDate(1)} name="right" size={20} color="#C3FF53" />
        </View>

        <View style={styles.statsGroup}>
          <StatsCard key={steps} label={'Steps'} value={steps} unit={'meters'} />
          <StatsCard key={distance} label={'Distance'} value={distance} unit={'meters'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white[100],
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[6],
    gap: theme.spacing[4],
  },
  datePicker: {
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  date: {
    color: 'black',
    fontWeight: '500',
    fontSize: 20,
    marginHorizontal: 20,
  },
  statsGroup: {
    borderRadius: 16,
    backgroundColor: theme.colors.white[100],
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    padding: theme.spacing[2],
  },
});
