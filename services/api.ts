import axios from 'axios';

// API Base URL
const API_BASE_URL = 'https://hackathon-2025-baroda.azurewebsites.net';

// Request Models
export interface GetUserChatRequest {
  email: string;
}

export interface ChatRequest {
  userEmail: string;
  message: string;
  isNewConversation: boolean;
  chatId: string;
  conversationId: string;
  sender: 'user' | 'assistant';
}

// Response Models
export interface Conversation {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
  type?: 'text' | 'issueType' | 'priority' | 'slots' | 'confirmation' | 'email' | 'image';
  data?: any;
}

export interface ChatDetail {
  id: number;
  chatId: string;
  email: string;
  createdAt: string;
  conversations: Conversation[] | null;
}

export interface GetUserChatResponse {
  data: ChatDetail[];
  success: boolean;
  message?: string;
}

// New interfaces for the updated API response
export interface Message {
  id: number;
  messageId: string;
  conversationId: string;
  sender: string;
  messageText: string;
  sentAt: string;
}

export interface ConversationDetail {
  id: number;
  conversationId: string;
  chatId: string;
  startedAt: string;
  endedAt: string;
  status: number;
  extractionResult: string;
  messages: Message[];
}

export interface ChatHistoryResponse {
  id: number;
  chatId: string;
  email: string;
  createdAt: string;
  conversations: ConversationDetail[];
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  confirmationMessage?: string;
  userIssueJson?: {
    issueType: string | null;
    priority: string | null;
    contactEmail: string | null;
    preferredSlotIndex: number | null;
  };
  conversationId?: string;
  chatId?: string;
}

// API Service Class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Get user chat details
  async getUserChatDetails(email: string): Promise<{ success: boolean; data?: ChatHistoryResponse; message?: string }> {
    try {
      console.log('Fetching chat history for email:', email);
      
      const response = await axios.get(`${this.baseURL}/api/ChatDetails/userChat`, {
        params: { email }
      });
      
      console.log('Chat history response:', JSON.stringify(response.data, null, 2));
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching user chat details:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Create new chat
  async createNewChat(email: string): Promise<{ success: boolean; chatId?: string; message?: string }> {
    try {
      const response = await axios.post(`${this.baseURL}/ChatDetails/createChat`, {
        email
      });
      
      return {
        success: true,
        chatId: response.data.chatId
      };
    } catch (error) {
      console.error('Error creating new chat:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Send chat message and get bot response
  async sendChatMessage(chatRequest: ChatRequest): Promise<ChatResponse> {
    try {
      console.log('Sending chat request:', JSON.stringify(chatRequest, null, 2));
      
      const response = await axios.post(`${this.baseURL}/api/Chatbot/chat`, chatRequest);
      
      console.log('Chat response:', JSON.stringify(response.data, null, 2));
      
      return {
        success: true,
        confirmationMessage: response.data.confirmationMessage,
        userIssueJson: response.data.userIssueJson,
        conversationId: response.data.conversationId,
        chatId: response.data.chatId
      };
    } catch (error: any) {
      console.error('Error sending chat message:', error);
      console.error('Request data:', JSON.stringify(chatRequest, null, 2));
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService(); 