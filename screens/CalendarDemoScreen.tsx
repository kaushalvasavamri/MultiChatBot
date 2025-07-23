import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CalendarEventScreen from './CalendarEventScreen';

interface CalendarDemoScreenProps {
  navigation?: any;
}

const CalendarDemoScreen: React.FC<CalendarDemoScreenProps> = ({ navigation }) => {
  const [showCalendarScreen, setShowCalendarScreen] = React.useState(false);

  const handleAddEventPress = () => {
    setShowCalendarScreen(true);
  };

  const handleBackPress = () => {
    setShowCalendarScreen(false);
  };

  if (showCalendarScreen) {
    return (
      <View style={styles.container}>
        {/* <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity> */}
        <CalendarEventScreen navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Calendar Demo</Text>
        <Text style={styles.subtitle}>
          Tap the button below to add events to your device calendar
        </Text>
        
        <TouchableOpacity style={styles.addEventButton} onPress={handleAddEventPress}>
          <Text style={styles.addEventButtonText}>📅 Add Event</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Features:</Text>
          <Text style={styles.infoText}>• Add events to device calendar</Text>
          <Text style={styles.infoText}>• Set custom date and time</Text>
          <Text style={styles.infoText}>• Add title and description</Text>
          <Text style={styles.infoText}>• Works on both iOS and Android</Text>
          <Text style={styles.infoText}>• Automatic permission handling</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  addEventButton: {
    backgroundColor: '#3498db',
    borderRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    transform: [{ scale: 1 }],
  },
  addEventButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    lineHeight: 22,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    backgroundColor: '#34495e',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CalendarDemoScreen;
