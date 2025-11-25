import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@/components/general";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Player } from "@/components/general/types";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { getRankInfo, calculatePoints } from "@/utils/rankSystem";
import RankBadge from "./RankBadge";

interface RankingPodiumProps {
  topThree: Player[];
  currentUserId: number;
  onViewAll?: () => void;
}

export default function RankingPodium({ topThree, currentUserId, onViewAll }: RankingPodiumProps) {
  const [first, second, third] = topThree;

  const renderPodiumPosition = (player: Player | undefined, position: 1 | 2 | 3) => {
    if (!player) return null;

    const isCurrentUser = player.id_player === currentUserId;
    const heights = { 1: 120, 2: 90, 3: 70 };
    const colors = {
      1: ["#ffd900ae", "#ffa60055"] as const,
      2: ["#c0c0c060", "#A0A0A0"] as const,
      3: ["#a94f29ff", "#cd61324f"] as const,
    };
    const icons = {
      1: "crown",
      2: "medal",
      3: "medal",
    } as const;

    const playerRankInfo = useMemo(() => {
      const points = calculatePoints(player);
      return getRankInfo(points, player.weeklyStreak, player.monthlyWorkoutDays || 0, player.dietCompletionRate || 0);
    }, [player]);

    return (
      <View style={[styles.podiumItem, position === 2 && styles.podiumSecond, position === 3 && styles.podiumThird]}>
        <View style={styles.playerAvatar}>
          <LinearGradient
            colors={colors[position]}
            style={styles.avatarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialDesignIcons name={icons[position]} size={24} color="#fff" />
          </LinearGradient>
          {isCurrentUser && (
            <View style={styles.youBadge}>
              <Text style={styles.youText}>Você</Text>
            </View>
          )}
        </View>
        <Text style={styles.playerName} numberOfLines={1}>
          {player.user.username.split(" ")[0]}
        </Text>
        <RankBadge
          rankInfo={playerRankInfo}
          size="small"
          showPoints={false}
          showProgress={false}
        />
        <View style={styles.statsContainer}>
          <MaterialDesignIcons name="fire" size={12} color="#ff6b9d" />
          <Text style={styles.statText}>{player.weeklyStreak}</Text>
        </View>
        <LinearGradient
          colors={colors[position]}
          style={[styles.podiumBase, { height: heights[position] }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Text style={styles.positionNumber}>#{position}</Text>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialDesignIcons name="trophy" size={24} color="#ffa64d" />
          <Text style={styles.title}>Top 3 da Semana</Text>
        </View>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Ver todos</Text>
            <MaterialDesignIcons name="chevron-right" size={20} color="#df80ff" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.podiumContainer}>
        {renderPodiumPosition(second, 2)}
        {renderPodiumPosition(first, 1)}
        {renderPodiumPosition(third, 3)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(27, 16, 49, 0.6)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.3)",
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: "#df80ff",
    fontWeight: "600",
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 10,
  },
  podiumItem: {
    alignItems: "center",
    flex: 1,
  },
  podiumSecond: {
    marginBottom: 30,
  },
  podiumThird: {
    marginBottom: 50,
  },
  playerAvatar: {
    marginBottom: 8,
    position: "relative",
  },
  avatarGradient: {
    width: 66,
    height: 66,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",

  },
  youBadge: {
    position: "absolute",
    bottom: -8,
    backgroundColor: "#df80ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1b1031",
  },
  youText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffffff",
  },
  playerName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffffff",
    marginBottom: 4,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  statText: {
    fontSize: 12,
    color: "#dfb7ff",
    fontWeight: "600",
  },
  podiumBase: {
    width: "100%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
   
  },
  positionNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffffff",
    textShadowColor: "rgba(0, 0, 0, 2.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});