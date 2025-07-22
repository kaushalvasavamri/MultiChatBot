import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Inputs, Buttons, Spacing } from '../styles/common';

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
    <View style={[Inputs.bar, style]}>
      <TouchableOpacity style={[Buttons.iconSecondary, { marginRight: Spacing.sm }]} 
      disabled={isLoading}
        // onPress={onPickImage}
      >
        <Ionicons name="add" size={24} color={Colors.textInverse} />
      </TouchableOpacity>
      {/* <TouchableOpacity style={[Buttons.iconSecondary, { marginRight: Spacing.sm }]} disabled={isLoading}>
        <Ionicons name="mic" size={24} color={Colors.textInverse} />
      </TouchableOpacity> */}
      <TextInput
        style={[Inputs.textInput, styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Ask anything..."
        placeholderTextColor={Colors.textLight}
        editable={!disabled}
        returnKeyType="send"
        multiline={true}
        onSubmitEditing={onSend}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <TouchableOpacity 
          style={[Buttons.send, isLoading && styles.sendButtonLoading]} 
          onPress={onSend} 
          disabled={disabled || isLoading}
        >
        <Ionicons name="send" size={24} color={Colors.textInverse} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sendButtonLoading: {
    opacity: 0.9,
  },
  multilineInput: {
    minHeight: 40,
    maxHeight: 120,
    paddingTop: 8,
    paddingBottom: 8,
  },
}); 