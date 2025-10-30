import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from '../general';
import MaterialDesignIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface InputModalProps {
  visible: boolean;
  title: string;
  placeholder: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

export default function InputModal({
  visible,
  title,
  placeholder,
  onClose,
  onSubmit,
}: InputModalProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
      onClose();
    }
  };

  const handleClose = () => {
    setValue('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <MaterialDesignIcons name="food-apple" size={24} color="#b88aff" />
            <Text style={styles.title}>{title}</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#9f7dcc"
            value={value}
            onChangeText={setValue}
            autoFocus
            onSubmitEditing={handleSubmit}
          />

          <View style={styles.footer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <MaterialDesignIcons name="check" size={20} color="#ffffff" />
              <Text style={styles.submitButtonText}>Criar</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'rgba(25, 15, 45, 0.98)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(169, 112, 255, 0.4)',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  input: {
    backgroundColor: 'rgba(43, 25, 70, 0.6)',
    borderWidth: 1.5,
    borderColor: 'rgba(169, 112, 255, 0.3)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
  },
  cancelButton: {
    backgroundColor: 'rgba(43, 25, 70, 0.8)',
    borderWidth: 1.5,
    borderColor: 'rgba(169, 112, 255, 0.3)',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#c5a8e0',
  },
  submitButton: {
    backgroundColor: '#b88aff',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});