import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from '../general';
import MaterialDesignIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { AlimentoDto } from '@/components/general/types';

interface AddAlimentoModalProps {
  visible: boolean;
  dietaId: number;
  mealId: string;
  mealName: string;
  onClose: () => void;
  onAdd: (dietaId: number, mealId: string, data: Omit<AlimentoDto, 'idDieta'>) => Promise<void>;
}

export default function AddAlimentoModal({
  visible,
  dietaId,
  mealId,
  mealName,
  onClose,
  onAdd,
}: AddAlimentoModalProps) {
  const [nome, setNome] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Calcular calorias automaticamente
  const calculatedCalories = 
    (parseFloat(proteins) || 0) * 4 + 
    (parseFloat(carbs) || 0) * 4 + 
    (parseFloat(fats) || 0) * 9;

  const resetForm = () => {
    setNome('');
    setProteins('');
    setCarbs('');
    setFats('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Digite o nome do alimento');
      return;
    }

    if (!proteins && !carbs && !fats) {
      Alert.alert('Erro', 'Digite pelo menos um macronutriente');
      return;
    }

    setIsLoading(true);

    try {
      const alimentoData: Omit<AlimentoDto, 'idDieta'> = {
        nome: nome.trim(),
        calories: Math.round(calculatedCalories),
        proteins: parseFloat(proteins) || 0,
        carbs: parseFloat(carbs) || 0,
        fats: parseFloat(fats) || 0,
        fibers: 0,
        sodium: 0,
        acucarTotal: 0,
        acucarAdicionado: 0,
        gorduraTrans: 0,
        gordurasMonosaturadas: 0,
        gordurasPoliinsaturadas: 0,
        gordurasSaturadas: 0,
      };

      await onAdd(dietaId, mealId, alimentoData);
      Alert.alert('Sucesso!', 'Alimento adicionado!');
      handleClose();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao adicionar alimento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Pressable style={styles.overlay} onPress={handleClose} />

        <View style={styles.modal}>
          {/* HEADER */}
          <View style={styles.header}>
            <MaterialDesignIcons name="food-apple" size={24} color="#b88aff" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.title}>Adicionar Alimento</Text>
              <Text style={styles.subtitle}>{mealName}</Text>
            </View>
            <Pressable onPress={handleClose}>
              <MaterialDesignIcons name="close" size={24} color="#ffffff" />
            </Pressable>
          </View>

          {/* FORM */}
          <ScrollView 
            style={styles.form} 
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* NOME */}
            <Text style={styles.label}>Nome do Alimento *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Arroz integral (100g)"
              placeholderTextColor="#9f7dcc"
              value={nome}
              onChangeText={setNome}
              autoFocus
            />

            {/* CALORIAS - CALCULADO AUTOMATICAMENTE */}
            <Text style={styles.label}>Calorias (kcal) *</Text>
            <View style={[styles.input, styles.caloriesDisplay]}>
              <MaterialDesignIcons name="fire" size={20} color="#ff9a76" />
              <Text style={styles.caloriesText}>
                {Math.round(calculatedCalories)} kcal
              </Text>
              <Text style={styles.caloriesHint}>calculado automaticamente</Text>
            </View>

            {/* PROTEÍNAS */}
            <Text style={styles.label}>Proteínas (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="5"
              placeholderTextColor="#9f7dcc"
              keyboardType="numeric"
              value={proteins}
              onChangeText={setProteins}
            />

            {/* CARBOIDRATOS */}
            <Text style={styles.label}>Carboidratos (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="30"
              placeholderTextColor="#9f7dcc"
              keyboardType="numeric"
              value={carbs}
              onChangeText={setCarbs}
            />

            {/* GORDURAS */}
            <Text style={styles.label}>Gorduras (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="2"
              placeholderTextColor="#9f7dcc"
              keyboardType="numeric"
              value={fats}
              onChangeText={setFats}
            />
          </ScrollView>

          {/* BOTÕES */}
          <View style={styles.buttons}>
            <Pressable style={styles.btnCancel} onPress={handleClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.btnSubmit, isLoading && { opacity: 0.5 }]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <MaterialDesignIcons name="check" size={20} color="#fff" />
              <Text style={styles.btnSubmitText}>
                {isLoading ? 'Salvando...' : 'Adicionar'}
              </Text>
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
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modal: {
    backgroundColor: '#1a0f2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '95%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(169,112,255,0.3)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#c5a8e0',
    marginTop: 2,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5d4f0',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(43,25,70,0.6)',
    borderWidth: 1.5,
    borderColor: 'rgba(169,112,255,0.3)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#fff',
  },
  caloriesDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,154,118,0.1)',
    borderColor: 'rgba(255,154,118,0.3)',
  },
  caloriesText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff9a76',
    flex: 1,
  },
  caloriesHint: {
    fontSize: 11,
    color: '#9f7dcc',
    fontStyle: 'italic',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(169,112,255,0.3)',
  },
  btnCancel: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(43,25,70,0.8)',
    borderWidth: 1.5,
    borderColor: 'rgba(169,112,255,0.3)',
    alignItems: 'center',
  },
  btnCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#c5a8e0',
  },
  btnSubmit: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#b88aff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnSubmitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});