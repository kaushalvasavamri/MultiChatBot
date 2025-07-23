import React, { useState, createContext } from 'react';
import { NavigationContainer, DefaultTheme, Theme, NavigationContainerRef } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import ChatScreen from './screens/ChatScreen';
import HistoryScreen from './screens/HistoryScreen';
// import CalendarDemoScreen from './screens/CalendarDemoScreen';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Message } from './screens/ChatScreen';
import { Colors, Headers, Buttons, Lists, Dividers, Spacing, CommonValues } from './styles/common';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthWrapper from './components/AuthWrapper';

const Drawer = createDrawerNavigator();

const MyTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
    primary: Colors.primary,
    card: Colors.primaryLight,
    text: Colors.textPrimary,
    border: Colors.primary,
    notification: Colors.primary,
  },
};

export const BottomNavHeightContext = createContext(0); // Set to 0 since we're removing bottom nav

const navigationRef = React.createRef<NavigationContainerRef<any>>();

const initialBotMessage: Message = { id: 'greet', text: '', isUser: false };

// Custom drawer content component
const CustomDrawerContent = (props: any) => {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout
        },
      ]
    );
  };

  return (
    <View style={styles.drawerContainer}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.primary }}>
        <View style={Headers.drawer}>
          <Text style={Headers.drawerTitle}>ChattySquad</Text>
          <Text style={Headers.drawerSubtitle}>AI Assistant</Text>
        </View>
      </SafeAreaView>
      
      <DrawerContentScrollView {...props}>
        <TouchableOpacity 
          style={[Buttons.primary, { width: '100%', marginTop: 0 }]}
          onPress={() => {
            props.onNewChat();
            props.navigation.navigate('Chat');
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent:'center', alignItems: 'center', gap: Spacing.sm }}>
            <Ionicons name="add" size={20} color={Colors.textInverse} />
            <Text style={Buttons.primaryText}>New Chat</Text>
          </View>
        </TouchableOpacity>
      
        <View style={Dividers.horizontal} />
        
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent Chats</Text>
          <TouchableOpacity 
            style={Lists.item}
            onPress={() => {
              props.navigation.navigate('History');
            }}
          >
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <Text style={Lists.itemText}>Chat History</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Tools</Text>
          <TouchableOpacity 
            style={Lists.item}
            onPress={() => {
              props.navigation.navigate('Calendar');
            }}
          >
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <Text style={Lists.itemText}>Calendar Events</Text>
          </TouchableOpacity>
        </View> */}
        
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
      {/* Fixed logout button at bottom */}
      <View style={styles.logoutContainer}>
        <View style={[Dividers.horizontal, { marginVertical: 0 }]} />
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main App Component with Authentication
function MainApp() {
  // const [newChatFlag, setNewChatFlag] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  const handleNewChat = () => {
    setMessages([initialBotMessage]);
    setInput('');
    setPickedImage(null);
    // setNewChatFlag(true);
    // setTimeout(() => setNewChatFlag(false), 100);
  };

  return (
    <NavigationContainer theme={MyTheme} ref={navigationRef}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} onNewChat={handleNewChat} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.textInverse,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerStyle: {
            backgroundColor: Colors.white,
            width: 280,
          },
          drawerActiveTintColor: Colors.primary,
          drawerInactiveTintColor: Colors.gray[500],
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
        {/* Temporarily commented out Calendar screen due to permission issues
        <Drawer.Screen 
          name="Calendar" 
          component={CalendarDemoScreen}
          options={{
            title: 'Calendar Events',
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        /> */}
       
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AuthWrapper>
          <MainApp />
        </AuthWrapper>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  newChatContainer: {
    paddingHorizontal: Spacing.md,
    marginTop: 0,
  },
  historySection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  historyTitle: {
    fontSize: CommonValues.fontSize.large,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: CommonValues.spacing.large,
    paddingHorizontal: CommonValues.spacing.small,
  },
  logoutContainer: {
    backgroundColor: Colors.white,
    paddingBottom: Spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.error,
    marginLeft: Spacing.sm,
    fontWeight: '500',
  },
});
