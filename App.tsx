import React, { useRef, useState, createContext } from 'react';
import { NavigationContainer, DefaultTheme, Theme, NavigationContainerRef } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import ChatScreen from './screens/ChatScreen';
import HistoryScreen from './screens/HistoryScreen';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Platform, View, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Message } from './screens/ChatScreen';

const Drawer = createDrawerNavigator();

const MyTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    primary: '#0D75B0',
    card: '#e6f3ff',
    text: '#222b45',
    border: '#0D75B0',
    notification: '#0D75B0',
  },
};

export const BottomNavHeightContext = createContext(0); // Set to 0 since we're removing bottom nav

const navigationRef = React.createRef<NavigationContainerRef<any>>();

const initialBotMessage: Message = { id: 'greet', text: 'Hi! How can I help you today?', isUser: false };

// Custom drawer content component
const CustomDrawerContent = (props: any) => {
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [input, setInput] = useState('');
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  const handleNewChat = () => {
    setMessages([initialBotMessage]);
    setInput('');
    setPickedImage(null);
    props.navigation.navigate('Chat');
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>MultiChatBot</Text>
        <Text style={styles.drawerSubtitle}>AI Assistant</Text>
      </View>
      
      <DrawerContentScrollView {...props}>
        <View style={styles.newChatContainer}>
          <TouchableOpacity 
            style={styles.newChatButton}
            onPress={handleNewChat}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.newChatText}>New Chat</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent Chats</Text>
          <TouchableOpacity 
            style={styles.historyItem}
            onPress={() => {
              props.navigation.navigate('History');
            }}
          >
            <Ionicons name="time-outline" size={20} color="#0D75B0" />
            <Text style={styles.historyItemText}>Chat History</Text>
          </TouchableOpacity>
        </View>
        
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
};

export default function App() {
  const [newChatFlag, setNewChatFlag] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [input, setInput] = useState('');
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  const handleNewChat = () => {
    setMessages([initialBotMessage]);
    setInput('');
    setPickedImage(null);
    setNewChatFlag(true);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={MyTheme} ref={navigationRef}>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0D75B0',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            drawerStyle: {
              backgroundColor: '#fff',
              width: 280,
            },
            drawerActiveTintColor: '#0D75B0',
            drawerInactiveTintColor: '#666',
          }}
        >
          <Drawer.Screen 
            name="Chat" 
            options={{
              title: 'Chat',
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="chatbubble-outline" size={size} color={color} />
              ),
            }}
          >
            {(props) => (
              <ChatScreen
                {...props}
                messages={messages}
                setMessages={setMessages}
                input={input}
                setInput={setInput}
                pickedImage={pickedImage}
                setPickedImage={setPickedImage}
                onNewChat={newChatFlag ? handleNewChat : undefined}
              />
            )}
          </Drawer.Screen>
          <Drawer.Screen 
            name="History" 
            component={HistoryScreen}
            options={{
              title: 'History',
              drawerIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="time-outline" size={size} color={color} />
              ),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#0D75B0',
    paddingTop: 18,
    paddingBottom: 10,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  drawerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  newChatContainer: {
    padding: 15,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D75B0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newChatText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
    marginHorizontal: 15,
  },
  historySection: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 5,
  },
  historyItemText: {
    fontSize: 15,
    color: '#0D75B0',
    marginLeft: 12,
    fontWeight: '500',
  },
});
