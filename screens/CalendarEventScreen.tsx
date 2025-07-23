import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import * as Calendar from 'expo-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CalendarEventScreenProps {
  navigation?: any;
}

const CalendarEventScreen: React.FC<CalendarEventScreenProps> = ({ navigation }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventEndDate, setEventEndDate] = useState(new Date(Date.now() + 60 * 60 * 1000)); // 1 hour later
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');

  // Request calendar permissions
  const getCalendarPermissions = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Calendar permission is required to add events to your calendar.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Get default calendar
  const getDefaultCalendar = async () => {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendar = calendars.find(
      (cal) => cal.source.name === 'Default' || cal.isPrimary
    ) || calendars[0];
    return defaultCalendar;
  };

  // Add event to calendar
  const addEventToCalendar = async () => {
    if (!eventTitle.trim()) {
      Alert.alert('Error', 'Please enter an event title.');
      return;
    }

    try {
      const hasPermission = await getCalendarPermissions();
      if (!hasPermission) return;

      const defaultCalendar = await getDefaultCalendar();
      
      if (!defaultCalendar) {
        Alert.alert('Error', 'No calendar found on this device.');
        return;
      }

      const eventDetails = {
        title: eventTitle,
        notes: eventDescription,
        startDate: eventDate,
        endDate: eventEndDate,
        timeZone: 'GMT',
        allDay: false,
      };

      const eventId = await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
      
      if (eventId) {
        Alert.alert(
          'Success!',
          `Event "${eventTitle}" has been added to your calendar.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setEventTitle('');
                setEventDescription('');
                setEventDate(new Date());
                setEventEndDate(new Date(Date.now() + 60 * 60 * 1000));
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      Alert.alert('Error', 'Failed to add event to calendar. Please try again.');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowEndDatePicker(false);
    }
    
    if (selectedDate) {
      if (showDatePicker) {
        setEventDate(selectedDate);
        // Auto-update end date to be 1 hour after start date
        setEventEndDate(new Date(selectedDate.getTime() + 60 * 60 * 1000));
      } else if (showEndDatePicker) {
        setEventEndDate(selectedDate);
      }
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add Calendar Event</Text>
        <Text style={styles.subtitle}>
          Create and add events to your device calendar
        </Text>

        {/* Event Title Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Event Title *</Text>
          <TextInput
            style={styles.input}
            value={eventTitle}
            onChangeText={setEventTitle}
            placeholder="Enter event title"
            placeholderTextColor="#999"
          />
        </View>

        {/* Event Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={eventDescription}
            onChangeText={setEventDescription}
            placeholder="Enter event description (optional)"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Start Date and Time */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Start Date & Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setDatePickerMode('date');
              setShowDatePicker(true);
            }}
          >
            <Text style={styles.dateButtonText}>
              📅 {formatDateTime(eventDate)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* End Date and Time */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>End Date & Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setDatePickerMode('date');
              setShowEndDatePicker(true);
            }}
          >
            <Text style={styles.dateButtonText}>
              📅 {formatDateTime(eventEndDate)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Event Button */}
        <TouchableOpacity style={styles.addButton} onPress={addEventToCalendar}>
          <Text style={styles.addButtonText}>Add Event to Calendar</Text>
        </TouchableOpacity>

        {/* Date Picker */}
        {(showDatePicker || showEndDatePicker) && (
          <DateTimePicker
            value={showDatePicker ? eventDate : eventEndDate}
            mode={datePickerMode}
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {Platform.OS === 'ios' && (showDatePicker || showEndDatePicker) && (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => {
              setShowDatePicker(false);
              setShowEndDatePicker(false);
            }}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CalendarEventScreen;
