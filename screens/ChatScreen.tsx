import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavHeightContext } from '../App';
import axios from 'axios';
import InputBar from '../components/InputBar';
import { apiService, ChatRequest } from '../services/api';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Colors, Layout, Cards, Buttons, Texts, Spacing, BorderRadius, CommonValues } from '../styles/common';
import { useRoute } from '@react-navigation/native';

// UUID generation function
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Centralized input validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const validateSlot = (slot: string): boolean => {
  const slotNumber = parseInt(slot.trim(), 10);
  return !isNaN(slotNumber) && slotNumber >= 1;
};

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  type?: 'text' | 'issueType' | 'priority' | 'slots' | 'confirmation' | 'email' | 'image';
  data?: any;
}

type Step = 'greeting' | 'waitUser' | 'issueType' | 'priority' | 'email' | 'slot' | 'confirmation';

const issueTypes = [
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Electrical', value: 'electrical' },
  { label: 'HVAC', value: 'hvac' },
  { label: 'Appliance', value: 'appliance' },
  { label: 'Structural', value: 'structural' },
  { label: 'Other', value: 'other' },
];

const priorities = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' }
];

// Removed mock slots and API calls - using sendChatMessage API instead

const initialBotMessage: Message = { id: 'greet', text: 'Hi! How can I help you today?', isUser: false };

const INPUT_BAR_GAP = 8;

interface ChatScreenProps {
  navigation: DrawerNavigationProp<any>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  pickedImage: string | null;
  setPickedImage: React.Dispatch<React.SetStateAction<string | null>>;
  onNewChat?: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, messages, setMessages, input, setInput, pickedImage, setPickedImage, onNewChat }) => {
  const route = useRoute();
  const passedChatId = (route as any).params?.chatId as string | undefined;
  const [isOldChat, setIsOldChat] = useState(false);
  const [step, setStep] = useState<Step>('waitUser');
  const headerHeight = 0;
  const [selectedIssueType, setSelectedIssueType] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const insets = useSafeAreaInsets();
  const inputBarMarginBottom = insets.bottom + INPUT_BAR_GAP;
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const flatListRef = React.useRef<FlatList>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock email for testing - in a real app, this would come from user authentication
  const TEST_EMAIL = 'nisarg.parikh@mrisoftware.com';

  // Centralized user input handler
  const handleUserInput = async (
    input: string,
    step: Step,
    setEmail?: (email: string) => void,
    setSelectedIssueType?: (type: string) => void,
    setSelectedPriority?: (priority: string) => void
  ) => {
    // Validate input based on step
    let isValid = true;
    let validationMessage = '';

    switch (step) {
      case 'email':
        if (!validateEmail(input)) {
          isValid = false;
          validationMessage = 'Please enter a valid email address.';
        }
        break;
      case 'slot':
        if (!validateSlot(input)) {
          isValid = false;
          validationMessage = `Please enter a valid slot number. You entered: "${input.trim()}"`;
        }
        break;
      case 'waitUser':
        // No validation needed for general text input
        break;
      default:
        break;
    }

    // Show validation error if input is invalid
    if (!isValid) {
      const errorMsg: Message = { 
        id: generateUUID(), 
        text: validationMessage, 
        isUser: false 
      };
      setMessages(prev => [errorMsg, ...prev]);
      setInput('');
      return;
    }

    // Set loading state
    setIsLoading(true);

    // Prepare chat and conversation IDs
    let chatId = currentChatId;
    let conversationId = currentConversationId;
    
    if (!chatId) {
      chatId = generateUUID();
      setCurrentChatId(chatId);
      console.log(`Generated new Chat ID (${step}):`, chatId);
    }
    if (!conversationId) {
      conversationId = generateUUID();
      setCurrentConversationId(conversationId);
      console.log(`Generated new Conversation ID (${step}):`, conversationId);
    }

    // Create user message based on step
    let userMessage: Message;
    let apiMessage: string;

    switch (step) {
      case 'email':
        const userEmail = input.trim();
        setEmail?.(userEmail);
        userMessage = { id: generateUUID(), text: userEmail, isUser: true };
        apiMessage = userEmail;
        break;
      case 'slot':
        const slotNumber = parseInt(input.trim(), 10);
        userMessage = { id: generateUUID(), text: `Slot: ${slotNumber}`, isUser: true };
        apiMessage = slotNumber.toString();
        break;
      case 'issueType':
        userMessage = { id: generateUUID(), text: `Issue: ${input.charAt(0).toUpperCase() + input.slice(1)}`, isUser: true };
        apiMessage = `Issue Type: ${input}`;
        break;
      case 'priority':
        userMessage = { id: generateUUID(), text: `Priority: ${input.charAt(0).toUpperCase() + input.slice(1)}`, isUser: true };
        apiMessage = `Priority: ${input}`;
        break;
      default:
        userMessage = { id: generateUUID(), text: input, isUser: true };
        apiMessage = input.trim();
        break;
    }

    // Add user message to chat only for certain steps
    if (step === 'issueType' || step === 'priority') {
      setMessages(prev => [userMessage, ...prev]);
    }

    // Send to API
    try {
      const chatRequest: ChatRequest = {
        userEmail: TEST_EMAIL,
        message: apiMessage,
        isNewConversation: !currentConversationId,
        chatId: chatId,
        conversationId: conversationId || generateUUID(),
        sender: 'user'
      };

      console.log(`Sending ${step} to API:`, chatRequest);
      
      const chatResponse = await apiService.sendChatMessage(chatRequest);
      
      handleBotResponse(chatResponse, setMessages, setStep, setCurrentChatId, setCurrentConversationId);
      
    } catch (error) {
      console.error(`Error sending ${step} to API:`, error);
      const errorMsg: Message = { 
        id: generateUUID(), 
        text: 'Sorry, I encountered an error. Please try again.', 
        isUser: false 
      };
      setMessages(prev => [errorMsg, ...prev]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  // ChatScreen starts fresh with initial bot message
  // Chat history is handled by HistoryScreen to avoid confusion
  // Users expect a clean slate when opening the chat screen

  const startNewChat = async () => {
    setMessages([initialBotMessage]);
    setStep('waitUser');
    setSelectedIssueType(null);
    setSelectedPriority(null);
    setEmail('');
    
    // Reset chat and conversation IDs to null so they will be generated fresh
    console.log('Starting new chat - resetting IDs');
    setCurrentChatId(null);
    setCurrentConversationId(null);
    
    // Create a new chat session
    try {
      const response = await apiService.createNewChat(TEST_EMAIL);
      if (response.success && response.chatId) {
        setCurrentChatId(response.chatId);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollButton(offsetY > 200);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPickedImage(result.assets[0].uri);
    }
  };

  // Utility function to handle chat API responses
  const handleBotResponse = (
    chatResponse: any,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setStep: React.Dispatch<React.SetStateAction<Step>>,
    setCurrentChatId: (id: string) => void,
    setCurrentConversationId: (id: string) => void
  ) => {
    if (chatResponse.success && chatResponse.confirmationMessage) {
      const confirmationMessage = chatResponse.confirmationMessage;
      setTimeout(() => {
        const botMessage = { id: generateUUID(), text: confirmationMessage, isUser: false };
        setMessages(prev => [botMessage, ...prev]);

        // Update chat and conversation IDs if provided
        if (chatResponse.chatId) setCurrentChatId(chatResponse.chatId);
        if (chatResponse.conversationId) setCurrentConversationId(chatResponse.conversationId);

        // Handle userIssueJson logic
        const userIssue = chatResponse.userIssueJson;
        if (userIssue) {
          if (userIssue.issueType === null) {
            setTimeout(() => {
              setMessages(prev => [
                { id: 'issue-type', text: 'Please select the type of maintenance issue:', isUser: false, type: 'issueType' },
                ...prev,
              ]);
              setStep('issueType');
            }, 1000);
          } else if (userIssue.priority === null) {
            setTimeout(() => {
              setMessages(prev => [
                { id: 'priority', text: 'Please select the priority of your issue:', isUser: false, type: 'priority' },
                ...prev,
              ]);
              setStep('priority');
            }, 1000);
          } else if (userIssue.contactEmail === null) {
            setTimeout(() => {
              setMessages(prev => [
                { id: 'ask-email', text: 'Please enter your email address:', isUser: false, type: 'email' },
                ...prev,
              ]);
              setStep('email');
            }, 1000);
          } else if (userIssue.preferredSlotIndex === null) {
            setStep('slot');
          }
        }
      }, 800);
    } else {
      // Handle error response
      const errorMsg: Message = {
        id: generateUUID(),
        text: chatResponse.message || 'Sorry, I encountered an error. Please try again.',
        isUser: false,
      };
      setMessages(prev => [errorMsg, ...prev]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !pickedImage) return;
    
    // Set loading state
    setIsLoading(true);
    
    // Generate chat and conversation IDs only if they don't exist yet
    let chatId = currentChatId;
    let conversationId = currentConversationId;
    
    if (!chatId) {
      chatId = generateUUID();
      setCurrentChatId(chatId);
      console.log('Generated new Chat ID:', chatId);
    }
    if (!conversationId) {
      conversationId = generateUUID();
      setCurrentConversationId(conversationId);
      console.log('Generated new Conversation ID:', conversationId);
    }
    
    const userMsg: Message = pickedImage
      ? { id: generateUUID(), text: input, isUser: true, type: 'image', data: { uri: pickedImage } }
      : { id: generateUUID(), text: input, isUser: true };
    
    setMessages(prev => [userMsg, ...prev]);
    
    // Save user message to API
    
    setPickedImage(null);
    setInput('');

    if (step === 'waitUser') {
      // Use the chat API to get a response
      try {
        const chatRequest: ChatRequest = {
          userEmail: TEST_EMAIL,
          message: input.trim(),
          isNewConversation: !currentConversationId,
          chatId: chatId,
          conversationId: conversationId || generateUUID(),
          sender: 'user'
        };

        console.log('Sending chat request from ChatScreen:', chatRequest);
        console.log('Using Chat ID:', chatId);
        console.log('Using Conversation ID:', conversationId);

        const chatResponse = await apiService.sendChatMessage(chatRequest);
        
        handleBotResponse(chatResponse, setMessages, setStep, setCurrentChatId, setCurrentConversationId);
        
      } catch (error) {
        console.error('Error sending chat message:', error);
        const errorMsg: Message = { 
          id: generateUUID(), 
          text: 'Sorry, I encountered an error. Please try again.', 
          isUser: false 
        };
        setMessages(prev => [errorMsg, ...prev]);
      }
          } else if (step === 'email') {
        await handleUserInput(input, step, setEmail);
      } else if (step === 'slot') {
        await handleUserInput(input, step);
      } else if (step === 'issueType') {
        await handleUserInput(input, step, undefined, setSelectedIssueType);
      } else if (step === 'priority') {
        await handleUserInput(input, step, undefined, undefined, setSelectedPriority);
      }
    
    // Reset loading state
    setIsLoading(false);
  };

  const handleIssueTypeSelect = async (issueType: string) => {
    await handleUserInput(issueType, 'issueType', undefined, setSelectedIssueType);
  };

  const handlePrioritySelect = async (priority: string) => {
    await handleUserInput(priority, 'priority', undefined, undefined, setSelectedPriority);
  };

  // Removed fetchSlots useEffect - slots will be handled by the backend API

  React.useEffect(() => {
    if (onNewChat) {
      onNewChat();
      // Reset chat and conversation IDs for new chat
      setCurrentChatId(null);
      setCurrentConversationId(null);
    }
  }, [onNewChat]);

  React.useEffect(() => {
    if (passedChatId) {
      setCurrentChatId(passedChatId);
      setIsOldChat(true);
      fetchOldMessages(passedChatId);
    }
  }, [passedChatId]);

  const fetchOldMessages = async (chatId: string) => {
    // Call your API to get the conversation for this chatId
    const response = await apiService.getUserChatDetails(TEST_EMAIL);
    if (response.success && response.data) {
      const chats = Array.isArray(response.data) ? response.data : [response.data];
      const chat = chats.find((c) => c.chatId === chatId);
      if (chat && chat.conversations && chat.conversations.length > 0) {
        // Flatten all messages from all conversations
        const allMessages = chat.conversations.flatMap((conv: any) => (conv.messages || []));
        // Map to your Message[] format
        setMessages(
          allMessages.map((msg: any) => ({
            id: msg.messageId,
            text: msg.messageText,
            isUser: msg.sender === 'user',
            // type, data, etc. can be added if needed
          }))
        );
      } else {
        // If no messages, show initial bot message
        setMessages([initialBotMessage]);
      }
    }
  };

  // ChatScreen starts fresh - no automatic history loading
  // Users can view history in the HistoryScreen

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.type === 'issueType') {
      return (
        <View style={[styles.bubble, styles.botBubble]}>
          <Text style={[styles.messageText, styles.botText]}>Please select the type of maintenance issue:</Text>
          <View style={styles.priorityRow}>
            {issueTypes.map(t => (
              <TouchableOpacity
                key={t.value}
                style={[styles.priorityBtn, selectedIssueType === t.value && styles.priorityBtnSelected]}
                onPress={() => handleIssueTypeSelect(t.value)}
                disabled={!!selectedIssueType}
              >
                <Text style={[styles.priorityBtnText, selectedIssueType === t.value && styles.priorityBtnTextSelected]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
    if (item.type === 'priority') {
      return (
        <View style={[styles.bubble, styles.botBubble]}>
          <Text style={[styles.messageText, styles.botText]}>Please select the priority of your issue:</Text>
          <View style={styles.priorityRow}>
            {priorities.map(p => (
              <TouchableOpacity
                key={p.value}
                style={[styles.priorityBtn, selectedPriority === p.value && styles.priorityBtnSelected]}
                onPress={() => handlePrioritySelect(p.value)}
                disabled={!!selectedPriority}
              >
                <Text style={[styles.priorityBtnText, selectedPriority === p.value && styles.priorityBtnTextSelected]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
    if (item.type === 'image' && item.data?.uri) {
      return (
        <View style={[styles.bubble, item.isUser ? styles.userBubble : styles.botBubble]}>
          {item.data.uri && (
            <Image source={{ uri: item.data.uri }} style={styles.chatImage} />
          )}
          {item.text ? (
            <Text style={[styles.messageText, item.isUser ? styles.userText : styles.botText]}>{item.text}</Text>
          ) : null}
        </View>
      );
    }
    return (
      <View style={[styles.bubble, item.isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.messageText, item.isUser ? styles.userText : styles.botText]}>{item.text}</Text>
      </View>
    );
  };

  React.useEffect(() => {
    if (step === 'issueType' && !messages.some(m => m.type === 'issueType')) {
      setMessages(prev => [
        { id: generateUUID(), text: '', isUser: false, type: 'issueType' },
        ...prev,
      ]);
    }
  }, [step, messages]);

  React.useEffect(() => {
    if (step === 'priority' && !messages.some(m => m.type === 'priority')) {
      setMessages(prev => [
        { id: generateUUID(), text: '', isUser: false, type: 'priority' },
        ...prev,
      ]);
    }
  }, [step, messages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryLight }} edges={[ "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={ useSafeAreaInsets().bottom }
      >
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messages}
            inverted
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            bounces={true}
            scrollEventThrottle={16}
            onScrollToIndexFailed={() => {}}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={10}
            getItemLayout={(data, index) => ({
              length: CommonValues.spacing.xxxlarge * 10, // Approximate height of each message
              offset: CommonValues.spacing.xxxlarge * 10 * index,
              index,
            })}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            onScroll={handleScroll}
          />
          {showScrollButton && (
            <TouchableOpacity
              style={styles.scrollButton}
              onPress={scrollToBottom}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-down" size={20} color={Colors.textInverse} />
            </TouchableOpacity>
          )}
          <InputBar
            value={input}
            onChangeText={setInput}
            onSend={handleSend}
            onPickImage={pickImage}
            disabled={step === 'issueType' || step === 'priority'}
            isLoading={isLoading}
            style={{ marginBottom: insets.bottom + CommonValues.spacing.xxxlarge }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'flex-end',
  },
  promptContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xxxl,
    marginBottom: Spacing.xxl,
  },
  promptText: {
    fontSize: CommonValues.fontSize.xxxlarge,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  suggestionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  suggestionBtn: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  suggestionText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: CommonValues.fontSize.large,
  },
  messages: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: CommonValues.borderRadius.medium,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.xs,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  messageText: {
    fontSize: CommonValues.fontSize.large,
  },
  userText: {
    color: Colors.textInverse,
  },
  botText: {
    color: Colors.primary,
  },
  priorityRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  priorityBtn: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  priorityBtnSelected: {
    backgroundColor: Colors.primary,
  },
  priorityBtnText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  priorityBtnTextSelected: {
    color: Colors.textInverse,
  },
  chatImage: {
    width: CommonValues.dimensions.imageSize,
    height: CommonValues.dimensions.imageSize,
    borderRadius: BorderRadius.lg,
    marginBottom: CommonValues.spacing.medium,
    backgroundColor: Colors.primaryLight,
  },
  headerTitleSimple: {
    margin: Spacing.xl,
    fontSize: CommonValues.fontSize.xxlarge,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  scrollButton: {
    position: 'absolute',
    right: Spacing.xl,
    bottom: 100,
    backgroundColor: Colors.primary,
    borderRadius: CommonValues.dimensions.scrollButtonRadius,
    width: CommonValues.dimensions.scrollButtonSize,
    height: CommonValues.dimensions.scrollButtonSize,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: CommonValues.spacing.large,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLight,
  },
  menuButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: CommonValues.fontSize.xlarge,
    fontWeight: 'bold',
    color: Colors.primary,
    flex: 1,
    textAlign: 'center',
  },
  newChatButton: {
    padding: Spacing.sm,
  },
});

export default ChatScreen;
