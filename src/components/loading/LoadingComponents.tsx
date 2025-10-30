import React from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Text } from '../general';

const { width } = Dimensions.get('window');

// ============================================
// LOADING SPINNER SIMPLES
// ============================================

export const LoadingSpinner = ({ size = 'large', color = '#b88aff' }: { size?: 'small' | 'large'; color?: string }) => (
  <View style={styles.spinnerContainer}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

// ============================================
// LOADING COM MENSAGEM
// ============================================

export const LoadingWithMessage = ({ message = 'Carregando...' }: { message?: string }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#b88aff" />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

// ============================================
// SKELETON LOADING (Card de Dieta)
// ============================================

export const DietaSkeletonCard = () => (
  <View style={styles.skeletonCard}>
    <View style={styles.skeletonHeader}>
      <View style={[styles.skeletonBox, styles.skeletonIcon]} />
      <View style={[styles.skeletonBox, styles.skeletonTitle]} />
    </View>
    <View style={styles.skeletonStats}>
      <View style={[styles.skeletonBox, styles.skeletonStat]} />
      <View style={[styles.skeletonBox, styles.skeletonStat]} />
      <View style={[styles.skeletonBox, styles.skeletonStat]} />
    </View>
  </View>
);

// ============================================
// SKELETON LOADING (Lista de Dietas)
// ============================================

export const DietasSkeletonList = ({ count = 3 }: { count?: number }) => (
  <View style={styles.skeletonList}>
    {Array.from({ length: count }).map((_, index) => (
      <DietaSkeletonCard key={index} />
    ))}
  </View>
);

// ============================================
// SKELETON LOADING (Card de Alimento)
// ============================================

export const AlimentoSkeletonCard = () => (
  <View style={styles.alimentoSkeleton}>
    <View style={styles.skeletonHeader}>
      <View style={[styles.skeletonBox, styles.skeletonFoodIcon]} />
      <View style={[styles.skeletonBox, styles.skeletonFoodName]} />
    </View>
    <View style={styles.skeletonNutrients}>
      <View style={[styles.skeletonBox, styles.skeletonNutrient]} />
      <View style={[styles.skeletonBox, styles.skeletonNutrient]} />
      <View style={[styles.skeletonBox, styles.skeletonNutrient]} />
      <View style={[styles.skeletonBox, styles.skeletonNutrient]} />
    </View>
  </View>
);

// ============================================
// LOADING DE TELA CHEIA
// ============================================

export const FullScreenLoading = ({ message }: { message?: string }) => (
  <View style={styles.fullScreenContainer}>
    <ActivityIndicator size="large" color="#b88aff" />
    {message && <Text style={styles.fullScreenText}>{message}</Text>}
  </View>
);

// ============================================
// ESTILOS
// ============================================

const styles = StyleSheet.create({
  spinnerContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#c5a8e0',
    fontWeight: '500',
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0118',
    gap: 16,
  },
  fullScreenText: {
    fontSize: 16,
    color: '#c5a8e0',
    fontWeight: '500',
  },
  skeletonList: {
    gap: 12,
    padding: 16,
  },
  skeletonCard: {
    backgroundColor: 'rgba(25, 15, 45, 0.7)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(169, 112, 255, 0.4)',
    padding: 18,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  skeletonBox: {
    backgroundColor: 'rgba(169, 112, 255, 0.2)',
    borderRadius: 8,
  },
  skeletonIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  skeletonTitle: {
    width: 150,
    height: 24,
    flex: 1,
  },
  skeletonStats: {
    flexDirection: 'row',
    gap: 12,
  },
  skeletonStat: {
    flex: 1,
    height: 60,
    borderRadius: 12,
  },
  alimentoSkeleton: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.15)',
  },
  skeletonFoodIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  skeletonFoodName: {
    flex: 1,
    height: 20,
  },
  skeletonNutrients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  skeletonNutrient: {
    width: '22%',
    height: 40,
    borderRadius: 8,
  },
});