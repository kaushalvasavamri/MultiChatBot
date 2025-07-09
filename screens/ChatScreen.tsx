import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavHeightContext } from '../App';
import axios from 'axios';
import InputBar from '../components/InputBar';
import { apiService, ChatRequest } from '../services/api';

// UUID generation function
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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
  { label: 'Low', value: 'low' },
  { label: 'Urgent', value: 'urgent' },
];

const mockSlots = [
  { id: 1, time: '10:00 AM - 10:30 AM' },
  { id: 2, time: '11:00 AM - 11:30 AM' },
  { id: 3, time: '2:00 PM - 2:30 PM' },
];

// Mock API base URL
const API_BASE_URL = 'https://api.example.com';

const fetchSlots = async (issueType: string, priority: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/slots`, {
      params: { issueType, priority }
    });
    return response.data;
  } catch (error) {
    console.log('Mock API: Fetching slots...');
    // Mock response
    return new Promise<{ id: number; time: string }[]>(resolve => {
      setTimeout(() => resolve(mockSlots), 700);
    });
  }
};

const bookSlot = async (slotId: number, email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/book-slot`, {
      slotId,
      email
    });
    return response.data.success;
  } catch (error) {
    console.log('Mock API: Booking slot...');
    // Mock response
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 700);
    });
  }
};



const initialBotMessage: Message = { id: 'greet', text: 'Hi! How can I help you today?', isUser: false };

const FAB_SIZE = 64;
const FAB_BOTTOM = 32;
const INPUT_BAR_GAP = 8;
const TAB_BAR_HEIGHT = 96;

interface ChatScreenProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  pickedImage: string | null;
  setPickedImage: React.Dispatch<React.SetStateAction<string | null>>;
  onNewChat?: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ messages, setMessages, input, setInput, pickedImage, setPickedImage, onNewChat }) => {
  const [step, setStep] = useState<Step>('waitUser');
  const [slots, setSlots] = useState<{ id: number; time: string }[]>([]);
  const headerHeight = 0;
  const [selectedIssueType, setSelectedIssueType] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const insets = useSafeAreaInsets();
  const bottomNavHeight = React.useContext(BottomNavHeightContext);
  const inputBarMarginBottom =
    Platform.OS === 'web'
      ? FAB_BOTTOM + FAB_SIZE + INPUT_BAR_GAP // 104
      : insets.bottom + bottomNavHeight + INPUT_BAR_GAP;
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const flatListRef = React.useRef<FlatList>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Mock email for testing - in a real app, this would come from user authentication
  const TEST_EMAIL = 'nisarg.parikh@mrisoftware.com';

  const loadChatHistory = async () => {
    try {
      const response = await apiService.getUserChatDetails(TEST_EMAIL);
      if (response.success && response.data) {
        // Convert API messages to our Message format
        const apiMessages: Message[] = [];
        
        response.data.conversations?.forEach(conversation => {
          conversation.messages?.forEach(msg => {
            apiMessages.push({
              id: msg.messageId,
              text: msg.messageText,
              isUser: msg.sender === 'user'
            });
          });
        });
        
        if (apiMessages.length > 0) {
          setMessages(apiMessages);
          // Set the current chat ID from the most recent conversation
          if (response.data.conversations && response.data.conversations.length > 0) {
            const latestConversation = response.data.conversations[0];
            setCurrentChatId(latestConversation.chatId);
          }
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const startNewChat = async () => {
    setMessages([initialBotMessage]);
    setStep('waitUser');
    setSelectedIssueType(null);
    setSelectedPriority(null);
    setSelectedSlot(null);
    setEmail('');
    
    // Generate new UUIDs for both chat and conversation
    const newChatId = generateUUID();
    const newConversationId = generateUUID();
    setCurrentChatId(newChatId);
    setCurrentConversationId(newConversationId);
    
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

  const saveMessageToAPI = async (message: string, isUser: boolean, type?: string, data?: any) => {
    if (!currentChatId) return;
    
    try {
      await apiService.saveConversationMessage(currentChatId, message, isUser, type, data);
    } catch (error) {
      console.error('Error saving message to API:', error);
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

  const handleSend = async () => {
    if (!input.trim() && !pickedImage) return;
    
    const userMsg: Message = pickedImage
      ? { id: generateUUID(), text: input, isUser: true, type: 'image', data: { uri: pickedImage } }
      : { id: generateUUID(), text: input, isUser: true };
    
    setMessages(prev => [userMsg, ...prev]);
    
    // Save user message to API
    await saveMessageToAPI(input.trim(), true, userMsg.type, userMsg.data);
    
    setPickedImage(null);
    setInput('');

    if (step === 'waitUser') {
      // Use the chat API to get a response
      try {
        const chatRequest: ChatRequest = {
          userEmail: TEST_EMAIL,
          message: input.trim(),
          isNewConversation: !currentConversationId,
          chatId: currentChatId || generateUUID(),
          conversationId: currentConversationId || generateUUID(),
          sender: 'user'
        };

        console.log('Sending chat request from ChatScreen:', chatRequest);

        const chatResponse = await apiService.sendChatMessage(chatRequest);
        
        if (chatResponse.success && chatResponse.confirmationMessage) {
          const confirmationMessage = chatResponse.confirmationMessage;
          const botMessage = { id: generateUUID(), text: confirmationMessage, isUser: false };
          
          setTimeout(() => {
            setMessages(prev => [botMessage, ...prev]);
            
            // Save bot response to API
            saveMessageToAPI(confirmationMessage, false);
            
            // Update chat and conversation IDs if provided
            if (chatResponse.chatId) {
              setCurrentChatId(chatResponse.chatId);
            }
            if (chatResponse.conversationId) {
              setCurrentConversationId(chatResponse.conversationId);
            }
            
            // If the response suggests starting the issue flow, proceed
            if (confirmationMessage.toLowerCase().includes('issue') || 
                confirmationMessage.toLowerCase().includes('problem') ||
                chatResponse.userIssueJson?.issueType) {
              
              // Check which fields are missing and ask questions accordingly
              const userIssue = chatResponse.userIssueJson;
              if (userIssue) {
                if (userIssue.issueType === null) {
                  setTimeout(() => {
                    const issueTypeMessage: Message = { 
                      id: 'issue-type', 
                      text: 'Please select the type of maintenance issue:', 
                      isUser: false, 
                      type: 'issueType' 
                    };
                    setMessages(prev => [issueTypeMessage, ...prev]);
                    
                    // Save bot message to API
                    saveMessageToAPI('Please select the type of maintenance issue:', false, 'issueType');
                    
                    setStep('issueType');
                  }, 1000);
                } else if (userIssue.priority === null) {
                  setTimeout(() => {
                    const priorityMessage: Message = { 
                      id: 'priority', 
                      text: 'Please select the priority of your issue:', 
                      isUser: false, 
                      type: 'priority' 
                    };
                    setMessages(prev => [priorityMessage, ...prev]);
                    
                    // Save bot message to API
                    saveMessageToAPI('Please select the priority of your issue:', false, 'priority');
                    
                    setStep('priority');
                  }, 1000);
                } else if (userIssue.contactEmail === null) {
                  setTimeout(() => {
                    const emailMessage: Message = { 
                      id: 'ask-email', 
                      text: 'Please enter your email address:', 
                      isUser: false, 
                      type: 'email' 
                    };
                    setMessages(prev => [emailMessage, ...prev]);
                    
                    // Save bot message to API
                    saveMessageToAPI('Please enter your email address:', false, 'email');
                    
                    setStep('email');
                  }, 1000);
                } else if (userIssue.preferredSlotIndex === null) {
                  // This will trigger the slot fetching logic in useEffect
                  setStep('slot');
                }
              }
            }
          }, 800);
        } else {
          // Handle error response
          const errorMsg: Message = { 
            id: generateUUID(), 
            text: chatResponse.message || 'Sorry, I encountered an error. Please try again.', 
            isUser: false 
          };
          setMessages(prev => [errorMsg, ...prev]);
        }
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.trim())) {
        const invalidEmailMsg: Message = { id: generateUUID(), text: 'Please enter a valid email address.', isUser: false };
        setMessages(prev => [invalidEmailMsg, ...prev]);
        
        // Save bot message to API
        saveMessageToAPI('Please enter a valid email address.', false);
        
        setInput('');
        return;
      }
      setEmail(input.trim());
      setStep('slot');
      setInput('');
      return;
    } else if (step === 'slot') {
      const idx = parseInt(input.trim(), 10) - 1;
      if (!isNaN(idx) && slots[idx]) {
        setSelectedSlot(slots[idx].id);
        const bookingMsg: Message = { id: generateUUID(), text: `Booking slot for ${email}...`, isUser: false };
        setMessages(prev => [bookingMsg, ...prev]);
        
        // Save bot message to API
        saveMessageToAPI(`Booking slot for ${email}...`, false);
        
        setStep('confirmation');
        const success = await bookSlot(slots[idx].id, email);
        setTimeout(() => {
          const confirmMsg: Message = { id: generateUUID(), text: success ? 'Your slot has been booked!' : 'Failed to book slot.', isUser: false, type: 'confirmation' };
          setMessages(prev => [confirmMsg, ...prev]);
          
          // Save bot message to API
          saveMessageToAPI(success ? 'Your slot has been booked!' : 'Failed to book slot.', false, 'confirmation');
        }, 700);
      } else {
        const invalidSlotMsg: Message = { id: generateUUID(), text: 'Please enter a valid slot number.', isUser: false };
        setMessages(prev => [invalidSlotMsg, ...prev]);
        
        // Save bot message to API
        saveMessageToAPI('Please enter a valid slot number.', false);
      }
      setInput('');
      return;
    }
    setInput('');
  };

  const handleIssueTypeSelect = async (issueType: string) => {
    setSelectedIssueType(issueType);
    const userMsg: Message = { id: generateUUID(), text: `Issue: ${issueType.charAt(0).toUpperCase() + issueType.slice(1)}`, isUser: true };
    setMessages(prev => [userMsg, ...prev]);
    
    // Save user message to API
    await saveMessageToAPI(`Issue: ${issueType.charAt(0).toUpperCase() + issueType.slice(1)}`, true);
    
    // Send the selection to the API to get the next question
    try {
      const chatRequest: ChatRequest = {
        userEmail: TEST_EMAIL,
        message: `Issue Type: ${issueType}`,
        isNewConversation: false,
        chatId: currentChatId || generateUUID(),
        conversationId: currentConversationId || generateUUID(),
        sender: 'user'
      };

      const chatResponse = await apiService.sendChatMessage(chatRequest);
      
      if (chatResponse.success && chatResponse.confirmationMessage) {
        const confirmationMessage = chatResponse.confirmationMessage;
        setTimeout(() => {
          const botMessage = { id: generateUUID(), text: confirmationMessage, isUser: false };
          setMessages(prev => [botMessage, ...prev]);
          
          // Save bot response to API
          saveMessageToAPI(confirmationMessage, false);
          
          // Check what the next question should be based on userIssueJson
          const userIssue = chatResponse.userIssueJson;
          if (userIssue) {
            if (userIssue.priority === null) {
              setTimeout(() => {
                const priorityMessage: Message = { 
                  id: generateUUID(), 
                  text: 'Please select the priority of your issue:', 
                  isUser: false, 
                  type: 'priority' 
                };
                setMessages(prev => [priorityMessage, ...prev]);
                
                // Save bot message to API
                saveMessageToAPI('Please select the priority of your issue:', false, 'priority');
                
                setStep('priority');
              }, 1000);
            } else if (userIssue.contactEmail === null) {
              setTimeout(() => {
                const emailMessage: Message = { 
                  id: generateUUID(), 
                  text: 'Please enter your email address:', 
                  isUser: false, 
                  type: 'email' 
                };
                setMessages(prev => [emailMessage, ...prev]);
                
                // Save bot message to API
                saveMessageToAPI('Please enter your email address:', false, 'email');
                
                setStep('email');
              }, 1000);
            } else if (userIssue.preferredSlotIndex === null) {
              setStep('slot');
            }
          }
        }, 800);
      }
    } catch (error) {
      console.error('Error sending issue type selection:', error);
    }
  };

  const handlePrioritySelect = async (priority: string) => {
    setSelectedPriority(priority);
    const userMsg: Message = { id: generateUUID(), text: `Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`, isUser: true };
    setMessages(prev => [userMsg, ...prev]);
    
    // Save user message to API
    await saveMessageToAPI(`Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`, true);
    
    // Send the selection to the API to get the next question
    try {
      const chatRequest: ChatRequest = {
        userEmail: TEST_EMAIL,
        message: `Priority: ${priority}`,
        isNewConversation: false,
        chatId: currentChatId || generateUUID(),
        conversationId: currentConversationId || generateUUID(),
        sender: 'user'
      };

      const chatResponse = await apiService.sendChatMessage(chatRequest);
      
      if (chatResponse.success && chatResponse.confirmationMessage) {
        const confirmationMessage = chatResponse.confirmationMessage;
        setTimeout(() => {
          const botMessage = { id: generateUUID(), text: confirmationMessage, isUser: false };
          setMessages(prev => [botMessage, ...prev]);
          
          // Save bot response to API
          saveMessageToAPI(confirmationMessage, false);
          
          // Check what the next question should be based on userIssueJson
          const userIssue = chatResponse.userIssueJson;
          if (userIssue) {
            if (userIssue.contactEmail === null) {
              setTimeout(() => {
                const emailMessage: Message = { 
                  id: generateUUID(), 
                  text: 'Please enter your email address:', 
                  isUser: false, 
                  type: 'email' 
                };
                setMessages(prev => [emailMessage, ...prev]);
                
                // Save bot message to API
                saveMessageToAPI('Please enter your email address:', false, 'email');
                
                setStep('email');
              }, 1000);
            } else if (userIssue.preferredSlotIndex === null) {
              setStep('slot');
            }
          }
        }, 800);
      }
    } catch (error) {
      console.error('Error sending priority selection:', error);
    }
  };

  React.useEffect(() => {
    if (step === 'slot' && selectedIssueType && selectedPriority) {
      setMessages(prev => [
        { id: generateUUID(), text: 'Fetching available time slots...', isUser: false },
        ...prev,
      ]);
      fetchSlots(selectedIssueType, selectedPriority).then(slots => {
        setSlots(slots);
        setTimeout(() => {
          setMessages(prev => [
            {
              id: generateUUID(),
              text: `Available slots:\n${slots.map((s: { id: number; time: string }, i: number) => `${i + 1}. ${s.time}`).join('\n')}\nPlease enter the slot number you want to book.`,
              isUser: false,
              type: 'slots',
              data: slots,
            },
            ...prev,
          ]);
        }, 700);
      });
    }
  }, [step, selectedIssueType, selectedPriority]);

  React.useEffect(() => {
    if (onNewChat) onNewChat();
  }, [onNewChat]);

  // Load chat history when component mounts
  React.useEffect(() => {
    loadChatHistory();
  }, []);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f8ff' }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={[styles.container, { paddingBottom: TAB_BAR_HEIGHT }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
        <Text style={styles.headerTitleSimple}>Chat</Text>
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
            length: 80, // Approximate height of each message
            offset: 80 * index,
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
            <Ionicons name="arrow-down" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        <InputBar
          value={input}
          onChangeText={setInput}
          onSend={handleSend}
          onPickImage={pickImage}
          disabled={step === 'issueType' || step === 'priority'}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Very light blue background
    justifyContent: 'flex-end',
  },
  promptContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  promptText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D75B0',
    textAlign: 'center',
    marginBottom: 32,
  },
  suggestionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  suggestionBtn: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 8,
    shadowColor: '#0D75B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e6f3ff',
  },
  suggestionText: {
    color: '#0D75B0',
    fontWeight: '600',
    fontSize: 16,
  },
  messages: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 20,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 4,
  },
  userBubble: {
    backgroundColor: '#0D75B0',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#e6f3ff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#0D75B0',
  },
  priorityRow: {
    flexDirection: 'row',
    marginTop: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityBtn: {
    backgroundColor: '#fff',
    borderColor: '#0D75B0',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  priorityBtnSelected: {
    backgroundColor: '#0D75B0',
  },
  priorityBtnText: {
    color: '#0D75B0',
    fontWeight: '600',
  },
  priorityBtnTextSelected: {
    color: '#fff',
  },
  chatImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 6,
    backgroundColor: '#e6f3ff',
  },
  headerTitleSimple: {
    margin: 20,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D75B0',
    letterSpacing: 0.5,
  },
  scrollButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: '#0D75B0',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ChatScreen;
