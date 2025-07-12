import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onPickImage: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  style?: any;
}

export default function InputBar({ value, onChangeText, onSend, onPickImage, disabled = false, isLoading = false, style }: InputBarProps) {
  return (
    <View style={[styles.inputBarExpressive, style]}>
      <TouchableOpacity style={styles.inputIconBtn} 
      disabled={isLoading}
      onPress={onPickImage}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.inputIconBtn} disabled={isLoading}>
        <Ionicons name="mic" size={24} color="#fff" />
      </TouchableOpacity>
      <TextInput
        style={styles.inputExpressive}
        value={value}
        onChangeText={onChangeText}
        placeholder="Ask me something..."
        placeholderTextColor="#b0b8c1"
        editable={!disabled}
        returnKeyType="send"
        onSubmitEditing={onSend}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0D75B0" />
      ) : (
        <TouchableOpacity 
          style={[styles.sendButtonExpressive, isLoading && styles.sendButtonLoading]} 
          onPress={onSend} 
          disabled={disabled || isLoading}
        >
        <Ionicons name="send" size={26} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputBarExpressive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 32,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#0D75B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 0.2,
    overflow: 'visible',
  },
  inputIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    backgroundColor: 'rgba(13,117,176,0.7)',
  },
  inputExpressive: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 32,
    paddingHorizontal: 0,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  sendButtonExpressive: {
    backgroundColor: '#0D75B0',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D75B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonLoading: {
    opacity: 0.9,
  },
}); 