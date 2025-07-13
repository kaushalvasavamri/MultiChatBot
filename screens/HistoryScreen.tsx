import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, ChatHistoryResponse } from '../services/api';
import { Colors, Layout, Headers, Cards, States, Buttons, Texts, Spacing, Lists, CommonValues } from '../styles/common';
import { useNavigation } from '@react-navigation/native';

// Mock email for testing - in a real app, this would come from user authentication
const TEST_EMAIL = 'nisarg.parikh@mrisoftware.com';

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [chatHistory, setChatHistory] = useState<ChatHistoryResponse[] | null>(null);
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
        setChatHistory(Array.isArray(response.data) ? response.data : [response.data]);
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

  const handleChatPress = (chat: ChatHistoryResponse) => {
    navigation.navigate('Chat', { chatId: chat.chatId });
  };

  if (loading) {
    return (
      <SafeAreaView style={Layout.safeArea} edges={["top", "left", "right"]}>
        <View style={Layout.container}>
          <View style={States.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={States.loadingText}>Loading chat history...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={Layout.safeArea} edges={["top", "left", "right"]}>
        <View style={Layout.container}>
          <Text style={Headers.simpleTitle}>History</Text>
          <View style={States.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
            <Text style={States.errorText}>{error}</Text>
            <TouchableOpacity style={Buttons.primary} onPress={fetchChatHistory}>
              <Text style={Buttons.primaryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={Layout.safeArea} edges={["left", "right", "bottom"]}>
      <View style={Layout.container}>  
        <FlatList
          data={chatHistory || []}
          keyExtractor={item => item.chatId}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={Cards.history}
              onPress={() => handleChatPress(item)}
            >
              {/* <Ionicons name="chatbubble-ellipses-outline" size={24} color={Colors.secondary} style={{ marginRight: Spacing.md }} /> */}
              <View style={styles.chatInfo}>
                <Text style={Texts.chatHistoryTitle} numberOfLines={1} ellipsizeMode='clip'>{item.chatId}</Text>
                <Text style={Texts.bodySecondary}>{formatDate(item.createdAt)}</Text>
                {/* You can show more info here if you want */}
              </View>
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <Text style={{ textAlign: 'center', padding: 8 }}>
              Total Chats: {chatHistory?.length}
            </Text>
          }
          contentContainerStyle={Lists.container}
          ListEmptyComponent={
            <View style={States.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color={Colors.gray[400]} />
              <Text style={States.emptyText}>No chats found</Text>
              <Text style={States.emptySubtext}>Your chats will appear here</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  chatInfo: {
    flex: 1,
    gap: Spacing.sm,
  },
  summaryContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: CommonValues.borderRadius.small,
  },
  summaryText: {
    fontSize: CommonValues.fontSize.medium,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statusText: {
    fontSize: CommonValues.fontSize.small,
    color: Colors.gray[600],
    marginTop: Spacing.xs,
  },
});

export default HistoryScreen;
