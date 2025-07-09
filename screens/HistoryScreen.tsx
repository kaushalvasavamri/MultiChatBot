import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, ChatHistoryResponse } from '../services/api';

// Mock email for testing - in a real app, this would come from user authentication
const TEST_EMAIL = 'nisarg.parikh@mrisoftware.com';

const HistoryScreen: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getUserChatDetails(TEST_EMAIL);
      
      if (response.success && response.data) {
        setChatHistory(response.data);
      } else {
        setError(response.message || 'Failed to fetch chat history');
      }
    } catch (err) {
      setError('An error occurred while fetching chat history');
      console.error('Error fetching chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleChatPress = (conversation: any) => {
    // TODO: Navigate to chat screen with this conversation's messages
    Alert.alert('Conversation Selected', `Opening conversation: ${conversation.conversationId}`);
  };

  const getTotalMessages = () => {
    if (!chatHistory || !chatHistory.conversations) return 0;
    return chatHistory.conversations.reduce((total, conv) => total + (conv.messages?.length || 0), 0);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={["top", "left", "right"]}>
        <View style={styles.container}>
          <View style={styles.headerSimple}>
            <Text style={styles.headerTitleSimple}>History</Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0D75B0" />
            <Text style={styles.loadingText}>Loading chat history...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={["top", "left", "right"]}>
        <View style={styles.container}>
          <View style={styles.headerSimple}>
            <Text style={styles.headerTitleSimple}>History</Text>
          </View>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchChatHistory}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.headerSimple}>
          <Text style={styles.headerTitleSimple}>History</Text>
        </View>
        
        {chatHistory && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Chat ID: {chatHistory.chatId}
            </Text>
            <Text style={styles.summaryText}>
              Conversations: {chatHistory.conversations?.length || 0}
            </Text>
            <Text style={styles.summaryText}>
              Total Messages: {getTotalMessages()}
            </Text>
          </View>
        )}
        
        <FlatList
          data={chatHistory?.conversations || []}
          keyExtractor={item => item.conversationId}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.historyItem}
              onPress={() => handleChatPress(item)}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#2563eb" style={{ marginRight: 12 }} />
              <View style={styles.chatInfo}>
                <Text style={styles.title}>Conversation #{item.id}</Text>
                <Text style={styles.subtitle}>Started: {formatDate(item.startedAt)}</Text>
                <Text style={styles.messageCount}>
                  {item.messages ? `${item.messages.length} messages` : 'No messages'}
                </Text>
                {item.status !== undefined && (
                  <Text style={styles.statusText}>Status: {item.status}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No conversations found</Text>
              <Text style={styles.emptySubtext}>Your conversations will appear here</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSimple: {
    paddingTop: 24,
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  headerTitleSimple: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D75B0',
    letterSpacing: 0.5,
  },
  list: {
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f3ff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#0D75B0',
  },
  chatInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#0D75B0',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  messageCount: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0D75B0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#9ca3af',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 4,
  },
});

export default HistoryScreen;
