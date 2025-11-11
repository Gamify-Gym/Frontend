import { View, StyleSheet } from "react-native";
import { Text } from "@/components/general";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Player } from "@/components/general/types";

interface DietRankingCardProps {
  player: Player;
  position: number;
  isCurrentUser: boolean;
  isTopThree: boolean;
}

export default function DietRankingCard({ player, position, isCurrentUser, isTopThree }: DietRankingCardProps) {
  const getRankIcon = () => {
    if (position === 1) return <MaterialDesignIcons name="crown" size={34} color="#FFD700" />;
    if (position === 2) return <MaterialDesignIcons name="medal" size={30} color="#C0C0C0" />;
    if (position === 3) return <MaterialDesignIcons name="medal" size={24} color="#CD7F32" />;
    return null;
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return "#eec317ff";
    if (rate >= 70) return "#d996dfe6";
    return "#bc3763ff";
  };

  const completionColor = getCompletionColor(player.dietCompletionRate || 0);

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
          <View style={[styles.completionBadge, { backgroundColor: completionColor + "30" }]}>
            <Text style={[styles.completionText, { color: completionColor }]}>
              {player.dietCompletionRate || 0}%
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialDesignIcons name="check-circle" size={16} color="#4caf50" />
            <Text style={styles.statValue}>{player.totalDietDaysCompleted || 0} dias completos</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${player.dietCompletionRate || 0}%`, backgroundColor: completionColor },
              ]}
            />
          </View>
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
    flex: 1,
  },
  currentUserName: {
    color: "#df80ff",
  },
  firstPlaceName: {
    color: "#FFD700",
  },
  completionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completionText: {
    fontSize: 13,
    fontWeight: "bold",
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
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(223, 128, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#dfb7ff",
    fontStyle: "italic",
  },
});