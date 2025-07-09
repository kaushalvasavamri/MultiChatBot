import React, { useRef, useState, createContext } from 'react';
import { NavigationContainer, DefaultTheme, Theme, NavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from './screens/ChatScreen';
import HistoryScreen from './screens/HistoryScreen';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Platform, View, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Message } from './screens/ChatScreen'; // If Message type is not exported, define it here

const Tab = createBottomTabNavigator();

const MyTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    primary: '#0D75B0', // Updated to new blue
    card: '#e6f3ff', // Light blue for tab bar
    text: '#222b45',
    border: '#0D75B0',
    notification: '#0D75B0',
  },
};

export const BottomNavHeightContext = createContext(96);

const navigationRef = React.createRef<NavigationContainerRef<any>>();

const NAV_ICONS = [
  { name: 'chatbubble-ellipses', label: 'Chat', screen: 'Chat' },
  { name: 'time', label: 'History', screen: 'History' },
];

const initialBotMessage: Message = { id: 'greet', text: 'Hi! How can I help you today?', isUser: false };

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [newChatFlag, setNewChatFlag] = useState(false);
  // Chat state lifted up
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [input, setInput] = useState('');
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  // Add any other chat state you want to persist

  // Handler to reset chat
  const handleNewChat = () => {
    setMessages([initialBotMessage]);
    setInput('');
    setPickedImage(null);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={MyTheme} ref={navigationRef}>
        <View style={{ flex: 1 }}>
          {activeIndex === 0 && (
            <ChatScreen
              messages={messages}
              setMessages={setMessages}
              input={input}
              setInput={setInput}
              pickedImage={pickedImage}
              setPickedImage={setPickedImage}
              onNewChat={newChatFlag ? handleNewChat : undefined}
            />
          )}
          {activeIndex === 1 && <HistoryScreen />}
          {/* Custom pill-shaped nav bar + docked FAB */}
          <View style={styles.customNavBarRow}>
            <View style={styles.customNavBarPill}>
              {NAV_ICONS.map((icon, idx) => (
                <TouchableOpacity
                  key={icon.name}
                  style={styles.customNavBarIconBtn}
                  onPress={() => {
                    if (icon.screen) setActiveIndex(idx);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={icon.name as any}
                    size={32}
                    color={activeIndex === idx ? '#0D75B0' : '#0D75B0'}
                    style={{ opacity: activeIndex === idx ? 1 : 0.5 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.customNavBarFab}
              onPress={() => {
                setActiveIndex(0);
                setNewChatFlag(true);
                setTimeout(() => setNewChatFlag(false), 100);
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="pencil" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  customNavBarRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  customNavBarPill: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  customNavBarIconBtn: {
    marginHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customNavBarFab: {
    marginLeft: 16,
    backgroundColor: '#0D75B0',
    borderRadius: 20,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
});
