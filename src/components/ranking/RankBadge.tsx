import { View, StyleSheet } from "react-native";
import { Text } from "@/components/general";
import { LinearGradient } from "expo-linear-gradient";
import { RankInfo } from "@/utils/rankSystem";

interface RankBadgeProps {
  rankInfo: RankInfo;
  size?: 'small' | 'medium' | 'large';
  showPoints?: boolean;
  showProgress?: boolean;
}

export default function RankBadge({
  rankInfo,
  size = 'medium',
  showPoints = false,
  showProgress = false,
}: RankBadgeProps) {
  if (size === 'small') {
    return (
      <View
        style={[
          styles.smallContainer,
          { backgroundColor: rankInfo.colors[0] },
        ]}
      >
        <Text style={styles.smallText}>{rankInfo.fullName}</Text>
      </View>
    );
  }

  if (size === 'medium') {
    return (
      <LinearGradient
        colors={rankInfo.colors as any}
        style={[
          styles.mediumContainer,
          { borderColor: rankInfo.borderColor },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.mediumText}>{rankInfo.fullName}</Text>
        {showPoints && (
          <Text style={styles.mediumPoints}>{rankInfo.totalPoints} pts</Text>
        )}
      </LinearGradient>
    );
  }

  const progressPercentage = rankInfo.pointsToNext
    ? ((rankInfo.pointsToNext) / (rankInfo.pointsToNext + 10)) * 100
    : 0;

  return (
    <LinearGradient
      colors={rankInfo.colors as any}
      style={[
        styles.largeContainer,
        { borderColor: rankInfo.borderColor },
        rankInfo.tier === 'canguru' && styles.kangarooGlow,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.largeTitle}>{rankInfo.fullName}</Text>

      {showPoints && (
        <View style={styles.pointsContainer}>
          <Text style={styles.largePoints}>{rankInfo.totalPoints} pontos</Text>
        </View>
      )}

      {showProgress && rankInfo.nextRankName && rankInfo.pointsToNext !== undefined && (
        <View style={styles.progressSection}>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.max(5, 100 - progressPercentage)}%`,
                  backgroundColor: rankInfo.borderColor,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {rankInfo.pointsToNext} pontos até desbloquear {rankInfo.nextRankName}
          </Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  smallContainer: {
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },

  mediumContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  mediumText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  mediumPoints: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffffdd',
  },

  largeContainer: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 3,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
    alignItems: 'center',
  },
  kangarooGlow: {
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 12,
  },
  largeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000ff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  pointsContainer: {
    marginBottom: 16,
  },
  largePoints: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000ff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  progressSection: {
    width: '100%',
    marginTop: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.54)',
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
