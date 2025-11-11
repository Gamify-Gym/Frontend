import { View, StyleSheet } from "react-native";
import { Text } from "@/components/general";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Player } from "@/components/general/types";

interface StreakRankingCardProps {
  player: Player;
  position: number;
  isCurrentUser: boolean;
  isTopThree: boolean;
}

export default function StreakRankingCard({ player, position, isCurrentUser, isTopThree }: StreakRankingCardProps) {
  const getRankIcon = () => {
    if (position === 1) return <MaterialDesignIcons name="crown" size={34} color="#FFD700" />;
    if (position === 2) return <MaterialDesignIcons name="medal" size={30} color="#C0C0C0" />;
    if (position === 3) return <MaterialDesignIcons name="medal" size={24} color="#b35634ff" />;
    return null;
  };

  const getPositionChangeIcon = () => {
    const change = player.lastPositionChange ?? 0;
    if (change > 0) {
      return <MaterialDesignIcons name="arrow-up" size={16} color="#4caf50" />;
    }
    if (change < 0) {
      return <MaterialDesignIcons name="arrow-down" size={16} color="#ff6b9d" />;
    }
    return <MaterialDesignIcons name="minus" size={16} color="#dfb7ff" />;
  };

  return (
    <View
      style={[
        styles.container,
        isCurrentUser && styles.currentUserCard,
        isTopThree && styles.topThreeCard,
        position === 1 && styles.firstPlaceCard,
      ]}
    >
      <View style={styles.rankBadge}>
        {getRankIcon() || <Text style={styles.rankNumber}>#{position}</Text>}
      </View>

      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text
            style={[
              styles.playerName,
              isCurrentUser && styles.currentUserName,
              position === 1 && styles.firstPlaceName,
            ]}
          >
            {player.user.username}
            {isCurrentUser && " (Você)"}
          </Text>
          <View style={styles.changeIndicator}>{getPositionChangeIcon()}</View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialDesignIcons name="fire" size={16} color="#ff6b9d" />
            <Text style={styles.statValue}>{player.weeklyStreak} semanas</Text>
          </View>
          <Text style={styles.separator}>•</Text>
          <View style={styles.statItem}>
            <MaterialDesignIcons name="dumbbell" size={16} color="#df80ff" />
            <Text style={styles.statValue}>
              {player.currentWeekTrainedDays}/{player.weeklyTargetDays} treinos
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(player.currentWeekTrainedDays / player.weeklyTargetDays) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((player.currentWeekTrainedDays / player.weeklyTargetDays) * 100)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(43, 11, 79, 0.4)",
    borderRadius: 16,
    marginBottom: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  currentUserCard: {
    backgroundColor: "rgba(223, 128, 255, 0.15)",
    borderColor: "rgba(223, 128, 255, 0.6)",
    borderWidth: 2,
  },
  topThreeCard: {
    backgroundColor: "rgba(43, 11, 79, 0.6)",
  },
  firstPlaceCard: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderColor: "rgba(255, 215, 0, 0.3)",
    borderWidth: 2,
  },
  rankBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(223, 128, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#dfb7ff",
  },
  content: {
    flex: 1,
    gap: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  currentUserName: {
    color: "#df80ff",
  },
  firstPlaceName: {
    color: "#FFD700",
  },
  changeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(223, 128, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 13,
    color: "#dfb7ff",
  },
  separator: {
    fontSize: 13,
    color: "#dfb7ff",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(223, 128, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#df80ff",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: "#dfb7ff",
    fontWeight: "600",
    minWidth: 35,
    textAlign: "right",
  },
});