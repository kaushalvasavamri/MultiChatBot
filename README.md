# MultiChatBot

A React Native chat application with API integration for managing chat conversations and history.

## Features

- **Real-time Chat**: Interactive chat interface with bot responses
- **Chat History**: View and manage previous chat conversations
- **API Integration**: Full integration with backend API for data persistence
- **Image Support**: Send images in chat conversations
- **Maintenance Assistant**: Specialized bot for maintenance issue reporting

## API Integration

The application integrates with the following API endpoints:

### Base URL
```
https://6a0a-14-195-100-18.ngrok-free.app/api
```

### Endpoints

#### 1. Get User Chat Details
- **URL**: `/ChatDetails/userChat`
- **Method**: `GET`
- **Parameters**: `email` (string)
- **Response**: Array of chat details with conversations

#### 2. Create New Chat
- **URL**: `/ChatDetails/createChat`
- **Method**: `POST`
- **Body**: `{ email: string }`
- **Response**: `{ success: boolean, chatId?: string }`

#### 3. Save Conversation Message
- **URL**: `/ChatDetails/saveMessage`
- **Method**: `POST`
- **Body**: `{ chatId: string, message: string, isUser: boolean, type?: string, data?: any, timestamp: string }`
- **Response**: `{ success: boolean }`

## Data Models

### Request Models
```typescript
interface GetUserChatRequest {
  email: string;
}
```

### Response Models
```typescript
interface Conversation {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
  type?: 'text' | 'issueType' | 'priority' | 'slots' | 'confirmation' | 'email' | 'image';
  data?: any;
}

interface ChatDetail {
  id: number;
  chatId: string;
  email: string;
  createdAt: string;
  conversations: Conversation[] | null;
}

interface GetUserChatResponse {
  data: ChatDetail[];
  success: boolean;
  message?: string;
}
```

## Project Structure

```
MultiChatBot/
├── services/
│   └── api.ts              # API service with request/response models
├── screens/
│   ├── ChatScreen.tsx      # Main chat interface
│   └── HistoryScreen.tsx   # Chat history view
├── components/
│   └── InputBar.tsx        # Chat input component
└── App.tsx                 # Main application component
```

## Usage

### Starting the Application
```bash
npm start
```

### Running on Device/Simulator
```bash
# iOS
npm run ios

# Android
npm run android
```

## API Service Usage

The API service is implemented in `services/api.ts` and provides the following methods:

```typescript
import { apiService } from './services/api';

// Get user chat history
const response = await apiService.getUserChatDetails('user@example.com');

// Create new chat
const newChat = await apiService.createNewChat('user@example.com');

// Save message
await apiService.saveConversationMessage(chatId, message, isUser, type, data);
```

## Testing

The application uses a test email (`nisarg.parikh@mrisoftware.com`) for API calls. In a production environment, this should be replaced with actual user authentication.

## Dependencies

- React Native
- Expo
- Axios (for API calls)
- React Navigation
- Expo Image Picker
- React Native Safe Area Context

## Development

The application automatically saves all chat messages to the API and retrieves chat history from the backend. The chat interface supports various message types including text, images, and interactive elements like issue type selection and priority selection. 