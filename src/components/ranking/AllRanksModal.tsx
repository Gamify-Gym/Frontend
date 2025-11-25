import { View, StyleSheet, Modal, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/general";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from 'expo-font';

interface AllRanksModalProps {
  visible: boolean;
  onClose: () => void;
  currentUserPoints?: number;
}

interface RankData {
  tier: string;
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  colors: string[];
  special?: string;
  epic?: boolean;
  supreme?: boolean;
}

const allRanks: RankData[] = [
  // RATO
  { tier: 'rato', level: 1, name: 'Rato 1', minPoints: 0, maxPoints: 16, colors: ['#4a4a4a', '#2c2c2c'] },
  { tier: 'rato', level: 2, name: 'Rato 2', minPoints: 17, maxPoints: 33, colors: ['#4a4a4a', '#2c2c2c'] },
  { tier: 'rato', level: 3, name: 'Rato Mestre', minPoints: 34, maxPoints: 50, colors: ['#4a4a4a', '#2c2c2c'], special: 'Primeiro milestone!' },

  // RAPOSA
  { tier: 'raposa', level: 1, name: 'Raposa 1', minPoints: 51, maxPoints: 67, colors: ['#ff6b35cd', '#ff8a42b6'] },
  { tier: 'raposa', level: 2, name: 'Raposa 2', minPoints: 68, maxPoints: 84, colors: ['#b35431ff', '#a15f18de'] },
  { tier: 'raposa', level: 3, name: 'Raposa Mestre', minPoints: 85, maxPoints: 100, colors: ['rgba(228, 17, 17, 0.44)', '#ff8a42d0'], special: 'Esperteza!' },

  // LEOPARDO
  { tier: 'leopardo', level: 1, name: 'Leopardo 1', minPoints: 101, maxPoints: 117, colors: ['#f5bd155a', '#f7b831ff'] },
  { tier: 'leopardo', level: 2, name: 'Leopardo 2', minPoints: 118, maxPoints: 134, colors: ['#f5bd155a', '#f7b831ff'] },
  { tier: 'leopardo', level: 3, name: 'Leopardo Mestre', minPoints: 135, maxPoints: 150, colors: ['#0000005a', '#f7b831ff'], special: 'Velocidade!' },

  // URSO POLAR
  { tier: 'ursoPolar', level: 1, name: 'Urso Polar 1', minPoints: 151, maxPoints: 167, colors: ['#e8f4f8', '#a8d5e2'] },
  { tier: 'ursoPolar', level: 2, name: 'Urso Polar 2', minPoints: 168, maxPoints: 184, colors: ['#e8f4f8', '#a8d5e2'] },
  { tier: 'ursoPolar', level: 3, name: 'Urso Polar Mestre', minPoints: 185, maxPoints: 200, colors: ['#e8f4f8', '#a8d5e2'], special: 'Força bruta!' },

  // RINOCERONTE
  { tier: 'rinoceronte', level: 1, name: 'Rinoceronte 1', minPoints: 201, maxPoints: 217, colors: ['#8b9aad', '#6c7a89'] },
  { tier: 'rinoceronte', level: 2, name: 'Rinoceronte 2', minPoints: 218, maxPoints: 234, colors: ['#8b9aad', '#6c7a89'] },
  { tier: 'rinoceronte', level: 3, name: 'Rinoceronte Mestre', minPoints: 235, maxPoints: 250, colors: ['#8b9aad', '#6c7a89'], special: 'Imparável!' },

  // ELEFANTE
  { tier: 'elefante', level: 1, name: 'Elefante 1', minPoints: 251, maxPoints: 267, colors: ['#6c7a89', '#4a5568'] },
  { tier: 'elefante', level: 2, name: 'Elefante 2', minPoints: 268, maxPoints: 284, colors: ['#6c7a89', '#4a5568'] },
  { tier: 'elefante', level: 3, name: 'Elefante Mestre', minPoints: 285, maxPoints: 300, colors: ['#6c7a89', '#4a5568'], special: 'Colosso!' },

  // MAMUTE
  { tier: 'mamute', level: 1, name: 'Mamute 1', minPoints: 301, maxPoints: 317, colors: ['#8b5a3c', '#6d4c3d'] },
  { tier: 'mamute', level: 2, name: 'Mamute 2', minPoints: 318, maxPoints: 334, colors: ['#8b5a3c', '#6d4c3d'] },
  { tier: 'mamute', level: 3, name: 'Mamute Mestre', minPoints: 335, maxPoints: 350, colors: ['#8b5a3c', '#6d4c3d'], special: 'Lendário!' },

  // DRAGÃO
  { tier: 'dragao', level: 1, name: 'Dragão 1', minPoints: 351, maxPoints: 383, colors: ['#9b59b6', '#8e44ad'] },
  { tier: 'dragao', level: 2, name: 'Dragão 2', minPoints: 384, maxPoints: 416, colors: ['#9b59b6', '#8e44ad'] },
  { tier: 'dragao', level: 3, name: 'Dragão Mestre', minPoints: 417, maxPoints: 450, colors: ['#9b59b6', '#8e44ad'], special: 'Poder mítico!' },

  // CANGURU (ESPECIAIS)
  { tier: 'canguru', level: 1, name: 'Canguru Imortal', minPoints: 451, maxPoints: 600, colors: ['#ffd700', '#ffed4e', '#ffd700'], special: ' Requer streak 30+ dias', },
  { tier: 'canguru', level: 2, name: 'Canguru Cósmico', minPoints: 601, maxPoints: 750, colors: ['#ffd700', '#ffed4e', '#ffd700'], special: ' Requer streak 60+ dias', },
  { tier: 'canguru', level: 3, name: 'Canguru Infinito', minPoints: 751, maxPoints: 900, colors: ['#ffd700', '#d61d36ff', '#551981ff'], special: ' RANK SUPREMO - Top 0.01%', },
];

const RankCard = ({ rankInfo, isCurrentUserRank }: { rankInfo: RankData; isCurrentUserRank: boolean }) => {
  const { name, minPoints, maxPoints, colors, special, epic, supreme, tier } = rankInfo;

  // Determinar cor do texto (preto para Canguru e Urso Polar)
  const textColor = (tier === 'canguru' || tier === 'ursoPolar') ? '#000000' : '#ffffff';

  return (
    <View style={[
      styles.rankCard,
      isCurrentUserRank && styles.currentUserRankCard
    ]}>
      <LinearGradient
        colors={colors as any}
        style={[
          styles.rankGradient,
          epic && styles.epicGradient,
          supreme && styles.supremeGradient,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[
          styles.rankName,
          { color: textColor },
          epic && styles.minecraftFont,
          supreme && styles.supremeText
        ]}>
          {supreme }
          {name}
          {supreme}
        </Text>

        <Text style={[styles.rankPoints, { color: textColor }]}>
          {minPoints}-{maxPoints} pontos
        </Text>

        {special && (
          <Text style={[styles.rankSpecial, { color: textColor }]}>{special}</Text>
        )}

        {isCurrentUserRank && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentText}>SEU RANK ATUAL</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

export default function AllRanksModal({ visible, onClose, currentUserPoints = 0 }: AllRanksModalProps) {
  const isInRange = (points: number, min: number, max: number) => {
    return points >= min && points <= max;
  };

  // Carregar a fonte Press Start 2P local
  const [fontsLoaded] = useFonts({
    'PressStart2P': require('../../assets/fonts/PressStart2P-Regular.ttf'),
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header fixo */}
        <View style={styles.header}>
          <Text style={styles.title}>🏆 TODOS OS RANKS</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialDesignIcons name="close" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* ScrollView com todos os ranks */}
        {!fontsLoaded ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#ffffff', fontSize: 16 }}>Carregando...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {allRanks.map((rank, index) => (
              <RankCard
                key={index}
                rankInfo={rank}
                isCurrentUserRank={isInRange(currentUserPoints, rank.minPoints, rank.maxPoints)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1031',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'rgba(27, 16, 49, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(223, 128, 255, 0.3)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(223, 128, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  rankCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    marginBottom: 12,
  },
  currentUserRankCard: {
    borderWidth: 3,
    borderColor: '#df80ff',
  },
  rankGradient: {
    padding: 30,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  epicGradient: {
    shadowColor: '#ffd700',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
  supremeGradient: {
    shadowColor: '#ffd700',
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 12,
  },
  rankName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  minecraftFont: {
    fontFamily: 'PressStart2P',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
  },
  supremeText: {
    fontSize: 25,
    textShadowRadius: 10,
  },
  rankPoints: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  rankSpecial: {
    fontSize: 9,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  currentBadge: {
    backgroundColor: '#df80ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 12,
  },
  currentText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});